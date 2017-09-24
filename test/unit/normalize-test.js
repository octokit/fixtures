const {diffString} = require('json-diff')
const {test} = require('tap')

const normalize = require('../../lib/normalize')

const fixtures = {
  getRepository: {
    in: require('../fixtures/get-organization-repository.json'),
    out: require('../../fixtures/api.github.com/get-repository.json')[0]
  },
  getRootViaNowProxy: require('../fixtures/get-root-via-now-proxy.json'),
  getTemporaryRepository: require('../fixtures/get-temporary-repository.json')
}

test('normalize', (t) => {
  const actual = normalize(fixtures.getRepository.in)
  const expected = fixtures.getRepository.out

  t.deepEqual(actual, expected, diffString(actual, expected))
  t.end()
})

test('normalize now proxy response #20', (t) => {
  const response = normalize(fixtures.getRootViaNowProxy)

  t.is(response.headers['x-now-region'], undefined)

  t.end()
})

test('normalize request paths containing temporary repository name #23', (t) => {
  const fixture = normalize(fixtures.getTemporaryRepository)

  t.is(fixture.path, '/repos/octokit-fixture-org/bar')

  t.end()
})
