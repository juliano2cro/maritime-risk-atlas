# Étape 2 — Mise en fonctionnement local

## Changements

- Node.js 22 comme référence et installation via un verrou npm racine unique.
- Variables locales pour l’URL de l’API, le style de carte, le port API, l’origine web et le service ML.
- Client HTTP commun et correction des types GeoJSON et SHAP.
- Démarrage FastAPI sans modèle : processus disponible, prédictions indisponibles (503).
- Contrat SHAP normalisé et dépendances MLflow/SHAP explicitement fixées.
- Une erreur de prédiction n’abaisse plus artificiellement la moyenne du trajet.
- Documentation du lancement, des tests et des limites.

## Vérifications effectuées

Le 31 octobre 2026, avec Node.js 22.23.4, npm 10.9.9 et Python 3.12.16 :

- `npm ci --no-audit --no-fund` : installation réussie depuis le verrou racine.
- `npm run typecheck` : réussi pour les deux workspaces.
- `npm run build` : réussi pour l’interface et l’API.
- `python -m unittest -v test_serve` : deux tests réussis, couvrant absence de modèle, validation des coordonnées, chargement, prédiction et cohérence SHAP sur un modèle temporaire.
- Démarrage simultané des trois services sur des ports de test : réussi.
- Pages `/`, `/map`, `/explain?lat=0&lng=0` : HTTP 200 en rendu serveur.
- `/map/send-coords` : points intermédiaires renvoyés.
- `/map/predict-risk` sans modèle : HTTP 503, aucun score de sécurité fabriqué.
- `git diff --check` : réussi.

## Limites

Le runtime Node et l’environnement Python utilisés pour les vérifications sont temporaires ; ils ne constituent pas une installation système. Les instructions du README permettent de recréer ces environnements.

La carte avec un fournisseur réel n’a pas été vérifiée visuellement dans un navigateur : son URL reste à renseigner localement. Le build signale un bundle cartographique volumineux et des avertissements de migration React Router ; ils ne bloquent pas la compilation.

Le service de modèle est fonctionnel sans modèle, et son contrat est testé avec une fixture. Aucun entraînement du modèle historique ni validation scientifique n’a été effectué à cette étape. Les dépendances Python transitives ne sont pas encore toutes verrouillées. Des avertissements de dépréciation de dépendances Python restent présents.

Docker n’a pas pu être testé : son daemon n’est pas disponible. Les Dockerfiles hérités restent à adapter ; ne pas les considérer comme un déploiement validé.

Les itinéraires restent ceux du prototype. Les ports et l’évitement des terres seront traités aux étapes dédiées. L’audit des CSV n’a pas commencé.
