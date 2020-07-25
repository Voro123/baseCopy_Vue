// 返回传入值的真实类型
function getType (m) {
  return {}.toString.call(m).slice(8, -1).toLowerCase()
}

export default getType