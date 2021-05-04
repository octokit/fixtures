import axios from "axios";

import fixtures from "../../../index.js";

test("Errors", async () => {
  expect.assertions(2);
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
    expect(error.response.status).toBe(422);
  }

  expect(mock.done.bind(mock)).not.toThrow();
});
