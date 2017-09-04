module.exports = isTravisCronJob

const env = require('./env')

// https://docs.travis-ci.com/user/cron-jobs/#Detecting-Builds-Triggered-by-Cron
function isTravisCronJob () {
  return env.TRAVIS_EVENT_TYPE === 'cron'
}
