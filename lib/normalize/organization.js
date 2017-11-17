module.exports = normalizeOrganization

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizePath = require('../fixturize-path')
const setIfExists = require('../set-if-exists')

function normalizeOrganization (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'owner'))
  setIfExists(response, 'avatar_url', fixturizePath.bind(null, scenarioState))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(response, 'public_repos', 42)
}
