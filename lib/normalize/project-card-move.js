export default projectCardMove;

import fixturizeEntityId from "../fixturize-entity-id.js";
import setIfExists from "../set-if-exists.js";

function projectCardMove(scenarioState, response, fixture) {
  setIfExists(
    fixture.body,
    "column_id",
    fixturizeEntityId.bind(null, scenarioState.ids, "project-column")
  );

  if (/:/.test(fixture.body.position)) {
    const originalColumnId = fixture.body.position.split(":")[1];
    const newColumnId = fixturizeEntityId(
      scenarioState.ids,
      "project-card",
      originalColumnId
    );

    fixture.body.position = fixture.body.position.replace(
      /:\d+$/,
      `:${newColumnId}`
    );
  }
}
