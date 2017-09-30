module.exports = normalizeCommit

const get = require('lodash/get')

const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeCommit (response) {
  const sha = response.sha
  const treeSha = get(response, 'tree.sha')

  // zerofy commit sha hashes
  setIfExists(response, 'sha', '0000000000000000000000000000000000000000')
  setIfExists(response, 'tree.sha', '0000000000000000000000000000000000000000')

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'author.date', '2017-10-10T16:00:00Z')
  setIfExists(response, 'committer.date', '2017-10-10T16:00:00Z')

  // normalize temporary repository
  setIfExists(response, 'url', url => url.replace(temporaryRepository.regex, '$1').replace(sha, '0000000000000000000000000000000000000000'))
  setIfExists(response, 'html_url', url => url.replace(temporaryRepository.regex, '$1').replace(sha, '0000000000000000000000000000000000000000'))
  setIfExists(response, 'tree.url', url => url.replace(temporaryRepository.regex, '$1').replace(treeSha, '0000000000000000000000000000000000000000'))
}
