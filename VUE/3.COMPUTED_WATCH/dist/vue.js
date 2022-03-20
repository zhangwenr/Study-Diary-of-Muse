(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // 静态方法
    var strats = {};
    var LIFECYCLE = ['beforeCreate', 'created'];
    LIFECYCLE.forEach(function (hook) {
      strats[hook] = function (p, c) {
        if (c) {
          if (p) {
            return p.concat(c);
          } else {
            return [c];
          }
        } else {
          return p;
        }
      };
    });
    function mergeOptions(parent, child) {
      // 我们期望将用户的选项和全局的options进行合并
      var options = {};

      for (var key in parent) {
        mergeField(key);
      }

      for (var _key in child) {
        if (!parent.hasOwnProperty(_key)) {
          mergeField(_key);
        }
      }

      function mergeField(key) {
        //    策略模式 用策略模式减少if、else
        if (strats[key]) {
          options[key] = strats[key](parent[key], child[key]);
        } else {
          options[key] = child[key] || parent[key];
        }
      }

      return options;
    }

    function initGlobalAPI(Vue) {
      // strats.data strats.computed...
      Vue.options = {};

      Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
      };
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;

      var _s, _e;

      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
    // 第一个分组就是属性的key value 就是 分组3/分组4/分组五

    var startTagClose = /^\s*(\/?)>/; // <div> <br/>
    // vue3 采用的不是使用正则
    // 对模板进行编译处理
    // htmlparser2——编译模板的插件
    // 语法树
    // {
    //     tag:'div',
    //     type:1,
    //     attrs:[{name,age,address}],
    //     parent:null,
    //     children:[
    //         tag:'div',
    //         type:1,
    //         attrs:[{name,age,address}],
    //         parent:null,
    //         children:[]
    //     ]
    // }

    function parseHTML(html) {
      // html最开始肯定是一个 hello</div>
      var ELEMENT_TYPE = 1;
      var TEXT_TYPE = 3;
      var stack = []; // 用于存放元素

      var currentParent; // 栈中的最后一个

      var root; // 最终需要转化成一棵抽象语法树 

      function createASTElement(tag, attrs) {
        return {
          tag: tag,
          type: ELEMENT_TYPE,
          children: [],
          attrs: attrs,
          parent: null
        };
      }

      function start(tag, attrs) {
        var node = createASTElement(tag, attrs);

        if (!root) {
          // 看一下是否是空树
          root = node; // 如果为空则当前是树的根节点
        }

        if (currentParent) {
          node.parent = currentParent;
          currentParent.children.push(node);
        }

        stack.push(node);
        currentParent = node; // console.log(tag, attrs, '开始')
      }

      function chars(text) {
        text = text.replace(/\s/g, '');
        text && currentParent.children.push({
          type: TEXT_TYPE,
          text: text,
          parent: currentParent
        }); // console.log(text, '文本')
      }

      function end(tag) {
        stack.pop(); // 弹出最后一个，校验标签是否合法

        currentParent = stack[stack.length - 1]; // console.log(tag, '结束')
      }

      function advance(n) {
        // 截取
        html = html.substring(n);
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);

        if (start) {
          var match = {
            tagName: start[1],
            // 标签名 div
            attrs: []
          };
          advance(start[0].length); // <div
          // 如果不是开始标签的结束 就一直匹配下去

          var attr, _end; // 去掉属性


          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length);
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5] || true
            });
          } // 去掉结束标签


          if (_end) {
            advance(_end[0].length);
          } // console.log(match)


          return match; // 不是开始标签
        }

        return false;
      }

      while (html) {
        // 如果textEnd 为0 说明是一个开始标签或者结束标签
        var textEnd = html.indexOf('<'); // 如果indexOf中的索引是0 则说明是个标签

        if (textEnd == 0) {
          var startTagMatch = parseStartTag();

          if (startTagMatch) {
            // 解析到的开始标签
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }

          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            // console.log(endTagMatch)
            advance(endTagMatch[0].length);
            end();
            continue;
          }
        }

        if (textEnd > 0) {
          var text = html.substring(0, textEnd); // 文本内容

          if (text) {
            chars(text);
            advance(text.length);
            continue;
          }
        }
      }

      console.log(root);
      return root;
    }

    function genProps(attrs) {
      var str = ''; // {name:value}

      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        if (attr.name === 'style') {
          (function () {
            // color:red:width:50 => {color:red}
            var obj = {};
            attr.value.split(';').forEach(function (item) {
              var _item$split = item.split(':'),
                  _item$split2 = _slicedToArray(_item$split, 2),
                  key = _item$split2[0],
                  value = _item$split2[1];

              obj[key] = value;
            });
            attr.value = obj;
          })();
        }

        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      }

      return "{".concat(str.slice(0, -1), "}"); // 把最后一个逗号去掉
    }

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量

    function gen(node) {
      if (node.type === 1) {
        return codegen(node);
      } else {
        // 文本 两种情况 {{name}}hello  {{age}}
        var text = node.text;

        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")");
        } else {
          // v_(_s(name)+'hello'+_s(name)
          var tokens = [];
          var match;
          defaultTagRE.lastIndex = 0;
          var lastIndex = 0; // split

          while (match = defaultTagRE.exec(text)) {
            var index = match.index; // 匹配的位置 {{name}} hello {{name}} hello

            if (index > lastIndex) {
              tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            tokens.push("_s(".concat(match[1].trim(), ")"));
            lastIndex = index + match[0].length;
          }

          if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
          } // console.log(tokens)


          return "_v(".concat(tokens.join('+'), ")");
        }
      }
    }

    function genChildren(children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }

    function codegen(ast) {
      var children = genChildren(ast.children);
      var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length ? ",".concat(children) : '', ")");
      return code;
    }

    function compileToFunction(template) {
      // 1.就是将template转化成ast语法树
      var ast = parseHTML(template); // 2.生成render方法 （render方法执行后的结果就是 虚拟DOM）
      // console.log(template)

      var code = codegen(ast);
      console.log(code);
      code = "with(this){return ".concat(code, "}");
      var render = new Function(code); // 根据代码生成render函数
      // _c('div',{id:"app",style:{"color":" blue","background":" aqua"}},_c('div',{style:{"color":" red"}},_v(_s(name)+"hello"+_s(age)+"hello")),_c('span',null,_v("world")))

      return render;
    }

    var id$1 = 0;

    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);

        this.id = id$1++; // 属性的dep要手机watcher

        this.subs = []; // 这里存放着当前属性对应的watcher有哪些
      }

      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          // 这里我们不希望放置重复的watcher，而且刚才只是一个单向的关系 dep->watcher
          // watcher 记录dep 多对多
          // this.subs.push(Dep.target)
          Dep.target.addDep(this); // 让watcher记住dep
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            return watcher.update();
          }); // 告诉watcher要更新
        }
      }]);

      return Dep;
    }();

    Dep.target = null;
    var stack = [];
    function pushTarget(watcher) {
      stack.push(watcher);
      Dep.target = watcher;
    }
    function popTarget() {
      stack.pop();
      Dep.target = stack[stack.length - 1];
    }

    var id = 0; // 1）当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
    // 2）调用_render() 会取值 走到get上
    // 每个属性有一个dep（属性就是被观察者），watcher就是观察者（属性变化了就会通知观察者来更新）-》 观察者模式

    var Watcher = /*#__PURE__*/function () {
      // 不同组件有不同的watcher
      function Watcher(vm, fn, options) {
        _classCallCheck(this, Watcher);

        // fn渲染函数 updateComponent
        this.id = id++;
        this.renderWatcher = options; // 是一个渲染watcher

        this.getter = fn; // 意味着调用这个函数可以发生取值操作

        this.deps = []; // 后续我们实现计算属性和一些清理工作需要用到

        this.depsId = new Set();
        this.lazy = options.lazy;
        this.dirty = this.lazy; // 缓存值

        this.vm = vm;
        console.log(this.lazy); // 默认不执行

        this.lazy ? undefined : this.get();
      } // 让渲染逻辑记住dep


      _createClass(Watcher, [{
        key: "addDep",
        value: function addDep(dep) {
          // 一个组件 对应着多个属性 重复的属性也不用记录
          var id = dep.id;

          if (!this.depsId.has(id)) {
            console.log('dep', dep);
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this); // watcher已经记住了dep而且去重了，此时让dep也记住watcher
          }
        }
      }, {
        key: "evaluate",
        value: function evaluate() {
          this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏 

          this.dirty = false;
        }
      }, {
        key: "get",
        value: function get() {
          // 把watcher暴露在全局上
          pushTarget(this); // 静态属性只有一份

          var value = this.getter.call(this.vm); // 会去vm上取值

          popTarget(); // 渲染完毕后就清空

          return value;
        }
      }, {
        key: "depend",
        value: function depend() {
          var i = this.deps.length;

          while (i--) {
            //  dep.depend()
            this.deps[i].depend(); // 让计算属性watcher 也收集渲染watcher
          }
        }
      }, {
        key: "update",
        value: function update() {
          // 依赖的属性发生变化了 就标识计算属性是脏值了
          if (this.lazy) {
            this.dirty = true;
          } else {
            // 异步更新
            queueWatcher(this); // 吧当前的watcher缓存其阿里
            // this.get() // 重新渲染
          }
        }
      }, {
        key: "run",
        value: function run() {
          // console.log('run')
          this.get();
        }
      }]);

      return Watcher;
    }();

    var queue = [];
    var has = {};
    var pending = false; // 防抖

    function flushSchedulerQueue() {
      var flushQueue = queue.slice(0);
      flushQueue.forEach(function (q) {
        return q.run();
      }); // 在刷新的过程中可能还有新的watcher，重新放到queue中

      queue = [];
      has = {};
    }

    function queueWatcher(watcher) {
      var id = watcher.id;

      if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        console.log(queue); // 不管我们的update执行多次，但是最终只执行一轮刷新操作

        if (!pending) {
          nextTick(flushSchedulerQueue);
          pending = true;
        }
      }
    }

    var callbacks = [];
    var waiting = false;

    function flushCallbacks() {
      var cbs = callbacks.slice(0);
      waiting = false;
      callbacks = [];
      cbs.forEach(function (cb) {
        return cb();
      }); // 按照顺序依次执行
    }

    var timerFunc;

    if (Promise) {
      timerFunc = function timerFunc() {
        Promise.resolve().then(flushCallbacks);
      };
    } else if (MutationObserver) {
      var observer = new MutationObserver(flushCallbacks); // 这里传入的回调是异步执行的

      var textNode = document.createTextNode(1);
      observer.observe(textNode, {
        characterData: true
      });

      timerFunc = function timerFunc() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      timerFunc = function timerFunc() {
        setImmediate(flushCallbacks);
      };
    } else {
      timerFunc = function timerFunc() {
        setTimeout(flushCallbacks);
      };
    }

    function nextTick(cb) {
      // 先内部还是先用户的？
      callbacks.push(cb); // 维护nextTick中的callback方法

      if (!waiting) {
        timerFunc();
        waiting = true;
      }
    } // 需要给每一个属性增加一个dep，目的就是收集watcher

    // h() _c()
    function createElementVNode(vm, tag, data) {
      if (data == null) {
        data = [];
      }

      var key = data.key;

      if (key) {
        delete data.key;
      }

      for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        children[_key - 3] = arguments[_key];
      }

      return vnode(vm, tag, key, data, children);
    } // _v

    function createTextVNode(vm, text) {
      return vnode(vm, undefined, undefined, undefined, undefined, text);
    } // ast一样吗？ast做的是语法层面的转化 他描述的是语法本身
    // 我们的虚拟dom 是描述的dom元素，可以增加一些自定义属性（描述dom的）

    function vnode(vm, tag, key, data, children, text) {
      return {
        vm: vm,
        tag: tag,
        key: key,
        data: data,
        children: children,
        text: text
      };
    }

    function createElm(vnode) {
      var tag = vnode.tag,
          data = vnode.data,
          children = vnode.children,
          text = vnode.text;

      if (typeof tag === 'string') {
        vnode.el = document.createElement(tag); // 这里将真实及诶单和虚拟节点对应起来，后续如果修改属性了

        patchProps(vnode.el, data); // 更新属性

        children.forEach(function (child) {
          vnode.el.appendChild(createElm(child));
        });
      } else {
        vnode.el = document.createTextNode(text);
      }

      return vnode.el;
    }

    function patchProps(el, props) {
      for (var key in props) {
        // style{color:'red'}
        if (key == 'style') {
          for (var styleName in props.style) {
            el.style[styleName] = props.style[styleName];
          }
        } else {
          el.setAttribute(key, props[key]);
        }
      }
    }

    function patch(oldVNode, vnode) {
      // 写的是初渲染流程
      var isRealElement = oldVNode.nodeType;

      if (isRealElement) {
        var elm = oldVNode; // 获取真实元素

        var parentElm = elm.parentNode; // 拿到父元素

        var newElm = createElm(vnode);
        parentElm.insertBefore(newElm, elm.nextSibling); // 先插入新节点

        parentElm.removeChild(elm); // 删除老节点
        // console.log(newElm)

        return newElm;
      }
    }

    function initLifeCycle(Vue) {
      Vue.prototype._update = function (vnode) {
        // 将cnode转化成真实dom
        var vm = this;
        var el = vm.$el;
        console.log('update', vnode); // patch既有初始化的功能 又有更新的功能

        vm.$el = patch(el, vnode);
      }; // _c('div',{id:"app",style:{"color":" blue","background":" aqua"}},_c('div',{style:{"color":" red"}},_v(_s(name)+"hello"+_s(age)+"hello")),_c('span',null,_v("world")))
      // _c _v和虚拟节点相关
      // _c('div',{},...children)


      Vue.prototype._c = function () {
        return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };

      Vue.prototype._v = function () {
        return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
      };

      Vue.prototype._s = function (value) {
        if (_typeof(value) !== 'object') return value;
        return JSON.stringify(value);
      };

      Vue.prototype._render = function () {
        // 当渲染的时候会去实例中取值，我们就可以将属性和视图绑定在一起
        return this.$options.render.call(this); // 通过ast语法转义后生成的render方法
      };
    }
    function mountComponent(vm, el) {
      // 1.调用render方法产生虚拟节点 虚拟ODM
      // 2.根据虚拟DOM产生真实DOM
      // 3.插入到el元素中
      vm.$el = el; // 这里的el 是通过querySelector处理过的

      var updateComponent = function updateComponent() {
        vm._update(vm._render()); // vm.$options.render() 虚拟节点

      };

      var xx = new Watcher(vm, updateComponent, true); // true用于标识是一个渲染watcher

      console.log(xx);
    } // vue核心流程
    // 1）创造了响应式数据
    // 2）模板转换成ast语法树
    // 3）将ast语法树转换了render函数
    // 4）后续每次数据更新可以只执行render函数（无需再次执行ast转化的过程）
    // render函数会去产生虚拟节点（使用响应式数据）
    // 根据生成的虚拟节点创造真实的DOM

    function callHook(vm, hook) {
      // 调用钩子函数
      var handlers = vm.$options[hook];

      if (handlers) {
        handlers.forEach(function (handler) {
          return handler.call(vm);
        });
      }
    }

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        // Object.defineProperty只能劫持已经存在的属性，后增的，或者删除的 不知道（vue里面会为此单独写一些api $set $delete）
        this.walk(data);
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          // 循环对象 对属性依次劫持
          // “重新定义”属性
          Object.keys(data).forEach(function (key) {
            return defineReactive(data, key, data[key]);
          });
        }
      }]);

      return Observer;
    }();

    function defineReactive(target, key, value) {
      //闭包 属性劫持
      observe(value); // 对所有的对象都进行属性劫持

      var dep = new Dep(); // 每一个属性都有一个dep

      Object.defineProperty(target, key, {
        get: function get() {
          // 取值的时候 会执行get
          console.log('用户取值了', Dep.target);

          if (Dep.target) {
            dep.depend(); // 让这个属性的收集器记住当前的watcher this.subs.push(Dep.target)
          }

          return value;
        },
        set: function set(newValue) {
          // 修改的时候 会执行set
          console.log('用户设置了');
          if (newValue === value) return;
          value = newValue;
          dep.notify(); // 通知更新
        }
      });
    }
    function observe(data) {
      // 对这个对象进行劫持
      if (_typeof(data) !== 'object' || data == null) {
        return; // 只对对象进行劫持
      } // 如果一个对象被劫持过了，就不需要再被劫持（要判断一个对象是否被劫持过，可以增添一个实例，用实例来判断是否被劫持过）


      return new Observer(data);
    }

    function initState(vm) {
      var opts = vm.$options; // 获取所有的选项

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) {
        initComputed(vm);
      }
    } // 代理

    function proxy(vm, target, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[target][key]; // vm._data.name
        },
        set: function set(newValue) {
          vm[target][key] = newValue;
        }
      });
    }

    function initData(vm) {
      var data = vm.$options.data; // data可能是函数和对象

      data = typeof data === 'function' ? data.call(vm) : data;
      vm._data = data; // 我将返回的对象放到了_data上
      // 对数据进行劫持 vue2里采用了一个api defineProperty

      observe(data); // 将vm._data 用vm来代理就可以了

      for (var key in data) {
        proxy(vm, '_data', key);
      }
    }

    function initComputed(vm) {
      var computed = vm.$options.computed;
      var watchers = vm._computedWatchers = {}; // 将计算属性watcher保存到vm上

      for (var key in computed) {
        var userDef = computed[key]; // 我们需要监控计算属性中 get的变化

        var fn = typeof userDef === 'function' ? userDef : userDef.get; // 如果直接new Watcher 默认就会执行fn

        watchers[key] = new Watcher(vm, fn, {
          lazy: true
        }); // 不要立即执行 要懒执行

        console.log('watchers------', watchers);
        console.log('key------', key);
        console.log('userDef------', userDef);
        defineComputed(vm, key, userDef);
      }
    }

    function defineComputed(target, key, userDef) {
      // const getter = typeof userDef === 'function' ? userDef : userDef.get
      var setter = userDef.set || function () {}; // 可以通过实例拿到对应的属性


      Object.defineProperty(target, key, {
        get: createComputedGetter(key),
        set: setter
      });
    } // 计算属性根本不会收集依赖，只会让自己的依赖属性去收集依赖


    function createComputedGetter(key) {
      // 检测是否要执行这个getter
      return function () {
        var watcher = this._computedWatchers[key]; // 获取到对应属性的watcher

        if (watcher.dirty) {
          // 如果是脏的就去执行 用户传入的函数
          watcher.evaluate(); // 求值后 dirty变为了false，下次就不求值了
        }

        if (Dep.target) {
          // 计算属性出栈后 还要渲染watcher，我应该让计算属性watcher里面的属性 也去收集上层watcher
          watcher.depend();
        }

        return watcher.value; // 最后返回的是watcher上的值
      };
    }

    function initMixin(Vue) {
      // 就是给Vue增加init方法的
      Vue.prototype._init = function (options) {
        // 用于初始化操作
        // console.log(options)
        // vue vm.$options 就是获取用户的配置
        // 我们使用的 vue的时候 $nextTick $data $attr.....内部属性
        var vm = this; // this.constructor.options vue的全局选项和用户传入的options做合并
        // 我们定义的全局指令和过滤器...都会挂在到实例上

        vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂在到实例上

        callHook(vm, 'beforeCreate'); // 初始化状态，初始化计算属性，watch

        initState(vm);
        callHook(vm, 'created');

        if (options.el) {
          vm.$mount(options.el); // 实现数据的挂载
        }
      };

      Vue.prototype.$mount = function (el) {
        var vm = this;
        el = document.querySelector(el);
        var ops = vm.$options;

        if (!ops.render) {
          // 先进行查找有没有render函数
          var template; // 没有render看一下是否写了template，没写template采用外部的template

          if (!ops.template && el) {
            // 没有写模板 但是写了el
            template = el.outerHTML;
          } else {
            if (el) {
              template = ops.template; // 如果有el 则采用模板的内容
            }
          } // 写了template就用写了的template
          // console.log(template)


          if (template) {
            // 这里需要对模板进行编译
            var render = compileToFunction(template);
            ops.render = render;
          }
        }

        mountComponent(vm, el); // 组件的挂载
        // 最终就可以获取render方法
        // script 标签引用的vue.global.js这个编译过程实在浏览器运行的
        // runtime是不包含模板编译的，整个编译是打包的时候通过loader来转义.vue文件的，用runtime的时候不能使用template（.vue文件的模板）
      };
    }

    function Vue(options) {
      // options就是用户的选项
      this._init(options);
    }

    Vue.prototype.$nextTick = nextTick;
    initMixin(Vue); // 扩展了init方法

    initLifeCycle(Vue);
    initGlobalAPI(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
