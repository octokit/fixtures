export default normalizeUser;

import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import setIfExists from "../set-if-exists.js";

function normalizeUser(scenarioState, response) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "owner")
  );

  // normalize URLs
  setIfExists(response, "avatar_url", fixturizePath.bind(null, scenarioState));
}
