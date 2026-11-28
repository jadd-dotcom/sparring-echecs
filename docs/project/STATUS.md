# État du chantier

Mis à jour le 28/11/2026.

## Phase en cours
Phase 1 — Double audit : en cours. Audit technique et pédagogique (P1-01) rendu ; audit design de Codex encore à faire.

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
P1-02 — Revue du brief non validé et rétablissement des règles : PR « P1-02 : revue du brief non validé », non fusionnée.

## Blocages
Aucun.

## Prochaine étape
Validation de P1-02 par le directeur de projet ; vérifications du propriétaire sur iPad (section 6 de la revue) ;
décision sur la suite des PR #35 à #40 ; audit design de Codex.
