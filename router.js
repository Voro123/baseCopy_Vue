const fs = require('fs')
const express = require('express')

let router = express.Router()

router
  .get('/', (req, res) => {
    fs.readFile('views/index.html', function (err, data) {
      if (err) return console.log(err)
      res.send(data.toString())
    })
  })
  .get('/test', (req, res) => {
    fs.readFile('views/test.html', function (err, data) {
      if (err) return console.log(err)
      res.send(data.toString())
    })
  })

module.exports = router