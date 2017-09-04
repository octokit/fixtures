const envalid = require('envalid')

module.exports = envalid.cleanEnv(process.env, {
  FIXTURES_USER_ACCESS_TOKEN: envalid.str(),
  // FIXTURES_REPO: envalid.str({default: 'gr2m/octokit-fixture'})
  FIXTURES_REPO: envalid.str({default: 'gr2m-fixtures-cat/sandbox'})
})
