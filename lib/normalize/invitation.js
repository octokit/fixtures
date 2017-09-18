module.exports = normalizeInvitation

const normalizeUser = require('./user')

function normalizeInvitation (response) {
  // set all IDs to 1
  response.url = response.url.replace(response.id, 1)
  response.id = 1

  // set all dates to Universe 2017 Keynote time
  response.created_at = '2017-10-10T09:00:00-07:00'

  normalizeUser(response.inviter)
  normalizeUser(response.invitee)
}
