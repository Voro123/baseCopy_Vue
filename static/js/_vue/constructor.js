import render from './render.js'
import getType from './Tools/getType.js'

// 保存构造函数可以属性允许的值和对应类型
const mapDatas = new Map([
  ['el', 'string'],
  ['data', 'object'],
  ['methods', 'object']
])


window._Vue = class {
  constructor(obj) {
    if (getType(obj) !== 'object') {
      throw Error('type Error')
    }
    if (obj.el === undefined) {
      throw Error(`Prop 'el' Show be Defined`)
    }

    for (let key in obj) {
      // 处理报错
      let mapVal = mapDatas.get(key)
      if (mapVal === undefined) {
        throw Error('Unknown prop')
      }
      if (mapDatas.get(key) !== getType(obj[key])) {
        throw Error(`type Error of [${key}]`)
      }
    }

    obj.data = obj.data || {}
    obj.methods = obj.methods || {}
    obj.constructor = _Vue

    Reflect.setPrototypeOf(obj.methods, obj)
    Reflect.setPrototypeOf(obj, obj.data)

    // 设置数据源属性,该属性为进入页面时第一次加载组件的模板
    obj = Object.assign(obj, { dataSource: document.getElementById(obj.el) })

    // 设置datas属性监听
    obj.data = new Proxy(obj.data, {
      set (target, name, value) {
        let oldval = target[name]
        target[name] = value

        if (typeof oldval !== 'undefined') {
          // 如果不是新添加的属性,重新渲染
          render(obj)
        }
        return true
      }
    })

    render(obj)
    return obj
  }
}

