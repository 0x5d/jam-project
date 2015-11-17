/**
 * Main application routes
 */
'use strict'

module.exports = function (app) {
  app.use('/api/v1/session', require('./api/session'))
}
