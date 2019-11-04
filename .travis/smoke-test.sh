#!/bin/bash
set -e

function finish {
    make logs stop
}

trap finish EXIT

make start

.scripts/docker/wait-healthy.sh "${COMPOSE_PROJECT_NAME:-article-store}_app_1"
