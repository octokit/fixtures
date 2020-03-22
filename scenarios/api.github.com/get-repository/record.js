const env = require("../../../lib/env");

// https://developer.github.com/v3/repos/#get
module.exports = {
  method: "get",
  url: "/repos/octokit-fixture-org/hello-world",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
  },
};
