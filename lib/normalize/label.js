module.exports = normalizeIssue

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizePath = require('../fixturize-path')
const setIfExists = require('../set-if-exists')

function normalizeIssue (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'label'))
  setIfExists(response, 'url', fixturizePath.bind(null, scenarioState))
}
