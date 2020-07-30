import vdToDom from './vdToDom.js'

// 获取两个vd的差异对象
function diff (oldVdom, newVdom, parent, index, consVue) {
  // 新建
  if (!oldVdom) {
    parent.appendChild(vdToDom(newVdom, consVue))
    return false
  }

  // 当前遍历的对应节点
  const element = parent.childNodes[index]

  // 删除
  if (newVdom === undefined) {
    parent.removeChild(element)
    return true
  }

  // 替换
  // 三个条件分别为:
  // 1.两个节点类型不同时(type)
  // 2.两个元素节点标签不同时(tag)
  // 3.两个文本节点内容不同时(text)
  if (typeof oldVdom !== typeof newVdom ||
    (oldVdom.tag && (oldVdom.tag !== newVdom.tag)) ||
    (!oldVdom.tag && (oldVdom !== newVdom))
  ) {
    parent.replaceChild(vdToDom(newVdom, consVue), element)
    return false
  }

  // 修改
  if (oldVdom.tag) {
    // 获取属性和子节点的差异
    _diffProps(oldVdom, newVdom, element)
    _diffChildren(oldVdom, newVdom, element, consVue)
    return false
  }

  // 其他情况,返回undefined
}

// 比较属性的变化并返回差异对象
function _diffProps (oldVdom, newVdom, element) {
  const oldProps = oldVdom.props
  const newProps = newVdom.props

  // 通过扩展运算符,将新旧属性对象合并成一个对象
  let sumProps = { ...oldProps, ...newProps }

  // 遍历这个对象的键值,与两个原对象的键值一一进行比较
  for (let key in sumProps) {
    // 如果在新属性对象中不存在遍历的键名,认为该属性被删除
    if (newProps[key] === undefined) {
      element.removeAttribute(key)
    }
    // 如果在旧属性对象中不存在遍历的键名,认为该属性被添加(更新)
    else if (oldProps[key] === undefined ||
      oldProps[key] !== newProps[key]) {
      // 跳过@/v-on开头的属性
      // 跳过key属性
      if (!(/^(@|(v-on))/.test(key) || key === 'key')) {
        element.setAttribute(key, newProps[key])
      }
    }
  }
}

// 比较子节点的变化并返回差异对象
function _diffChildren (oldVdom, newVdom, element, consVue) {
  // let maxLen = Math.max(oldVdom.children.length, newVdom.children.length)

  // for (let i = 0; i < maxLen; i++) {
  //   diff(oldVdom.children[i], newVdom.children[i], element, i, consVue)
  // }

  // 遍历旧VD对象
  const vOldChildren = oldVdom.children
  const vNewChildren = newVdom.children
  let oldVLen = vOldChildren.length

  for (let i = 0; i < oldVLen; i++) {
    let _newVdom // 对应要比较的新节点

    // 当前旧VD遍历节点有key属性的情况
    if ((oldVdom.children[i].props && oldVdom.children[i].props.key) !== undefined) {
      // 查找新VD的子节点有没有对应key属性
      _newVdom = vNewChildren.find((childVd, i2) => {
        if (childVd?.props && oldVdom?.children[i].props) {
          if (childVd.props.key.toString() === oldVdom.children[i].props.key) {
            // 找到的同时会移除数组的对应元素
            vNewChildren.splice(i2, 1)
            return true
          }
        }
      })

      // 有的情况下,计算这两个节点的差异打补丁
      if (_newVdom) {
        diff(vOldChildren[i], _newVdom, element, i, consVue)
        continue
      }
    }

    // 旧VD遍历节点没有key属性或没有对应key属性对象的情况
    // 判断新VD第一个元素有没有key属性
    const key = vNewChildren[0]?.props?.key
    if (key !== undefined) {
      let flag = false
      // 如果新VD第一个元素被调到了末尾,继续循环看新的新VD头元素
      while (!flag && vNewChildren.length) {
        flag = true
        /* 遍历旧节点,查找有没有和新VD第一个元素同样key属性的元素,若有，将新VD第一个元素置换
         到其末尾 */
        for (let n = i + 1; n < oldVLen; n++) {
          if (vOldChildren[n].props?.key === key) {
            flag = false
            const len = vNewChildren.length - 1;
            [vNewChildren[0], vNewChildren[len]] = [vNewChildren[len], vNewChildren[0]]
            break
          }
        }
      }
    }

    // 若新VD头元素没有key属性或没有对应key属性元素,正常渲染
    if (diff(vOldChildren[i], vNewChildren[0], element, i, consVue)) {
      i--
      oldVLen--
    }
    if (vNewChildren.length) {
      vNewChildren.splice(0, 1)
    }

  }

  // 若遍历完旧节点所有节点,新VD还有元素,将它们遍历完
  for (let i = 0, vNewLen = vNewChildren.length; i < vNewLen; i++) {
    diff(null, vNewChildren[i], element, oldVLen + i, consVue)
  }
}

export default diff