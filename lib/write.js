module.exports = write

const {promisify} = require('util')
const {resolve, dirname} = require('path')
const writeFile = promisify(require('fs').writeFile)

const mkdirp = promisify(require('mkdirp'))

async function write (fixturesPath, fixtures) {
  const path = resolve(__dirname, '..', 'fixtures', `${fixturesPath}.json`)

  await mkdirp(dirname(path))
  return writeFile(path, JSON.stringify(fixtures, null, 2))
}
