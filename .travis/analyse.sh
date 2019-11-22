#!/bin/bash
set -e

function finish() {
  make logs; make stop
}

trap finish EXIT

make start wait-healthy

make exec command="npx hydra-validator analyse http://localhost:8080/"
