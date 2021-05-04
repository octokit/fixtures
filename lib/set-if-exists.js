export default setIfExists;

import get from "lodash/get.js";
import set from "lodash/set.js";

function setIfExists(object, key, value) {
  if (!object) {
    return;
  }

  const currentValue = get(object, key);

  if (currentValue === undefined) {
    return;
  }

  const newValue = typeof value === "function" ? value(currentValue) : value;

  set(object, key, newValue);
}
