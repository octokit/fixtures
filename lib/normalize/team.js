module.exports = normalizeTeam

const setIfExists = require('../set-if-exists')

function normalizeTeam (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'url', value => value.replace(response.id, 1))
  setIfExists(response, 'members_url', value => value.replace(response.id, 1))
  setIfExists(response, 'repositories_url', value => value.replace(response.id, 1))
  setIfExists(response, 'id', 1)
}
