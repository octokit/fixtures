# Contributing

* [Requirements & local setup](#requirements--local-setup)
* [Test users / organization / tokens](#test-users--organization--tokens)
* [Record](#record)
* [Tests](#tests)
* [Coverage](#coverage)

Thanks for wanting to contribute to the Octokit Fixtures, your help is more than
welcome. If you have a question about contributing, please open an issue!

A general overview of how Octokit Fixtures work, have a look at [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

Please abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Requirements & local setup

Octokit Fixtures require Node 8 in order to run its tests.

The basic setup is

```
git clone https://github.com/octokit/fixtures.git octokit-fixtures
cd octokit-fixtures
npm install
npm test
```

## Test users / organization / tokens

GitHub created test user accounts and an organization for the octokit fixtures.
In order to run the `bin/record.js` script, you will need to configure the
environment variables listed below. If you need the tokens in order to contribute,
please let us know and we will provide them to you.

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

## Record

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

In case you created temporary repositories that you want to delete all at once:

```
node bin/remove-temporary-repositories
```

## Tests

Run integration & unit tests with

```
npm test
```

## Coverage

After running tests, a coverage report can be generated that can be browsed locally.

```
npm run coverage
```

## Releases

Releases are automated using [semantic-release](https://github.com/semantic-release/semantic-release).
The following commit message conventions determine which version is released:

1. `fix: ...` or `fix(scope name): ...` prefix in subject: bumps fix version, e.g. `1.2.3` → `1.2.4`
2. `feat: ...` or `feat(scope name): ...` prefix in subject: bumps feature version, e.g. `1.2.3` → `1.3.0`
3. `BREAKING CHANGE:` in body: bumps breaking version, e.g. `1.2.3` → `2.0.0`

Only one version number is bumped at a time, the highest version change trumps the others.
