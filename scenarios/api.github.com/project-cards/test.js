const axios = require('axios')
const {test} = require('tap')

const fixtures = require('../../..')

test('Labels', async (t) => {
  const mock = fixtures.mock('api.github.com/project-cards')

  // https://developer.github.com/v3/projects/cards/#create-a-project-card
  await axios({
    method: 'post',
    url: 'https://api.github.com/projects/columns/1000/cards',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      note: 'Example card 1'
    }
  })
  await axios({
    method: 'post',
    url: 'https://api.github.com/projects/columns/1000/cards',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      note: 'Example card 2'
    }
  })

  // https://developer.github.com/v3/projects/cards/#list-project-cards
  await axios({
    method: 'get',
    url: 'https://api.github.com/projects/columns/1000/cards',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  // https://developer.github.com/v3/projects/cards/#get-a-project-card
  await axios({
    method: 'get',
    url: 'https://api.github.com/projects/columns/cards/1000',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  // https://developer.github.com/v3/projects/cards/#update-a-project-card
  await axios({
    method: 'patch',
    url: 'https://api.github.com/projects/columns/cards/1000',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      note: 'Example card 1 updated'
    }
  })

  // https://developer.github.com/v3/projects/cards/#move-a-project-card
  // move 1st card to 2nd column
  await axios({
    method: 'post',
    url: 'https://api.github.com/projects/columns/cards/1000/moves',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      position: 'top',
      column_id: 1001
    }
  })

  // move 2nd card to bottom of 2nd column
  await axios({
    method: 'post',
    url: 'https://api.github.com/projects/columns/cards/1001/moves',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      position: 'bottom',
      column_id: 1001
    }
  })

  // move 1st card below 2nd card
  await axios({
    method: 'post',
    url: 'https://api.github.com/projects/columns/cards/1000/moves',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001',
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      position: `after:1001`
    }
  })

  // https://developer.github.com/v3/projects/cards/#delete-a-project-card
  await axios({
    method: 'delete',
    url: 'https://api.github.com/projects/columns/cards/1000',
    headers: {
      Accept: 'application/vnd.github.inertia-preview+json',
      Authorization: 'token 0000000000000000000000000000000000000001'
    }
  })

  t.doesNotThrow(mock.done.bind(mock), 'satisfies all mocks')
  t.end()
})
