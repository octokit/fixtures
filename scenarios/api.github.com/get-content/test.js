const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get repository', async (t) => {
  const mock = fixtures.mock('api.github.com/get-content')

  const result = await axios({
    method: 'get',
    url: 'https://api.github.com/repos/octokit-fixture-org/hello-world/contents/',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  }).catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.is(result.data.length, 1)
  t.is(result.data[0].path, 'README.md')
  t.end()
})
