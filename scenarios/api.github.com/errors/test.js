const axios = require("axios");
const { test } = require("tap");

const fixtures = require("../../..");

test("Errors", async (t) => {
  t.plan(2);
  const mock = fixtures.mock("api.github.com/errors");

  try {
    await axios({
      method: "post",
      url: "https://api.github.com/repos/octokit-fixture-org/errors/labels",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token 0000000000000000000000000000000000000001",
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        name: "foo",
        color: "invalid",
      },
    });
  } catch (error) {
    t.is(error.response.status, 422);
  }

  t.doesNotThrow(mock.done.bind(mock), "satisfies all mocks");

  t.end();
});
