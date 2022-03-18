const fs = require('fs').promises
// const co = require("co") // 第三方模块
async function read() { // 生成器 固定写法 加个*
    try {
        let out1 = await fs.readFile("a.txt", "utf8")
        let out2 = await fs.readFile(out1, "utf-8")
        return out2
    } catch (e) {
        console.log(e)
    }
}

read().then(data => {
    console.log(data, 111)
}).catch(err => {
    console.log(err)
})

// async+await 函数就是 generator + co的语法糖