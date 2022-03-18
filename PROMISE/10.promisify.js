const fs = require('fs')
const fs = require('fs').promises // 将fs中的所有对象都转变成promise
// const { promisify } = require('util') // promisify 方法可以将某一个异步函数进行转化


// 根据传入的参数转换指定的方法
function promisify(fn) { // 将node异步api转换成promise写法
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, function (err, data) {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}

function promisifyAll(obj) {// 将所有的函数都转换成promise
    for (let key in obj) {
        let val = obj[key]
        if (typeof val === 'function') {
            obj[key] = promisify(val)
        }
    }
}
promisifyAll(fs)

const read = promisify(fs.readFile) // promisify就是一个高阶函数

// function read(...args) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(...args, function (err, data) {
//             if (err) return reject(err)
//             resolve(data)
//         })
//     })
// }
read('./a.txt', 'utf8').then((data) => {
    console.log(data)
})