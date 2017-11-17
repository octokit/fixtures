module.exports = normalizeUser

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizePath = require('../fixturize-path')
const setIfExists = require('../set-if-exists')

function normalizeUser (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'owner'))

  // normalize URLs
  setIfExists(response, 'avatar_url', fixturizePath.bind(null, scenarioState))
}
