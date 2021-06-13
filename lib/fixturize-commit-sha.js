export default fixturizeCommitSha;

// We keep track of commit sha hashes. We don’t want to simply zerofy them as
// there can be multiple commits. So instead we keep state of a counter and
// pad the counter with 0s left.
function fixturizeCommitSha(map, sha) {
  // Do nothing if the passed sha is already set
  if (map[sha]) {
    return map[sha];
  }

  // Do nothing if the passed sha is one of our fixturized ones
  if (Object.values(map).includes(sha)) {
    return sha;
  }

  // Otherwise calculate the new sha and set it on the passed state map.
  const counter = Object.keys(map).length + 1;
  map[sha] = ("0000000000000000000000000000000000000000" + counter).substr(-40);

  return map[sha];
}
