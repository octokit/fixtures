module.exports = normalizeStatus

const fixturizeCommitSha = require('../fixturize-commit-sha')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeStatus (scenarioState, response, fixture) {
  const sha = response.url.match(/[0-9a-f]{40}$/).pop()

  // set ID to 1
  setIfExists(response, 'id', 1)

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // normalize temporary repository & fixturize sha
  setIfExists(response, 'url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/[0-9a-f]{40}$/, fixturizeCommitSha(scenarioState.commitSha, sha))
  })

  normalizeUser(scenarioState, response.creator)

  // fixturize sha in fixture and location header if present
  if (typeof fixture !== 'object') {
    return
  }

  fixture.path = fixture.path.replace(/[0-9a-f]{40}(\/statuses)?$/, fixturizeCommitSha(scenarioState.commitSha, sha) + '$1')
  if (fixture.headers.location) {
    fixture.headers.location = fixture.headers.location.replace(/[0-9a-f]{40}(\/statuses)?$/, fixturizeCommitSha(scenarioState.commitSha, sha) + '$1')
  }
}
