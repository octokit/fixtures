export default normalizeIssuesSearch;

import normalizeIssue from "./issue.js";
import setIfExists from "../set-if-exists.js";

function normalizeIssuesSearch(scenarioState, { items }) {
  items.forEach((result) => {
    normalizeIssue(scenarioState, result);
    setIfExists(result, "score", 42);
  });
}
