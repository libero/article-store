#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

output=$(curl --silent --show-error --write-out '%{http_code}' 'http://localhost:8080/')
body=${output::${#output}-3}
status=${output: -3}

[[ "$status" == 200 ]]
jq --exit-status "$body" /dev/null
