#!/usr/bin/env node

const axios = require('axios')

const env = require('../lib/env')
const temporaryRepository = require('../lib/temporary-repository')

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS}`
  }
})

github.get('/orgs/octokit-fixture-org/repos')

.then(result => {
  return Promise.all(result.data
    .map(repository => repository.name)
    .filter(name => temporaryRepository.regex.test(name))
    .map(name => {
      return github.delete(`/repos/octokit-fixture-org/${name}`)

      .then(() => {
        console.log(`✅  ${name} deleted`)
      })
    })
  )
})

.catch(console.log)
