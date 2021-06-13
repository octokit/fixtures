import axios from "axios";

import fixtures from "../../../index.js";

test("Get archive", async () => {
  const mock = fixtures.mock("api.github.com/get-archive");

  // https://developer.github.com/v3/repos/#edit
  const redirectLocation = await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/get-archive/tarball/main",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
    // axios (or the lower level follow-redirects package) does not handle 307
    // redirects correctly
    maxRedirects: 0,
  })
    .catch((error) => {
      expect(error.response.status).toBe(302);
      if (error.response.status === 302) {
        return error.response.headers.location;
      }

      throw error;
    })
    .catch(mock.explain);

  expect(redirectLocation).toBe(
    "https://codeload.github.com/octokit-fixture-org/get-archive/legacy.tar.gz/refs/heads/main"
  );

  const result = await axios({
    method: "get",
    url: redirectLocation,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  expect(Buffer.from(result.data, "binary").toString("hex").length).toBe(340);

  expect(mock.done.bind(mock)).not.toThrow();
});
