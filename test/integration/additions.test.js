import isObject from "lodash/isObject.js";
import mapValues from "lodash/mapValues.js";
import axios from "axios";

import fixtures from "../../index.js";

test("reqheaders additions", async () => {
  const mock = fixtures.mock("api.github.com/get-repository", {
    reqheaders: {
      "x-fixtures-id": "123",
    },
  });

  try {
    await axios({
      method: "get",
      url: "https://api.github.com/repos/octokit-fixture-org/hello-world",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token 0000000000000000000000000000000000000001",
      },
    });
    throw new Error("should fail without X-Foo header");
  } catch (error) {
    expect(error.message).toMatch("No match for request");
  }

  try {
    await axios({
      method: "get",
      url: "https://api.github.com/repos/octokit-fixture-org/hello-world",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token 0000000000000000000000000000000000000001",
        "x-fixtures-id": "123",
      },
    });
  } catch (error) {
    throw new Error(mock.explain(error));
  }
});

test("scope additions", async () => {
  const mock = fixtures.mock("api.github.com/rename-repository", {
    scope: "http://localhost:3000",
  });

  // https://developer.github.com/v3/repos/#edit
  await axios({
    method: "patch",
    url: "http://localhost:3000/repos/octokit-fixture-org/rename-repository",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      name: "rename-repository-newname",
    },
  }).catch((error) => expect(mock.explain(error)).toBeFalsy());

  // https://developer.github.com/v3/repos/#get
  await axios({
    method: "get",
    url: "http://localhost:3000/repos/octokit-fixture-org/rename-repository",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
    maxRedirects: 0,
  }).catch((error) => {
    if (/No match for request/.test(error.message)) {
      expect(mock.explain(error)).toBeFalsy();
    }

    expect(error.response.headers.location).toBe(
      "http://localhost:3000/repositories/1000"
    );
  });
});

test("additions function", async () => {
  const mapValuesDeep = (v, callback) =>
    isObject(v) ? mapValues(v, (v) => mapValuesDeep(v, callback)) : callback(v);
  const mock = fixtures.mock("api.github.com/release-assets", (fixture) => {
    if (fixture.scope === "https://uploads.github.com:443") {
      fixture.path = `/uploads.github.com${fixture.path}`;
    }

    fixture.scope = "http://localhost:3000";
    fixture.reqheaders.host = "localhost:3000";
    fixture.reqheaders["x-fixtures-id"] = "123";
    return mapValuesDeep(fixture, (value) => {
      if (typeof value !== "string") {
        return value;
      }

      return value
        .replace("https://api.github.com/", "http://localhost:3000/")
        .replace(
          "https://uploads.github.com/",
          "http://localhost:3000/uploads.github.com/"
        );
    });
  });

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // Get release to retrieve upload URL
  const { data } = await axios({
    method: "get",
    url: "http://localhost:3000/repos/octokit-fixture-org/release-assets/releases/tags/v1.0.0",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "x-fixtures-id": "123",
    },
  }).catch((error) => expect(mock.explain(error)).toBeFalsy());

  expect(data.url).toBe(
    "http://localhost:3000/repos/octokit-fixture-org/release-assets/releases/1000"
  );
  expect(data.upload_url).toBe(
    "http://localhost:3000/uploads.github.com/repos/octokit-fixture-org/release-assets/releases/1000/assets{?name,label}"
  );

  // https://developer.github.com/v3/repos/releases/#upload-a-release-asset
  // upload attachment to release URL returned by create release request
  await axios({
    method: "post",
    url: "http://localhost:3000/uploads.github.com/repos/octokit-fixture-org/release-assets/releases/1000/assets?name=test-upload.txt&label=test",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
      "Content-Type": "text/plain",
      "Content-Length": 14,
      "x-fixtures-id": "123",
    },
    data: "Hello, world!\n",
  }).catch((error) => console.log(mock.explain(error)));
});
