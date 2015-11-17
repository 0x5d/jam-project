'use strict'
const config = require('../../config')
const client = require('redis').createClient(config.redis.uri)
// const temp = require('../components/socketio.js')()
// console.log('temp',temp)
const uuid = require('node-uuid')

exports.set = function (req, res) {
  let key = req.body.key || 'key'
  let value = req.body.value || 'value'
  client.set(key, value)
  return res.status(200).json({value: value})
}

exports.get = function (req, res) {
  let key = req.params.key || 'key'
  client.get(key, function (err, data) {
    if (err) return res.status(500)
    return res.status(200).json({data: data})
  })
}

exports.new = function createNew (req, res) {
  var newId = uuid()
  var sessionObj = {samples: [], bpm: 120, beats: 4}
  client.hmset(newId, sessionObj)
  res.redirect('/session.html?id=' + newId)
}
