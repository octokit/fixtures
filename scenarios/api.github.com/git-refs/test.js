import axios from "axios";

import fixtures from "../../../index.js";

test("Git references", async () => {
  const mock = fixtures.mock("api.github.com/git-refs");

  // https://developer.github.com/v3/git/refs/#get-all-references
  // returns a single reference for the master branch, pointing to sha for 2nd commit
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/git-refs/git/refs/",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/git/refs/#create-a-reference
  // Create a new branch "test" pointing to sha of initial commit
  await axios({
    method: "post",
    url: "https://api.github.com/repos/octokit-fixture-org/git-refs/git/refs",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      ref: "refs/heads/test",
      sha: "0000000000000000000000000000000000000002",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/git/refs/#update-a-reference
  // update test branch to point to sha of 2nd commit instead
  await axios({
    method: "patch",
    url: "https://api.github.com/repos/octokit-fixture-org/git-refs/git/refs/heads/test",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      sha: "0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/git/refs/#get-all-references
  // Now returns both branches: master & test
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/git-refs/git/refs/",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/git/refs/#delete-a-reference
  // Delete test branch
  await axios({
    method: "delete",
    url: "https://api.github.com/repos/octokit-fixture-org/git-refs/git/refs/heads/test",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
