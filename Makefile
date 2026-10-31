.DEFAULT_GOAL := help

PYTHON ?= python3.12
ML_DIR := services/ml
VENV := $(ML_DIR)/.venv
VENV_PYTHON := $(VENV)/bin/python

.PHONY: help prerequisites env install install-js install-python \
	dev-web dev-api dev-ml typecheck test check build

help:
	@echo "make install  : préparer la configuration et installer les dépendances"
	@echo "make dev-web  : démarrer l'interface"
	@echo "make dev-api  : démarrer l'API"
	@echo "make dev-ml   : démarrer le service ML"
	@echo "make check    : vérifier les types et les tests ML"
	@echo "make build    : compiler les applications"

prerequisites:
	@command -v node >/dev/null || { echo "Node.js 22 est requis."; exit 1; }
	@node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major !== 22 || minor < 12) { console.error("Node.js 22.12 ou ultérieur dans la branche 22 est requis."); process.exit(1); }'
	@command -v npm >/dev/null || { echo "npm est requis."; exit 1; }
	@$(PYTHON) -c 'import sys; assert sys.version_info[:2] == (3, 12), "Python 3.12 est requis"'

env:
	@test -f apps/web/.env || cp apps/web/.env.example apps/web/.env
	@test -f apps/api/.env || cp apps/api/.env.example apps/api/.env

install: prerequisites env
	@$(MAKE) install-js
	@$(MAKE) install-python
	@echo "Installation terminée. Renseignez VITE_MAP_STYLE_URL dans apps/web/.env."

install-js:
	npm ci

install-python:
	@test -d "$(VENV)" || $(PYTHON) -m venv "$(VENV)"
	$(VENV_PYTHON) -m pip install -r "$(ML_DIR)/requirements-dev.txt"

dev-web:
	npm run dev:web

dev-api:
	npm run dev:api

dev-ml:
	cd "$(ML_DIR)" && .venv/bin/python -m uvicorn serve_fastapi:app --host 127.0.0.1 --port 8080

typecheck:
	npm run typecheck

test:
	cd "$(ML_DIR)" && .venv/bin/python -m unittest -v test_serve

check: typecheck test

build:
	npm run build