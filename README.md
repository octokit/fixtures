# fixtures

> Fixtures for all the octokittens

[![Build Status](https://travis-ci.org/octokit/fixtures.svg?branch=master)](https://travis-ci.org/octokit/fixtures)
[![Coverage Status](https://coveralls.io/repos/octokit/fixtures/badge.svg?branch=master)](https://coveralls.io/github/octokit/fixtures?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/octokit/fixtures.svg)](https://greenkeeper.io/)

Records requests/responses against the [GitHub REST API](https://developer.github.com/v3/)
and stores them as JSON fixtures for usage as a standalone [http mock server](#standalonemockserver)
or as a [Node module](#asnodemodule).

- [Usage](#usage)
  * [Standalone mock server](#standalone-mock-server)
  * [As node module](#as-node-module)
    + [fixtures.mock(scenario)](#fixturesmockscenario)
    + [fixtures.get(scenario)](#fixturesgetscenario)
- [How it works](HOW_IT_WORKS.md)
- [Contributing](CONTRIBUTING.md)
- [License](#license)

## Usage

### Standalone mock server

Download binary for your os from the [latest release](https://github.com/octokit/fixtures/releases/latest).

Alternatively, you can also install `@octokit/fixtures` as a global npm package, if you prefer that:

```
# npm install --global @octokit/fixtures
octokit-fixtures-server
```

It currently loads all mocks from [`/scenarios/api.github.com/*/normalized-fixture.json`](scenarios/api.github.com/). Once started,
you can send requests

```
curl -H'Accept: application/vnd.github.v3+json' http://localhost:3000/repos/octocat/hello-world
# returns response from fixture
```

### As node module

Currently requires node 8+

#### fixtures.mock(scenario)

`fixtures.mock(scenario)` will intercept requests using [nock](https://www.npmjs.com/package/nock).
`scenario` is a String in the form `<host name>/<scenario name>`. `host name`
is any folder in [`fixtures/`](fixtures/). `scenario name` is any filename in
the host name folders without the `.js` extension.

```js
const https = require('https')
const fixtures = require('@octokit/fixtures')

fixtures.mock('api.github.com/get-repository')
https.request({
  method: 'GET',
  hostname: 'api.github.com',
  path: '/repos/octocat/hello-world',
  headers: {
    accept: 'application/vnd.github.v3+json'
  }
}, (response) => {
  console.log('headers:', response.headers)
  response.on('data', (data) => console.log(data.toString()))
  // logs response from fixture
}).end()
```

For tests, you can check if all mocks have been satisfied for a given scenario

```js
const mock = fixtures.mock('api.github.com/get-repository')
// send requests ...
mock.done() // will throw an error unless all mocked routes have been called
mock.isDone() // returns true / false
mock.pending() // returns array of pending mocks in the format [<method> <path>]
```

`mock.explain` can be used to amend an error thrown by nock if a request could
not be matched

```js
const mock = fixtures.mock('api.github.com/get-repository')
const github = new GitHub()
return github.repos.get({owner: 'octokit-fixture-org', repo: 'hello-world'})
.catch(mock.explain)
```

Now instead of logging

```
Error: Nock: No match for request {
  "method": "get",
  "url": "https://api.github.com/orgs/octokit-fixture-org",
  "headers": {
    "host": "api.github.com",
    "content-length": "0",
    "user-agent": "NodeJS HTTP Client",
    "accept": "application/vnd.github.v3+json"
  }
}
```

The log shows exactly what the difference between the sent request and the next
pending mock is

```diff
 Request did not match mock:
 {
   headers: {
-    accept: "application/vnd.github.v3"
+    accept: "application/vnd.github.v3+json"
   }
 }
```

#### fixtures.get(scenario)

`fixtures.get(scenario)` will return the JSON object which is used by [nock](https://www.npmjs.com/package/nock)
to mock the API routes. You can use that method to convert the JSON to another
format, for example.

## License

[MIT](LICENSE.md)
