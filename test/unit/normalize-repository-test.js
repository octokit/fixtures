const {test} = require('tap')

const normalizeRepository = require('../../lib/normalize/repository')

const organizationRepositoryResponse = require('../fixtures/get-organization-repository.json').response
const userRepositoryResponse = require('../fixtures/get-user-repository.json').response

test('normalize organization repository', (t) => {
  const fixture = Object.assign({}, organizationRepositoryResponse)
  normalizeRepository(fixture)

  t.is(fixture.id, 1, 'sets id to 1')
  t.is(fixture.owner.id, 1, 'sets owner.id to 1')
  t.end()
})

test('normalize user repository', (t) => {
  const fixture = Object.assign({}, userRepositoryResponse)
  normalizeRepository(fixture)

  t.is(fixture.owner.id, 1, 'sets owner.id to 1')
  t.end()
})
