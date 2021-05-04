export default normalizeReleaseAsset;
import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizeCommitSha from "../fixturize-commit-sha.js";
import fixturizePath from "../fixturize-path.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function normalizeReleaseAsset(scenarioState, response) {
  // set ID to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "release")
  );

  // fixturize commit sha hashes
  setIfExists(
    response,
    "target_commitish",
    fixturizeCommitSha(scenarioState.commitSha, response.target_commitish)
  );

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "published_at", "2017-10-10T16:00:00Z");

  // normalize temporary repository name & id in URLs
  [
    "assets_url",
    "html_url",
    "tarball_url",
    "upload_url",
    "url",
    "zipball_url",
  ].forEach((property) => {
    setIfExists(response, property, fixturizePath.bind(null, scenarioState));
  });

  normalizeUser(scenarioState, response.author);
}
