const gulp = require('gulp')
const pug = require('gulp-pug')
const connect = require('gulp-connect')

gulp.task('pug', () => {
    gulp.src('src/*.pug')
        .pipe(pug({
            pretty: true,
            verbose: true,
            data: {
                user: {
                    name: 'chunzujun'
                }
            }}))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload())
})

gulp.task('connect', function() {
    connect.server({
        name: 'Pug Demo Server',
        root: 'dist',
        port: 8080,
        livereload: true
    });
});

gulp.task('watch', () => {
    gulp.watch('src/*.pug', ['pug'])
});

gulp.task('default', ['pug', 'watch', 'connect'])