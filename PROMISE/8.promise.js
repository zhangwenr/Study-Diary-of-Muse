const Promise = require('./3.promise.js')

let p1 = new Promise((resolve, reject) => {
    resolve()
})

// let p2 = p1.then(() => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('ok')
//         }, 1000);
//     }) // 如果x 是promise 我需要等待promise变成成功或者失败
// })


// resolve了一个promise的例子：
let p2 = p1.then(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(1111)
                }, 3000);
            }))
        }, 1000);
    }) // 如果x 是promise 我需要等待promise变成成功或者失败
})

// 值的穿透的例子
// new Promise((resolve, reject) => {
//     resolve('ok')
// }).then().then().then().then((data) => {
//     console.log(data, 1111)
// })

p2.then((data) => {
    console.log(data, 'success')
}, err => {
    console.log(err, 'fail')
})