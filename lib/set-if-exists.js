module.exports = setIfExists

const get = require('lodash/get')
const set = require('lodash/set')

function setIfExists (object, key, value) {
  if (!object) {
    return
  }

  const currentValue = get(object, key)

  if (currentValue === undefined) {
    return
  }

  const newValue = typeof value === 'function' ? value(currentValue) : value

  set(object, key, newValue)
}
