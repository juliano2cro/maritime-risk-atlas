# Maritime Risk Atlas

Plateforme d’analyse du risque de piraterie maritime combinant données historiques, indicateurs socio-économiques et machine learning.

![Logo](logo_MRA.png)

## Organisation

- `apps/web` : interface React, carte et graphiques.
- `apps/api` : API Express et préparation des points d’analyse.
- `services/ml` : données CSV historiques, entraînement et API FastAPI.
- `docs` : architecture, méthode et feuille de route.
- `infrastructure` : futurs fichiers de déploiement.

## Prérequis

- Node.js 22 (version indiquée dans `.nvmrc`) et npm 10 ou ultérieur.
- Python 3.12 pour le service ML. La compatibilité avec Python 3.14 n’est pas garantie par les dépendances actuelles.

## Installation et lancement local

Depuis la racine :

```sh
npm ci
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Renseigner `VITE_MAP_STYLE_URL` dans `apps/web/.env` avec le style de votre fournisseur cartographique. Les variables `VITE_` sont visibles dans le navigateur. Sans style, l’application affiche un message de configuration ; aucune clé n’est fournie dans le dépôt.

Dans deux terminaux :

```sh
npm run dev:api
```

```sh
npm run dev:web
```

Interface : `http://localhost:5173`. API : `http://localhost:3000/health`.

Pour le service ML, dans un troisième terminal :

```sh
cd services/ml
python3.12 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn serve_fastapi:app --host 127.0.0.1 --port 8080
```

Le service démarre sans modèle : `/health` répond avec `model_loaded: false`, `/ready`, `/predict` et `/explain` signalent leur indisponibilité avec HTTP 503. L’interface et l’API restent utilisables pour préparer un tracé ; aucune prédiction n’est fabriquée. Un modèle absent n’est pas interprété comme un risque nul.

Le modèle historique n’est pas fourni. `python train.py`, depuis `services/ml`, peut le produire, mais cet entraînement est coûteux et sa méthode reste à revoir. Ne pas le lancer pour simplement démarrer l’application. `MODEL_PATH` permet de choisir un modèle local de confiance ; ne pas charger d’artefact d’origine inconnue.

## Vérifications

Depuis la racine :

```sh
npm run typecheck
npm run build
```

Depuis `services/ml`, dans l’environnement Python :

```sh
pip install -r requirements-dev.txt
python -m unittest -v test_serve
```

Les tests créent un petit modèle temporaire pour vérifier le contrat de prédiction et d’explication ; ce n’est pas un modèle produit. Voir `docs/STEP-02.md` pour les vérifications et limites de cette étape.

Les configurations Docker héritées ne constituent pas encore un lancement validé du monorepo ; Docker Compose et le déploiement seront traités séparément.

## Limites actuelles

L’interface conserve encore le comportement du prototype : segments directs entre points, sans évitement des terres. Le modèle estime une catégorie d’issue parmi les incidents historiques, pas la probabilité d’une attaque pendant un voyage. Voir `docs/ROADMAP.md` avant toute interprétation des scores.

## Origine

Ce projet prolonge le prototype collectif OnePirate. Les contributions à la refonte seront documentées séparément. Le monorepo démarre avec un nouvel historique Git ; les anciens historiques ont été supprimés à la demande du propriétaire.

## Conventions

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles de structure et [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) pour les responsabilités des composants.
