#!/usr/bin/env node

// run with "DEBUG=axios" to see debug logs
import axiosDebugLog from "axios-debug-log";
axiosDebugLog({
  request: function (debug, config) {
    debug(`${config.method.toUpperCase()} ${config.url}`);
  },
  response: () => {},
  error: () => {},
});

import axios from "axios";
import Bottleneck from "bottleneck";
import chalk from "chalk";
import cloneDeep from "lodash/cloneDeep.js";
import { diff, diffString } from "json-diff";
import { globSync } from "glob";
import humanize from "humanize-string";
import minimist from "minimist";

import normalize from "../lib/normalize/index.js";
import read from "../lib/read.js";
import recordScenario from "../lib/record-scenario.js";
import write from "../lib/write.js";

const argv = minimist(process.argv.slice(2), {
  boolean: ["update", "test-cached"],
});
const doUpdate = argv.update;
const selectedScenarios = argv._;
const hasSelectedScenarios = selectedScenarios.length > 0;

const scenarios = hasSelectedScenarios
  ? selectedScenarios
  : globSync("scenarios/**/record.js");

async function runScenario(scenarioPath, diffs) {
  const fixtureName = scenarioPath.replace(/(^scenarios\/|\/record\.js$)/g, "");
  const [domain, title] = fixtureName.split("/");
  console.log("");
  console.log(
    `⏯️  ${chalk.bold(domain)}: ${humanize(title.replace(".js", ""))} ...`
  );

  const request = axios.create({
    baseURL: `https://${domain}`,
    maxRedirects: 0, // record redirects explicitly
  });

  // throttle writing requests
  // https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 3000,
  });
  request.interceptors.request.use((config) => {
    if (
      !["POST", "PATCH", "PUT", "DELETE"].includes(config.method.toUpperCase())
    ) {
      return config;
    }

    return limiter.schedule(async () => config);
  });

  const oldNormalizedFixtures = await read(fixtureName);
  const newRawFixtures = await recordScenario({
    request: request,
    scenario: (await import(`../scenarios/${fixtureName}/record.js`)).default,
  });

  const scenarioState = {
    commitSha: {}, // map original commit sha hashes to normalized commit hashes
    ids: {},
  };

  const newNormalizedFixtures = [];
  for (const newRawFixture of newRawFixtures) {
    if (hasIgnoreHeader(newRawFixture)) continue;

    const newNormalizedFixture = await normalize(
      scenarioState,
      cloneDeep(newRawFixture)
    );
    newNormalizedFixtures.push(newNormalizedFixture);
  }

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
    newRawFixtures,
  });

  if (fixturesDiffs[0][0] === "-") {
    if (doUpdate) {
      console.log("📼  New fixtures recorded");
      await write(fixtureName, {
        normalized: newNormalizedFixtures,
        raw: newRawFixtures,
      });
      return;
    }
    console.log(`❌  "${fixtureName}" looks like a new fixture`);
    return;
  }

  if (doUpdate) {
    console.log("📼  Fixture updates recorded");
    await write(fixtureName, {
      normalized: newNormalizedFixtures,
      raw: newRawFixtures,
    });
    return;
  }

  console.log("❌  Fixtures are not up-to-date");

  console.log(diffString(oldNormalizedFixtures, newNormalizedFixtures));
  console.log(
    `💁  Update fixtures with \`${chalk.bold("bin/record.js --update")}\``
  );
}

async function main() {
  // run scenarios one by one
  const diffs = [];
  for (const scenarioPath of scenarios) {
    try {
      await runScenario(scenarioPath, diffs);
    } catch (error) {
      console.error(`error while running scenario ${scenarioPath}`);
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
    }
  }

  if (diffs.length === 0) {
    console.log("🤖  No fixture changes detected in cron job.");
    return;
  }

  if (doUpdate) {
    return;
  }

  console.log(`${diffs.length} fixtures are out of date. Exit 1`);
  process.exit(1);
}

main();

function hasIgnoreHeader(fixture) {
  return "x-octokit-fixture-ignore" in fixture.reqheaders;
}
