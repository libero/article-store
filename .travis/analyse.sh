#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

make docker-compose command="exec -T app npx hydra-validator analyse http://localhost:8080/"
