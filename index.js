module.exports = {
  get,
  mock
}

const nock = require('nock')
const headers = require('./lib/headers')

function get (name) {
  const fixtures = require(`./fixtures/${name}.json`)
  return fixtures.map(fixture => Object.assign({}, fixture))
}

function mock (name) {
  const fixtures = get(name)

  fixtures.forEach(fixture => {
    fixture.rawHeaders = headers.toArray(fixture.headers)
    delete fixture.headers
  })

  const mocks = nock.define(fixtures)
  return mocks[0]
}
