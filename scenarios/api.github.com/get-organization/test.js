const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get organization', async (t) => {
  const mock = fixtures.mock('api.github.com/get-organization')

  const result = await axios({
    method: 'get',
    url: 'https://api.github.com/orgs/octokit-fixture-org',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  }).catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.is(result.data.id, 1000)
  t.end()
})
