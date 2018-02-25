const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get repository', async (t) => {
  const mock = fixtures.mock('api.github.com/get-content')

  const jsonResult = await axios({
    method: 'get',
    url: 'https://api.github.com/repos/octokit-fixture-org/hello-world/contents/',
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  }).catch(mock.explain)

  t.is(jsonResult.data.length, 1)
  t.is(jsonResult.data[0].path, 'README.md')

  const rawResult = await axios({
    method: 'get',
    url: 'https://api.github.com/repos/octokit-fixture-org/hello-world/contents/README.md',
    headers: {
      Accept: 'application/vnd.github.v3.raw'
    }
  }).catch(mock.explain)

  t.is(rawResult.data, '# hello-world')
  t.is(rawResult.headers['content-type'], 'application/vnd.github.v3.raw; charset=utf-8')

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
