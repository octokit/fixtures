module.exports = normalizeIssue

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizePath = require('../fixturize-path')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')

function normalizeIssue (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'issue'))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(response, 'comments', 42)

  // normalize temporary repository
  ;[
    'url',
    'repository_url',
    'labels_url',
    'comments_url',
    'events_url',
    'html_url'
  ].forEach(property => {
    setIfExists(response, property, fixturizePath.bind(null, scenarioState))
  })

  normalizeUser(scenarioState, response.user)
}
