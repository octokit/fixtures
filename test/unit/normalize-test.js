const {diffString} = require('json-diff')
const {test} = require('tap')

const normalize = require('../../lib/normalize')

const fixtures = {
  getRepository: {
    in: require('../fixtures/get-organization-repository.json'),
    out: require('../../fixtures/api.github.com/get-repository.json')[0]
  }
}

test('normalize', (t) => {
  const actual = normalize(fixtures.getRepository.in)
  const expected = fixtures.getRepository.out

  t.deepEqual(actual, expected, diffString(actual, expected))
  t.end()
})
