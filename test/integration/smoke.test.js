import axios from "axios";

import fixtures from "../..";
import { readFileSync } from "fs";

test("Accepts fixtures object as argument", async () => {
  fixtures.mock(
    JSON.parse(
      readFileSync(
        "./scenarios/api.github.com/get-repository/normalized-fixture.json"
      )
    )
  );

  const result = await axios({
    method: "get",
    url: "https://api.github.com/repos/octokit-fixture-org/hello-world",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  expect(result.data.name).toBe("hello-world");
});

test("Missing Accept header", async () => {
  fixtures.mock("api.github.com/get-repository");

  try {
    await axios({
      method: "get",
      url: "https://api.github.com/repos/octokit-fixture-org/hello-world",
    });
    throw new Error("request should fail");
  } catch (error) {
    expect(error.message).toMatch("No match for request");
  }
});

test("Matches corret fixture based on authorization header", async () => {
  fixtures.mock("api.github.com/get-root");

  const result = await axios({
    method: "get",
    url: "https://api.github.com",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token 0000000000000000000000000000000000000001",
    },
  });

  expect(result.headers["x-ratelimit-remaining"]).toBe("4999");
});

test("unmatched request error", async () => {
  const mock = fixtures.mock("api.github.com/get-repository");

  try {
    await axios({
      method: "get",
      url: "https://api.github.com/unknown",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }).catch(mock.explain);
    throw new Error("request should fail");
  } catch (error) {
    expect(error.message).toMatch('+  url: "https://api.github.com/unknown');
  }
});

test("explain non-request error", async () => {
  const mock = fixtures.mock("api.github.com/get-repository");

  try {
    mock.explain(new Error("foo"));
    throw new Error("should throw error");
  } catch (error) {
    expect(error.message).toBe("foo");
  }
});
