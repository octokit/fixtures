module.exports = {
  get,
  mock
}

const {resolve} = require('path')
const nock = require('nock')

function get (name) {
  return require(`./fixtures/${name}.json`)
}

function mock (name) {
  const fixturesPath = resolve(__dirname, 'fixtures', `${name}.json`)
  const mocks = nock.load(fixturesPath)
  return mocks[0]
}
