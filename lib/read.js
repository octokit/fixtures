export default read;

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

async function read(fixturesPath) {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "scenarios",
    fixturesPath,
    "normalized-fixture.json",
  );
  try {
    const json = await readFile(path);
    return JSON.parse(json);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    return [];
  }
}
