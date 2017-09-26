const {test} = require('tap')

const setIfExists = require('../../lib/set-if-exists')

test('setIfExists accepts undefined as object argument', (t) => {
  const result = setIfExists(undefined, 'foo', 'bar')
  t.is(result, undefined)
  t.end()
})
