export default normalizeIssuesSearch;

import normalizeIssue from "./issue";
import setIfExists from "../set-if-exists";

function normalizeIssuesSearch(scenarioState, { items }) {
  items.forEach((result) => {
    normalizeIssue(scenarioState, result);
    setIfExists(result, "score", 42);
  });
}
