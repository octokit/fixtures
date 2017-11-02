module.exports = normalizeReleaseAsset

const fixturizeCommitSha = require('../fixturize-commit-sha')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeReleaseAsset (scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(response, 'id', 1)

  // fixturize commit sha hashes
  setIfExists(response, 'target_commitish', fixturizeCommitSha(scenarioState.commitSha, response.target_commitish))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'published_at', '2017-10-10T16:00:00Z')

  // normalize temporary repository name & id in URLs
  ;[
    'url',
    'assets_url',
    'upload_url'
  ].forEach(property => {
    setIfExists(response, property, url => {
      return url
        .replace(temporaryRepository.regex, '$1')
        .replace(/\d+(\/assets.*)?$/, '1$1')
    })
  })

  ;[
    'html_url',
    'tarball_url',
    'zipball_url'
  ].forEach(property => {
    setIfExists(response, property, url => {
      return url
        .replace(temporaryRepository.regex, '$1')
    })
  })

  normalizeUser(scenarioState, response.author)
}
