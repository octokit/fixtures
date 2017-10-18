module.exports = normalizeReference

const get = require('lodash/get')

const fixturizeCommitSha = require('../fixturize-commit-sha')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeReference (scenarioState, response, fixture) {
  const sha = get(response, 'object.sha')
  const fixturizedSha = fixturizeCommitSha(scenarioState.commitSha, sha)

  // fixturize commit sha hashes
  setIfExists(response, 'object.sha', fixturizedSha)
  setIfExists(fixture, 'body.sha', fixturizeCommitSha.bind(null, scenarioState.commitSha))

  // normalize temporary repository
  setIfExists(response, 'url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'object.url', url => url.replace(temporaryRepository.regex, '$1').replace(sha, fixturizedSha))
}
