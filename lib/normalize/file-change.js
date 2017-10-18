module.exports = normalizeFileChange

const normalizeCommit = require('./commit')
const normalizeContent = require('./content')

function normalizeFileChange (scenarioState, response) {
  normalizeCommit(scenarioState, response.commit)
  normalizeContent(scenarioState, response.content)
}
