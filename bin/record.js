#!/usr/bin/env node

const axios = require('axios')
const chalk = require('chalk')
const {diff, diffString} = require('json-diff')
const glob = require('glob')
const humanize = require('humanize-string')
const nock = require('nock')

const isTravisCronJob = require('../lib/is-travis-cron-job')
const normalize = require('../lib/normalize')
const notifyAboutFixturesChanges = require('../lib/notify-about-fixtures-changes')
const read = require('../lib/read')
const write = require('../lib/write')

const argv = require('minimist')(process.argv.slice(2), {
  boolean: 'update'
})
const doUpdate = argv.update
const selectedScenarios = argv._
const hasSelectedScenarios = selectedScenarios.length > 0

nock.recorder.rec({
  output_objects: true,
  dont_print: true,
  enable_reqheaders_recording: true
})

const scenarios = hasSelectedScenarios ? selectedScenarios : glob.sync('scenarios/**/*.js')
const diffs = []

// run scenarios one by one
scenarios.reduce(async (promise, scenarioPath) => {
  await promise
  const fixturePath = scenarioPath.replace(/(^scenarios\/|\.js$)/g, '')
  const [domain, title] = fixturePath.split('/')
  console.log('')
  console.log(`⏯️  ${chalk.bold(domain)}: ${humanize(title.replace('.js', ''))} ...`)

  const scenario = require(`../scenarios/${fixturePath}`)

  if (Array.isArray(scenario)) {
    // if scenario is an array of request options, send requests sequentially
    await scenario.reduce(async (promise, step) => {
      try {
        await promise
      } catch (error) {
        // don’t fail on 4xx errors, they are valid fixtures
        if (error.response.status >= 500) {
          throw error
        }
      }

      return axios(step)
    }, Promise.resolve())
  } else if (typeof scenario === 'object') {
    // if scenario is an object with request options, send a request for it
    await axios(scenario)
  } else {
    // otherwise we expect scenario to be an asynchronous function
    await scenario()
  }

  const newFixtures = nock.recorder.play().map(normalize)
  const oldFixtures = await read(fixturePath)
  nock.recorder.clear()

  const fixturesDiffs = diff(newFixtures, oldFixtures)
  if (fixturesDiffs) {
    diffs.push({
      name: fixturePath,
      changes: fixturesDiffs,
      newFixtures,
      oldFixtures
    })
    if (fixturesDiffs[0][0] === '-') {
      if (doUpdate) {
        console.log(`📼  New fixtures recorded`)
        return write(fixturePath, newFixtures)
      }
      console.log(`❌  This looks like a new fixture`)
    } else {
      if (doUpdate) {
        console.log(`📼  Fixture updates recorded`)
        return write(fixturePath, newFixtures)
      }
      console.log(`❌  Fixtures are not up-to-date`)

      if (!isTravisCronJob()) {
        console.log(diffString(oldFixtures, newFixtures))
        console.log('💁  Update fixtures with `bin/record update`')
      }
    }
  } else {
    console.log(`✅  Fixtures are up-to-date`)
  }

  return Promise.resolve()
}, Promise.resolve())

.then(() => {
  if (diffs.length === 0) {
    if (isTravisCronJob()) {
      console.log('[CRON] ✅ No fixture changes detected.')
    }
    return
  }

  if (doUpdate) {
    return
  }

  if (isTravisCronJob()) {
    return notifyAboutFixturesChanges(diffs)
  }

  console.log(`${diffs.length} fixtures are out of date. Exit 1`)
  process.exit(1)
})

.catch((error) => {
  if (!error.response) {
    console.log(error)
    return
  }

  console.log(error.toString())
  console.log(JSON.stringify(error.response.data, null, 2))
})
