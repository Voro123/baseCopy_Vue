import domToVd from './domToVd.js'
import vdToDom from './vdToDom.js'
import diff from './diff.js'

// 初始化页面
let firstTime = true
function render (consVue) {
  let newVd = domToVd(consVue.dataSource, consVue)

  const el = document.getElementById(consVue.el)
  const parent = el.parentNode

  if (firstTime) {
    // 第一次页面渲染的场合:用渲染完的节点替换原来的节点
    el.parentNode.replaceChild(vdToDom(newVd, consVue), el)
    firstTime = false
  } else {
    // 其他场合,计算两次VD的diff对象
    diff(domToVd(el, consVue), newVd, parent, [...parent.childNodes].indexOf(el), consVue)
  }

}
export default render