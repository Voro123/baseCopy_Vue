const express = require('express')
const router = require('./router.js')

const app = express()

app.use('/', express.static('./static'))
app.use('/', express.static('./views'))

app.use(router)

app.listen(5050, function () {
  console.log('正在监听5050端口..')
})
