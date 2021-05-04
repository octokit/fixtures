import axios from "axios";

import fixtures from "../../../index.js";

test("Labels", async () => {
  const mock = fixtures.mock("api.github.com/search-issues");

  // https://developer.github.com/v3/search/#search-issues
  const query = "sesame repo:octokit-fixture-org/search-issues";
  await axios({
    method: "get",
    url: `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
