export default normalizeRepository;

import fixturizeEntityId from "../fixturize-entity-id.js";
import normalizeOrganization from "./organization.js";
import normalizeUser from "./user.js";
import setIfExists from "../set-if-exists.js";
import { regex } from "../temporary-repository.js";

function normalizeRepository(scenarioState, response, fixture) {
  // set all IDs to 1
  setIfExists(
    response,
    "id",
    fixturizeEntityId.bind(null, scenarioState.ids, "repository")
  );

  // set all dates to Universe 2017 Keynote time
  setIfExists(response, "created_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "updated_at", "2017-10-10T16:00:00Z");
  setIfExists(response, "pushed_at", "2017-10-10T16:00:00Z");

  // set all counts to 42
  setIfExists(response, "forks_count", 42);
  setIfExists(response, "forks", 42);
  setIfExists(response, "network_count", 42);
  setIfExists(response, "open_issues_count", 42);
  setIfExists(response, "open_issues", 42);
  setIfExists(response, "stargazers_count", 42);
  setIfExists(response, "subscribers_count", 42);
  setIfExists(response, "watchers_count", 42);
  setIfExists(response, "watchers", 42);

  // normalize temporary repository
  [
    "name",
    "full_name",
    "html_url",
    "url",
    "forks_url",
    "keys_url",
    "collaborators_url",
    "teams_url",
    "hooks_url",
    "issue_events_url",
    "events_url",
    "assignees_url",
    "branches_url",
    "tags_url",
    "blobs_url",
    "git_tags_url",
    "git_refs_url",
    "trees_url",
    "statuses_url",
    "languages_url",
    "stargazers_url",
    "contributors_url",
    "subscribers_url",
    "subscription_url",
    "commits_url",
    "git_commits_url",
    "comments_url",
    "issue_comment_url",
    "contents_url",
    "compare_url",
    "merges_url",
    "archive_url",
    "downloads_url",
    "issues_url",
    "pulls_url",
    "milestones_url",
    "notifications_url",
    "labels_url",
    "releases_url",
    "deployments_url",
    "git_url",
    "ssh_url",
    "clone_url",
    "svn_url",
  ].forEach((property) => {
    // not all these properties are set in repository response all the time
    setIfExists(response, property, (value) => {
      return value.replace(regex, "$1");
    });
  });

  if (response.organization) {
    normalizeOrganization(scenarioState, response.owner);
    normalizeOrganization(scenarioState, response.organization);
  } else {
    normalizeUser(scenarioState, response.owner);
  }

  // normalize payload
  setIfExists(fixture, "body.name", (name) => name.replace(regex, "$1"));
}
