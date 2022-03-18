// generater用法
const fs = require('fs').promises
// const co = require("co") // 第三方模块
function* read() { // 生成器 固定写法 加个*
    let out1 = yield fs.readFile("a.txt", "utf8")
    let out2 = yield fs.readFile(out1, "utf-8")
    return out2
}

let it = read()

// let { value, done } = it.next()
// value.then(data => {
//     let { value, done } = it.next(data)
//     value.then(data => {
//         let { value, done } = it.next(data)
//         console.log(value)
//     })
// })

function co(it) {
    return new Promise((resolve, reject) => {
        function next(data) {
            let { value, done } = it.next(data) // 拿到done 是否完成 value就是本次yield的返回值

            if (done) { return resolve(value) } // 如果解析完毕直接将结果作为co的成功结果
            Promise.resolve(value).then(data => {
                next(data)
            }, reject)
        }
        next()
    })
}

// 简化then链
co(it).then(data => {
    console.log(data)
})