import Dep, { popTarget, pushTarget } from "./dep"

let id = 0
// 1）当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
// 2）调用_render() 会取值 走到get上

// 每个属性有一个dep（属性就是被观察者），watcher就是观察者（属性变化了就会通知观察者来更新）-》 观察者模式

class Watcher { // 不同组件有不同的watcher
    constructor(vm, fn, options) {
        // fn渲染函数 updateComponent
        this.id = id++
        this.renderWatcher = options // 是一个渲染watcher
        this.getter = fn // 意味着调用这个函数可以发生取值操作
        this.deps = [] // 后续我们实现计算属性和一些清理工作需要用到
        this.depsId = new Set()
        this.lazy = options.lazy
        this.dirty = this.lazy // 缓存值
        this.vm = vm
        console.log(this.lazy)

        // 默认不执行
        this.lazy ? undefined : this.get()
    }
    // 让渲染逻辑记住dep
    addDep(dep) { // 一个组件 对应着多个属性 重复的属性也不用记录
        let id = dep.id
        if (!this.depsId.has(id)) {
            console.log('dep', dep)

            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this) // watcher已经记住了dep而且去重了，此时让dep也记住watcher
        }
    }
    evaluate() {
        this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏 
        this.dirty = false;
    }
    get() {
        // 把watcher暴露在全局上
        pushTarget(this)  // 静态属性只有一份
        let value = this.getter.call(this.vm) // 会去vm上取值
        popTarget() // 渲染完毕后就清空
        return value
    }
    depend() {
        let i = this.deps.length
        while (i--) {
            //  dep.depend()
            this.deps[i].depend() // 让计算属性watcher 也收集渲染watcher

        }
    }
    update() {
        // 依赖的属性发生变化了 就标识计算属性是脏值了
        if (this.lazy) {
            this.dirty = true
        } else {
            // 异步更新
            queueWatcher(this) // 吧当前的watcher缓存其阿里
            // this.get() // 重新渲染
        }
    }
    run() {
        // console.log('run')
        this.get()
    }
}
let queue = []
let has = {}
let pending = false // 防抖
function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    flushQueue.forEach(q => q.run()) // 在刷新的过程中可能还有新的watcher，重新放到queue中
    queue = []
    has = {}
}
function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true
        console.log(queue)
        // 不管我们的update执行多次，但是最终只执行一轮刷新操作
        if (!pending) {
            nextTick(flushSchedulerQueue, 0)
            pending = true
        }

    }
}

let callbacks = []
let waiting = false
function flushCallbacks() {
    let cbs = callbacks.slice(0)
    waiting = false
    callbacks = []
    cbs.forEach(cb => cb()) // 按照顺序依次执行
}

let timerFunc
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    let observer = new MutationObserver(flushCallbacks) // 这里传入的回调是异步执行的
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}
export function nextTick(cb) { // 先内部还是先用户的？
    callbacks.push(cb) // 维护nextTick中的callback方法
    if (!waiting) {
        timerFunc()
        waiting = true
    }

}
// 需要给每一个属性增加一个dep，目的就是收集watcher
// 一个视图中（组件） 有多少个属性 （n个属性会对应一个视图） n个dep对应一个watcher
// 1个属性对应这多个视图
// 多对多的关系
export default Watcher