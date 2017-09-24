module.exports = normalizeIssue

const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeIssue (response) {
  // set all IDs to 1
  setIfExists(response, 'id', 1)
  setIfExists(response, 'url', url => url.replace(/\/\d+$/, '/1'))

  // normalize temporary repository
  setIfExists(response, 'url', (value) => {
    return value.replace(temporaryRepository.regex, '$1')
  })
}
