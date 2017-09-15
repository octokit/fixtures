#!/usr/bin/env bash

npm link .
octokit-fixtures-server &
serverPid=$!

sleep 3

curl -H'Accept: application/vnd.github.v3+json' http://localhost:3000/repos/octokit-fixture-org/hello-world | grep -q '"full_name":"octokit-fixture-org/hello-world"'
returnCode=$? # is 1 if grep could not find string above

kill $serverPid
exit $returnCode
