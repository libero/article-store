#!/bin/bash
set -e

if [ "$#" -ne 1 ]; then
    echo "Pushes a local container image to Docker Hub"
    echo 
    echo "Usage: $0 PROJECT"
    echo "Example: $0 dummy-api"
    echo "Relies on the following environment variables:"
    echo "- GITHUB_REF"
    echo "- DOCKER_USERNAME, DOCKER_PASSWORD"
    echo "- IMAGE_TAG"
    exit 1
fi

project="$1"

if [[ "$GITHUB_REF" = "refs/head/master" ]]; then
    echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin 

    # tag temporarily as liberoadmin due to lack of `libero/` availability
    docker tag "libero/$project:$IMAGE_TAG" "liberoadmin/$project:$IMAGE_TAG"
    docker push "liberoadmin/$project:$IMAGE_TAG"
    # push `latest` image
    docker tag "libero/$project:$IMAGE_TAG" "liberoadmin/$project:latest"
    docker push "liberoadmin/$project:latest"
else
    echo "not pushing an image, we are not on master"
fi
