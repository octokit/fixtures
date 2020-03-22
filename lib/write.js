module.exports = write;

const { promisify } = require("util");
const { resolve, dirname } = require("path");
const writeFile = promisify(require("fs").writeFile);

const prettier = require("prettier");
const mkdirp = require("mkdirp");

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
