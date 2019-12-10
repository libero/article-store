#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

docker run --rm --init --network host --mount "type=bind,source=$(pwd)/test/hypertest/,destination=/tests" hydrofoil/hypertest:latest --baseUri http://localhost:8080/
