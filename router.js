const fs = require('fs')
const express = require('express')

let router = express.Router()

router
  .get('/', (req, res) => {
    fs.readFile('/index.html', function (err, data) {
      if (err) return console.log(err)
      res.redirect('/index.html')
    })
  });

module.exports = router