.DEFAULT_GOAL = help
.PHONY = help install build start stop wait-healthy logs watch run dev prod

SHELL = /usr/bin/env bash
REAL_TARGET = $$(if [[ $${TARGET} = "prod" ]]; then echo "prod"; else echo "dev"; fi)
DOCKER_COMPOSE := docker-compose --file .docker/docker-compose.yml --file .docker/docker-compose.${REAL_TARGET}.yml

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
	for service in $$(${DOCKER_COMPOSE} ps --quiet); do \
		.scripts/docker/wait-healthy.sh "$${service}"; \
	done

logs: ## Show the containers' logs
	${DOCKER_COMPOSE} logs

watch: ## Follow the containers' logs
	${DOCKER_COMPOSE} logs --follow

run: ## Build and runs the containers
	TARGET=${REAL_TARGET} make --jobs=2 build stop
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app; ${DOCKER_COMPOSE} down --volumes

dev: ## Build and runs the container for development
	TARGET=dev make run

prod: ## Builds and runs the container for production
	TARGET=prod make run
