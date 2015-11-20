var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var config = require('./server/config')
var socketServer = require('./server/real-time')

var app = express()
var server = http.Server(app)

socketServer.init(server)

// config
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// route
app.use('/api/v1', require('./server/api'))

// Create a static file server
app.use(express.static(__dirname + '/public'))

server.listen(config.server.port, function onListening () {
  console.log('Jam is listening on port %s', config.server.port)
})
