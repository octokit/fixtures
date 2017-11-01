module.exports = removeProxyHost

const env = require('./env')

function removeProxyHost (fixture) {
  // workaround for https://github.com/octokit/fixtures/issues/3
  /* istanbul ignore else */
  if (env.FIXTURES_PROXY) {
    fixture.scope = 'https://api.github.com:443'
    fixture.reqheaders.host = 'api.github.com'

    const poweredByHeaderIndex = fixture.rawHeaders.indexOf('x-powered-by')
    if (poweredByHeaderIndex !== -1) {
      fixture.rawHeaders.splice(poweredByHeaderIndex, 2)
    }
  }

  return fixture
}
