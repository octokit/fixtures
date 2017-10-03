module.exports = normalize

const env = require('../env')
const headers = require('../headers')
const setIfExists = require('../set-if-exists')
const temporaryRepository = require('../temporary-repository')
const toEntityName = require('../to-entity-name')

function normalize (fixture) {
  // fixture.rawHeaders is an array in the form of ['key1', 'value1', 'key2', 'value2']
  // But the order of these can change, e.g. between local tests and CI on Travis.
  // That’s why we turn them into an object before storing the fixtures and turn
  // them back into an array before loading
  fixture.headers = headers.toObject(fixture.rawHeaders)
  delete fixture.rawHeaders

  // rename temporary repositories
  // e.g. tmp-scenario-bar-20170924033013835 => bar
  fixture.path = fixture.path.replace(temporaryRepository.regex, '$1')
  if (fixture.headers.location && temporaryRepository.regex.test(fixture.headers.location)) {
    fixture.headers.location = fixture.headers.location.replace(temporaryRepository.regex, '$1')
  }

  // set all IDs in paths to 1
  fixture.path = fixture.path.replace(/\/\d+$/, '/1')
  if (fixture.headers.location) {
    fixture.headers.location = fixture.headers.location.replace(/\/\d+$/, '/1')
  }

  // set all dates to Universe 2017 Keynote time
  setIfExists(fixture.headers, 'date', 'Tue, 10 Oct 2017 16:00:00 GMT')
  setIfExists(fixture.headers, 'last-modified', 'Tue, 10 Oct 2017 16:00:00 GMT')
  setIfExists(fixture.headers, 'x-ratelimit-reset', '1507651200000')

  // Set remaining rate limit to 59 for unauthenticated accounts and
  // to 4999 to authenticated accounts
  const rateLimitRemaining = parseInt(fixture.headers['x-ratelimit-limit'], 10)
  setIfExists(fixture.headers, 'x-ratelimit-remaining', String(rateLimitRemaining - 1))

  // zerofy random stuff
  setIfExists(fixture.headers, 'etag', '"00000000000000000000000000000000"')
  setIfExists(fixture.headers, 'x-runtime-rack', '0.000000')
  setIfExists(fixture.headers, 'x-github-request-id', '0000:00000:0000000:0000000:00000000')

  if (!fixture.reqheaders.authorization) {
    // add authorization to "badheaders" to help with matching the
    // right fixture to the right request
    fixture.badheaders = ['authorization']
  }

  // workaround for https://github.com/octokit/fixtures/issues/3
  /* istanbul ignore else */
  if (env.FIXTURES_PROXY) {
    fixture.scope = 'https://api.github.com:443'
    fixture.reqheaders.host = 'api.github.com'
    delete fixture.headers['x-powered-by']
  }

  // leave out headers that tend to change on different environments
  delete fixture.headers['accept-ranges']
  delete fixture.headers.region
  delete fixture.headers.server
  delete fixture.headers.vary

  // The GitHub API has several endpoints that require a PUT or a PATCH verb
  // with an empty body. In that case it’s unclear what content-type to set,
  // or if a content-type header is to be set at all. So we remove it from our
  // fixtures in that case but set content-length to 0 as required via:
  // https://developer.github.com/v3/#http-verbs
  if ((fixture.method === 'put' || fixture.method === 'patch') && !fixture.body) {
    delete fixture.reqheaders['content-type']
    fixture.reqheaders['content-length'] = 0
  }

  // normalize content-type value
  if (fixture.reqheaders['content-type']) {
    fixture.reqheaders['content-type'] = fixture.reqheaders['content-type'].replace(';charset=utf-8', '; charset=utf-8')
  }

  const responses = Array.isArray(fixture.response) ? fixture.response : [fixture.response]
  responses.forEach(response => {
    const entityName = toEntityName(response)
    if (entityName) {
      require(`./${entityName}`)(response, fixture)
    }
  })

  // remove headers added by proxy
  // see https://github.com/octokit/fixtures/pull/20#issuecomment-331558385
  delete fixture.headers['x-now-region']

  // update content length
  fixture.headers['content-length'] = String(JSON.stringify(fixture.response).length)

  return fixture
}
