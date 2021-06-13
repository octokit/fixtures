export default calculateBodyLength;

function calculateBodyLength(body) {
  if (typeof body === "string") {
    return body.length;
  }

  return JSON.stringify(body).length;
}
