const glob = require('glob')
const {test} = require('tap')

const normalize = require('../../lib/normalize')

glob.sync('scenarios/**/raw-fixture.json')
  .map(path => path.replace(/(^scenarios\/|\/raw-fixture.json$)/g, ''))
  .forEach(fixturnName => {
    test(`normalize ${fixturnName}`, t => {
      const raw = require(`../../scenarios/${fixturnName}/raw-fixture.json`)
      const expected = require(`../../scenarios/${fixturnName}/normalized-fixture.json`)

      const scenarioState = {
        commitSha: {},
        ids: {}
      }
      const actual = raw.filter(isntIgnored).map(normalize.bind(null, scenarioState))
      t.deepEqual(actual, expected)
      t.end()
    })
  })

function isntIgnored (fixture) {
  return !fixture.reqheaders['x-octokit-fixture-ignore']
}
