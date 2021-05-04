export default write;

import { promisify } from "util";
import { resolve, dirname } from "path";
import { writeFile as _writeFile } from "fs"
const writeFile = promisify(_writeFile);

import prettier from "prettier";
import mkdirp from "mkdirp";

async function write(fixturesPath, fixtures) {
  const path = resolve(__dirname, "..", "scenarios", fixturesPath);

  await mkdirp(dirname(path));
  return Promise.all([
    writeFile(
      resolve(path, "normalized-fixture.json"),
      prettier.format(JSON.stringify(fixtures.normalized), { parser: "json" })
    ),
    writeFile(
      resolve(path, "raw-fixture.json"),
      prettier.format(JSON.stringify(fixtures.raw), { parser: "json" })
    ),
  ]);
}
