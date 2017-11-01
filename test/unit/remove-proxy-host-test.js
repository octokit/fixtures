const proxyquire = require('proxyquire')
const {test} = require('tap')

const minimalFixture = {
  path: '/',
  rawHeaders: [],
  reqheaders: {},
  response: {}
}

test('remove proxy host (#3)', (t) => {
  const removeProxyHost = proxyquire('../../lib/remove-proxy-host', {
    './env': {
      FIXTURES_PROXY: 'https://myproxy.com'
    }
  })

  const fixture = Object.assign({}, minimalFixture)
  fixture.scope = 'https://myproxy.com:443'
  fixture.reqheaders.host = 'myproxy.com'

  const result = removeProxyHost(fixture)
  t.is(result.scope, 'https://api.github.com:443', 'sets scope')
  t.is(result.reqheaders.host, 'api.github.com', 'sets host request header')

  t.end()
})

test('remove x-powered-by header (#3)', (t) => {
  const removeProxyHost = proxyquire('../../lib/remove-proxy-host', {
    './env': {
      FIXTURES_PROXY: 'https://myproxy.com'
    }
  })

  const fixture = Object.assign({}, minimalFixture)
  fixture.scope = 'https://myproxy.com:443'
  fixture.reqheaders.host = 'myproxy.com'
  fixture.rawHeaders = [
    'x-powered-by',
    'foobar'
  ]

  const result = removeProxyHost(fixture)
  t.is(result.rawHeaders.indexOf('x-powered-by'), -1, 'removes x-powered-by response header')

  t.end()
})
