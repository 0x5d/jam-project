'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./session.controller')

router.post('', controller.new)

module.exports = router
