import axios from "axios";
import fixtures from "../../../index.js";

test("Branch protection", async () => {
  const mock = fixtures.mock("api.github.com/branch-protection");

  // https://developer.github.com/v3/repos/branches/#get-branch-protection
  // Get branch protection
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/branch-protection/branches/main/protection",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  })
    .catch((error) => {
      if (error.response.data.message === "Branch not protected") {
        return; // this 404 is expected
      }

      throw error;
    })
    .catch(mock.explain);

  // https://developer.github.com/v3/repos/branches/#update-branch-protection
  // Update branch protection with minimal settings
  await axios({
    method: "put",
    url: "https://api.github.com/repos/octokit-fixture-org/branch-protection/branches/main/protection",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      required_status_checks: null,
      required_pull_request_reviews: null,
      restrictions: null,
      enforce_admins: false,
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/branches/#update-branch-protection
  // Update branch protection with maximal settings
  await axios({
    method: "put",
    url: "https://api.github.com/repos/octokit-fixture-org/branch-protection/branches/main/protection",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      required_status_checks: {
        strict: true,
        contexts: ["foo/bar"],
      },
      required_pull_request_reviews: {
        dismissal_restrictions: {
          users: ["octokit-fixture-user-a"],
          teams: [], // bug: server returns "Only 100 users and teams can be specified." when set to ['a-team']
        },
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false,
      },
      restrictions: {
        users: ["octokit-fixture-user-a"],
        teams: ["a-team"],
      },
      enforce_admins: true,
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/branches/#remove-branch-protection
  // Remove branch protection
  await axios({
    method: "delete",
    url: "https://api.github.com/repos/octokit-fixture-org/branch-protection/branches/main/protection",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
