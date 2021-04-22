export default normalizeTeam;

import fixturizeEntityId from "../fixturize-entity-id";
import fixturizePath from "../fixturize-path";
import setIfExists from "../set-if-exists";

function normalizeTeam(scenarioState, response) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "team")
  );

  // normalize URLs
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "members_url", fixturizePath.bind(null, scenarioState));
  setIfExists(
    response,
    "repositories_url",
    fixturizePath.bind(null, scenarioState)
  );
}
