const path = require('path')

module.exports = {
  entry: './static/js/_vue/constructor.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'static/js/_vue/dist')
  },
  mode: 'development',
  //处理es6 语法  exclude 排除 node_modules 下面的文件
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
}