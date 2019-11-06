#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy
