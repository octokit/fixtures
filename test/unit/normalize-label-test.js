const {test} = require('tap')

const normalizeLabel = require('../../lib/normalize/issue')
const toEntityName = require('../../lib/to-entity-name')

const addLabelsToIssueResponse = require('../fixtures/add-labels-to-issue.json').response

test('toEntityName(issueResponse)', (t) => {
  const response = Object.assign({}, addLabelsToIssueResponse[0])
  const name = toEntityName(response)

  t.is(name, 'label')
  t.end()
})

test('normalize create issue response', (t) => {
  const response = Object.assign({}, addLabelsToIssueResponse[0])
  normalizeLabel(response)

  t.is(response.id, 1, 'sets id to 1')
  t.end()
})
