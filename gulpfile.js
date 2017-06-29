const gulp = require('gulp')
const pug = require('gulp-pug')
const connect = require('gulp-connect')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')

// 浏览器模块化支持
const babelify = require('babelify')
const browserify = require('browserify')

const glob = require('glob')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const es = require('event-stream')
const del = require('del')

const entryBaseDir = 'src/js/entry/'
let bundleKey

gulp.task('pug', () => {
    gulp.src('src/*.pug')
        .pipe(pug({
            pretty: true,
            verbose: true,
            cache: true,
            data: {
                title: 'Pug Demo',
                keywords: 'Pug Demo',
                description: 'This is a pug demo',
                bundleKey
            }}))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload())
})

gulp.task('script', () => { // 支持多个entry
    glob('src/js/entry/*.js', (err, files) => {
        if(err) console.error(err)
        const tasks = files.map(entry => {
            entry = entry.replace(entryBaseDir, '')
            return browserify({ basedir: entryBaseDir, entries: entry, debug: true})
                .transform(babelify, { presets: ["es2015"] })
                .bundle()
                .on('error', err => console.error(err))
                .pipe(source(entry))
                .pipe(buffer())
                .pipe(rename({ extname: '.bundle.' + (bundleKey ? bundleKey + '.' : '') + 'js' }))
                .pipe(sourcemaps.init())
                .pipe(uglify())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist'))
        })
        es.merge(tasks).pipe(connect.reload())
    })
})

gulp.task('serve', () => {
    connect.server({
        name: 'Pug Demo Server',
        root: 'dist',
        port: 8080,
        livereload: true
    })
})

gulp.task('clean', () => {
    return del([
        'dist/*',
        '!dist/*.min.js'
    ]);
})

gulp.task('watch', () => {
    gulp.watch('src/**/*.pug', ['pug'])
    gulp.watch('src/js/**/*.js', ['script'])
})

gulp.task('bundleKey', () => {
    bundleKey = new Date().getTime()
})

gulp.task('dist', ['clean', 'bundleKey', 'script', 'pug', 'serve'])
gulp.task('default', ['watch', 'serve', 'script', 'pug'])