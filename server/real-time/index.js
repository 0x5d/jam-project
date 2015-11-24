'use strict'

// const config = require('../config')

function init (http) {
  const io = require('socket.io')(http)

  io.on('connection', function (socket) {
    socket.on('enter', function (id) {
      socket.join(id)
      // Join 'self' room
      socket.join(socket.id)
    })

    socket.on('sound', function (data) {
      socket.broadcast.to(data.id).emit('sound', {name: data.name, blob: data.blob})
    })

    socket.on('settings', function (settings) {
      socket.broadcast.to(settings.id).emit('settings', settings)
    })
  })
}

module.exports = {
  'init': init
}
