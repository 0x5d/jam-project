var express = require('express')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
// var multer = require('multer') // v1.0.5
// var upload = multer() // for parsing multipart/form-data
const config = require('./server/config')

var redis = require('redis')
var client = redis.createClient(config.redis.uri)

client.on('error', function (err) {
  console.log('Error ' + err)
})

var app = express()
var http = require('http').Server(app)

require('./server/components/socketio.js').init(http)

// config
app.use(methodOverride())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// get Routes
require('./server/routes')(app)

// Create a static file server
app.use(express.static(__dirname + '/public'))

var port = 8080
http.listen(port)
console.log('Express server started on port %s', port)
