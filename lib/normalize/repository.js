module.exports = normalizeRepository

const normalizeOrganization = require('./organization')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')

function normalizeRepository (response) {
  // set all IDs to 1
  setIfExists(response, 'id', 1)

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'pushed_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(response, 'forks_count', 42)
  setIfExists(response, 'forks', 42)
  setIfExists(response, 'network_count', 42)
  setIfExists(response, 'open_issues_count', 42)
  setIfExists(response, 'open_issues', 42)
  setIfExists(response, 'stargazers_count', 42)
  setIfExists(response, 'subscribers_count', 42)
  setIfExists(response, 'watchers_count', 42)
  setIfExists(response, 'watchers', 42)

  if (response.organization) {
    normalizeOrganization(response.owner)
    normalizeOrganization(response.organization)
  } else {
    normalizeUser(response.owner)
  }
}
