// https://developer.github.com/v3/markdown/
module.exports = [
  {
    method: 'post',
    url: '/markdown',
    headers: {
      Accept: 'text/html'
    },
    data: {
      text: `### Hello

b597b5d`,
      context: 'octokit-fixture-org/hello-world',
      mode: 'gfm'
    }
  },
  {
    method: 'post',
    url: '/markdown/raw',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/plain; charset=utf-8'
    },
    data: `### Hello

b597b5d`
  }
]
