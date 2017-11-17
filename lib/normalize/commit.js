module.exports = normalizeCommit

const get = require('lodash/get')

const fixturizeCommitSha = require('../fixturize-commit-sha')
const fixturizePath = require('../fixturize-path')
const setIfExists = require('../set-if-exists')

function normalizeCommit (scenarioState, response) {
  const sha = response.sha
  const treeSha = get(response, 'tree.sha')
  const fixturizedTreeSha = fixturizeCommitSha(scenarioState.commitSha, treeSha)
  const fixturizedSha = fixturizeCommitSha(scenarioState.commitSha, sha)

  // fixturize commit sha hashes
  setIfExists(response, 'tree.sha', fixturizedTreeSha)
  setIfExists(response, 'sha', fixturizedSha)

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'author.date', '2017-10-10T16:00:00Z')
  setIfExists(response, 'committer.date', '2017-10-10T16:00:00Z')

  // normalize temporary repository
  setIfExists(response, 'url', fixturizePath.bind(null, scenarioState))
  setIfExists(response, 'html_url', fixturizePath.bind(null, scenarioState))
  setIfExists(response, 'tree.url', fixturizePath.bind(null, scenarioState))
}
