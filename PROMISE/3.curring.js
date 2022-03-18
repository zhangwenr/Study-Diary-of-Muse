function sum(a, b, c) {
    return a + b + c
}

// 柯里化的例子
let curring = (fn, ...args) => {
    function inner(args) {
        console.log('fn--------', fn)
        console.log('args--------', args)
        return fn.length > args.length ? (...arr) => inner([...args, ...arr]) : fn(...args)
    }
    return inner(args)
}
// let fn1 = curring(sum)
// let fn2 = fn1(1, 2);
// console.log('fn2----------', fn2)
// fn2---------- (...arr) => inner([...args, ...arr])

// let r = fn2(3)
// console.log('r------------', r)
// r------------ 6


// 柯里化函数的运用
function isType(type, val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
}

let isString = curring(isType, 'String')
let isNumber = curring(isType, 'Number')
console.log('isString------', isString)

console.log(isString('123')) // true
console.log(isString(123)) // false
console.log(isNumber(123)) // true