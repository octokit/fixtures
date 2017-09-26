// https://developer.github.com/v3/orgs/#get-an-organization
module.exports = {
  method: 'get',
  url: '/orgs/octokit-fixture-org',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
}
