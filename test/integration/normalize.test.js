import { globSync } from "glob";
import { readFileSync } from "fs";

import normalize from "../../lib/normalize/index.js";

globSync("scenarios/**/raw-fixture.json")
  .map((path) => path.replace(/(^scenarios\/|\/raw-fixture.json$)/g, ""))
  .forEach((fixturnName) => {
    test(`normalize ${fixturnName}`, async () => {
      const raw = JSON.parse(
        readFileSync(`./scenarios/${fixturnName}/raw-fixture.json`)
      );
      const expected = JSON.parse(
        readFileSync(`./scenarios/${fixturnName}/normalized-fixture.json`)
      );

      const scenarioState = {
        commitSha: {},
        ids: {},
      };
      const actual = [];
      for (let item of raw.filter(isntIgnored)) {
        let result = await normalize.bind(null, scenarioState)(item);
        actual.push(result);
      }
      expect(actual).toEqual(expected);
    });
  });

function isntIgnored(fixture) {
  return !fixture.reqheaders["x-octokit-fixture-ignore"];
}
