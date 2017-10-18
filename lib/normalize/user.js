module.exports = normalizeUser

const setIfExists = require('../set-if-exists')

function normalizeUser (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'avatar_url', value => value.replace(response.id, 1))
  setIfExists(response, 'id', 1)
}
