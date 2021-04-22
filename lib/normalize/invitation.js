export default normalizeInvitation;

import fixturizeEntityId from "../fixturize-entity-id";
import fixturizePath from "../fixturize-path";
import normalizeRepository from "./repository";
import normalizeUser from "./user";
import setIfExists from "../set-if-exists";

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
