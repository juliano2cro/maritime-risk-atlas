# Architecture et état initial

## Flux existant

Navigateur (`apps/web`, port 5173) → API Express (`apps/api`, port 3000) → API FastAPI (`services/ml`, port 8080 en local).

L’API Express prépare les coordonnées et relaie les prédictions. FastAPI charge un modèle entraîné localement. Les CSV restent dans le service ML et les scripts sont exécutés depuis ce répertoire.

## Évolutions prévues

Le moteur maritime aura une responsabilité distincte des prédictions : obtenir un trajet navigable, puis échantillonner ce trajet pour l’analyse. Le choix de ses données et de son implémentation reste à faire. PostGIS et le pipeline d’ingestion seront ajoutés après audit des CSV.

## État de validation

Node.js 22 et Python 3.12 sont les environnements de référence pour le lancement local. Les adresses de l’interface et du service ML sont configurables via les exemples `.env`. Le verrou npm racine remplace les anciens verrous imbriqués.

Le service ML démarre sans modèle et distingue disponibilité du processus (`/health`) et du modèle (`/ready`). Son contrat SHAP expose un scalaire `expected_value` et une liste de contributions alignée sur `feature_names`. Les modèles incompatibles avec TreeExplainer peuvent prédire, mais l’explication retourne HTTP 503.

Voir `STEP-02.md` pour les résultats de vérification. Les configurations Docker héritées restent à adapter et à valider.

Le monorepo possède un historique Git unique, sans les historiques des anciens dépôts.
