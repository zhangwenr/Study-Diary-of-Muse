const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

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

export function parseHTML(html) { // html最开始肯定是一个 hello</div>
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 用于存放元素
    let currentParent // 栈中的最后一个
    let root

    // 最终需要转化成一棵抽象语法树 
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function start(tag, attrs) {
        let node = createASTElement(tag, attrs)
        if (!root) { // 看一下是否是空树
            root = node // 如果为空则当前是树的根节点
        }
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node
        // console.log(tag, attrs, '开始')
    }
    function chars(text) {
        text = text.replace(/\s/g, '')
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
        // console.log(text, '文本')
    }
    function end(tag) {
        let node = stack.pop() // 弹出最后一个，校验标签是否合法
        currentParent = stack[stack.length - 1]
        // console.log(tag, '结束')
    }
    function advance(n) { // 截取
        html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1], // 标签名 div
                attrs: []
            }
            advance(start[0].length) // <div

            // 如果不是开始标签的结束 就一直匹配下去
            let attr, end
            // 去掉属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
            }
            // 去掉结束标签
            if (end) {
                advance(end[0].length)
            }
            // console.log(match)
            return match // 不是开始标签
        }
        return false

    }
    while (html) {
        // 如果textEnd 为0 说明是一个开始标签或者结束标签
        let textEnd = html.indexOf('<') // 如果indexOf中的索引是0 则说明是个标签
        if (textEnd == 0) {
            const startTagMatch = parseStartTag()
            if (startTagMatch) { // 解析到的开始标签
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                // console.log(endTagMatch)
                advance(endTagMatch[0].length)
                end(endTagMatch)
                continue
            }
        }
        if (textEnd > 0) {
            let text = html.substring(0, textEnd) // 文本内容
            if (text) {
                chars(text)
                advance(text.length)
                continue
            }
        }
    }
    console.log(root)
    return root
}