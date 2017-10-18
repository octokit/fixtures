const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get repository', async (t) => {
  const mock = fixtures.mock('api.github.com/add-labels-to-issue')

  // https://developer.github.com/v3/issues/#create-an-issue
  await axios({
    method: 'post',
    url: `https://api.github.com/repos/octokit-fixture-org/add-labels-to-issue/issues`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token 0000000000000000000000000000000000000001`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      title: 'Issue without a label'
    }
  })

  // https://developer.github.com/v3/issues/labels/#add-labels-to-an-issue
  await axios({
    method: 'post',
    url: `https://api.github.com/repos/octokit-fixture-org/add-labels-to-issue/issues/1/labels`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token 0000000000000000000000000000000000000001`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: [
      'Foo',
      'bAr',
      'baZ'
    ]
  }) // .catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
