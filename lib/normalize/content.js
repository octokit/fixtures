export default normalizeContent;

import fixturizePath from "../fixturize-path.js";
import setIfExists from "../set-if-exists.js";

function normalizeContent(scenarioState, response) {
  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "author.date", "2017-10-10T16:00:00Z");
  setIfExists(response, "committer.date", "2017-10-10T16:00:00Z");

  // normalize temporary repository
  setIfExists(response, "url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "html_url", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "git_url", fixturizePath.bind(null, scenarioState));
  setIfExists(
    response,
    "download_url",
    fixturizePath.bind(null, scenarioState)
  );
  setIfExists(response, "_links.self", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "_links.git", fixturizePath.bind(null, scenarioState));
  setIfExists(response, "_links.html", fixturizePath.bind(null, scenarioState));
}
