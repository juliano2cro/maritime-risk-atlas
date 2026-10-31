# Feuille de route

## 1 — Fondations

- [x] Regrouper interface, API et service ML dans une structure commune.
- [x] Supprimer les anciens historiques et démarrer un historique unique.
- [ ] Installer les dépendances et produire un verrou npm commun.
- [ ] Corriger les erreurs de compilation existantes, notamment les types SHAP.
- [ ] Centraliser la configuration et ajouter CI et Docker Compose.

## 2 — Navigation maritime

- [ ] Auditer les dix ports existants : coordonnées d’affichage, accès navigables et sources.
- [ ] Afficher les ports cliquables et une recherche départ/arrivée.
- [ ] Choisir et documenter une source de réseau maritime et de géométrie terrestre, licences incluses.
- [ ] Calculer un chemin sur un graphe maritime avec distances géodésiques.
- [ ] Valider chaque segment contre les terres ; gérer détroits, canaux et antiméridien.
- [ ] Refuser les points terrestres et signaler les trajets introuvables.
- [ ] Afficher kilomètres et milles nautiques.
- [ ] Séparer géométrie du trajet et échantillonnage pour l’analyse.
- [ ] Tester les détours autour des terres, les passages étroits et les ports inaccessibles.

Ne pas présenter une ligne directe comme un itinéraire navigable. Une carte à faible résolution ne permet pas de garantir tous les passages côtiers. Cette application est un outil d’analyse, pas un système de navigation opérationnelle.

## 3 — Données et modèles

- [ ] Auditer les CSV et documenter catégories, valeurs manquantes et licences.
- [ ] Corriger la cible : la catégorie Boarded est actuellement omise des abordages.
- [ ] Charger les incidents et indicateurs pays dans PostGIS via un pipeline reproductible.
- [ ] Définir une tâche ML et une référence, comparer les variables par validation temporelle.
- [ ] Réserver le test final ; versionner données, transformations et modèle.
- [ ] Ne pas assimiler absence de résultat à risque nul.

## 4 — Livraison

- [ ] Déployer une démonstration avec logs, sauvegardes et retour arrière.
- [ ] Documenter résultats mesurés, limites et contributions personnelles.
