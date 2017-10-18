module.exports = normalizeOrganization

const setIfExists = require('../set-if-exists')

function normalizeOrganization (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'avatar_url', value => value.replace(response.id, 1))
  setIfExists(response, 'id', 1)

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(response, 'public_repos', 42)
}
