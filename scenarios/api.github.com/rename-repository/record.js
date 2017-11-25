module.exports = renameRepository

const env = require('../../../lib/env')
const getTemporaryRepository = require('../../../lib/temporary-repository')

async function renameRepository (state) {
  let error
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: 'octokit-fixture-org',
    name: 'rename-repository'
  })

  await temporaryRepository.create()

  try {
    // https://developer.github.com/v3/repos/#edit
    // rename repository
    await state.request({
      method: 'patch',
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
      },
      data: {
        name: `${temporaryRepository.name}-newname`
      }
    })

    // https://developer.github.com/v3/repos/#get
    // get repository using previous name
    await state.request({
      method: 'get',
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
      }
    })

    .catch((error) => {
      const newUrl = error.response.data.url

      // get repository at returned URL
      return state.request({
        method: 'get',
        url: newUrl,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
        }
      })
    })

    // https://developer.github.com/v3/repos/#edit
    // update repository using previous name
    await state.request({
      method: 'patch',
      url: `/repos/octokit-fixture-org/${temporaryRepository.name}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
      },
      data: {
        name: `${temporaryRepository.name}-newname`,
        description: 'test description'
      }
    })

    .catch((error) => {
      const newUrl = error.response.data.url

      // get repository at returned URL
      return state.request({
        method: 'patch',
        url: newUrl,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
        },
        data: {
          name: `${temporaryRepository.name}-newname`,
          description: 'test description'
        }
      })
    })
  } catch (_error) {
    error = _error
  }

  await temporaryRepository.delete()

  if (error) {
    return Promise.reject(error)
  }
}
