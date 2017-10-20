const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Create File', async (t) => {
  const mock = fixtures.mock('api.github.com/create-file')

  const result = await axios({
    method: 'put',
    url: 'https://api.github.com/repos/octokit-fixture-org/create-file/contents/test.txt',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token 0000000000000000000000000000000000000001`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      message: 'create test.txt',
      content: Buffer.from('Test content').toString('base64')
    }
  }).catch(mock.explain)

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.is(result.data.content.type, 'file')
  t.end()
})
