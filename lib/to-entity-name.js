module.exports = toEntityName

function toEntityName (object, fixture) {
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
  if (/\/statuses\/[0-9a-f]{40}$/.test(object.url)) {
    return 'status'
  }
  if (/\/commits\/[0-9a-f]{40}\/status$/.test(object.url)) {
    return 'combined-status'
  }
  if ('ref' in object) {
    return 'reference'
  }
  if (/\/protection$/.test(object.url)) {
    return 'branch-protection'
  }
  if ('prerelease' in object) {
    return 'release'
  }
  if (/\/releases\/assets\/\d+$/.test(object.url)) {
    return 'release-asset'
  }
  if ('errors' in object) {
    return 'error'
  }
}
