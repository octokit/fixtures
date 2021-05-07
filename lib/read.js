export default read;

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

function read(fixturesPath) {
  const path = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "scenarios",
    fixturesPath,
    "normalized-fixture.json"
  );
  try {
    return require(path);
  } catch (error) {
    return [];
  }
}
