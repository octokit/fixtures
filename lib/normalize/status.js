export default normalizeStatus;

import { bind } from "../fixturize-entity-id";
import { bind as _bind } from "../fixturize-path";
import normalizeUser from "./user";
import setIfExists from "../set-if-exists";

function normalizeStatus(scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(response, "id", bind(null, scenarioState.ids, "status"));

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  // normalize temporary repository & fixturize sha
  setIfExists(response, "url", _bind(null, scenarioState));

  normalizeUser(scenarioState, response.creator);
}
