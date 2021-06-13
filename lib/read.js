export default read;

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

async function read(fixturesPath) {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "scenarios",
    fixturesPath,
    "normalized-fixture.json"
  );
  try {
    const json = await readFile(path);
    return JSON.parse(json);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    return [];
  }
}
