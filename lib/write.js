export default write;

import { resolve, dirname } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import * as prettier from "prettier";

async function write(fixturesPath, fixtures) {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "scenarios",
    fixturesPath,
  );

  await mkdir(dirname(path), { recursive: true });
  return Promise.all([
    writeFile(
      resolve(path, "normalized-fixture.json"),
      await prettier.format(JSON.stringify(fixtures.normalized), {
        parser: "json",
      }),
    ),
    writeFile(
      resolve(path, "raw-fixture.json"),
      await prettier.format(JSON.stringify(fixtures.raw), { parser: "json" }),
    ),
  ]);
}
