module.exports = normalizeIssuesSearch

const normalizeIssue = require('./issue')
const setIfExists = require('../set-if-exists')

function normalizeIssuesSearch (scenarioState, response) {
  response.items.forEach(result => {
    normalizeIssue(scenarioState, result)
    setIfExists(result, 'score', 42)
  })
}
