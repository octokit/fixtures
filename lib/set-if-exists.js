module.exports = setIfExists

function setIfExists (object, key, value) {
  if (key in object) {
    object[key] = value
  }
}
