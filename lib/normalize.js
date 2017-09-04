module.exports = normalize

const rawHeaders = require('./raw-headers')

function normalize (fixture) {
  // set all dates to Universe 2017 Keynote time
  fixture.response.created_at = '2017-10-10T16:00:00Z'
  fixture.response.updated_at = '2017-10-10T16:00:00Z'
  fixture.response.pushed_at = '2017-10-10T16:00:00Z'
  rawHeaders.set(fixture.rawHeaders, 'Date', 'Tue, 10 Oct 2017 16:00:00 GMT')
  rawHeaders.set(fixture.rawHeaders, 'Last-Modified', 'Tue, 10 Oct 2017 16:00:00 GMT')
  rawHeaders.set(fixture.rawHeaders, 'X-RateLimit-Reset', '1507651200000')

  // set all counts to 42
  fixture.response.forks = 42
  fixture.response.forks_count = 42
  fixture.response.open_issues_count = 42
  fixture.response.open_issues = 42
  fixture.response.network_count = 42
  fixture.response.stargazers_count = 42
  fixture.response.subscribers_count = 42
  fixture.response.watchers = 42
  fixture.response.watchers_count = 42

  // Set remaining rate limit to 59 for unauthenticated accounts and
  // to 4999 to authenticated accounts
  const rateLimitRemaining = parseInt(rawHeaders.get(fixture.rawHeaders, 'X-RateLimit-Limit'), 10)
  rawHeaders.set(fixture.rawHeaders, 'X-RateLimit-Remaining', String(rateLimitRemaining - 1))

  // zerofy random stuff
  rawHeaders.set(fixture.rawHeaders, 'ETag', '"00000000000000000000000000000000"')
  rawHeaders.set(fixture.rawHeaders, 'X-Runtime-rack', '0.000000')
  rawHeaders.set(fixture.rawHeaders, 'X-GitHub-Request-Id', '0000:00000:0000000:0000000:00000000')

  // zerofy auth token (if present)
  if (fixture.reqheaders.authorization) {
    fixture.reqheaders.authorization = fixture.reqheaders.authorization.replace(/^token \w{40}$/, 'token 0000000000000000000000000000000000000000')
  } else {
    // otherwise add authorization to "badheaders" to help with matching the
    // right fixture to the right request
    fixture.badheaders = ['authorization']
  }

  // update content length
  rawHeaders.set(fixture.rawHeaders, 'Content-Length', String(JSON.stringify(fixture.response).length))

  return fixture
}
