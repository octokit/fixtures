export default normalizeReleaseAsset;
import fixturizeEntityId from "../fixturize-entity-id.js";
import fixturizePath from "../fixturize-path.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";

function normalizeReleaseAsset(scenarioState, response, fixture) {
  // set ID to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "release-asset")
  );

  // set count to 42
  setIfExists(response, "download_count", 42);

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");

  // normalize temporary repository name & id in URLs
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(
    response,
    "browser_download_url",
    fixturizePath.bind(null, scenarioState)
  );

  normalizeUser(scenarioState, response.uploader);
}
