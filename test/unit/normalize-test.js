const proxyquire = require('proxyquire')
const {test} = require('tap')

const minimalFixture = {
  path: '/',
  rawHeaders: [],
  reqheaders: {},
  response: {}
}

test('normalize when using proxy (#3)', (t) => {
  const normalize = proxyquire('../../lib/normalize', {
    '../env': {
      FIXTURES_PROXY: 1
    }
  })

  const fixture = Object.assign({}, minimalFixture)
  fixture.scope = 'https://myproxy.com:443'
  fixture.reqheaders.host = 'myproxy.com'
  fixture.rawHeaders = [
    'x-powered-by',
    'foobar'
  ]

  const result = normalize(fixture)
  t.is(result.scope, 'https://api.github.com:443', 'sets scope')
  t.is(fixture.reqheaders.host, 'api.github.com', 'sets host request header')
  t.is(fixture.headers['x-powered-by'], undefined, 'removes x-powered-by response header')

  t.end()
})
