module.exports = normalizeIssue

const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

function normalizeIssue (scenarioState, response) {
  // set all IDs to 1
  setIfExists(response, 'id', 1)
  setIfExists(response, 'number', 1)
  setIfExists(response, 'url', url => url.replace(/\/\d+$/, '/1'))
  setIfExists(response, 'labels_url', url => url.replace(/\/\d+\/labels\{\/name\}$/, '/1/labels{/name}'))
  setIfExists(response, 'comments_url', url => url.replace(/\/\d+\/comments$/, '/1/comments'))
  setIfExists(response, 'events_url', url => url.replace(/\/\d+\/events$/, '/1/events'))
  setIfExists(response, 'html_url', url => url.replace(/\/\d+$/, '/1'))

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, 'created_at', '2017-10-10T16:00:00Z')
  setIfExists(response, 'updated_at', '2017-10-10T16:00:00Z')

  // set all counts to 42
  setIfExists(response, 'comments', 42)

  // normalize temporary repository
  ;[
    'url',
    'repository_url',
    'labels_url',
    'comments_url',
    'events_url',
    'html_url'
  ].forEach(property => {
    setIfExists(response, property, (value) => {
      return value.replace(temporaryRepository.regex, '$1')
    })
  })

  normalizeUser(scenarioState, response.user)
}
