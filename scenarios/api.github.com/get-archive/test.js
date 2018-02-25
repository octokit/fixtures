const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get archive', async (t) => {
  const mock = fixtures.mock('api.github.com/get-archive')

  // https://developer.github.com/v3/repos/#edit
  const redirectLocation = await axios({
    method: 'get',
    url: 'https://api.github.com/repos/octokit-fixture-org/get-archive/tarball/master',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    },
    // axios (or the lower level follow-redirects package) does not handle 307
    // redirects correctly
    maxRedirects: 0
  }).catch(error => {
    t.is(error.response.status, 302)
    if (error.response.status === 302) {
      return error.response.headers.location
    }

    throw error
  }).catch(mock.explain)

  t.is(redirectLocation, 'https://codeload.github.com/octokit-fixture-org/get-archive/legacy.tar.gz/master')

  const result = await axios({
    method: 'get',
    url: redirectLocation,
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  })

  t.is(Buffer.from(result.data, 'binary').toString('hex').length, 340)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
