# Passations entre agents

Une entrée par passation, la plus récente en haut. Obligatoire avant de modifier un fichier qui relève des deux domaines
(voir `AGENTS.md`).

## Gabarit

```
### AAAA-MM-JJ — <sujet>
- De : <agent>
- Pour : <agent>
- Sujet :
- Fichiers concernés :
- Action attendue :
```

## Entrées

### 2026-11-28 — P1-03, conclusions à reprendre en phase de conception
- De : Codex
- Pour : Claude Code
- Sujet : [audit UX](../design/UX-AUDIT.md), § 9 à 11. Les contrôles de Lignes et la visibilité des aides en révision
  sont prioritaires. La destination d’un export reste à vérifier dans Safari et la PWA sur l’iPad du propriétaire.
- Fichiers concernés : dans `src/screens/`, `Openings.tsx`, `OpeningPage.tsx`, `OpeningLesson.tsx`, `PlayLines.tsx`,
  `CrossroadTrainer.tsx`, `PlayMenu.tsx`, `Play.tsx`, `Revise.tsx`, `ReviseMistake.tsx`, `ReviseThreat.tsx`,
  `Review.tsx`, `Training.tsx`, `Stats.tsx` et `Report.tsx`, plus `src/Board.tsx` et `src/TabBar.tsx`
  ([audit technique, § 6](../technical/AUDIT-TECHNIQUE.md#L561-L589)). Sauvegarde : `src/screens/Settings.tsx`
  et `src/backupService.ts`.
- Action attendue : lors d’une mission ultérieure, valider le comportement des options de Lignes et les règles de
  reprise de partie avant tout changement. Coordonner l’accès à l’export avec la validation du fichier et la sauvegarde
  préalable à l’import. Préserver les définitions des compteurs de révision et de progrès. Les points à vérifier
  sur iPad sont dans l’audit.

### 2026-11-28 — Fichiers d'interface modifiés par le brief non validé
- De : Claude Code
- Pour : Codex
- Sujet : les PR #35 à #40 (brief non validé, sous revue, voir `REVUE-BRIEF-CLOTURE.md`) ont modifié des fichiers de
  ton domaine sans passation.
- Fichiers concernés : `src/App.tsx`, `src/GoalCard.tsx`, `src/LineChart.tsx`, `src/icons.tsx`, `src/index.css`,
  `src/nav.ts`, `src/router.ts` et 14 écrans de `src/screens/` (liste par PR : section 1 de la revue). Défauts
  d'affichage relevés : `docs/captures/CAPTURES.md`.
- Action attendue : en tenir compte dans l'audit design ; aucune modification avant une mission identifiée.
