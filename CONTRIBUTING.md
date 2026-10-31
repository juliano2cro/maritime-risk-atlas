# Conventions de développement

## Structure

- `apps/web` contient l’interface et appelle l’API ; il n’accède pas directement aux fichiers CSV ou au modèle.
- `apps/api` expose les fonctionnalités produit, valide les entrées et coordonne les services.
- `services/ml` contient l’entraînement et le service de prédiction. Une séparation interne entre préparation, entraînement et service sera faite lors de la refonte ML.
- `docs` conserve les décisions, la méthode et les limites connues.
- `infrastructure` contient les configurations de lancement et de déploiement communes.

Éviter les imports de fichiers source entre applications. Si un contrat partagé devient nécessaire, créer un package dédié avec une responsabilité explicite.

## Changements

Faire des changements petits et cohérents. Décrire le problème, la solution et les vérifications réalisées. Ajouter des tests pour les calculs, contrats et comportements significatifs ; documenter les limites si une vérification est impossible.

Les commandes communes se lancent depuis la racine : `npm run build` et `npm run typecheck`. La configuration des outils de lint et de formatage sera ajoutée à l’étape de mise en fonctionnement.

## Données et sécurité

Ne pas committer les secrets, environnements locaux ou modèles générés. Conserver les données sources sans modification et documenter leurs licences. Les CSV restent provisoirement dans `services/ml` pour préserver les chemins du prototype ; leur organisation sera revue avec le pipeline de données.

Ne jamais assimiler une prédiction absente à un risque nul. Documenter la cible du modèle et ses limites. Les points et segments d’un itinéraire doivent être validés côté serveur avant de présenter le trajet comme maritime.

## Dépendances

Utiliser les workspaces npm depuis la racine. Les anciens verrous dans les applications sont conservés temporairement ; les remplacer par un verrou racine après installation et validation à l’étape 2. Ne pas supprimer les verrous sans produire leur remplacement.
