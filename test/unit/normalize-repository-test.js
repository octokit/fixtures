const {test} = require('tap')

const normalizeRepository = require('../../lib/normalize/repository')

const organizationRepositoryResponse = require('../fixtures/get-organization-repository.json').response
const userRepositoryResponse = require('../fixtures/get-user-repository.json').response

test('normalize organization repository', (t) => {
  const response = Object.assign({}, organizationRepositoryResponse)
  normalizeRepository(response)

  t.is(response.id, 1, 'sets id to 1')
  t.is(response.owner.id, 1, 'sets owner.id to 1')
  t.end()
})

test('normalize user repository', (t) => {
  const response = Object.assign({}, userRepositoryResponse)
  normalizeRepository(response)

  t.is(response.owner.id, 1, 'sets owner.id to 1')
  t.end()
})
