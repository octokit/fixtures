export default branchProtection;

import get from "lodash/get.js";

import normalizeTeam from "./team.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";
import { regex } from "../temporary-repository.js";

// https://developer.github.com/v3/repos/branches/#response-2
function branchProtection(scenarioState, response) {
  // normalize temporary repository
  setIfExists(response, "url", (url) => url.replace(regex, "$1"));
  setIfExists(response, "required_status_checks.url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(response, "required_status_checks.contexts_url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(response, "required_pull_request_reviews.url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(
    response,
    "required_pull_request_reviews.dismissal_restrictions.url",
    (url) => url.replace(regex, "$1")
  );
  setIfExists(
    response,
    "required_pull_request_reviews.dismissal_restrictions.users_url",
    (url) => url.replace(regex, "$1")
  );
  setIfExists(
    response,
    "required_pull_request_reviews.dismissal_restrictions.teams_url",
    (url) => url.replace(regex, "$1")
  );
  setIfExists(response, "enforce_admins.url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(response, "restrictions.url", (url) => url.replace(regex, "$1"));
  setIfExists(response, "restrictions.users_url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(response, "restrictions.teams_url", (url) =>
    url.replace(regex, "$1")
  );
  setIfExists(response, "restrictions.apps_url", (url) =>
    url.replace(regex, "$1")
  );

  // normalize users
  const dismissalRestrictionsUsers =
    get(
      response,
      "required_pull_request_reviews.dismissal_restrictions.users"
    ) || [];
  const dismissalRestrictionsTeams =
    get(
      response,
      "required_pull_request_reviews.dismissal_restrictions.teams"
    ) || [];
  const restrictionsUsers = get(response, "restrictions.users") || [];
  const restrictionsTeams = get(response, "restrictions.teams") || [];

  dismissalRestrictionsUsers
    .concat(restrictionsUsers)
    .forEach(normalizeUser.bind(null, scenarioState));
  dismissalRestrictionsTeams
    .concat(restrictionsTeams)
    .forEach(normalizeTeam.bind(null, scenarioState));
}
