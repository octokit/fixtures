export default normalizeCommon;

function normalizeCommon(response) {
  if (typeof response !== "object") {
    return;
  }

  traverse({ response }, setNodeId);
}

function traverse(obj, handle) {
  Object.values(obj).forEach((value) => {
    if (!value) {
      return;
    }

    handle(value);

    if (typeof value === "object") {
      return traverse(value, handle);
    }
  });
}

function setNodeId(obj) {
  if (typeof obj !== "object") {
    return;
  }

  if ("node_id" in obj) {
    obj.node_id = "MDA6RW50aXR5MQ==";
  }
}
