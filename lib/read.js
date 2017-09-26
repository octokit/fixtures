module.exports = read

const {resolve} = require('path')

function read (fixturesPath) {
  const path = resolve(__dirname, '..', 'scenarios', fixturesPath, 'normalized-fixture.json')
  try {
    return require(path)
  } catch (error) {
    return []
  }
}
