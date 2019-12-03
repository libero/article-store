#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

make exec tty= command="npx hydra-validator analyse http://localhost:8080/"
