export default normalizeIssue;

import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function normalizeIssue(scenarioState, response) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "issue")
  );

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  // set all counts to 42
  setIfExists(response, "comments", 42);

  // normalize temporary repository
  [
    "url",
    "repository_url",
    "labels_url",
    "comments_url",
    "events_url",
    "html_url",
    "timeline_url",
  ].forEach((property) => {
    setIfExists(response, property, fixturizePath.bind(null, scenarioState));
  });

  normalizeUser(scenarioState, response.user);
}
