module.exports = normalizeReleaseAsset

const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeReleaseAsset (scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(response, 'id', 1)

  // set count to 42
  setIfExists(response, 'download_count', 42)

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // normalize temporary repository name & id in URLs
  setIfExists(response, 'url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/\d+$/, 1)
  })
  setIfExists(response, 'browser_download_url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
  })

  normalizeUser(scenarioState, response.uploader)

  fixture.path = fixture.path.replace(/\/releases\/\d+\/assets/, '/releases/1/assets')
}
