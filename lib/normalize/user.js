export default normalizeUser;

import fixturizeEntityId from "../fixturize-entity-id";
import fixturizePath from "../fixturize-path";
import setIfExists from "../set-if-exists";

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
