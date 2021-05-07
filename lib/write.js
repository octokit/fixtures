export default write;

import { resolve, dirname } from "path";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import prettier from "prettier";
import mkdirp from "mkdirp";

async function write(fixturesPath, fixtures) {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "scenarios",
    fixturesPath
  );

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
