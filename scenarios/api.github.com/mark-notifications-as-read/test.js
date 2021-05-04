import axios from "axios";

import fixtures from "../../../index.js";

test("Labels", async () => {
  const mock = fixtures.mock("api.github.com/mark-notifications-as-read");

  await axios({
    method: "put",
    url: "https://api.github.com/notifications",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "content-length": 0,
    },
  });

  expect(mock.done.bind(mock)).not.toThrow();
});
