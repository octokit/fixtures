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

## How it works

[![](assets/octokit-fixtures-introduction.png)](https://youtu.be/L851arJSMhM)

`@octokit/fixtures` provides fixtures that can be used by automated tests for
GitHub API clients, either as [standalone mock server](#standalone-mock-server)
or as a [Node module](#as-node-module).

The fixtures are recorded programatically
by sending requests against the [GitHub REST API](https://developer.github.com/v3/)
and recording both requests and responses into JSON files. Each scenario has their own folder in the [scenarios/<host>/ folder](scenarios/)). Each of these folders contains 4 files:

- **`test.js`**  
  an integration test as an example for consumers
- **`record.js`** <a name="record-js-file"></a>  
  exports one of the following

  - [axios request config](https://www.npmjs.com/package/axios#request-config)
  - an array of axios request configs
  - a function that returns a Promise

  To keep requests from being captured as fixture (e.g. to create/delete a
  temporary request), set the request Header `X-Octokit-Fixture-Ignore` to `'true'`.
- **`raw-fixture.json`**  
  The raw request and response before normalization, which is used for integration tests and debugging. Only sensitive credentials are removed
- **`normalized-fixture`** <a name="normalized-fixture-file"></a>    
  The result of the recorded fixtures after normalization.

### Recording

The [record task](#record) [normalizes](#normalization) requests and responses
before storing them in order to remove changing values like time stamps and counts.
Afterwards the new fixtures are compared to the existing ones. If a change occurs,
an error is logged.

### Updating fixtures

The stored fixtures can be updated by running `bin/record.js --update`.

To create a new scenario, follow the steps below which describe the process
for the example to create a new scenario "Get repository" for GitHub’s public
api at https://api.github.com, make sure to adapt it for your own scenario.


1. Create the folder `scenarios/api.github.com/get-repository/`. In that folder,
   create a [`record.js`](#record-js-file) file.

2. Run `bin/record.js`. It should log the following
   ```
   ⏯  api.github.com: Get repository ...
   ❌  This looks like a new fixture
   ```
3. If there are no other changes, you can create the new fixtures by
   running `bin/record.js --update`. Now it should log
   ```
   ⏯  api.github.com: Get repository ...
   📼  New fixtures recorded
   ```
4. Look into the created [`normalized-fixture.json`](#normalized-fixture-file) file
   and make sure all content is normalized correctly (see [Normalizations](#normalizations) below).
   Adapt the file as needed.
5. Run `TAP_GREP="normalize api.github.com/get-repository" ./node_modules/.bin/tap test/integration/normalize-test.js`
   (replace `api.github.com/get-repository` with the folder of your new scenario).
   It will fail and show the changes between your `normalized-fixture.json` file
   and the one that got calculated. Look into the [`lib/normalize` folder](lib/normalize)
   and make the necessary changes. Repeat until the test passes
6. Run `bin/record.js` again, it should result with "Fixtures are up-to-date".
   If not, repeat the previous step until it does
7. Commit all changes with `feat(scenario): get repository`
8. Create a pull request

### Automated pull requests when API change

In order to keep the fixtures up-to-date with GitHub’s and GitHub Enterprise’s
APIs, the record task is run daily utilizing [Travis Cron Jobs](https://docs.travis-ci.com/user/cron-jobs/).
If a change in the fixtures occurs, a pull request is opened (or updated) in
order to notify the maintainers who can then release a new breaking version
of the `@octokit/fixtures` package and notify developers of the update.

### Standalone server

The standalone [http mock server](#standalonemockserver) is [a simple express app](bin/serve.js)
which uses the [http-proxy-middleware package](https://www.npmjs.com/package/http-proxy-middleware)
to proxy requests to the mocked routes based on the existing fixtures.

### Normalizations

- **All IDs are set to 1**
- **Tokens Authorization Header are zerofied**
- **All timestamps are set to the time of the GitHub Universe 2017 keynote**  
  Dates are set in different formats, so here are a few examples
  - UTC in seconds: `2017-10-10T16:00:00Z` (e.g. `updated_at`)
  - UTC with Timezone Delta: `2017-10-10T09:00:00-07:00` (e.g. invitation `created_at`)
  - GMT date string: `Tue, 10 Oct 2017 16:00:00 GMT` (e.g. `Last-Modified` header)
  - UNIX timestamp in seconds: `1507651200000` (e.g. `X-RateLimit-Reset` header)
- **All counts are set to 42**  
  for example: `forks_count`, `open_issues_count`
- **Rate limits**
  - for unauthenticated requests, `X-RateLimit-Remaining` is set to `59`.
  - for authenticated requests, `X-RateLimit-Remaining` is set to `4999`.
- **Random things**  
  Fill random headers like `ETag` or `X-GitHub-Request-Id` and auth tokens with 0s.
- **Content-Length** header is re-calculated after normalization of the response body
- **URLs containing temporary repository names** in response properties, paths
  and location header are renamed,
  e.g. `tmp-scenario-create-file-20170930034241803` is renamed to `create-file`.
- **Commit sha hashes** are zerofied,
  e.g. `3f3f005b29247e51a4f4d6b8ce07b67646cd6074` becomes `0000000000000000000000000000000000000000`

https://github.com/octokit/fixtures/issues/14

## Local development

### Test users / organization / tokens

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

The following access tokens need to be configured as environment variables. You
can create a `.env` file to configure them locally, it is parsed using [dotenv](https://www.npmjs.com/package/dotenv).

<table>
  <thead>
    <tr>
      <th>
        #
      </th>
      <th>
        Environment variable
      </th>
      <th>
        User
      </th>
      <th>
        Description
      </th>
    </tr>
  </thead>
  <tr>
    <th valign=top>
      1
    </th>
    <th valign=top>
      FIXTURES_USER_A_TOKEN_FULL_ACCESS
    </th>
    <td>
      octokit-fixture-user-a
    </td>
    <td valign=top>
      All scopes enabled
    </td>
  </tr>
  <tr>
    <th valign=top>
      2
    </th>
    <th valign=top>
      FIXTURES_USER_B_TOKEN_FULL_ACCESS
    </th>
    <td>
      octokit-fixture-user-b
    </td>
    <td valign=top>
      All scopes enabled
    </td>
  </tr>
</table>

### Record

Run scenarios from `scenarios/**` against the real GitHub APIs and compare
responses to previously recorded fixtures

```
node bin/record
```

If there are changes, you can updated the recorded fixtures

```
node bin/record --update
```

To record selected scenarios, pass their names to the record command.
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

### Releases

Releases are automated using [semantic-release](https://github.com/semantic-release/semantic-release).
The following commit message conventions determine which version is released:

1. `fix: ...` or `fix(scope name): ...` prefix in subject: bumps fix version, e.g. `1.2.3` → `1.2.4`
2. `feat: ...` or `feat(scope name): ...` prefix in subject: bumps feature version, e.g. `1.2.3` → `1.3.0`
3. `BREAKING CHANGE:` in body: bumps breaking version, e.g. `1.2.3` → `2.0.0`

Only one version number is bumped at a time, the highest version change trumps the others.

The server binaries are currently not generated and uploaded automatically. To
generate them run `npx pgk .`, then upload the resulting binaries to the respective
[release](https://github.com/octokit/fixtures/releases). We plan to automate
that process: [#](https://github.com/octokit/fixtures/issues/6) – pull requests welcome 🤗

## License

[MIT](LICENSE.md)
