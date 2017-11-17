module.exports = normalizeReleaseAsset

const fixturizeEntityId = require('../fixturize-entity-id')
const fixturizeCommitSha = require('../fixturize-commit-sha')
const fixturizePath = require('../fixturize-path')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')

function normalizeReleaseAsset (scenarioState, response) {
  // set ID to 1
  setIfExists(response, 'id', fixturizeEntityId.bind(null, scenarioState.ids, 'release'))

  // fixturize commit sha hashes
  setIfExists(response, 'target_commitish', fixturizeCommitSha(scenarioState.commitSha, response.target_commitish))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'published_at', '2017-10-10T16:00:00Z')

  // normalize temporary repository name & id in URLs
  ;[
    'assets_url',
    'html_url',
    'tarball_url',
    'upload_url',
    'url',
    'zipball_url'
  ].forEach(property => {
    setIfExists(response, property, fixturizePath.bind(null, scenarioState))
  })

  normalizeUser(scenarioState, response.author)
}
