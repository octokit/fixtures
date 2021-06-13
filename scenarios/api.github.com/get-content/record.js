import env from "../../../lib/env.js";

// https://developer.github.com/v3/repos/contents/#get-contents
// empty path returns README file if present
export default [
  {
    method: "get",
    url: "/repos/octokit-fixture-org/hello-world/contents/",
    headers: {
      accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  },
  {
    method: "get",
    url: "/repos/octokit-fixture-org/hello-world/contents/README.md",
    headers: {
      accept: "application/vnd.github.v3.raw",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  },
];
