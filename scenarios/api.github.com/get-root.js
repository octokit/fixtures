const env = require('../../lib/env')

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
      Authorization: `token ${env.FIXTURES_USER_ACCESS_TOKEN}`
    }
  }
]
