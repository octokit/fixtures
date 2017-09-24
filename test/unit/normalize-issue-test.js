const {test} = require('tap')

const normalizeIssue = require('../../lib/normalize/issue')
const toEntityName = require('../../lib/to-entity-name')

const createIssueResponse = require('../fixtures/create-issue.json').response

test('toEntityName(issueResponse)', (t) => {
  const response = Object.assign({}, createIssueResponse)
  const name = toEntityName(response)

  t.is(name, 'issue')
  t.end()
})

test('normalize create issue response', (t) => {
  const response = Object.assign({}, createIssueResponse)
  normalizeIssue(response)

  t.is(response.id, 1, 'sets id to 1')
  t.is(response.number, 1, 'sets number to 1')
  t.is(response.url, 'https://api.github.com/repos/octokit-fixture-org/foo-repo/issues/1', 'sets number to 1 in url')
  t.is(response.labels_url, 'https://api.github.com/repos/octokit-fixture-org/foo-repo/issues/1/labels{/name}', 'sets number to 1 in labels url')
  t.is(response.user.id, 1, 'sets user.id to 1')
  t.end()
})
