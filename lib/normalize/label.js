export default normalizeIssue;

import fixturizeEntityId from "../fixturize-entity-id";
import fixturizePath from "../fixturize-path";
import setIfExists from "../set-if-exists";

function normalizeIssue(scenarioState, response) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "label")
  );
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
}
