module.exports = markNotificationsAsRead

const env = require('../../../lib/env')

// https://developer.github.com/v3/activity/notifications/#mark-as-read
async function markNotificationsAsRead (state) {
  try {
    await state.request({
      method: 'put',
      url: '/notifications',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
      }
    })
  } catch (error) {
    // GitHub API current returns an error when sending an empty body, this
    // should get fixed soon. Once it does make sure to
    // remove the workaround for https://github.com/octokit/rest.js/issues/694
  }

  await state.request({
    method: 'put',
    url: '/notifications',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
    },
    data: {}
  })
}
