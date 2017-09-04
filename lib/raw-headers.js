module.exports = {
  get: getRawHeader,
  set: setRawHeader,
  toObject: rawHeadersToObject,
  toArray: objectToRawHeaders
}

function setRawHeader (rawHeaders, key, value) {
  const index = rawHeaders.map(toLowerCaseHeader).indexOf(key.toLowerCase())
  if (index === -1) {
    return
  }

  rawHeaders[index + 1] = value
}

function getRawHeader (rawHeaders, key) {
  const index = rawHeaders.map(toLowerCaseHeader).indexOf(key.toLowerCase())
  if (index === -1) {
    return
  }

  return rawHeaders[index + 1]
}

function rawHeadersToObject (rawHeaders) {
  const keys = []
  const values = []
  for (let i = 0; i < rawHeaders.length; i = i + 2) {
    keys.push(rawHeaders[i])
    values.push(rawHeaders[i + 1])
  }

  return keys.sort().reduce((object, key, i) => {
    object[key] = values[i]
    return object
  }, {})
}

function objectToRawHeaders (object) {
  const keys = Object.keys(object).sort()

  return keys.reduce((rawHeaders, key) => {
    return rawHeaders.concat(key, object[key])
  }, [])
}

function toLowerCaseHeader (string, index) {
  // we don’t care about header values, so we skip them
  return index % 2 ? '' : string.toLowerCase()
}
