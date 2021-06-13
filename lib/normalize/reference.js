export default normalizeReference;
import fixturizeCommitSha from "../fixturize-commit-sha.js";
import fixturizePath from "../fixturize-path.js";
import setIfExists from "../set-if-exists.js";

function normalizeReference(scenarioState, response, fixture) {
  // fixturize commit sha hashes
  setIfExists(
    response,
    "object.sha",
    fixturizeCommitSha.bind(null, scenarioState.commitSha)
  );
  setIfExists(
    fixture,
    "body.sha",
    fixturizeCommitSha.bind(null, scenarioState.commitSha)
  );

  // normalize temporary repository
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "object.url", fixturizePath.bind(null, scenarioState));
}
