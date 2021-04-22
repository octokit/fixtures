export default normalizeCombinedStatus;

import fixturizeCommitSha from "../fixturize-commit-sha";
import fixturizePath from "../fixturize-path";
import normalizeRepository from "./repository";
import normalizeStatus from "./status";
import setIfExists from "../set-if-exists";

function normalizeCombinedStatus(scenarioState, response) {
  const sha = response.sha;

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  // fixturize sha
  setIfExists(
    response,
    "sha",
    fixturizeCommitSha(scenarioState.commitSha, sha)
  );

  // normalize temporary repository & fixturize sha in URLs
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "commit_url", fixturizePath.bind(null, scenarioState));

  response.statuses.forEach(normalizeStatus.bind(null, scenarioState));
  normalizeRepository(scenarioState, response.repository);
}
