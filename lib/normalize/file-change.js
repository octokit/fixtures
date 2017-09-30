module.exports = normalizeFileChange

const normalizeCommit = require('./commit')
const normalizeContent = require('./content')

function normalizeFileChange (response) {
  normalizeCommit(response.commit)
  normalizeContent(response.content)
}
