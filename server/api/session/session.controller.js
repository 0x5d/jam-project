'use strict'
const config = require('../../config')
const uuid = require('node-uuid')

exports.new = function createNew (req, res) {
  var newId = uuid()
  res.redirect('/session.html?id=' + newId)
}
