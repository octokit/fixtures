# octokit-fixtures

> Fixtures for all the octokittens

[![Build Status](https://travis-ci.org/gr2m/octokit-fixtures.svg?branch=master)](https://travis-ci.org/gr2m/octokit-fixtures)
[![Coverage Status](https://coveralls.io/repos/gr2m/octokit-fixtures/badge.svg?branch=master)](https://coveralls.io/github/gr2m/octokit-fixtures?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/gr2m/octokit-fixtures.svg)](https://greenkeeper.io/)

Records requests/responses against the [GitHub REST API](https://developer.github.com/v3/)
and stores them as JSON fixtures for usage as a standalone [http mock server](#standalonemockserver)
or as a [Node module](#asnodemodule).

- [Usage](#usage)
  * [Standalone mock server](#standalone-mock-server)
  * [As node module](#as-node-module)
    + [fixtures.mock(scenario)](#fixturesmockscenario)
    + [fixtures.get(scenario)](#fixturesgetscenario)
- [How it works](#how-it-works)
  * [Recording](#recording)
  * [Updating fixtures](#updating-fixtures)
  * [Automated pull requests when API change](#automated-pull-requests-when-api-change)
  * [Standalone server](#standalone-server)
  * [Normalizations](#normalizations)
- [Local development](#local-development)
  * [Record](#record)
  * [Server](#server)
  * [Tests](#tests)
  * [Coverage](#coverage)
- [License](#license)

## Usage

### Standalone mock server

Download binary for your os from the [latest release](https://github.com/gr2m/octokit-fixtures/releases/latest).

Alternatively, you can also install `octokit-fixtures` as a global npm package, if you prefer that:

```
# npm install --global octokit-fixtures
octokit-fixtures-server
```

It currently loads all mocks from [`/fixtures/api.github.com`](fixtures/api.github.com/). Once started,
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
const fixtures = require('octokit-fixtures')

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
```

#### fixtures.get(scenario)

`fixtures.get(scenario)` will return the JSON object which is used by [nock](https://www.npmjs.com/package/nock)
to mock the API routes. You can use that method to convert the JSON to another
format, for example.

## How it works

`octokit-fixtures` provides fixtures that can be used by automated tests for
GitHub API clients, either as [standalone mock server](#standalonemockserver)
or as a [Node module](#asnodemodule).

The fixtures are recorded programatically (see [scenarios/ folder](scenarios/))
by sending requests against the [GitHub REST API](https://developer.github.com/v3/)
and recording both requests and responses into JSON files (see [fixtures/ folder](fixtures/)).

### Recording

The [record task](#record) [normalizes](#normalization) requests and responses
before storing them in order to remove changing values like time stamps and counts.
Afterwards the new fixtures are compared to the existing ones. If a change occurs,
an error is logged.

### Updating fixtures

The stored fixtures can be updated by running `bin/record.js --update`.

To create a new scenario

1. create a new file in the [scenarios folder](scenarios/) that matches the host
   name you send requests to. A scenario is a `*.js` which can export
   - [axios request config](https://www.npmjs.com/package/axios#request-config)
   - an array of axios request configs
   - a function that returns a Promise
2. Run `bin/record.js`. It should log something like
   ```
   ⏯  api.github.com: Get root ...
   ❌  This looks like a new fixture
   ```
3. If there are no other changes, you can create the new fixtures by
   running `bin/record.js --update`. Now it should log something like
   ```
   ⏯  api.github.com: Get root ...
   📼  New fixtures recorded
   ```
4. Running `bin/record.js` again will show that all fixtures are up-to-date now.

### Automated pull requests when API change

In order to keep the fixtures up-to-date with GitHub’s and GitHub Enterprise’s
APIs, the record task is run daily utilizing [Travis Cron Jobs](https://docs.travis-ci.com/user/cron-jobs/).
If a change in the fixtures occurs, a pull request is opened (or updated) in
order to notify the maintainers who can then release a new breaking version
of the `octokit-fixtures` and notify developers of the update.

### Standalone server

The standalone [http mock server](#standalonemockserver) is [a simple express app](bin/serve.js)
which uses the [http-proxy-middleware package](https://www.npmjs.com/package/http-proxy-middleware)
to proxy requests to the mocked routes based on the existing fixtures.

### Normalizations

- **All timestamps are set to the time of the GitHub Universe 2017 keynote**  
  Dates are set in different formats, so here are a few examples
  - UTC in seconds: **2017-10-10T16:00:00Z** (e.g. `updated_at`)
  - GMT date string: **Tue, 10 Oct 2017 16:00:00 GMT** (e.g. `Last-Modified` header)
  - UNIX timestamp in seconds: **1507651200000** (e.g. `X-RateLimit-Reset` header)
- **All counts are set to 42**  
  for example: `forks_count`, `open_issues_count`
- **Rate limits**
  - for unauthenticated requests, `X-RateLimit-Remaining` is set to `59`.
  - for authenticated requests, `X-RateLimit-Remaining` is set to `4999`.
- **Random things**  
  Fill random headers like `ETag` or `X-GitHub-Request-Id` and auth tokens with 0s.
- **Content-Length** header is re-calculated after normalization of the response body

## Local development

### Test users / organization

GitHub created test user accounts and an organization for the octokit fixtures:

<table>
  <tr>
    <th valign=top>
      <a href="https://github.com/octokit-fixture-user-a"><img src="https://github.com/octokit-fixture-user-a.png?size=60" alt=""></a>
    </th>
    <td valign=top>
      <a href="https://github.com/octokit-fixture-user-a"><strong>octokit-fixture-user-a</strong> </a>(user)<br>
      Main user, has unlimited private repositories
    </td>
  </tr>
    <tr>
      <th valign=top>
        <a href="https://github.com/octokit-fixture-user-b"><img src="https://github.com/octokit-fixture-user-b.png?size=60" alt=""></a>
      </th>
      <td valign=top>
        <a href="https://github.com/octokit-fixture-user-b"><strong>octokit-fixture-user-b</strong> </a>(user)<br>
        Secondary user, private repositories only
      </td>
    </tr>
      <tr>
        <th valign=top>
          <a href="https://github.com/octokit-fixture-org"><img src="https://github.com/octokit-fixture-org.png?size=60" alt=""></a>
        </th>
        <td valign=top>
          <a href="https://github.com/octokit-fixture-org"><strong>octokit-fixture-org</strong></a> (org)<br>
          Main organization, unlimited private repositories, unlimited seats
        </td>
      </tr>
</table>

### Record

Some scenarios require a user token with full access. [Create one](https://github.com/settings/tokens)
and then set the `FIXTURES_USER_ACCESS_TOKEN` environment variable. You can
create a local `.env` file if you like, it is parsed using [dotenv](https://www.npmjs.com/package/dotenv).

Run scenarios from `scenarios/**` against the real GitHub APIs and compare
responses to previously recorded fixtures

```
node bin/record
```

If there are changes, you can updated the recorded fixtures

```
node bin/record --update
```

To record a selected scenarios, pass their names to the record command.
You can combine that with the `--update` flag.

```
node bin/record api.github.com/get-root api.github.com/get-repository
```

### Server

Start the server with

```
node bin/serve
```

### Tests

Run integration & unit tests with

```
npm test
```

Run the end-to-end test with

```
test/end-to-end/server-test.sh
```

### Coverage

After running tests, a coverage report can be generated that can be browsed locally.

```
npm run coverage
```

## License

[MIT](LICENSE.md)
