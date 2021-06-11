import assert from "assert";
import { URL } from "url";
import cloneDeep from "lodash/cloneDeep.js";
import merge from "lodash/merge.js";
import pick from "lodash/pick.js";
import nock from "nock";
import headers from "./lib/headers.js";
import { diffString } from "json-diff";
import { readFileSync } from "fs";

export default {
  // don’t use short syntax for node@4 compatibility
  get,
  mock,
  nock,
};

function get(name) {
  return JSON.parse(
    readFileSync(`./scenarios/${name}/normalized-fixture.json`)
  );
}

function mock(fixtures, additions) {
  if (typeof fixtures === "string") {
    fixtures = get(fixtures);
  }
  fixtures = cloneDeep(fixtures);

  if (additions) {
    const applyAdditions =
      typeof additions === "function"
        ? additions
        : applyAdditionsDefault.bind(null, additions);
    fixtures.forEach((fixture, i) => {
      fixtures[i] = applyAdditions(fixture);
    });
  }

  fixtures.forEach((fixture) => {
    fixture.rawHeaders = headers.toArray(fixture.headers);
    delete fixture.headers;
  });

  const mocks = nock.define(fixtures);

  const api = {
    pending() {
      return [].concat(...mocks.map((mock) => mock.pendingMocks()));
    },
    explain(error) {
      if (!/^Nock: No match/.test(error.message)) {
        throw error;
      }

      const expected = getNextMockConfig(mocks);
      const actualString = error.message
        .substr("Nock: No match for request ".length)
        .replace(/\s+Got instead(.|[\r\n])*$/, "");

      const requestConfig = JSON.parse(actualString);
      const actual = pick(requestConfig, Object.keys(expected));
      actual.headers = pick(
        requestConfig.headers,
        Object.keys(expected.headers)
      );
      error.message = `Request did not match mock ${
        api.pending()[0]
      }:\n${diffString(expected, actual)}`;

      delete error.config;
      delete error.request;
      delete error.response;
      delete error.status;
      delete error.statusCode;
      delete error.source;

      throw error;
    },
    done() {
      assert.ok(
        api.isDone(),
        `Mocks not yet satisfied:\n${api.pending().join("\n")}`
      );
    },
    isDone() {
      return api.pending().length === 0;
    },
  };

  return api;
}

function getNextMockConfig(mocks) {
  const nextMock = mocks.find((mock) => mock.pendingMocks().length > 0)
    .interceptors[0];
  return {
    method: nextMock.method.toLowerCase(),
    url: `https://api.github.com${nextMock.uri}`,
    headers: nextMock.options.reqheaders,
  };
}

function applyAdditionsDefault(additions, fixture) {
  merge(fixture, additions);
  if (additions.scope) {
    const url = new URL(additions.scope);
    fixture.reqheaders.host = url.host;
    if (fixture.headers.location) {
      fixture.headers.location = fixture.headers.location.replace(
        "https://api.github.com/",
        url.href
      );
    }
  }

  return fixture;
}
