import axios from "axios";

import fixtures from "../../../index.js";

test("Get repository", async () => {
  const mock = fixtures.mock("api.github.com/get-content");

  const jsonResult = await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/hello-world/contents/",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(jsonResult.data.length).toBe(1);
  expect(jsonResult.data[0].path).toBe("README.md");

  const rawResult = await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/hello-world/contents/README.md",
    headers: {
      Accept: "application/vnd.github.v3.raw",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(rawResult.data).toBe("# hello-world");
  expect(rawResult.headers["content-type"]).toBe(
    "application/vnd.github.v3.raw; charset=utf-8"
  );

  expect(mock.done.bind(mock)).not.toThrow();
});
