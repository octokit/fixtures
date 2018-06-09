const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('paginate issues', async (t) => {
  const mock = fixtures.mock('api.github.com/paginate-issues')

  // https://developer.github.com/v3/issues/#list-issues-for-a-repository
  // Get pages 1 - 5.
  const baseUrl = 'https://api.github.com/repos/octokit-fixture-org/paginate-issues/issues?per_page=3'
  const options = {
    method: 'get',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  }

  await axios.request(Object.assign(options, {
    url: baseUrl
  })).catch(mock.explain)

  for (let i = 2; i <= 5; i++) {
    await axios.request(Object.assign(options, {
      url: `${baseUrl}&page=${i}`
    })).catch(mock.explain)
  }

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
