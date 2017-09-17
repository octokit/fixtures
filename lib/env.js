const envalid = require('envalid')

module.exports = envalid.cleanEnv(process.env, {
  FIXTURES_PROXY: envalid.str({default: ''}),
  FIXTURES_REPO: envalid.str({default: 'gr2m/octokit-fixture'}),
  FIXTURES_USER_A_TOKEN_FULL_ACCESS: envalid.str()
})
