const Promise = require('./4.promise')
const fs = require('fs')

// function readFile(...args) {
//     let dfd = Promise.deferred()
//     fs.readFile(...args, function (err, data) {
//         if (err) return dfd.reject(err)
//         dfd.resolve(data)
//     })
//     return dfd.promise
// }


// catch
// readFile('a.txt', 'utf8').then(data => {
//     return readFile(data + 1, 'utf8')
// }).catch(err => {
//     console.log('2错')
// }).then((data) => {
//     console.log(data)
// })


// Promise.resolve / Promise.reject
// Promise.reject('error').catch(err => {
//     console.log(err)
// })

// 注意区别 Promise.resolve 会解析里面的promise（会有等待效果）
// 对于Promise.reject 而言 不具备等待效果

// Promise.all
function readFile(...args) {
    return new Promise((resolve, reject) => {
        fs.readFile(...args, function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })
}
// Promise.all就是都成功就是成功了，有一个失败就是失败了
Promise.all([readFile('a.txt', 'utf8'), readFile('b.txt', 'utf8'), 3, 4, 5]).then((data) => {
    console.log(data)
}).catch(err => {
    console.log(err)
})

Promise.prototype.finally = function (cb) {
    return this.then((y) => {
        return Promise.resolve(cb()).then(() => y)
    }, (r) => {
        return Promise.resolve(cb()).then(() => { throw r })
    })
}

// Promise.finally 无论成功和失败都执行
Promise.resolve('abc').finally((...args) => {
    console.log('无论成功和失败都执行', args)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1000);
    })
}).then(data => {
    console.log(data, 's')
}).catch(err => {
    console.log(err, 'err')
})