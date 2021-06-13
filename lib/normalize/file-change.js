export default normalizeFileChange;

import normalizeCommit from "./commit.js";
import normalizeContent from "./content.js";

function normalizeFileChange(scenarioState, response) {
  normalizeCommit(scenarioState, response.commit);
  normalizeContent(scenarioState, response.content);
}
