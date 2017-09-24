const {test} = require('tap')

const normalizeRepository = require('../../lib/normalize/repository')

const organizationRepositoryResponse = require('../fixtures/get-organization-repository.json').response
const userRepositoryResponse = require('../fixtures/get-user-repository.json').response
const getTemporaryRepositoryResponse = require('../fixtures/get-temporary-repository.json').response

test('normalize organization repository', (t) => {
  const response = Object.assign({}, organizationRepositoryResponse)
  normalizeRepository(response)

  t.is(response.id, 1, 'sets id to 1')
  t.is(response.owner.id, 1, 'sets owner.id to 1')
  t.end()
})

test('normalize user repository', (t) => {
  const response = Object.assign({}, userRepositoryResponse)
  normalizeRepository(response)

  t.is(response.owner.id, 1, 'sets owner.id to 1')
  t.end()
})

test('normalize temporary repository', (t) => {
  const response = Object.assign({}, getTemporaryRepositoryResponse)
  normalizeRepository(response)

  t.is(response.name, 'bar')
  t.is(response.full_name, 'octokit-fixture-org/bar')
  t.is(response.html_url, 'https://github.com/octokit-fixture-org/bar')
  t.is(response.url, 'https://api.github.com/repos/octokit-fixture-org/bar')
  t.is(response.forks_url, 'https://api.github.com/repos/octokit-fixture-org/bar/forks')
  t.is(response.keys_url, 'https://api.github.com/repos/octokit-fixture-org/bar/keys{/key_id}')
  t.is(response.collaborators_url, 'https://api.github.com/repos/octokit-fixture-org/bar/collaborators{/collaborator}')
  t.is(response.teams_url, 'https://api.github.com/repos/octokit-fixture-org/bar/teams')
  t.is(response.hooks_url, 'https://api.github.com/repos/octokit-fixture-org/bar/hooks')
  t.is(response.issue_events_url, 'https://api.github.com/repos/octokit-fixture-org/bar/issues/events{/number}')
  t.is(response.events_url, 'https://api.github.com/repos/octokit-fixture-org/bar/events')
  t.is(response.assignees_url, 'https://api.github.com/repos/octokit-fixture-org/bar/assignees{/user}')
  t.is(response.branches_url, 'https://api.github.com/repos/octokit-fixture-org/bar/branches{/branch}')
  t.is(response.tags_url, 'https://api.github.com/repos/octokit-fixture-org/bar/tags')
  t.is(response.blobs_url, 'https://api.github.com/repos/octokit-fixture-org/bar/git/blobs{/sha}')
  t.is(response.git_tags_url, 'https://api.github.com/repos/octokit-fixture-org/bar/git/tags{/sha}')
  t.is(response.git_refs_url, 'https://api.github.com/repos/octokit-fixture-org/bar/git/refs{/sha}')
  t.is(response.trees_url, 'https://api.github.com/repos/octokit-fixture-org/bar/git/trees{/sha}')
  t.is(response.statuses_url, 'https://api.github.com/repos/octokit-fixture-org/bar/statuses/{sha}')
  t.is(response.languages_url, 'https://api.github.com/repos/octokit-fixture-org/bar/languages')
  t.is(response.stargazers_url, 'https://api.github.com/repos/octokit-fixture-org/bar/stargazers')
  t.is(response.contributors_url, 'https://api.github.com/repos/octokit-fixture-org/bar/contributors')
  t.is(response.subscribers_url, 'https://api.github.com/repos/octokit-fixture-org/bar/subscribers')
  t.is(response.subscription_url, 'https://api.github.com/repos/octokit-fixture-org/bar/subscription')
  t.is(response.commits_url, 'https://api.github.com/repos/octokit-fixture-org/bar/commits{/sha}')
  t.is(response.git_commits_url, 'https://api.github.com/repos/octokit-fixture-org/bar/git/commits{/sha}')
  t.is(response.comments_url, 'https://api.github.com/repos/octokit-fixture-org/bar/comments{/number}')
  t.is(response.issue_comment_url, 'https://api.github.com/repos/octokit-fixture-org/bar/issues/comments{/number}')
  t.is(response.contents_url, 'https://api.github.com/repos/octokit-fixture-org/bar/contents/{+path}')
  t.is(response.compare_url, 'https://api.github.com/repos/octokit-fixture-org/bar/compare/{base}...{head}')
  t.is(response.merges_url, 'https://api.github.com/repos/octokit-fixture-org/bar/merges')
  t.is(response.archive_url, 'https://api.github.com/repos/octokit-fixture-org/bar/{archive_format}{/ref}')
  t.is(response.downloads_url, 'https://api.github.com/repos/octokit-fixture-org/bar/downloads')
  t.is(response.issues_url, 'https://api.github.com/repos/octokit-fixture-org/bar/issues{/number}')
  t.is(response.pulls_url, 'https://api.github.com/repos/octokit-fixture-org/bar/pulls{/number}')
  t.is(response.milestones_url, 'https://api.github.com/repos/octokit-fixture-org/bar/milestones{/number}')
  t.is(response.notifications_url, 'https://api.github.com/repos/octokit-fixture-org/bar/notifications{?since,all,participating}')
  t.is(response.labels_url, 'https://api.github.com/repos/octokit-fixture-org/bar/labels{/name}')
  t.is(response.releases_url, 'https://api.github.com/repos/octokit-fixture-org/bar/releases{/id}')
  t.is(response.deployments_url, 'https://api.github.com/repos/octokit-fixture-org/bar/deployments')
  t.is(response.git_url, 'git://github.com/octokit-fixture-org/bar.git')
  t.is(response.ssh_url, 'git@github.com:octokit-fixture-org/bar.git')
  t.is(response.clone_url, 'https://github.com/octokit-fixture-org/bar.git')
  t.is(response.svn_url, 'https://github.com/octokit-fixture-org/bar')

  t.end()
})
