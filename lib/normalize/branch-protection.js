module.exports = branchProtection

const get = require('lodash/get')

const normalizeTeam = require('./team')
const normalizeUser = require('./user')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')

// https://developer.github.com/v3/repos/branches/#response-2
function branchProtection (scenarioState, response) {
  // normalize temporary repository
  setIfExists(response, 'url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_status_checks.url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_status_checks.contexts_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_pull_request_reviews.url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_pull_request_reviews.dismissal_restrictions.url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_pull_request_reviews.dismissal_restrictions.users_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'required_pull_request_reviews.dismissal_restrictions.teams_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'enforce_admins.url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'restrictions.url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'restrictions.users_url', url => url.replace(temporaryRepository.regex, '$1'))
  setIfExists(response, 'restrictions.teams_url', url => url.replace(temporaryRepository.regex, '$1'))

  // normalize users
  const dismissalRestrictionsUsers = get(response, 'required_pull_request_reviews.dismissal_restrictions.users') || []
  const dismissalRestrictionsTeams = get(response, 'required_pull_request_reviews.dismissal_restrictions.teams') || []
  const restrictionsUsers = get(response, 'restrictions.users') || []
  const restrictionsTeams = get(response, 'restrictions.teams') || []

  dismissalRestrictionsUsers.concat(restrictionsUsers).forEach(normalizeUser.bind(null, scenarioState))
  dismissalRestrictionsTeams.concat(restrictionsTeams).forEach(normalizeTeam.bind(null, scenarioState))
}
