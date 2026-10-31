# Architecture et état initial

## Flux existant

Navigateur (`apps/web`, port 5173) → API Express (`apps/api`, port 3000) → API FastAPI (`services/ml`, port 8080 en local).

L’API Express prépare les coordonnées et relaie les prédictions. FastAPI charge un modèle entraîné localement. Les CSV restent dans le service ML et les scripts sont exécutés depuis ce répertoire.

## Évolutions prévues

Le moteur maritime aura une responsabilité distincte des prédictions : obtenir un trajet navigable, puis échantillonner ce trajet pour l’analyse. Le choix de ses données et de son implémentation reste à faire. PostGIS et le pipeline d’ingestion seront ajoutés après audit des CSV.

## État de validation

La structure et les fichiers de configuration ont été vérifiés. Le code applicatif provient du prototype et n’est pas encore validé par compilation ou exécution. Node.js et npm ne sont pas disponibles dans l’environnement de travail au moment de cette étape. Les configurations Docker existantes restent à adapter au lancement du monorepo.

Le nouveau dépôt racine possède son propre historique. Les historiques archivés des anciens dépôts ont été supprimés explicitement ; aucun dépôt imbriqué ne doit être ajouté.
