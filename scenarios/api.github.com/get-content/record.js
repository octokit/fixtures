// https://developer.github.com/v3/repos/contents/#get-contents
// empty path returns README file if present
module.exports = [
  {
    method: 'get',
    url: '/repos/octokit-fixture-org/hello-world/contents/',
    headers: {
      accept: 'application/vnd.github.v3+json'
    }
  },
  {
    method: 'get',
    url: '/repos/octokit-fixture-org/hello-world/contents/README.md',
    headers: {
      accept: 'application/vnd.github.v3.raw'
    }
  }
]
