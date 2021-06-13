export default normalizeInvitation;

import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import normalizeRepository from "./repository.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function normalizeInvitation(scenarioState, response) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "invitation")
  );

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T09:00:00-07:00");

  // normalize URLs
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "html_url", fixturizePath.bind(null, scenarioState));

  normalizeRepository(scenarioState, response.repository);
  normalizeUser(scenarioState, response.inviter);
  normalizeUser(scenarioState, response.invitee);
}
