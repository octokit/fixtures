import env from "../../../lib/env.js";

// https://developer.github.com/v3/#root-endpoint
export default [
  {
    method: "get",
    url: "/",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`,
    },
  },
];
