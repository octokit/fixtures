# Recording raw fixtures for testing

Here is an example to record a request to GitHub’s API. It logs the fixture
as JSON to stdout. You can directly copy & paste it into a new fixture for
testing as you need it.

```js
const axios = require('axios')
const nock = require('nock')

nock.recorder.rec({
  output_objects: true,
  dont_print: true,
  enable_reqheaders_recording: true
})

axios({
  method: 'get',
  url: 'https://api.github.com/repos/octokit-fixture-org/hello-world',
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
})

.then(() => {
  const fixtures = nock.recorder.play()
  console.log(JSON.stringify(fixtures, null, 2))
})
```
