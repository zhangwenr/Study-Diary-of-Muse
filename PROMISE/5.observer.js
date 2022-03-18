class Subject { // 被观察者 （需要有一个自身的状态，状态变化率要通知所有的观察者）
    constructor(name) {
        this.name = name
        this.observers = []
        this.state = '我开心的在玩'
    }
    attach(o) {
        this.observers.push(o)
    }
    setState(newState) {
        this.state = newState
        this.observers.forEach(o => o.update(this))
    }
}

class Observer { // 观察者
    constructor(name) {
        this.name = name
    }

    update(s) {
        console.log(this.name + ":" + s.name + "当前的状态是" + s.state)
    }
}

let s = new Subject('小宝宝')
let o1 = new Observer('爸爸')
let o2 = new Observer('妈妈')

// 订阅模式
s.attach(o1)
s.attach(o2)
s.setState('有人咬我，不开心')

// 实现一个自己的promise，基于回调的方式