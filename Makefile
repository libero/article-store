.DEFAULT_GOAL = help
.PHONY: help install gitmodules build start stop wait-healthy sh exec logs watch lint fix test run dev prod

SHELL = /usr/bin/env bash
MAKEFLAGS += --jobs=4

ifneq (${TARGET}, prod)
TARGET = dev
endif

DOCKER_COMPOSE = docker-compose --file .docker/docker-compose.yml --file .docker/docker-compose.${TARGET}.yml

export IMAGE_TAG
export TARGET

help: ## Display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: node_modules gitmodules ## Install dependencies locally

node_modules: package.json package-lock.json
	npm install
	touch node_modules

gitmodules:
	git submodule update --init --recursive

build: ## Build the containers
	${DOCKER_COMPOSE} build

start: ## Start the containers
	${DOCKER_COMPOSE} up --detach

stop: ## Stop the containers
	${DOCKER_COMPOSE} down

wait-healthy: start ## Wait for the containers to be healthy
	services=($$(${DOCKER_COMPOSE} ps --quiet)); \
	if [ $${#services[@]} -eq 0 ]; then \
		echo "No containers running"; \
		exit 1; \
	fi; \
	for service in $${services}; do \
		.scripts/docker/wait-healthy.sh "$${service}"; \
	done

sh: ## Open a shell on the app container
	make exec command="sh"

exec: ## Run a command on the app container
	if [ -z "$(command)" ]; then \
		echo "No command provided"; \
		exit 1; \
	fi; \
	${DOCKER_COMPOSE} exec app $(command)

logs: ## Show the containers' logs
	${DOCKER_COMPOSE} logs

watch: ## Follow the containers' logs
	${DOCKER_COMPOSE} logs --follow

lint: export TARGET = dev
lint: ## Lint the code
	${DOCKER_COMPOSE} run --rm app npm run lint

fix: export TARGET = dev
fix: ## Fix linting issues in the code
	${DOCKER_COMPOSE} run --rm app npm run lint:fix

test: export TARGET = dev
test: ## Run the tests
	${DOCKER_COMPOSE} run --rm app npm run test

run:
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app; ${DOCKER_COMPOSE} down

dev: export TARGET = dev
dev: install build stop ## Build and runs the container for development
	$(MAKE) run

prod: export TARGET = prod
prod: build stop ## Builds and runs the container for production
	$(MAKE) run
