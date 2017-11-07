module.exports = normalizeContent

const setIfExists = require('../set-if-exists')

function normalizeContent (scenarioState, response) {
  // zerofy request ID
  setIfExists(response, 'request_id', '0000:00000:0000000:0000000:00000000')
}
