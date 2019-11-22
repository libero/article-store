#!/bin/bash
set -e

function finish() {
  make logs; make stop
}

trap finish EXIT

make start wait-healthy

output=$(curl --silent --show-error --write-out '\n%{http_code}' 'http://localhost:8080/')
body=$(echo "$output" | head --lines=-1)
status=$(echo "$output" | tail --lines=1)

[[ "$status" == 200 ]]
jq --exit-status "$body" /dev/null
