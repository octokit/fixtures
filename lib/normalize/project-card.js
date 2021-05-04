export default projectCard;
import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function projectCard(scenarioState, response, fixture) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "project-card")
  );

  // normalize URLs
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "column_url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "project_url", fixturizePath.bind(null, scenarioState));

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  normalizeUser(scenarioState, response.creator);
}
