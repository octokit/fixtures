import axios from "axios";

import fixtures from "../../../index.js";

test("Labels", async () => {
  const mock = fixtures.mock("api.github.com/labels");

  // https://developer.github.com/v3/issues/labels/#list-all-labels-for-this-repository
  // List all labels for a repository
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/labels/labels",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/issues/labels/#create-a-label
  // Create a label
  await axios({
    method: "post",
    url: "https://api.github.com/repos/octokit-fixture-org/labels/labels",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "test-label",
      color: "663399",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/issues/labels/#get-a-single-label
  // Get a label
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/labels/labels/test-label",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/issues/labels/#get-a-single-label
  // Update a label
  await axios({
    method: "patch",
    url: "https://api.github.com/repos/octokit-fixture-org/labels/labels/test-label",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      new_name: "test-label-updated",
      color: "BADA55",
    },
  }).catch(mock.explain);

  // https://developer.github.com/v3/issues/labels/#delete-a-label
  // Delete a label
  await axios({
    method: "delete",
    url: "https://api.github.com/repos/octokit-fixture-org/labels/labels/test-label-updated",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  }).catch(mock.explain);

  expect(mock.done.bind(mock)).not.toThrow();
});
