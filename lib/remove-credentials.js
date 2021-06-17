export default removeCredentials;

import env from "./env.js";

const tokenToFixture = {
  [env.FIXTURES_USER_A_TOKEN_FULL_ACCESS]:
    "0000000000000000000000000000000000000001",
  [env.FIXTURES_USER_B_TOKEN_FULL_ACCESS]:
    "0000000000000000000000000000000000000002",
};

function removeCredentials(fixture) {
  // zerofy auth token
  fixture.reqheaders.authorization = (
    fixture.reqheaders.authorization || ""
  ).replace(/^token (\w{40})$/, (_, token) => {
    token = tokenToFixture[token] || "0000000000000000000000000000000000000000";
    return `token ${token}`;
  });

  return fixture;
}
