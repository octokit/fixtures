import env from "../../../lib/env.js";

// https://developer.github.com/v3/repos/#get
export default {
  method: "get",
  url: "/repos/octokit-fixture-org/hello-world",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
  },
};
