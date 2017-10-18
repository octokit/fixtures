const {test} = require('tap')

const fixturizeCommitSha = require('../../lib/fixturize-commit-sha')

test('fixturizeCommitSha for fixturized sha', (t) => {
  const map = {
    'existing': '0000000000000000000000000000000000000001'
  }
  const sha = fixturizeCommitSha(map, '0000000000000000000000000000000000000001')
  t.is(sha, '0000000000000000000000000000000000000001')
  t.end()
})
