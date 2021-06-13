export default normalizeContent;

import setIfExists from "../set-if-exists.js";

function normalizeContent(scenarioState, response) {
  // zerofy request ID
  setIfExists(response, "request_id", "0000:00000:0000000:0000000:00000000");
}
