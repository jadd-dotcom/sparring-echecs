# État du chantier

Mis à jour le 28/11/2026.

## Phase en cours
Phase 1 — Double audit. La phase 0 (préparation et sécurisation) est close.

## Missions validées
| Mission | Objet | Résultat |
|---|---|---|
| P0-01 | État des lieux en lecture seule | Rapport rendu ; aucun fichier modifié. |
| P0-02 | Point de retour et contrôle avant fusion | Tag `v1.0-avant-refonte` sur `ad76851` ; lint, tests et build sur chaque PR ; PR #31 fusionnée ; `main` sur `6610ce1` ; exécution n°145 réussie. |
| P0-03 | Règles de collaboration et mémoire commune | `AGENTS.md`, `CLAUDE.md`, `docs/project/` ; PR #32 fusionnée ; `main` sur `cf228cd` ; exécution n°147 réussie (build et deploy). |
| P0-04 | Stabiliser le test lent et compléter les règles | Délai de 20 s sur le test lent de `signposts.test.ts` ; D-007, D-008, R-08 ; PR #33 fusionnée ; `main` sur `61afd16`. |

## Mission en cours
P1-01 — Audit technique et pédagogique (Claude Code) : `docs/technical/AUDIT-TECHNIQUE.md`. L'audit du design et de
l'ergonomie est confié à Codex, séparément.

## Blocages
Aucun.

## Prochaine étape
Phase 2 : conception de la refonte, à partir des deux audits.
