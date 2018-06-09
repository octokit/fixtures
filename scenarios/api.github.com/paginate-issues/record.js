module.exports = paginateIssues

const env = require('../../../lib/env')
const getTemporaryRepository = require('../../../lib/temporary-repository')

async function paginateIssues (state) {
  let error
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS,
    org: 'octokit-fixture-org',
    name: 'paginate-issues'
  })

  await temporaryRepository.create()

  try {
    // create 13 issues for our testing. We want 5 pages so that we can request
    // ?per_page=3&page=3 which has different URLs for first, previous, next and last page.
    // Why 13? ¯\_(ツ)_/¯

    for (var i = 1; i <= 13; i++) {
      // https://developer.github.com/v3/issues/#create-an-issue
      // This request will be ignored
      await state.request({
        method: 'post',
        url: `/repos/octokit-fixture-org/${temporaryRepository.name}/issues`,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
          'X-Octokit-Fixture-Ignore': 'true'
        },
        data: {
          title: `Test issue ${i}`
        }
      })
    }

    // https://developer.github.com/v3/issues/#list-issues-for-a-repository
    // Get 1st page and then page 2-5 with page query parameter
    const baseUrl = `/repos/octokit-fixture-org/${temporaryRepository.name}/issues?per_page=3`
    const options = {
      method: 'get',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
      }
    }

    await state.request(Object.assign(options, {
      url: baseUrl
    }))

    for (let i = 2; i <= 5; i++) {
      await state.request(Object.assign(options, {
        url: `${baseUrl}&page=${i}`
      }))
    }
  } catch (_error) {
    error = _error
  }

  await temporaryRepository.delete()

  if (error) {
    return Promise.reject(error)
  }
}
