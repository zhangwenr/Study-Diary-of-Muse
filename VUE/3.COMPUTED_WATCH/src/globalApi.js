import { mergeOptions } from "./utils"

export function initGlobalAPI(Vue) {
    // strats.data strats.computed...
    Vue.options = {}

    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}