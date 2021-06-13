export default fixturizeEntityId;

// In cases when we can’t simply set IDs to 1 because we have to handle multiple
// entities of the same type, this method returns counter-based IDs per type
function fixturizeEntityId(entityIdsMap, entityName, id) {
  if (!entityIdsMap[entityName]) {
    entityIdsMap[entityName] = {};
  }

  const map = entityIdsMap[entityName];

  // Do nothing if the passed id is already set
  if (map[id]) {
    return map[id];
  }

  // Do nothing if passed id is a normalized one
  const check = parseInt(id, 10);
  if (Object.values(map).includes(check)) {
    return check;
  }

  // Otherwise calculate the new id and set it on the passed state map.
  // IDs start at 1000 to differentiate from issue/PR numbers
  const counter = Object.keys(map).length + 1000;
  map[id] = counter;

  // return the new id
  return map[id];
}
