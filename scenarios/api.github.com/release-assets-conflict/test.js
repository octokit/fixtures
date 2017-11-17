const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Labels', async (t) => {
  t.plan(2)
  const mock = fixtures.mock('api.github.com/release-assets-conflict')

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Get release to retrieve upload URL
  await axios({
    method: 'get',
    url: `https://api.github.com/repos/octokit-fixture-org/release-assets-conflict/releases/tags/v1.0.0`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // upload attachment to release URL returned by create release request
  try {
    await axios({
      method: 'post',
      url: `https://uploads.github.com/repos/octokit-fixture-org/release-assets-conflict/releases/1000/assets?name=test-upload.txt&label=test`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 0000000000000000000000000000000000000001',
        'Content-Type': 'text/plain',
        'Content-Length': 14
      },
      data: 'Hello, world!\n'
    })
  } catch (error) {
    t.is(error.response.status, 422)
  }

  // https://developer.github.com/v3/repos/releases/#list-assets-for-a-release
  // Retrieve the asset lists to get the id of the existing asset
  await axios({
    method: 'get',
    url: 'https://api.github.com/repos/octokit-fixture-org/release-assets-conflict/releases/1000/assets',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  // https://developer.github.com/v3/repos/releases/#delete-a-release-asset
  // delete the existing asset
  await axios({
    method: 'delete',
    url: 'https://api.github.com/repos/octokit-fixture-org/release-assets-conflict/releases/assets/1000',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  // Upload again, this time it will work
  await axios({
    method: 'post',
    url: `https://uploads.github.com/repos/octokit-fixture-org/release-assets-conflict/releases/1000/assets?name=test-upload.txt&label=test`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'text/plain',
      'Content-Length': 14
    },
    data: 'Hello, world!\n'
  })

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
