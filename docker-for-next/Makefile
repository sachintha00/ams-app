#!/usr/bin/make
SHELL = /bin/sh
UID := $(shell id -u)
GID := $(shell id -g)
export UID
export GID
include .env

up-f:
	docker compose -f docker-compose-dev.yml up --build

up:
	docker compose -f docker-compose-dev.yml up -d --build

down:
	docker compose -f docker-compose-dev.yml down

shell-app:
	docker exec -it $(APP_NAME) /bin/sh

