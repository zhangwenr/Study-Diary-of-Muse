import { observe } from "./observe/index"
import Watcher from "./observe/watcher"
export function initState(vm) {
    const opts = vm.$options // 获取所有的选项
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
}
// 代理
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key] // vm._data.name
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}
function initData(vm) {
    let data = vm.$options.data // data可能是函数和对象
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data // 我将返回的对象放到了_data上
    // 对数据进行劫持 vue2里采用了一个api defineProperty
    observe(data)

    // 将vm._data 用vm来代理就可以了
    for (let key in data) {
        proxy(vm, '_data', key)
    }
}

function initComputed(vm) {
    const computed = vm.$options.computed
    const watchers = vm._computedWatchers = {} // 将计算属性watcher保存到vm上
    for (let key in computed) {
        let userDef = computed[key]

        // 我们需要监控计算属性中 get的变化
        let fn = typeof userDef === 'function' ? userDef : userDef.get

        // 如果直接new Watcher 默认就会执行fn
        watchers[key] = new Watcher(vm, fn, { lazy: true }) // 不要立即执行 要懒执行
        defineComputed(vm, key, userDef)
    }
}
function defineComputed(target, key, userDef) {
    // const getter = typeof userDef === 'function' ? userDef : userDef.get
    const setter = userDef.set || (() => { })
    // console.log(getter, setter)

    // 可以通过实例拿到对应的属性
    Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function () {
        const watcher = this._computedWatchers[key] // 获取到对应属性的watcher
        if (watcher.dirty) {
            // 如果是脏的就去执行 用户传入的函数
            watcher.evaluate()
        }
        return this.value
    }
}