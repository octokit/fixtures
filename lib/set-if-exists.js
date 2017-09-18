module.exports = setIfExists

function setIfExists (object, key, value) {
  if (!object) {
    return
  }

  if (key in object) {
    object[key] = typeof value === 'function' ? value(object[key]) : value
  }
}
