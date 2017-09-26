module.exports = recordScenario

const nock = require('nock')
const normalize = require('./normalize')

async function recordScenario ({request, scenario}) {
  nock.recorder.rec({
    output_objects: true,
    dont_print: true,
    enable_reqheaders_recording: true
  })

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

      return request(step)
    }, Promise.resolve())
  } else if (typeof scenario === 'object') {
    // if scenario is an object with request options, send a request for it
    await request(scenario)
  } else {
    // otherwise we expect scenario to be an asynchronous function
    await scenario({request})
  }

  const fixtures = nock.recorder.play()
    .filter(hasntIgnoreHeader)
    .map(normalize)

  nock.recorder.clear()
  nock.restore()

  return fixtures
}

function hasntIgnoreHeader (fixture) {
  const hasIgnoreHeader = 'x-octokit-fixture-ignore' in fixture.reqheaders
  return !hasIgnoreHeader
}
