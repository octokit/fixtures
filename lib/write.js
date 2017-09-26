module.exports = write

const {promisify} = require('util')
const {resolve, dirname} = require('path')
const writeFile = promisify(require('fs').writeFile)

const mkdirp = promisify(require('mkdirp'))

async function write (fixturesPath, fixtures) {
  const path = resolve(__dirname, '..', 'scenarios', fixturesPath)

  await mkdirp(dirname(path))
  return Promise.all([
    writeFile(resolve(path, 'normalized-fixture.json'), JSON.stringify(fixtures.normalized, null, 2)),
    writeFile(resolve(path, 'raw-fixture.json'), JSON.stringify(fixtures.raw, null, 2))
  ])
}
