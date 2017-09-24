const {test} = require('tap')

const temporaryRepository = require('../../lib/temporary-repository')

test('temporaryRepository(name) returns {create, delete} API', (t) => {
  const options = {}
  const api = temporaryRepository(options)

  t.isA(api.create, 'function')
  t.isA(api.delete, 'function')

  t.end()
})

test('temporaryRepository(name) returns {name}', (t) => {
  const options = {
    name: 'foo-bar'
  }
  const api = temporaryRepository(options)

  t.match(api.name, temporaryRepository.regex, `"${api.name}" matches tmp repository name regex`)

  t.end()
})

test('temporaryRepository.regex', {only: true}, (t) => {
  const {name} = temporaryRepository({name: 'funky-repo'})
  const [, originalName] = name.match(temporaryRepository.regex)
  t.is(originalName, 'funky-repo')
  t.is(`/repos/org-foo/${name}`.replace(temporaryRepository.regex, '$1'), '/repos/org-foo/funky-repo')
  t.end()
})

test('temporaryRepository(name).create() sends POST /orgs/octokit-fixture-org/repos request', (t) => {
  t.plan(4)

  const options = {
    name: 'repo-bar',
    token: 'token123',
    org: 'org-foo',
    request (options) {
      t.is(options.method, 'post')
      t.is(options.url, '/orgs/org-foo/repos')
      t.is(options.headers.Authorization, 'token token123')
      t.is(options.data.name, api.name)
    }
  }
  const api = temporaryRepository(options)
  api.create()
})

test('temporaryRepository(name).delete() sends DELETE `/repos/octokit-fixture-org/<tmp name> request', (t) => {
  t.plan(3)

  const options = {
    name: 'repo-bar',
    token: 'token123',
    org: 'org-foo',
    request (options) {
      t.is(options.method, 'delete')
      t.is(options.url, `/repos/org-foo/${api.name}`)
      t.is(options.headers.Authorization, 'token token123')
    }
  }
  const api = temporaryRepository(options)
  api.delete()
})
