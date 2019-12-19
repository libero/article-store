#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

docker run --rm --network host hydrofoil/hydra-analyser:0.2.0 http://localhost:8080/
