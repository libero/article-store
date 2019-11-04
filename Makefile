.DEFAULT_GOAL = help

SHELL = /usr/bin/env bash
REAL_ENV = $$(if [[ $${ENV} = "prod" ]]; then echo "prod"; else echo "dev"; fi)
DOCKER_COMPOSE := docker-compose $$(if [[ ${REAL_ENV} = "prod" ]]; then echo "--file docker-compose.yml"; fi)

help: ## Display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies locally
	npm install

build: ## Build the containers
	${DOCKER_COMPOSE} build

start: ## Start the containers
	${DOCKER_COMPOSE} up --detach

stop: ## Stop the containers
	${DOCKER_COMPOSE} down

run: ## Build and runs the containers
	ENV=${REAL_ENV} make --jobs=2 build stop
	${DOCKER_COMPOSE} up --abort-on-container-exit --exit-code-from app; ${DOCKER_COMPOSE} down --volumes

dev: ## Build and runs the container for development
	ENV=dev make run

prod: ## Builds and runs the container for production
	ENV=prod make run
