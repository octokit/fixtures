module.exports = toEntityName

function toEntityName (object) {
  if (!object) {
    return
  }
  if (object.type === 'Organization') {
    return 'organization'
  }
  if ('forks' in object) {
    return 'repository'
  }
  if ('invitee' in object && 'inviter' in object) {
    return 'invitation'
  }
  if ('number' in object && /\/issues\/\d+$/.test(object.url)) {
    return 'issue'
  }
  if ('color' in object && /\/labels\//.test(object.url)) {
    return 'label'
  }
  if ('content' in object && 'commit' in object) {
    return 'file-change'
  }
}
