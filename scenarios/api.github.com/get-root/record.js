const env = require('../../../lib/env')

// https://developer.github.com/v3/#root-endpoint
module.exports = [
  {
    method: 'get',
    url: '/',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  },
  {
    method: 'get',
    url: '/',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
    }
  }
]
