const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Labels', async (t) => {
  const mock = fixtures.mock('api.github.com/lock-issue')

  // https://developer.github.com/v3/issues/#lock-an-issue
  await axios({
    method: 'put',
    url: 'https://api.github.com/repos/octokit-fixture-org/lock-issue/issues/1/lock',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      // > For PUT requests with no body attribute, be sure
      //   to set the Content-Length header to zero.
      // https://developer.github.com/v3/#http-verbs
      'Content-Length': '0'
    }
  }).catch(mock.explain)

  // https://developer.github.com/v3/issues/#unlock-an-issue
  await axios({
    method: 'delete',
    url: 'https://api.github.com/repos/octokit-fixture-org/lock-issue/issues/1/lock',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  }).catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
