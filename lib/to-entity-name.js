module.exports = toEntityName

function toEntityName (object) {
  if (object.type === 'Organization') {
    return 'organization'
  }
  if ('forks' in object) {
    return 'repository'
  }
}
