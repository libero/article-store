#!/bin/bash
set -e

function finish() {
  make logs stop
}

trap finish EXIT

make start wait-healthy

ping=$(curl -sS 'http://localhost:8080/' 2>&1)
[[ $ping == 'OK' ]]
