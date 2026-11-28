# Règles communes aux agents — Sparring Échecs

Ces règles s'appliquent à tout agent qui travaille sur ce dépôt (Claude Code, Codex). Le propriétaire a le dernier mot ;
le directeur de projet rédige les missions, les contrôle et les valide.

## Missions
- Une mission à la fois, identifiée (ex. `P1-01`). À la fin : rapport, puis arrêt ; attendre la mission suivante.
- Ne rien faire hors du périmètre de la mission. Un besoin hors périmètre se signale dans le rapport.

## Git et publication
- Une branche par mission. Jamais de push direct sur `main`. Toujours une pull request vers `main`.
- Ne jamais fusionner soi-même une pull request.
- `main` = production : toute fusion sur `main` publie le site (`.github/workflows/deploy.yml`, job `deploy`).
- Chaque pull request vers `main` exécute lint, tests et build, sans déployer.
- Point de retour : tag `v1.0-avant-refonte` (commit `ad76851`).

## Preuves
- Donner les commandes réellement exécutées et leurs résultats réels.
- Ne jamais déclarer un test qui n'a pas été lancé.
- Marquer « non vérifié » tout ce qui n'a pas été vérifié.

## Données utilisateur
- La progression est dans IndexedDB (base Dexie `sparring-echecs`, `src/db.ts`), dont la table `meta` (clé/valeur).
- Aucune modification du schéma Dexie ni des clés de la table `meta` sans migration testée et validation préalable.

## Interdits sans validation
- Réécriture complète, suppression de fonctionnalité, commande destructive.

## Domaines
| Agent | Domaine |
|---|---|
| Claude Code | logique, moteurs, données, algorithmes pédagogiques, tests, `docs/technical/` |
| Codex | interface, styles, composants visuels, navigation, accessibilité, `docs/design/` |

Un fichier qui relève des deux domaines exige une note dans `docs/project/HANDOFF.md` avant toute modification.

## Fin de mission
- Mettre à jour `docs/project/STATUS.md`.
- Mettre à jour `docs/project/HANDOFF.md` si l'autre agent est concerné.

## Commandes du projet
Node 22 (version utilisée par le CI).

| Étape | Commande |
|---|---|
| Installation (selon le lockfile) | `npm ci` |
| Lint | `npm run lint` |
| Typage (pas de script dédié ; aussi exécuté par le build) | `npx tsc -b` |
| Tests unitaires (Vitest) | `npm test` |
| Build de production (`dist/`) | `npm run build` |

Les scripts `tests/*.cjs` (Playwright) ne sont pas exécutés par le CI ; voir le README pour leur usage.
