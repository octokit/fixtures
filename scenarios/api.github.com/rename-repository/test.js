import axios from "axios";

import fixtures from "../../../index.js";

test("Labels", async () => {
  const mock = fixtures.mock("api.github.com/rename-repository");

  // https://developer.github.com/v3/repos/#edit
  await axios({
    method: "patch",
    url: "https://api.github.com/repos/octokit-fixture-org/rename-repository",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "rename-repository-newname",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/#get
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/rename-repository",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/repos/#edit
  await axios({
    method: "patch",
    url: "https://api.github.com/repos/octokit-fixture-org/rename-repository",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "rename-repository-newname",
      description: "test description",
    },
    // axios (or the lower level follow-redirects package) does not handle 307
    // redirects correctly
    maxRedirects: 0,
  })
    .catch((error) => {
      if (error.response.status === 307) {
        return; // all good
      }

      throw error;
    })
    .catch(mock.explain);

  // https://developer.github.com/v3/repos/#edit
  await axios({
    method: "patch",
    url: "https://api.github.com/repositories/1000",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "rename-repository-newname",
      description: "test description",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
