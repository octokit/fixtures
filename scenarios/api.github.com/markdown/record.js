import env from "../../../lib/env.js";

// https://developer.github.com/v3/markdown/
export default [
  {
    method: "post",
    url: "/markdown",
    headers: {
      Accept: "text/html",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
    data: {
      text: `### Hello

b597b5d`,
      context: "octokit-fixture-org/hello-world",
      mode: "gfm",
    },
  },
  {
    method: "post",
    url: "/markdown/raw",
    headers: {
      Accept: "text/html",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
      "Content-Type": "text/plain; charset=utf-8",
    },
    data: `### Hello

b597b5d`,
  },
];
