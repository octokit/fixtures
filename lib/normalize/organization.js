module.exports = normalizeOrganization

const setIfExists = require('../set-if-exists')

function normalizeOrganization (fixture) {
  // set all counts to 42
  setIfExists(fixture.response, 'public_repos', 42)
}
