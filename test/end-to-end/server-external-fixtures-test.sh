#!/usr/bin/env bash

npm link .
octokit-fixtures-server --fixtures $(pwd)/scenarios/api.github.com/get-organization/normalized-fixture.json &
serverPid=$!

sleep 3

# should succeed since we're loading the get-organization fixture
curl -H'Accept: application/vnd.github.v3+json' http://localhost:3000/orgs/octokit-fixture-org | grep -q '"login":"octokit-fixture-org"'
returnCode1=$? # is 0 if grep could not find string above

# should fail since we're not loading the repo (inverted due to grep -v)
curl -H'Accept: application/vnd.github.v3+json' http://localhost:3000/repos/octokit-fixture-org/hello-world | grep -v -q '"full_name":"octokit-fixture-org/hello-world"'
returnCode2=$? # is 0 if grep could not find string above

# stop the server
kill $serverPid

# exit non-zero if any return codes are non-zero
! (( $returnCode1 || $returnCode2 ))
