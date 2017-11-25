module.exports = {
  // don’t use short syntax for node@4 compatibility
  get: get,
  mock: mock
}

const assert = require('assert')
const pick = require('lodash/pick')
const nock = require('nock')
const headers = require('./lib/headers')
const diffString = require('json-diff').diffString

function get (name) {
  const fixtures = require(`./scenarios/${name}/normalized-fixture.json`)
  return fixtures.map(fixture => Object.assign({}, fixture))
}

function mock (name) {
  const fixtures = get(name)

  fixtures.forEach(fixture => {
    fixture.rawHeaders = headers.toArray(fixture.headers)
    delete fixture.headers
  })

  const mocks = nock.define(fixtures)

  const api = {
    pending () {
      return [].concat.apply([], mocks.map(mock => mock.pendingMocks()))
    },
    explain (error) {
      if (!/^Nock: No match/.test(error.message)) {
        throw error
      }

      const expected = getNextMockConfig(mocks)
      const requestConfig = JSON.parse(error.message.substr('Nock: No match for request '.length))
      const actual = pick(requestConfig, Object.keys(expected))
      actual.headers = pick(requestConfig.headers, Object.keys(expected.headers))

      error.message = `Request did not match mock ${api.pending()[0]}:\n${diffString(expected, actual)}`

      delete error.config
      delete error.request
      delete error.response
      delete error.status
      delete error.statusCode
      delete error.source

      throw error
    },
    done () {
      assert.ok(api.isDone(), 'Mocks not yet satisfied:\n' + api.pending().join('\n'))
    },
    isDone () {
      return api.pending().length === 0
    }
  }

  return api
}

function getNextMockConfig (mocks) {
  const nextMock = mocks.find(mock => mock.pendingMocks().length > 0).interceptors[0]
  return {
    method: nextMock.method.toLowerCase(),
    url: `https://api.github.com${nextMock.uri}`,
    headers: nextMock.options.reqheaders
  }
}
