module.exports = notifyAboutFixturesChanges

const querystring = require('querystring')

const axios = require('axios')
const {diff: getDiff, diffString} = require('json-diff')

const env = require('./env')

async function notifyAboutFixturesChanges (diffs) {
  console.log('')
  console.log('🤖  Fixture changes detected in cron job. Creating pull request ...')
  const github = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      common: {
        authorization: `token ${env.FIXTURES_USER_ACCESS_TOKEN}`
      }
    }
  })

  // who am I?
  const {data: {login}} = await github.get('/user')
  console.log(`🤖  Signed in as ${login}. Looking if I already created a pull request`)

  // Do I have a pending pull request?
  const query = querystring.stringify({
    type: 'pr',
    author: login,
    is: 'open',
    repo: env.FIXTURES_REPO
  }, ' ', ':')

  const {data: pullRequestsResult} = await github.get(`/search/issues?q=${query}`)
  const pullRequestNumbers = pullRequestsResult.items.map(pr => pr.number)

  // if there are more than a single pull request, then we have a problem, because
  // I don’t know which one to update. So I’ll ask you for help :)
  if (pullRequestsResult.total_count > 1) {
    console.log('🤖🆘 Oh oh, I don’t know how to handle more than one pull requests. Creating an issue for my human friends')
    const result = await github.post(`/repos/${env.FIXTURES_REPO}/issues`, {
      title: '🤖🆘 Too many PRs',
      body: `Dearest humans,

I’ve run into a problem here. My friend Travis notified that something changed in GitHub’s APIs. I would usually create a new pull request to let you know about it, or update an existing one. But now there more than one: ${pullRequestNumbers.map(number => `#${number}`).join(', ')}

I don’t know how that happened, did I short-circuit again?

You could really help me by closing all pull requests or leave the one open you want me to keep updating.

For the time being, these are the changes I have found:

${diffsToIssueBody(diffs)}

Hope you can fix it (and my circuits) soon 🙏`
    })

    const {data: {html_url: issueUrl}} = result
    console.log(`🤖🙏 issue created: ${issueUrl}`)
    return
  }

  if (pullRequestsResult.total_count === 1) {
    const pullRequest = pullRequestsResult.items[0]
    console.log(`🤖  Existing pull-request found: ${pullRequest.html_url}`)

    const {data} = await github.get(`/repos/${env.FIXTURES_REPO}/pulls/${pullRequest.number}`)
    const branchName = data.head.ref

    await updateFixtures({diffs, github, branchName})

    console.log(`🤖  pull-request updated: ${pullRequest.html_url}`)
    return
  }

  console.log('🤖  No existing pull request found')

  console.log(`🤖  Looking for last commit sha of ${env.FIXTURES_REPO}/git/refs/heads/master`)
  const {data: {object: {sha}}} = await github.get(`/repos/${env.FIXTURES_REPO}/git/refs/heads/master`)

  // const branchName = `cron/fixtures-changes/${new Date().toISOString().substr(0, 10)}`
  const branchName = `cron/fixtures-changes/${new Date().toISOString().substr(0, 10)}`
  console.log(`🤖  Creating new branch: ${branchName} using last sha ${sha}`)
  await github.post(`/repos/${env.FIXTURES_REPO}/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha
  })

  await updateFixtures({diffs, github, branchName})

  console.log(`🤖  Creating pull request`)
  const {data} = await github.post(`/repos/${env.FIXTURES_REPO}/pulls`, {
    title: `🤖🚨  ${diffs.length} changes in existing fixtures detected`,
    head: branchName,
    base: 'master',
    body: `Dearest humans,

My friend Travis asked me to let you know that they found API changes in their daily routine check.`
  })
  console.log(`🤖  Pull request created: ${data.html_url}`)
}

function diffsToIssueBody (diffs) {
  return diffs.map(diff => {
    return `<details>
<summary><strong>${diff.name}</strong></summary>

\`\`\`diff
${diffString(diff.oldFixtures, diff.newFixtures, {color: false}).trim()}
\`\`\`
</details>`
  }).join('\n')
}

function updateFixtures ({diffs, github, branchName}) {
  return diffs.reduce(async (promise, diff) => {
    await promise
    const fileApiPath = `/repos/${env.FIXTURES_REPO}/contents/fixtures/${diff.name}.json?ref=${branchName}`
    const fileContent = Buffer.from(JSON.stringify(diff.newFixtures, null, 2) + '\n').toString('base64')

    if (diff.changes[0][0] === '-') {
      throw new Error(`🤖🆘 Looks like ${diff.name} is a new fixture, but that could not have come from a routine check?`)
    }

    console.log(`🤖  Loading current fixture file for ${diff.name} from ${fileApiPath}`)
    try {
      await github.get(fileApiPath)
    } catch (error) {
      console.log(error.toString())
      console.log(JSON.stringify(error.response.data, null, 2))
    }
    const {data} = await github.get(fileApiPath)

    const existingContent = Buffer.from(data.content, 'base64').toString()
    const diffToRemote = getDiff(diff.newFixtures, JSON.parse(existingContent))

    if (!diffToRemote) {
      return console.log(`🤖  ${diff.name} is up-to-date`)
    }

    console.log(`🤖  Updating fixture file for ${diff.name}`)
    const {data: {content}} = await github.put(fileApiPath, {
      path: `fixtures/${diff.name}.json`,
      content: fileContent,
      branch: branchName,
      sha: data.sha,
      message: `fix(fixture): updated ${diff.name}

BREAKING CHANGE: ${diff.name} has changed

\`\`\`diff
${diffString(diff.oldFixtures, diff.newFixtures, {color: false}).trim()}
\`\`\``
    })

    console.log(`🤖  ${diff.name} updated: ${content.html_url}`)
  }, Promise.resolve())
}
