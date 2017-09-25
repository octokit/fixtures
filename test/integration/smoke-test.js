const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../..')

test('Missing Accept header', async (t) => {
  fixtures.mock('api.github.com/get-repository')

  try {
    await axios({
      method: 'get',
      url: 'https://api.github.com/repos/octokit-fixture-org/hello-world'
    })
    t.fail('request should fail')
  } catch (error) {
    t.match(error.message, 'No match for request')
  }

  t.end()
})

test('Matches corret fixture based on authorization header', async (t) => {
  fixtures.mock('api.github.com/get-root')

  const result = await axios({
    method: 'get',
    url: 'https://api.github.com',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000000'
    }
  })

  t.is(result.headers['x-ratelimit-remaining'], '4999')

  t.end()
})
