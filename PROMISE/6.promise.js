// Promise 基本上不用关心浏览器的兼容性

// Promise是一个类 我们可以new Promise 创造一个实例
// promise 有三个状态 1.默认状态叫等待态pending 2.resolve表示成功态 fulfilled 3.reject表示变成失败态 rejected

// 只有再pending的状态的时候才能改变状态，不能从成功变失败，也不能从失败变成功

// 1.承诺状态
// 1.1当pending时，a promise：
// 1.1.1可以转换到fulfilled或rejected状态

// 1.2当fulfilled时，a promise:
// 1.2.1不能转换到任何其他的状态
// 1.2.2必须有一个不能改变的value

// 1.3当rejected时，a promise：
// 1.3.1不能转换到任何其他的状态
// 1.3.2必须有一个不能改变的reason
// Here, “must not change” means immutable identity (i.e. ===), but does not imply deep immutability.
// 使用throwerror抛出异常也会执行到失败的逻辑

// 2.then方法
// 一个promise的then方法接受两个参数
// promise.then(onFulfilled, onRejected)
// 2.1这两个onFulfilled和onRejected可选的参数
// 2.1.1如果onFulfilled不是函数，则必须忽略它
// 2.1.2如果onRejected不是函数，则必须忽略它

// 2.2如果onFulfilled是一个函数：
// 2.2.1它必须在promise完成后调用，并以promise的value作为它的第一个参数
// 2.2.2在promise完成之前不能调用它
// 2.2.3不能多次调用它

// 2.3如果onRejected是一个函数
// 2.3.1它必须在promise被拒绝后调用，并以promise的reason作为它的第一个参数
// 2.3.2在promise被拒绝之前不能调用它
// 2.3.3不能多次调用它

// 2.4onFulfilled或者onRejected在执行上下文堆栈仅包含平台代码之前不得调用

// 2.5onFulfilled并且onRejected必须作为函数调用（即没有this值）

// 2.6then 可以在同一个 Promise 上多次调用
// 2.6.1如果/何时promise满足，所有相应的onFulfilled回调必须按照它们对then
// 2.6.2如果/何时promise被拒绝，所有相应的onRejected回调必须按照它们对then

// 2.7then必须返回一个promise

// 3The Promise Resolution Procedure（承诺解决程序----resolvePromise）
// 3.1如果promise和x引用同一个对象，promise则以一个TypeError为理由拒绝

// 3.2如果x是一个承诺，则采用它的状态
// 3.2.1如果x是待处理的，则promise必须保持待处理状态，直到x完成或拒绝
// 3.2.2如果/何时x满足，promise则以相同的值满足
// 3.2.3如果/何时x被拒绝，promise以同样的理由拒绝

// 3.3否则，如果x是一个对象或函数
// 3.3.1让then是x.then
// 3.3.2如果检索属性x.then导致抛出异常e，以e作为reason来拒绝promise
// 3.3.3如果then是一个函数，则使用x作为this、第一个参数resolvePromise和第二个参数调用它rejectPromise，其中：
// 3.3.3.1




let Promise = require('./3.promise.js')
let promise = new Promise((resolve, reject) => {
    // resolve('ok')
    // throw new Error('error')
    // reject('ok')
    setTimeout(() => {
        reject('ok')
    }, 1000)
})

promise.then((value) => { // then方法中提供两个参数1.成功回调 2.失败回调
    console.log(value, 'success')
}, (reason) => {
    console.log(reason, 'fail')
})
