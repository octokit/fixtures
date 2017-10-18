module.exports = normalizeContent

const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeContent (scenarioState, response) {
  // zerofy commit sha hashes
  setIfExists(response, 'tree.sha', '0000000000000000000000000000000000000000')

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'author.date', '2017-10-10T16:00:00Z')
  setIfExists(response, 'committer.date', '2017-10-10T16:00:00Z')

  // normalize temporary repository
  setIfExists(response, 'url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'html_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'git_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'download_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, '_links.self', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, '_links.git', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, '_links.html', url => url.replace(temporaryRepository.regex, '$1'))
}
