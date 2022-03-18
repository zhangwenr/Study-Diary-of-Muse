// 静态方法
const strats = {}
const LIFECYCLE = [
    'beforeCreate',
    'created'
]
LIFECYCLE.forEach(hook => {
    strats[hook] = function (p, c) {
        if (c) {
            if (p) {
                return p.concat(c)
            } else {
                return [c]
            }
        } else {
            return p
        }
    }

})

export function mergeOptions(parent, child) {
    // 我们期望将用户的选项和全局的options进行合并
    const options = {}
    for (let key in parent) {
        mergeField(key)
    }

    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    function mergeField(key) {
        //    策略模式 用策略模式减少if、else
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            options[key] = child[key] || parent[key]
        }
    }

    return options
}