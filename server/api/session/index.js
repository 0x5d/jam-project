'use strict'

var router = require('express').Router()
var controller = require('./session.ctrl')

router.post('', controller.new)

module.exports = router
