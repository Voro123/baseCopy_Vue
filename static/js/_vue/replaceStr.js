// 将传入字符串用正则进行数据提取替换
function replaceStr (str, consVue, mapData) {

  // 替换consVue数据
  for (const key of Object.getOwnPropertyNames(consVue.data)) {
    const reg = new RegExp(`(?<=(\\W|^))${key}(?=(\\W|$))`, 'g')
    str = str.replace(reg, `consVue.data['${key}']`)
  }
  for (const key of Object.getOwnPropertyNames(consVue.methods)) {
    const reg = new RegExp(`(?<=(\\W|^))${key}(?=(\\W|$))`, 'g')
    str = str.replace(reg, `consVue.methods['${key}']`)
  }

  // 替换mapData数据
  for (const key of mapData.keys()) {
    const reg = new RegExp(`(?<=(\\W|^))${key}(?=(\\W|$))`, 'g')
    str = str.replace(reg, `mapData.get('${key}')`)
  }

  // 如果字符串内只写了一个方法,给它加上括号
  if (/^consVue.methods\['.*'\]$/.test(str)) {
    str += '()'
  }
  return eval(str)
}

export default replaceStr