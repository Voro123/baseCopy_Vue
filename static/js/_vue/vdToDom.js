import replaceStr from './replaceStr.js'

// 将vd样式渲染到页面上
function vdToDom (vdobj, consVue) {
  let domReturn
  if (!vdobj.tag) {
    // 传入的是一个文本节点
    domReturn = document.createTextNode(vdobj)
  } else {
    // 传入的是一个元素节点
    domReturn = document.createElement(vdobj.tag)

    // 遍历添加属性
    if (vdobj.props) {
      for (let key in vdobj.props) {
        const eventKey = key.match(/^(?:(?:@|(?:v-on)))(.*)/)?.[1]
        if (eventKey) {
          // 属性名以@或v-on开头的场合,判定为事件,添加事件监听器
          // (不在dom转换为vd时渲染的原因时要为元素绑定事件监听器,在dom里直接操作快很多)

          domReturn.addEventListener(eventKey, () => {
            replaceStr(vdobj.props[key], consVue, vdobj.mapData)
          })
        }
        else {
          domReturn.setAttribute(key, vdobj.props[key])
        }
      }
    }

    // 遍历添加子节点
    for (let child of vdobj.children) {
      switch (typeof child) {
        // 文本节点渲染
        case 'string': {
          domReturn.appendChild(vdToDom(child, consVue))
          break
        }
        // 元素节点渲染
        case 'object': {
          domReturn.appendChild(vdToDom(child, consVue))
          break
        }
        // 其他场合:跳过
        default: {
          break
        }
      }
    }
  }

  return domReturn
}

export default vdToDom
