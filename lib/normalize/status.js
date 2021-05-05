export default normalizeStatus;

import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function normalizeStatus(scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "status")
  );

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  // normalize temporary repository & fixturize sha
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));

  normalizeUser(scenarioState, response.creator);
}
