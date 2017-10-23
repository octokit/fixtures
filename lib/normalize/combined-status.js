module.exports = normalizeCombinedStatus

const fixturizeCommitSha = require('../fixturize-commit-sha')
const normalizeRepository = require('./repository')
const normalizeStatus = require('./status')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeCombinedStatus (scenarioState, response, fixture) {
  const sha = response.sha

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // fixturize sha
  setIfExists(response, 'sha', fixturizeCommitSha(scenarioState.commitSha, sha))

  // normalize temporary repository & fixturize sha in URLs
  setIfExists(response, 'url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/[0-9a-f]{40}\/status$/, fixturizeCommitSha(scenarioState.commitSha, sha) + '/status')
  })
  setIfExists(response, 'commit_url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/[0-9a-f]{40}$/, fixturizeCommitSha(scenarioState.commitSha, sha))
  })

  response.statuses.forEach(normalizeStatus.bind(null, scenarioState))
  normalizeRepository(scenarioState, response.repository)

  // fixturize sha in current fixture and location header if present
  fixture.path = fixture.path.replace(/[0-9a-f]{40}\/status$/, fixturizeCommitSha(scenarioState.commitSha, sha) + '/status')
}
