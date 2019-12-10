#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

docker run --rm --network host --mount "type=bind,source=$(pwd)/test/hypertest/,destination=/tests" hydrofoil/hypertest:_0.3.2 --baseUri http://localhost:8080/
