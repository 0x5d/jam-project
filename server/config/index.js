'use strict'

var all = {
  env: process.env.NODE_ENV,

  // Redis connection options
  redis: {
    uri: 'redis://x:fc6505606e6b439bbe07fda895c189e4@handsome-hemlock-4434.redisgreen.net:11042/'
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = all
