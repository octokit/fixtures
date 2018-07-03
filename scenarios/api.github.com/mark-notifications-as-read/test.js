const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Labels', async (t) => {
  const mock = fixtures.mock('api.github.com/mark-notifications-as-read')

  await axios({
    method: 'put',
    url: 'https://api.github.com/notifications',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'content-length': 0
    }
  })

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
