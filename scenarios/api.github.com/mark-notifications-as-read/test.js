const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Labels', async (t) => {
  const mock = fixtures.mock('api.github.com/mark-notifications-as-read')

  // https://developer.github.com/v3/activity/notifications/#mark-as-read
  // Currently fails when no body is sent
  await axios({
    method: 'put',
    url: 'https://api.github.com/notifications',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'content-length': 0
    }
  }).catch(error => {
    if (error.response.status === 400) {
      // GitHub API current returns an error when sending an empty body, this
      // should get fixed soon. Once it does make sure to
      // remove the workaround for https://github.com/octokit/rest.js/issues/694
      return
    }

    throw error
  }).catch(mock.explain)

  await axios({
    method: 'put',
    url: 'https://api.github.com/notifications',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {}
  })

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
