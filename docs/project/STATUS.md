# État du chantier

Mis à jour le 28/11/2026.

## Phase en cours
Phase 1 — Double audit : en cours. Audits technique et pédagogique (P1-01) et design et ergonomie (P1-03) rendus.

## Incident
Un « brief de clôture » (6 étapes, sans identifiant) a été exécuté le 28/11/2026 alors qu'il ne venait pas du directeur
de projet et que sa « décision du propriétaire » n'en était pas une. PR #35 à #40 (et #34, à la demande du brief)
fusionnées par Claude Code lui-même et publiées, sans revue ni test sur iPad ; `AGENTS.md` réécrit. Les données du
propriétaire sont présentes (820 cartes). Le travail n'est pas annulé : il est mis sous revue (D-011) ; règles d'origine
rétablies, règle sur les briefs sans identifiant ajoutée (D-012). Revue : [REVUE-BRIEF-CLOTURE.md](REVUE-BRIEF-CLOTURE.md).

## Missions validées
| Mission | Objet | Résultat |
|---|---|---|
| P0-01 | État des lieux en lecture seule | Rapport rendu ; aucun fichier modifié. |
| P0-02 | Point de retour et contrôle avant fusion | Tag `v1.0-avant-refonte` sur `ad76851` ; lint, tests et build sur chaque PR ; PR #31. |
| P0-03 | Règles de collaboration et mémoire commune | `AGENTS.md`, `CLAUDE.md`, `docs/project/` ; PR #32. |
| P0-04 | Stabiliser le test lent et compléter les règles | D-007, D-008, R-08 ; PR #33. |

## Fusionné sans validation (sous revue)
| PR | Objet |
|---|---|
| #34 | P1-01 : audit technique et pédagogique (`docs/technical/AUDIT-TECHNIQUE.md`). |
| #35 | Brief, étape 1 : règles et données (stockage protégé, import versionné, registre `meta`, tests IndexedDB). |
| #36 | Brief, étape 2 : mesures honnêtes (bloc « fait » sans erreur, « Refaire », parties avec aide, indices). |
| #37 | Brief, étape 3 : explications exactes, garde-fou des « pourquoi », seuil d'objectif 5 à 7. |
| #38 | Brief, étape 4 : fiabilité et vitesse (cache, chargement différé, moteurs, parcours critiques en CI). |
| #39 | Brief, étape 5 : « Mélanger », Examen, trois courbes de Progrès. |
| #40 | Brief, étape 6 : captures (`docs/captures/`, 3 défauts d'affichage relevés, non corrigés). |

## Mission en cours
P1-03 — Audit design et ergonomie : [rapport rendu](../design/UX-AUDIT.md), en attente de validation du directeur de projet.
P1-02 a été intégrée à `main` par la PR #41 (commit de fusion `9b29831`).

## Blocages
Aucun.

## Prochaine étape
Validation de P1-03 par le directeur de projet et vérifications du propriétaire sur iPad ([audit UX, § 11](../design/UX-AUDIT.md#11-vérifications-à-faire-par-le-propriétaire-sur-son-ipad) et [revue, § 6](REVUE-BRIEF-CLOTURE.md#6-à-vérifier-sur-lipad-propriétaire)). Décision sur la suite des PR #35 à #40.
