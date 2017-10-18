module.exports = normalizeInvitation

const normalizeRepository = require('./repository')
const normalizeUser = require('./user')
const temporaryRepository = require('../temporary-repository')

function normalizeInvitation (scenarioState, response) {
  // set all IDs to 1
  response.url = response.url.replace(response.id, 1)
  response.id = 1

  // set all dates to Universe 2017 Keynote time
  response.created_at = '2017-10-10T09:00:00-07:00'

  // normalize temporary repository
  response.html_url = response.html_url.replace(temporaryRepository.regex, '$1')

  normalizeUser(scenarioState, response.invitee)
  normalizeUser(scenarioState, response.inviter)
  normalizeRepository(scenarioState, response.repository)
}
