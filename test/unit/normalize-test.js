const {diffString} = require('json-diff')
const {test} = require('tap')

const normalize = require('../../lib/normalize')

const fixtures = {
  getRepository: {
    in: require('../fixtures/get-organization-repository.json'),
    out: require('../../fixtures/api.github.com/get-repository.json')[0]
  },
  getRootViaNowProxy: {
    in: require('../fixtures/get-root-via-now-proxy.json')
  }
}

test('normalize', (t) => {
  const actual = normalize(fixtures.getRepository.in)
  const expected = fixtures.getRepository.out

  t.deepEqual(actual, expected, diffString(actual, expected))
  t.end()
})

test('normalize now proxy response #20', (t) => {
  const response = normalize(fixtures.getRootViaNowProxy.in)

  t.is(response.headers['x-now-region'], undefined)

  t.end()
})
