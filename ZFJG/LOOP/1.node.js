console.log(globalThis) // setImmediate[ie下也有 node中自己实现的]

console.log(this) // 模块中的this 不是global 原因在于node中有天生的模块化规范 common.js
// 把每个文件都当做模块

// 模块化规范有哪些
// umd amd common.js es6Module SystemJS iife (requirejs) cmd(seajs)
// amd define
// commonjs node中自己实现的
// umd 支持 amd + commonjs + global
// es6Module import export
// iife 立即执行函数
// SystemJS微前端

// commonjs规范是node的 特地就是定义了 如何导入模块 和导出模块 定义模块

// 导出统一采用 module.exports来导出
// 导入 require
// 每一个js文件就是一个模块 每次引用文件的时候 都会在外层添加一个函数 并改变this指向

// (function () {
//     console.log(this === global)
// })()
// 打印true

// 默认这个函数中也提供了几个参数 5个参数 不是global上的属性，但是在文件中可以直接访问
console.log(require) // 可以引入其他模块
console.log(module) // 当前模块对象
console.log(exports) // 模块导出的结果
console.log(__dirname) // 绝对路径，当前文件所在的文件夹
console.log(__filename) // 绝对路径，当前文件所在的文件夹

console.log(arguments.callee.toString())

// 在使用require的时候就被包裹了一层 函数 这里就有这五个参数
// function (exports, require, module, __filename, __dirname) {}

// node中常用的模块 fs(文件系统) / path（路径系统）
const fs = require('fs') // 内置模块、核心模块 require怎么实现的

// 同步读取文件 什么时候用同步 同步的性能更好（缺陷时堵塞）当程序刚刚运行前 都可以采用
// 后面我们用http服务端的时候 需要在回调中采用异步

// 读取文件的时候如果文件不存在会发生异常
let r = fs.readFileSync('./node.md', 'utf8')
// console.log(r)

// 判断文件是否存在
let exists = fs.existsSync('./note1.md') // 这个方法的异步方法被废弃了
console.log(exists)

const path = require('path')

console.log(path.join(__dirname, 'a', 'b', 'c', '/')) // a\b\c 拼接路径的
console.log(path.resolve(__dirname, 'a', 'b', 'c')) // 解析出绝对路径 也具备拼接的功能

// join就是拼接认/ resolve接续绝对路径 （以当前运行文件的目录来解析） 不认/
console.log(path.dirname(__filename)) // 取父路径的
console.log(path.extname('a.min.js')) // 取扩展名 都是最后一个
console.log(path.basename('a.min.js', '.js')) // 取基础名

// 以后读取文件操作路径 尽量 才去绝对路径
// let r2 = fs.readFileSync('./node.md', 'utf8') // 用相对路径 会由于执行的路径发生变化导致问题
// console.log(r2)

// 如何将一个字符串执行？
// eval 会引用上级作用域的变量 适合简单的js执行 不毅力啊上下文变量

// Function 构造函数创建一个新的Function对象。直接调用此构造函数可用动态创建函数，但会遇到和eval类似的安全问题和较小的性能问题。
// 然而和eval不同的是，Function创建的函数只能在全局作用域中运行。
var a = 100
eval('console.log(a)')

const vm = require('vm') // 虚拟机模块

var a = 100
// vm.runInThisContext('console.log(a)') // 实现一个 安全的执行，但是挂载全局上已经可以获取到


// 微任务：[then1, then2, ]
Promise.resolve().then(() => {
    console.log('then1')
    Promise.resolve().then(() => {
        console.log('then1-1')
        return Promise.resolve()
    }).then(() => {
        console.log('then1-2')
    })
}).then(() => {
    console.log('then2')
}).then(() => {
    console.log('then3')
}).then(() => {
    console.log('then4')
}).then(() => {
    console.log('then5')
})
console.log(22)

// 打印：then1，then1-1,then2,then3

// wrw:[ ，注册then1-2，注册then4]

// ecmascript中 promise的多余特点：1）Promise.resolve(promise的时候) 会直接将这个promise解析出来
//                                2）一个promise返回一个promise会产生两个then




