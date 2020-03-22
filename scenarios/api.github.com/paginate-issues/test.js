const axios = require("axios");
const { test } = require("tap");

const fixtures = require("../../..");

test("paginate issues", async (t) => {
  const mock = fixtures.mock("api.github.com/paginate-issues");

  // https://developer.github.com/v3/issues/#list-issues-for-a-repository
  // Get pages 1 - 5.
  const options = {
    method: "get",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  };

  const urls = [
    "https://api.github.com/repos/octokit-fixture-org/paginate-issues/issues?per_page=3",
    "https://api.github.com/repositories/1000/issues?per_page=3&page=2",
    "https://api.github.com/repositories/1000/issues?per_page=3&page=3",
    "https://api.github.com/repositories/1000/issues?per_page=3&page=4",
    "https://api.github.com/repositories/1000/issues?per_page=3&page=5",
  ];

  for (var i = 0; i < urls.length; i++) {
    await axios
      .request(
        Object.assign(options, {
          url: urls[i],
        })
      )
      .catch(mock.explain);
  }

  t.doesNotThrow(mock.done.bind(mock), "satisfies all mocks");
  t.end();
});
