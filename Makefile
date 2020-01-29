.DEFAULT_GOAL = help
.PHONY: help install gitmodules build start start-db init-db stop wait-healthy sh exec logs watch lint fix test unit-test integration-test run dev prod

SHELL = /usr/bin/env bash

ifneq (${TARGET}, prod)
TARGET = dev
INITDB = initdb:dev
else
INITDB = initdb
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
	$(MAKE) init-db
	${DOCKER_COMPOSE} up --detach

start-db:
	${DOCKER_COMPOSE} up --detach db

init-db:
	$(MAKE) start-db
	${DOCKER_COMPOSE} run --rm app npm run ${INITDB}

stop: ## Stop the containers
	${DOCKER_COMPOSE} down

wait-healthy: ## Wait for the containers to be healthy
	@services=($$(${DOCKER_COMPOSE} ps --quiet)); \
	if [ $${#services[@]} -eq 0 ]; then \
		echo "No containers running"; \
		exit 1; \
	fi; \
	for service in $${services[@]}; do \
		.scripts/docker/wait-healthy.sh "$${service}"; \
	done

sh: ## Open a shell on the app container
	$(MAKE) exec command="sh"

tty = 1
exec: ## Run a command on the app container
	@if [ -z "$(command)" ]; then \
		echo "No command provided"; \
		exit 1; \
	fi;
	${DOCKER_COMPOSE} exec $(if $(tty),,-T) app $(command)

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
test: ## Run all the tests
	$(MAKE) start-db
	${DOCKER_COMPOSE} run --rm app npm run test; exit=$$?; ${DOCKER_COMPOSE} down; exit $$exit

unit-test: export TARGET = dev
unit-test: ## Run the unit tests
	${DOCKER_COMPOSE} run --rm app npm run test:unit

integration-test: export TARGET = dev
integration-test: ## Run the integration tests
	$(MAKE) start-db
	${DOCKER_COMPOSE} run --rm app npm run test:integration; exit=$$?; ${DOCKER_COMPOSE} down; exit $$exit

run:
	$(MAKE) init-db
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app; ${DOCKER_COMPOSE} down

dev: export TARGET = dev
dev: ## Build and runs the container for development
	$(MAKE) --jobs=4 install build stop
	$(MAKE) run

prod: export TARGET = prod
prod: ## Builds and runs the container for production
	$(MAKE) --jobs=2 build stop
	$(MAKE) run
