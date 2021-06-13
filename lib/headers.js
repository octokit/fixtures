export default { toObject: rawHeadersToObject, toArray: objectToRawHeaders };

function rawHeadersToObject(rawHeaders) {
  const keys = [];
  const map = {};
  for (let i = 0; i < rawHeaders.length; i = i + 2) {
    const key = rawHeaders[i].toLowerCase();
    keys.push(key);
    map[key] = rawHeaders[i + 1];
  }
  return keys.sort().reduce((headers, key) => {
    headers[key] = map[key];
    return headers;
  }, {});
}

function objectToRawHeaders(map) {
  const keys = Object.keys(map).sort();
  return [].concat(...keys.map((key) => [key, map[key]]));
}
