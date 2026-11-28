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

### 2026-11-28 — Fichiers d'interface modifiés par le brief non validé
- De : Claude Code
- Pour : Codex
- Sujet : les PR #35 à #40 (brief non validé, sous revue, voir `REVUE-BRIEF-CLOTURE.md`) ont modifié des fichiers de
  ton domaine sans passation.
- Fichiers concernés : `src/App.tsx`, `src/GoalCard.tsx`, `src/LineChart.tsx`, `src/icons.tsx`, `src/index.css`,
  `src/nav.ts`, `src/router.ts` et 14 écrans de `src/screens/` (liste par PR : section 1 de la revue). Défauts
  d'affichage relevés : `docs/captures/CAPTURES.md`.
- Action attendue : en tenir compte dans l'audit design ; aucune modification avant une mission identifiée.
