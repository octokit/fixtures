// https://developer.github.com/v3/repos/#get
module.exports = {
  method: 'get',
  url: '/repos/octokit-fixture-org/hello-world',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
}
