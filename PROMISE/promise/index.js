const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
const resolvePromise = (x, promise2, resolve, reject) => {
    // 处理x导致的promise2 是成功还是失败
    // 如果x是普通值 直接调用promise2 的resolve
    // 如果x是一个promise 那么就采用x的状态。并且将结果继续调用promise2的resolve和reject向下传递

    if (promise2 === x) {
        return reject(new TypeError('循环引用'))
    }

    // 判断x是不是一个promise 先保证x得是一个对象或者函数，如果不是对象或者函数 那么x一定不是promise
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called
        // 我需要看x上有没有then方法 有then方法才说明他是一个promise、
        try {
            let then = x.then // x可能是别人写的promise 那么取then有风险
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return
                    called = true
                    // y有可能是普通值，也有可能是promise，需要递归
                    // 递归解析知道我们的y的值是一个普通值
                    resolvePromise(y, promise2, resolve, reject)
                    // resolve(y)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else { // then可能是对象或者普通值，没有then方法的都执行这里
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        // x就是一个普通的值，直接把x传递给promise2的成功即可
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING
        this.value = undefined // 成功的原因
        this.reason = undefined // 失败的原因

        this.onResolvedCallbacks = []; // 存放成功的回调
        this.onRejectedCallbacks = []; // 存放失败的回调

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject) // 默认new Promise中的函数会立即执行
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
        let promise2 = new Promise((resolve, reject) => {
            // 链式调用的核心 就是处理 x 和 promise 之间的关系
            if (this.status == FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status == REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status == PENDING) {
                // 稍后成功了 除了执行回调外 还有其他的逻辑
                // 订阅
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        // todo...增加自定义的逻辑
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        // todo...
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
            }
        })
        return promise2
    }
}

// 在测试的时候 会测试你的promise对象是否符合规范
// 还可以帮我们创造一个延迟对象
Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
// npm instsall promises-aplus-tests -g
// promises-aplus-tests 3.promise

module.exports = Promise