# Règles communes — Sparring Échecs

Le propriétaire a le dernier mot ; le directeur de projet rédige les briefs et contrôle le résultat.
Claude Code fait tout le travail : code, interface, contenu pédagogique, tests et documentation.

## Briefs et missions
- Un brief est identifié (ex. `P1-01`) et peut contenir plusieurs étapes. Les étapes s'enchaînent dans l'ordre ; à la fin
  du brief : rapport, puis arrêt jusqu'au brief suivant.
- Ne rien faire hors du périmètre du brief. Un besoin hors périmètre se signale dans le rapport.

## Git et publication
- Une PR par étape, depuis une branche repartie de `main` à jour ; la branche de session peut être réutilisée.
- Jamais de push direct sur `main` : `main` est protégée par le ruleset « protection-main » (PR obligatoire, contrôle
  `build` obligatoire, suppression et force-push bloqués).
- Chaque pull request vers `main` exécute lint, tests et build, sans déployer.
- Claude Code fusionne ses propres PR **quand tous les contrôles sont verts**. Jamais de fusion sur contrôle rouge, même si
  la cause est connue.
- `main` = production : toute fusion sur `main` publie le site (`.github/workflows/deploy.yml`, job `deploy`).
- Point de retour : tag `v1.0-avant-refonte` (commit `ad76851`).

## Limites des agents cloud
- Pas de push de tag (refusé par l'environnement, HTTP 403).
- Pas de relance de job CI (refusé par GitHub, `403 Resource not accessible by integration`).
- Ces actions reviennent au propriétaire.

## Preuves
- Donner les commandes réellement exécutées et leurs résultats réels.
- Ne jamais déclarer un test qui n'a pas été lancé.
- Marquer « non vérifié » tout ce qui n'a pas été vérifié.

## Données utilisateur
- La progression est dans IndexedDB (base Dexie `sparring-echecs`, `src/db.ts`), dont la table `meta` (clé/valeur).
- Les clés de `meta` sont déclarées dans le registre typé `src/metaKeys.ts`. Un test refuse toute clé non déclarée.
- Aucune modification du schéma Dexie ni des clés de `meta` sans migration testée (`src/db.test.ts`).

## Interdits sans validation
- Réécriture complète, suppression de fonctionnalité, commande destructive.

## Fin de brief
- Mettre à jour `docs/project/STATUS.md`.

## Commandes du projet
Node 22 (version utilisée par le CI).

| Étape | Commande |
|---|---|
| Installation (selon le lockfile) | `npm ci` |
| Lint | `npm run lint` |
| Typage (pas de script dédié ; aussi exécuté par le build) | `npx tsc -b` |
| Tests unitaires (Vitest) | `npm test` |
| Build de production (`dist/`) | `npm run build` |

Les scripts `tests/*.cjs` (Playwright) se lancent contre `npx vite preview --port 4173` ; voir le README pour leur usage.
