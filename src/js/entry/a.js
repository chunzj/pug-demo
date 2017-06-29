/**
 * Created by chunzj on 29/06/2017.
 */
import { a, b } from '../common/c'
import { forEach } from 'lodash'

console.log(a, b)

forEach([1,2,3], item => {
    console.log(item)
})
console.log('我是a')