#!/usr/bin/env node

const axios = require('axios')
const chalk = require('chalk')
const {diff, diffString} = require('json-diff')
const glob = require('glob')
const humanize = require('humanize-string')
const nock = require('nock')

const env = require('../lib/env')
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
  const fixtureName = scenarioPath.replace(/(^scenarios\/|\.js$)/g, '')
  const [domain, title] = fixtureName.split('/')
  console.log('')
  console.log(`⏯️  ${chalk.bold(domain)}: ${humanize(title.replace('.js', ''))} ...`)

  const scenario = require(`../scenarios/${fixtureName}`)
  let baseURL = `https://${domain}`

  // workaround for https://github.com/gr2m/octokit-fixtures/issues/3
  if (domain === 'api.github.com' && env.FIXTURES_PROXY) {
    baseURL = env.FIXTURES_PROXY
  }

  const state = {
    request: axios.create({baseURL})
  }

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

      return state.request(step)
    }, Promise.resolve())
  } else if (typeof scenario === 'object') {
    // if scenario is an object with request options, send a request for it
    await state.request(scenario)
  } else {
    // otherwise we expect scenario to be an asynchronous function
    await scenario(state)
  }

  const newFixtures = nock.recorder.play()
    .filter(hasntIgnoreHeader)
    .map(normalize)
  const oldFixtures = await read(fixtureName)
  nock.recorder.clear()

  const fixturesDiffs = diff(newFixtures, oldFixtures)
  if (fixturesDiffs) {
    diffs.push({
      name: fixtureName,
      changes: fixturesDiffs,
      newFixtures,
      oldFixtures
    })
    if (fixturesDiffs[0][0] === '-') {
      if (doUpdate) {
        console.log(`📼  New fixtures recorded`)
        return write(fixtureName, newFixtures)
      }
      console.log(`❌  "${fixtureName}" looks like a new fixture`)
    } else {
      if (doUpdate) {
        console.log(`📼  Fixture updates recorded`)
        return write(fixtureName, newFixtures)
      }
      console.log(`❌  Fixtures are not up-to-date`)

      if (!isTravisCronJob()) {
        console.log(diffString(oldFixtures, newFixtures))
        console.log(`💁  Update fixtures with \`${chalk.bold('bin/record.js --update')}\``)
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
      console.log('🤖  No fixture changes detected in cron job.')
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
    process.exit(1)
  }

  console.log(error.toString())
  console.log(JSON.stringify(error.response.data, null, 2))
  process.exit(1)
})

function hasntIgnoreHeader (fixture) {
  const hasIgnoreHeader = 'x-octokit-fixture-ignore' in fixture.reqheaders
  return !hasIgnoreHeader
}
