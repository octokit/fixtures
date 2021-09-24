export default normalize;
import calculateBodyLength from "../calculate-body-length.js";
import fixturizePath from "../fixturize-path.js";
import headers from "../headers.js";
import normalizeCommon from "./common.js";
import setIfExists from "../set-if-exists.js";
import toEntityName from "../to-entity-name.js";

async function normalize(scenarioState, fixture) {
  // fixture.rawHeaders is an array in the form of ['key1', 'value1', 'key2', 'value2']
  // But the order of these can change, e.g. between local tests and CI on GitHub Actions.
  // That’s why we turn them into an object before storing the fixtures and turn
  // them back into an array before loading
  fixture.headers = headers.toObject(fixture.rawHeaders);
  delete fixture.rawHeaders;

  fixture.path = fixturizePath(scenarioState, fixture.path);
  if (fixture.headers.location) {
    fixture.headers.location = fixturizePath(
      scenarioState,
      fixture.headers.location
    );
  }

  // set all dates to Universe 2017 Keynote time
  setIfExists(fixture.headers, "date", "Tue, 10 Oct 2017 16:00:00 GMT");
  setIfExists(fixture.headers, "expires", "Tue, 10 Oct 2017 16:00:00 GMT");
  setIfExists(
    fixture.headers,
    "last-modified",
    "Tue, 10 Oct 2017 16:00:00 GMT"
  );
  setIfExists(fixture.headers, "x-ratelimit-reset", "1507651200000");

  // Set remaining rate limit to 59 for unauthenticated accounts and
  // to 4999 to authenticated accounts
  const rateLimitRemaining = parseInt(fixture.headers["x-ratelimit-limit"], 10);
  setIfExists(
    fixture.headers,
    "x-ratelimit-remaining",
    String(rateLimitRemaining - 1)
  );

  // Set used rate limit to 1
  setIfExists(fixture.headers, "x-ratelimit-used", 1);

  // zerofy random stuff
  setIfExists(fixture.headers, "etag", '"00000000000000000000000000000000"');
  setIfExists(fixture.headers, "x-runtime-rack", "0.000000");
  setIfExists(
    fixture.headers,
    "x-github-request-id",
    "0000:00000:0000000:0000000:00000000"
  );

  // leave out headers that tend to change on different environments
  delete fixture.headers["accept-ranges"];
  delete fixture.headers.region;
  delete fixture.headers.server;
  delete fixture.headers.vary;
  delete fixture.headers["x-runtime-rack"];

  // The GitHub API has several endpoints that require a PUT or a PATCH verb
  // with an empty body. In that case it’s unclear what content-type to set,
  // or if a content-type header is to be set at all. So we remove it from our
  // fixtures in that case but set content-length to 0 as required via:
  // https://developer.github.com/v3/#http-verbs
  if (
    (fixture.method === "put" || fixture.method === "patch") &&
    !fixture.body
  ) {
    delete fixture.reqheaders["content-type"];
    fixture.reqheaders["content-length"] = 0;
  }

  // normalize content-type value
  if (fixture.reqheaders["content-type"]) {
    fixture.reqheaders["content-type"] = fixture.reqheaders["content-type"]
      .replace(";charset=utf-8", "; charset=utf-8")
      .replace("application/json", "application/json; charset=utf-8");
  }

  const responses = Array.isArray(fixture.response)
    ? fixture.response
    : [fixture.response];
  for (let response of responses) {
    normalizeCommon(response);
    const entityName = toEntityName(response, fixture);
    if (entityName) {
      await (
        await import(`./${entityName}.js`)
      ).default(scenarioState, response, fixture);
    }
  }

  // update content length
  if (/^application\/json/.test(fixture.headers["content-type"])) {
    fixture.headers["content-length"] = String(
      calculateBodyLength(fixture.response)
    );
  }

  if (fixture.responseIsBinary) {
    fixture.headers["content-length"] = Buffer.from(
      fixture.response,
      "hex"
    ).length;
  }

  // remove `Transfer-Encoding: chunked` headers:
  // https://github.com/octokit/fixtures/issues/97
  if (fixture.headers["transfer-encoding"] === "chunked") {
    delete fixture.headers["transfer-encoding"];
  }

  // normalize link header if response is paginated
  if (fixture.headers.link) {
    fixture.headers.link = fixture.headers.link.replace(
      /https:\/\/[^;]+/g,
      (url) => fixturizePath(scenarioState, url)
    );
  }

  if (fixture.body) {
    fixture.reqheaders["content-length"] = calculateBodyLength(fixture.body);
  }

  // handle redirect response
  if (fixture.status > 300 && fixture.status < 400) {
    fixture.headers.location = fixturizePath(
      scenarioState,
      fixture.headers.location
    );
    if (fixture.response.url) {
      fixture.response.url = fixture.headers.location;
    }
  }

  // remove varnishs header if present
  setIfExists(fixture.headers, "x-varnish", "1000");
  setIfExists(fixture.headers, "age", "0");

  if (fixture.headers["x-github-media-type"]) {
    fixture.headers["x-github-media-type"] =
      fixture.headers["x-github-media-type"];
  }

  return fixture;
}
