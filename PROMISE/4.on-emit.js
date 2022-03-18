const { fstat } = require('fs')

let events = {
    _arr: [],
    on(fn) {
        this._arr.push(fn)
    },
    emit() {
        this._arr.forEach(fn => fn())
    }
}

events.on(function () {
    console.log('每次读取完毕后都执行')
})

events.on(function () {
    if (Object.keys(school).length === 2) {
        console.log('读取完毕')
    }
})

let school = {}
fs.readFile("./a.txt", "utf8", function (err, data) {
    school.name = data;
    events.emit()
})

fs.readFile("./b.txt", "utf8", function (err, data) {
    school.age = data;
    events.emit()
})

// 好处是发布和订阅之间没有任何联系 不订阅也可以发布。不耦合
// 发布订阅——需要用户手动触发emit

// 观察者模式的区别：发布与订阅之间是有关系的（内部观察者模式是基于发布订阅的） 观察者模式氛围 观察者和被观察者


