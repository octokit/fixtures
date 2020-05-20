# fixtures

> Fixtures for all the octokittens

![Test](https://github.com/octokit/fixtures/workflows/Test/badge.svg)

Records requests/responses against the [GitHub REST API](https://developer.github.com/v3/)
and stores them as JSON fixtures.

- [Usage](#usage)
  - [fixtures.mock(scenario)](#fixturesmockscenario)
  - [fixtures.get(scenario)](#fixturesgetscenario)
  - [fixtures.nock](#fixturesnock)
- [How it works](HOW_IT_WORKS.md)
- [Contributing](CONTRIBUTING.md)
- [License](#license)

## Usage

Currently requires node 8+

### fixtures.mock(scenario)

`fixtures.mock(scenario)` will intercept requests using [nock](https://www.npmjs.com/package/nock).
`scenario` is a String in the form `<host name>/<scenario name>`. `host name`
is any folder in [`scenarios/`](scenarios/). `scenario name` is any filename in
the host name folders without the `.js` extension.

```js
const https = require("https");
const fixtures = require("@octokit/fixtures");

fixtures.mock("api.github.com/get-repository");
https
  .request(
    {
      method: "GET",
      hostname: "api.github.com",
      path: "/repos/octokit-fixture-org/hello-world",
      headers: {
        accept: "application/vnd.github.v3+json",
      },
    },
    (response) => {
      console.log("headers:", response.headers);
      response.on("data", (data) => console.log(data.toString()));
      // logs response from fixture
    }
  )
  .end();
```

For tests, you can check if all mocks have been satisfied for a given scenario

```js
const mock = fixtures.mock("api.github.com/get-repository");
// send requests ...
mock.done(); // will throw an error unless all mocked routes have been called
mock.isDone(); // returns true / false
mock.pending(); // returns array of pending mocks in the format [<method> <path>]
```

`mock.explain` can be used to amend an error thrown by nock if a request could
not be matched

```js
const mock = fixtures.mock("api.github.com/get-repository");
const github = new GitHub();
return github.repos
  .get({ owner: "octokit-fixture-org", repo: "hello-world" })
  .catch(mock.explain);
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

### fixtures.get(scenario)

`fixtures.get(scenario)` will return the JSON object which is used by [nock](https://www.npmjs.com/package/nock)
to mock the API routes. You can use that method to convert the JSON to another
format, for example.

### fixtures.nock

`fixtures.nock` is the [nock](https://github.com/node-nock/nock) instance used
internally by `@octokit/fixtures` for the http mocking. Use at your own peril :)

## License

[MIT](LICENSE.md)
