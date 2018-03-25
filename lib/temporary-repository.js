module.exports = temporaryRepository

module.exports.regex = /tmp-scenario-([^/]+)-\d{17}-\w{5}/

function temporaryRepository ({org, name, request, token}) {
  const state = {org, name, request, token}
  const nowTimestamp = new Date().toISOString().replace(/\D/g, '')
  const random = Math.random().toString(36).substr(2, 5)
  state.temporaryName = `tmp-scenario-${name}-${nowTimestamp}-${random}`

  return {
    name: state.temporaryName,
    create: createTemporaryRepository.bind(null, state),
    delete: deleteTemporaryRepository.bind(null, state)
  }
}

function createTemporaryRepository (state) {
  // https://developer.github.com/v3/repos/#create
  return state.request({
    method: 'post',
    url: `/orgs/${state.org}/repos`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${state.token}`,
      'X-Octokit-Fixture-Ignore': 'true'
    },
    data: {
      name: state.temporaryName
    }
  })
}

function deleteTemporaryRepository (state) {
  // https://developer.github.com/v3/repos/#create
  return state.request({
    method: 'delete',
    url: `/repos/${state.org}/${state.temporaryName}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${state.token}`,
      'X-Octokit-Fixture-Ignore': 'true'
    },
    // delete repositories that have been renamed in the scenario
    maxRedirects: 1
  })
}
