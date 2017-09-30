module.exports = removeCredentials

function removeCredentials (fixture) {
  if (!fixture.reqheaders.authorization) {
    return fixture
  }

  // zerofy auth token
  fixture.reqheaders.authorization = fixture.reqheaders.authorization.replace(/^token \w{40}$/, 'token 0000000000000000000000000000000000000000')

  return fixture
}
