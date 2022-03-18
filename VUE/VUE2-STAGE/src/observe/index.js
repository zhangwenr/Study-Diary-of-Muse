import Dep from "./dep"

class Observer {
    constructor(data) {
        // Object.defineProperty只能劫持已经存在的属性，后增的，或者删除的 不知道（vue里面会为此单独写一些api $set $delete）
        this.walk(data)
    }
    walk(data) { // 循环对象 对属性依次劫持
        // “重新定义”属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))

    }
}
export function defineReactive(target, key, value) { //闭包 属性劫持
    observe(value) // 对所有的对象都进行属性劫持
    let dep = new Dep() // 每一个属性都有一个dep
    Object.defineProperty(target, key, {
        get() { // 取值的时候 会执行get
            console.log('用户取值了', Dep.target)
            if (Dep.target) {
                dep.depend() // 让这个属性的收集器记住当前的watcher this.subs.push(Dep.target)
            }
            return value
        },
        set(newValue) { // 修改的时候 会执行set
            console.log('用户设置了')
            if (newValue === value) return
            value = newValue
            dep.notify() // 通知更新
        }
    })
}
export function observe(data) {
    // 对这个对象进行劫持

    if (typeof data !== 'object' || data == null) {
        return  // 只对对象进行劫持
    }

    // 如果一个对象被劫持过了，就不需要再被劫持（要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过）
    return new Observer(data)
}