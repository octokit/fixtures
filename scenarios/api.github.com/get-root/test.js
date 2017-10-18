const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get repository', async (t) => {
  const mock = fixtures.mock('api.github.com/get-root')

  await axios({
    method: 'get',
    url: 'https://api.github.com/',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  }).catch(mock.explain)

  await axios({
    method: 'get',
    url: 'https://api.github.com/',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token 0000000000000000000000000000000000000001`
    }
  }).catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
