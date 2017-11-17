module.exports = normalizeStatus

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizePath = require('../fixturize-path')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')

function normalizeStatus (scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'status'))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // normalize temporary repository & fixturize sha
  setIfExists(response, 'url', fixturizePath.bind(null, scenarioState))

  normalizeUser(scenarioState, response.creator)
}
