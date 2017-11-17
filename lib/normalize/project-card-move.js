module.exports = projectCardMove

const fixturizeEntityId = require('../fixturize-entity-id')
const setIfExists = require('../set-if-exists')

function projectCardMove (scenarioState, response, fixture) {
  setIfExists(fixture.body, 'column_id', fixturizeEntityId.bind(null, scenarioState.ids, 'project-column'))

  if (/:/.test(fixture.body.position)) {
    const originalColumnId = fixture.body.position.split(':')[1]
    const newColumnId = fixturizeEntityId(scenarioState.ids, 'project-card', originalColumnId)

    fixture.body.position = fixture.body.position.replace(/:\d+$/, `:${newColumnId}`)
  }
}
