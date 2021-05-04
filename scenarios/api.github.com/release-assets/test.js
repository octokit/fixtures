import axios from "axios";

import fixtures from "../../../index.js";

test("Labels", async () => {
  const mock = fixtures.mock("api.github.com/release-assets");

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Get release to retrieve upload URL
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // upload attachment to release URL returned by create release request
  await axios({
    method: "post",
    url: "https://uploads.github.com/repos/octokit-fixture-org/release-assets/releases/1000/assets?name=test-upload.txt&label=test",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "text/plain",
      "Content-Length": 14,
    },
    data: "Hello, world!\n",
  });

  // https://developer.github.com/v3/repos/releases/#list-assets-for-a-release
  // list assets for release
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/1000/assets",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  // https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
  // get single release asset
  await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/assets/1000",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  // https://developer.github.com/v3/repos/releases/#get-a-single-release-asset
  // Edit name / label of release asset
  await axios({
    method: "patch",
    url: "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/assets/1000",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "new-filename.txt",
      label: "new label",
    },
  });

  // https://developer.github.com/v3/repos/releases/#delete-a-release-asset
  // delete a release asset
  await axios({
    method: "delete",
    url: "https://api.github.com/repos/octokit-fixture-org/release-assets/releases/assets/1000",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  expect(mock.done.bind(mock)).not.toThrow();
});
