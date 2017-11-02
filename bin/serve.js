#!/usr/bin/env node

const pathResolve = require('path').resolve

const express = require('express')
const glob = require('glob')
const nock = require('nock')
const proxy = require('http-proxy-middleware')

const fixturePaths = glob.sync(pathResolve(__dirname, '..', 'scenarios/api.github.com/*/normalized-fixture.json'))

fixturePaths.map(nock.load).forEach((fixtureMocks) => {
  // by default, nock only allows each mocked route to be called once, afterwards
  // it returns a "No match for request" error. mock.persist() works around that
  fixtureMocks.forEach(mock => mock.persist())
})

const app = express()
app.use('/', proxy({
  target: 'https://api.github.com',
  changeOrigin: true,
  loglevel: 'debug',
  onError (error, request, response) {
    response.writeHead(500, {
      'Content-Type': 'application/json; charset=utf-8'
    })

    if (error.message.indexOf('Nock: No match for request') !== 0) {
      return response.end(error.message)
    }

    const errorRequestJson = JSON.parse(error.message.substr('Nock: No match for request '.length))

    response.end(JSON.stringify({
      error: 'Nock: No match for request',
      request: errorRequestJson
    }, null, 2) + '\n')
  }
}))
app.listen(3000)
console.log('🌐  http://localhost:3000')
