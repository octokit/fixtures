import axios from "axios";

import fixtures from "../../../index.js";

test("Get repository", async () => {
  const mock = fixtures.mock("api.github.com/get-root");

  await axios({
    method: "get",
    url: "https://api.github.com/",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
