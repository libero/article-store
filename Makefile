.DEFAULT_GOAL = help
.PHONY: help install build start stop wait-healthy sh logs watch run dev prod

SHELL = /usr/bin/env bash

ifneq (${TARGET}, prod)
TARGET = dev
endif

DOCKER_COMPOSE = docker-compose --file .docker/docker-compose.yml --file .docker/docker-compose.${TARGET}.yml

export IMAGE_TAG
export TARGET

help: ## Display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: node_modules ## Install dependencies locally

node_modules: package.json package-lock.json
	npm install
	touch node_modules

build: ## Build the containers
	${DOCKER_COMPOSE} build

start: ## Start the containers
	${DOCKER_COMPOSE} up --detach

stop: ## Stop the containers
	${DOCKER_COMPOSE} down

wait-healthy: ## Wait for the containers to be healthy
	services=($$(${DOCKER_COMPOSE} ps --quiet)); \
	if [ $${#services[@]} -eq 0 ]; then \
		echo "No containers running"; \
		exit 1; \
	fi; \
	for service in $${services}; do \
		.scripts/docker/wait-healthy.sh "$${service}"; \
	done

sh: ## Open a shell on the app container
	${DOCKER_COMPOSE} exec app sh

logs: ## Show the containers' logs
	${DOCKER_COMPOSE} logs

watch: ## Follow the containers' logs
	${DOCKER_COMPOSE} logs --follow

run:
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app; ${DOCKER_COMPOSE} down

dev: export TARGET = dev
dev: ## Build and runs the container for development
	make --jobs=3 install build stop
	make run

prod: export TARGET = prod
prod: ## Builds and runs the container for production
	make --jobs=2 build stop
	make run
