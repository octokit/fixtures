export default normalizeFileChange;

import normalizeCommit from "./commit";
import normalizeContent from "./content";

function normalizeFileChange(scenarioState, response) {
  normalizeCommit(scenarioState, response.commit);
  normalizeContent(scenarioState, response.content);
}
