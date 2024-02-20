SHELL = /bin/bash

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

dev:		## start app in dev mode
	cd web && yarn dev

setup-web:
	cd web && yarn

build-web:
	cd web && yarn build

setup-deploy:
	cd deploy && yarn

setup: setup-web setup-deploy		## install and setup everything for development

cdk-deploy-web:
	cd deploy && yarn cdk deploy GcWebAppStack

deploy: setup build-web cdk-deploy-web		## deploy web app
