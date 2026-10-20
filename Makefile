install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

lint-fix:
	npm run lint:fix

.PHONY: install dev build test lint lint-fix
