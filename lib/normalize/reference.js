module.exports = normalizeReference

const fixturizeCommitSha = require('../fixturize-commit-sha')
const fixturizePath = require('../fixturize-path')
const setIfExists = require('../set-if-exists')

function normalizeReference (scenarioState, response, fixture) {
  // fixturize commit sha hashes
  setIfExists(response, 'object.sha', fixturizeCommitSha.bind(null, scenarioState.commitSha))
  setIfExists(fixture, 'body.sha', fixturizeCommitSha.bind(null, scenarioState.commitSha))

  // normalize temporary repository
  setIfExists(response, 'url', fixturizePath.bind(null, scenarioState))
  setIfExists(response, 'object.url', fixturizePath.bind(null, scenarioState))
}
