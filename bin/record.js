#!/usr/bin/env node

// run with "DEBUG=axios" to see debug logs
require("axios-debug-log")({
  request: function(debug, config) {
    debug(`${config.method.toUpperCase()} ${config.url}`);
  },
  response: () => {},
  error: () => {}
});

const axios = require("axios");
const Bottleneck = require("bottleneck");
const chalk = require("chalk");
const cloneDeep = require("lodash/cloneDeep");
const { diff, diffString } = require("json-diff");
const glob = require("glob");
const humanize = require("humanize-string");

const normalize = require("../lib/normalize");
const read = require("../lib/read");
const recordScenario = require("../lib/record-scenario");
const write = require("../lib/write");

const argv = require("minimist")(process.argv.slice(2), {
  boolean: ["update", "test-cached"]
});
const doUpdate = argv.update;
const selectedScenarios = argv._;
const hasSelectedScenarios = selectedScenarios.length > 0;

const scenarios = hasSelectedScenarios
  ? selectedScenarios
  : glob.sync("scenarios/**/record.js");
const diffs = [];

// run scenarios one by one
scenarios
  .reduce(async (promise, scenarioPath) => {
    await promise;
    const fixtureName = scenarioPath.replace(
      /(^scenarios\/|\/record\.js$)/g,
      ""
    );
    const [domain, title] = fixtureName.split("/");
    console.log("");
    console.log(
      `⏯️  ${chalk.bold(domain)}: ${humanize(title.replace(".js", ""))} ...`
    );

    const request = axios.create({
      baseURL: `https://${domain}`,
      maxRedirects: 0 // record redirects explicitly
    });

    // throttle writing requests
    // https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits
    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 3000
    });
    request.interceptors.request.use(config => {
      if (
        !["POST", "PATCH", "PUT", "DELETE"].includes(
          config.method.toUpperCase()
        )
      ) {
        return config;
      }

      return limiter.schedule(async () => config);
    });

    // set strict validation header, remove once stricter validations are applied
    // to all requests: https://developer.github.com/changes/2018-11-07-strict-validation/
    request.interceptors.request.use(config => {
      config.headers.Accept = `${config.headers.Accept},application/vnd.github.speedy-preview+json`;
      return config;
    });

    const oldNormalizedFixtures = await read(fixtureName);
    const newRawFixtures = await recordScenario({
      request: request,
      scenario: require(`../scenarios/${fixtureName}/record`)
    });

    const scenarioState = {
      commitSha: {}, // map original commit sha hashes to normalized commit hashes
      ids: {}
    };

    const newNormalizedFixtures = await Promise.all(
      newRawFixtures
        .map(cloneDeep)
        .filter(hasntIgnoreHeader)
        .map(normalize.bind(null, scenarioState))
    );

    const fixturesDiffs = diff(newNormalizedFixtures, oldNormalizedFixtures);
    if (!fixturesDiffs) {
      console.log("✅  Fixtures are up-to-date");
      return;
    }

    diffs.push({
      name: fixtureName,
      changes: fixturesDiffs,
      newNormalizedFixtures,
      oldNormalizedFixtures,
      newRawFixtures
    });

    if (fixturesDiffs[0][0] === "-") {
      if (doUpdate) {
        console.log("📼  New fixtures recorded");
        return write(fixtureName, {
          normalized: newNormalizedFixtures,
          raw: newRawFixtures
        });
      }
      console.log(`❌  "${fixtureName}" looks like a new fixture`);
      return;
    }

    if (doUpdate) {
      console.log("📼  Fixture updates recorded");
      return write(fixtureName, {
        normalized: newNormalizedFixtures,
        raw: newRawFixtures
      });
    }

    console.log("❌  Fixtures are not up-to-date");

    console.log(diffString(oldNormalizedFixtures, newNormalizedFixtures));
    console.log(
      `💁  Update fixtures with \`${chalk.bold("bin/record.js --update")}\``
    );
  }, Promise.resolve())

  .then(() => {
    if (diffs.length === 0) {
      console.log("🤖  No fixture changes detected in cron job.");
      return;
    }

    if (doUpdate) {
      return;
    }

    console.log(`${diffs.length} fixtures are out of date. Exit 1`);
    process.exit(1);
  })

  .catch(error => {
    if (!error.response) {
      console.log(error);
      process.exit(1);
    }

    console.log(error.toString());
    console.log("REQUEST");
    console.log(`${error.config.method.toUpperCase()} ${error.config.url}`);
    console.log("RESPONSE HEADERS");
    console.log(JSON.stringify(error.response.headers, null, 2));
    console.log("RESPONSE BODY");
    console.log(JSON.stringify(error.response.data, null, 2));
    process.exit(1);
  });

function hasntIgnoreHeader(fixture) {
  const hasIgnoreHeader = "x-octokit-fixture-ignore" in fixture.reqheaders;
  return !hasIgnoreHeader;
}
