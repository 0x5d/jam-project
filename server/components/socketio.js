'use strict'

const config = require('../config')
const client = require('redis').createClient(config.redis.uri)

module.exports.init = function (http) {
  const io = require('socket.io')(http)

  io.on('connection', function (socket) {
    socket.on('enter', function (id) {
      socket.join(id)
      socket.join(socket.id)
      client.hgetall(id, function (err, reply) {
        io.to(socket.id).emit('settings', reply)
      })
    })

    socket.on('sound', function (data) {
      socket.broadcast.to(data.id).emit('sound', {name: data.name, blob: data.blob})
    })

    socket.on('settings', function (settings) {
      socket.broadcast.to(settings.id).emit('settings', settings)
    })
  })
}
