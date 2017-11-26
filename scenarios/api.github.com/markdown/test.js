const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Get repository', async (t) => {
  const mock = fixtures.mock('api.github.com/markdown')

  const {data: contextMarkdown} = await axios({
    method: 'post',
    url: 'https://api.github.com/markdown',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      text: `### Hello

b597b5d`,
      context: 'octokit-fixture-org/hello-world',
      mode: 'gfm'
    }
  }).catch(mock.explain)

  t.is(contextMarkdown, `<h3>Hello</h3>
<p><a href="https://github.com/octokit-fixture-org/hello-world/commit/b597b5d6eead8f1a9e9d3243cd70a890a6155ca8" class="commit-link"><tt>b597b5d</tt></a></p>`)

  const {data: markdown} = await axios({
    method: 'post',
    url: 'https://api.github.com/markdown/raw',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/plain; charset=utf-8'
    },
    data: `### Hello

b597b5d`
  }).catch(mock.explain)

  t.is(markdown, `<h3>
<a id="user-content-hello" class="anchor" href="#hello" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Hello</h3>
<p>b597b5d</p>
`)
  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')

  t.end()
})
