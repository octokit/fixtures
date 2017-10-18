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
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  t.is(result.headers['x-ratelimit-remaining'], '4999')

  t.end()
})

test('unmatched request error', async (t) => {
  const mock = fixtures.mock('api.github.com/get-repository')

  try {
    await axios({
      method: 'get',
      url: 'https://api.github.com/unknown',
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    }).catch(mock.explain)
    t.fail('request should fail')
  } catch (error) {
    t.match(error.message, '+  url: "https://api.github.com/unknown')
  }

  t.end()
})

test('explain non-request error', {only: true}, async (t) => {
  const mock = fixtures.mock('api.github.com/get-repository')

  try {
    mock.explain(new Error('foo'))
    t.fail('should throw error')
  } catch (error) {
    t.is(error.message, 'foo')
  }

  t.end()
})
