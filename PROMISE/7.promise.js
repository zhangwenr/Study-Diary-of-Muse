const Promise = require('./index.js')
const fs = require('fs')

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        resolve()
        // fs.readFile(filePath, 'utf8', function (err, data) {
        //     if (err) return reject(err)
        //     resolve(data)
        // })
    })
}

// 将promise嵌套进行简化
// 1.如果promise中的then的回调（成功或者失败）返回一个普通值（不是promise，也不是错误）就将结果传递到下一次的then的成功回调中
// 2.如果发生了异常，那么会把这个异常抛出到外层的then的失败的回调中去
// 3.如果返回的是一个promise，那么需要判断这个promise的状态。如果promise是成功，就继续将成功的结果传递到外层的成功，
// 如果是失败，就将promise传递给外层的失败
let promise2 = readFile('./a.txt').then(data => {
    return 199
})
promise2.then((data) => {
    console.log(21, data)
}, () => {
    console.log(err)
})