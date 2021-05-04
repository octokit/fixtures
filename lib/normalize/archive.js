export default normalizeArchive;

import { createGzip } from "zlib";

import intoStream from "into-stream";
import { buffer } from "get-stream";
import { extract as _extract, pack as _pack } from "tar-stream";
import gunzip from "gunzip-maybe";

import { regex } from "../temporary-repository.js";

async function normalizeArchive(scenarioState, response, fixture) {
  fixture.headers["content-disposition"] = fixture.headers[
    "content-disposition"
  ]
    // normalize folder name in file name
    .replace(regex, "$1")
    // zerofy sha
    .replace(/archive-\w{7}/, "archive-0000000");

  const extract = _extract();
  const pack = _pack();
  const readStream = intoStream(Buffer.from(response, "hex"));

  // The response is the Repository folder with the README.md file inside. The
  // folder name is always different, based on the repository name when recorded.
  // That's why we have to untar/zip the response, change the folder name and
  // retar/zip it again.

  extract.on("entry", function (header, stream, callback) {
    header.name = header.name
      // normalize folder name in path
      .replace(regex, "$1")
      // zerofy sha in path
      .replace(/-(\w){7}\//, "-0000000/");

    // normalize mtime
    header.mtime = {
      getTime: () => 1507651200000,
    };

    // write the new entry to the pack stream
    stream.pipe(pack.entry(header, callback));
  });

  extract.on("finish", function () {
    // all entries done - lets finalize it
    pack.finalize();
  });

  // pipe the old tarball to the extractor
  readStream.pipe(gunzip()).pipe(extract);

  // pipe the new tarball the another stream
  const writeStream = pack.pipe(createGzip());

  const result = await buffer(writeStream).catch(console.log);
  fixture.response = result.toString("hex");

  // normalize across operating systems / extra flags
  // see http://www.zlib.org/rfc-gzip.html#header-trailer
  const normalizedHeader = "1f8b0800000000000003";
  fixture.response =
    normalizedHeader + fixture.response.substr(normalizedHeader.length);
}
