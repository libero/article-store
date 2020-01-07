#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy
make initdb

docker run --rm --init --network host --mount "type=bind,source=$(pwd)/test/hypertest/,destination=/tests" hydrofoil/hypertest:_0.4.0 --baseUri http://localhost:8080/
