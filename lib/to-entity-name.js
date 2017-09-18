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
}
