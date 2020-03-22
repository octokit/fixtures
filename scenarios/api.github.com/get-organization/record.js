const env = require("../../../lib/env");

// https://developer.github.com/v3/orgs/#get-an-organization
module.exports = {
  method: "get",
  url: "/orgs/octokit-fixture-org",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
  },
};
