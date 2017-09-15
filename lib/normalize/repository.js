module.exports = normalizeRepository

const setIfExists = require('../set-if-exists')

function normalizeRepository (fixture) {
  // set all dates to Universe 2017 Keynote time
  setIfExists(fixture.response, 'pushed_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(fixture.response, 'forks_count', 42)
  setIfExists(fixture.response, 'forks', 42)
  setIfExists(fixture.response, 'network_count', 42)
  setIfExists(fixture.response, 'open_issues_count', 42)
  setIfExists(fixture.response, 'open_issues', 42)
  setIfExists(fixture.response, 'stargazers_count', 42)
  setIfExists(fixture.response, 'subscribers_count', 42)
  setIfExists(fixture.response, 'watchers_count', 42)
  setIfExists(fixture.response, 'watchers', 42)
}
