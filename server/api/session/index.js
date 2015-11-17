'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./session.controller')

router.post('/save', controller.set)
router.post('', controller.new)
router.get('/get/:key', controller.get)

module.exports = router
