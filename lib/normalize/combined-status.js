module.exports = normalizeCombinedStatus

const normalizeRepository = require('./repository')
const normalizeStatus = require('./status')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeCombinedStatus (response, fixture) {
  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // zerofy sha
  setIfExists(response, 'sha', '0000000000000000000000000000000000000000')

  // normalize temporary repository & zerofy sha in URLs
  setIfExists(response, 'url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/[0-9a-f]{40}\/status$/, '0000000000000000000000000000000000000000/status')
  })
  setIfExists(response, 'commit_url', url => {
    return url
      .replace(temporaryRepository.regex, '$1')
      .replace(/[0-9a-f]{40}$/, '0000000000000000000000000000000000000000')
  })

  response.statuses.forEach(normalizeStatus)
  normalizeRepository(response.repository)

  // zerofy sha in fixture and location header if present
  fixture.path = fixture.path.replace(/[0-9a-f]{40}\/status$/, '0000000000000000000000000000000000000000/status')
}
