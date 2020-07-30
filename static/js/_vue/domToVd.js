import getType from './Tools/getType.js'
import replaceStr from './replaceStr.js'

/* 将 dom 节点抽象成 vd 样式
  el: 要转化的 dom 节点
  consVue: 渲染组件的相应 _Vue 实例
  vParent: 指向当前遍历节点的父节点 VD 对象
  mapData: 该Map对象存放暂时变量,如 v-for="i in 3" 产生的 i 变量等
*/
function domToVd (el, consVue, vParent = null, mapData = new Map()) {
  let props = {}
  let children = []

  let vd = {
    tag: el.localName, // [String] 元素标签
    props: props,  // [Object] 元素属性对象
    children: children, // [Array] 元素子节点集合
    mapData: null, // [Map] 临时变量键值集合
  }

  // 遍历元素属性并添加入vd中
  for (let attr of el.attributes) {
    let attrKey = attr.localName
    let attrVal = attr.nodeValue

    // 如果属性名为预设的v-for,认为需要改元素循环输出
    switch (attrKey) {
      case 'v-for': {
        let el_copy = el.cloneNode(true)
        el_copy.removeAttribute(attrKey)

        if (vParent === null) {
          throw Error(`can't find Parent of element`)
        }

        let arrSplit = attrVal.split(' in ')

        if (arrSplit.length !== 2) {
          throw Error(`wrong layout of v-for`)
        }

        arrSplit[0] = arrSplit[0].trim()
        arrSplit[1] = arrSplit[1].trim()

        // 重复定义属性报错
        if (consVue.data[arrSplit[0]] !== undefined) {
          throw Error(`repeat define variable ${arrSplit[0]}`)
        }

        let arr = null

        // 将第二个参数与绑定数据进行转换
        if (consVue.data[arrSplit[1]] !== undefined) {
          arrSplit[1] = consVue.data[arrSplit[1]]
        }
        else if (mapData.has(arrSplit[1])) {
          arrSplit[1] = mapData.get(arrSplit[1])
        }

        // 如果第二个参数是一个数字,将它转换为从1到这个数字的数组
        if (!Object.is(Number(arrSplit[1]), NaN)) {
          let num = Number(arrSplit[1])
          arr = []
          for (let i = 0; i < num; i++) {
            arr.push(i)
          }
        }
        // 如果第二个参数是一个数组,将其本身传入arr
        else if (getType(arrSplit[1]) === 'array') {
          arr = arrSplit[1]
        }

        // 如果第一个参数使用了mapData存在键名,抛出一个错误
        if (mapData.get(arrSplit[0])) {
          throw Error(`Can't use the key ${arrSplit[0]}`)
        }

        const arrLen = arr.length
        // 数组为0的情况下不进行渲染
        if (arrLen === 0) {
          return undefined
        }

        /* 将需要重复的元素添加入父节点的子节点,重复指定循环次数-1,然后再渲染
        当前元素作为最后一个 */
        for (let i in arr) {
          if ((Number)(i) === arrLen - 1) { break }
          vParent.children.push(domToVd(el_copy, consVue, vParent,
            new Map([...mapData, ...[[arrSplit[0], arr[i]]]])
          ))
        }
        mapData = new Map([...mapData, ...[[arrSplit[0], arr[arrLen - 1]]]])
        break
      }
      default: {
        // 如果属性名以v-bind:或:开头
        // 提取除了前缀外的真属性名
        const trueKey = attrKey.match(/^(?:(?:v-bind:)|\:)(.*)/)?.[1]
        if (trueKey) {
          props[trueKey] = replaceStr(attrVal, consVue, mapData)
        } else {
          // 其他场合,直接添加对应属性
          props[attrKey] = attrVal
        }
      }
    }
  }

  // 遍历节点的所有子节点并添加入vd中
  for (let child of el.childNodes) {
    switch (child.nodeType) {
      // 元素节点
      case 1: {
        children.push(domToVd(child, consVue, vd, mapData))
        break
      }
      // 文本节点
      case 3: {
        // 将文本中{{...}}样式的文本转化为对应数据
        let textval = child.nodeValue.toString()
        const textDatas = textval.match(/\{\{\s*\S*\s*\}\}/g)
        if (textDatas) {
          for (const scriptText of textDatas) {
            const newText = replaceStr(scriptText.slice(2, -2).trim(), consVue, mapData)
            textval = textval.replace(scriptText, newText)
          }
        }
        children.push(textval)
        break
      }
      // 其他节点:跳过
      default: {
        break
      }
    }
  }

  vd.mapData = mapData
  return vd
}

export default domToVd