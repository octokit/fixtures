module.exports = calculateBodyLength

function calculateBodyLength (body) {
  if (typeof body === 'string') {
    return String(body.length)
  }

  return String(JSON.stringify(body).length)
}
