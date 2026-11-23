// Génère docs/LECONS-ECHIQUIER.md depuis src/data/boardLessons.ts et src/lib/board/* (npm run board-doc).
import { writeFileSync } from 'node:fs';
import { BOARD_LESSONS } from '../src/data/boardLessons';
import { SHORT_GAMES } from '../src/data/boardGames';
import { CHAPTERS, levelsOf, REPLAY_REVIEW, REVIEW_DAYS, testRule } from '../src/lib/board/levels';
import { expectedLabel, makeQuestion } from '../src/lib/board/questions';
import { seeded } from '../src/lib/board/stats';
import { fig } from '../src/lib/notation';

let md = `# Leçons « Maîtrise de l’échiquier »

Contenu affiché dans l’appli, généré depuis \`src/data/boardLessons.ts\` et \`src/lib/board/\` (\`npm run board-doc\`).
Objectif du mode : jouer à l’aveugle. Les chapitres se débloquent dans l’ordre ; chaque chapitre = une courte leçon
(méthode + astuce), puis des exercices chronométrés : « S’entraîner » (sans chrono, corrigé expliqué après chaque réponse)
et « Épreuve » (critères de maîtrise ci-dessous). Tout se fait au toucher, hors ligne ; son court et légère vibration
sur une erreur (désactivables avec le réglage Sons).

## Règles générales

- **Validation d’un chapitre** : tous ses niveaux validés (le 7a, « rejouer de tête », est un entraînement non noté).
  Les niveaux d’un chapitre se débloquent aussi dans l’ordre.
- **Ch. 1-2** : chaque niveau (1a … 1e, 2c … 2e) a son épreuve de 30 s (au moins 25 bonnes réponses, au plus 1 erreur),
  à réussir 3 fois (pas forcément de suite).
- **Ch. 3-5** : 20 questions, au moins 19 justes, temps médian ≤ 3 s par question. Pour une réponse à plusieurs cases
  (« cite les cases entre… », « toutes les cases du cavalier »), le temps compte **par case donnée** (temps ÷ nombre de cases).
- **Ch. 6** : 10 questions à la longueur visée, au moins 9 justes ; longueurs 2, 4, 6 puis 8 **demi-coups**
  (« 1.e4 e5 » = 2 demi-coups), un niveau par longueur.
- **Ch. 7** : partie à l’aveugle finie avec au plus 3 coups d’œil ; finie = mat, pat ou nulle, ou abandon après au moins
  20 de mes coups (pour qu’un abandon immédiat ne valide pas le chapitre). Contre Maia au niveau choisi ; sans effet sur mon niveau.
- **Révisions** des chapitres validés : J+${REVIEW_DAYS.join(', J+')}, puis tous les 7 jours. Une révision = une épreuve d’un
  niveau du chapitre, à tour de rôle (chapitre 7 : rejouer une partie courte avec au plus ${REPLAY_REVIEW.maxErrors} erreurs et
  ${REPLAY_REVIEW.maxPeeks} coup d’œil). Révision ratée → chapitre « à revoir », de nouveau dû le lendemain ; une fois réussie,
  on repart de J+1.
- **Échauffement échiquier (3 min)** (accueil) : enchaîne les révisions du jour, « à revoir » d’abord, jusqu’à 3 minutes ;
  sans révision due, 3 minutes de « trouve la case » sur mes cases les plus faibles.
- **Adaptatif** : pour chaque case, erreurs et temps de réponse. Faiblesse = 70 % taux d’erreur + 30 % lenteur (au-delà de
  1,5 s en moyenne) ; une case jamais vue vaut 0,3. Une case est tirée avec un poids 1 + 6 × faiblesse : une case très faible
  sort jusqu’à 7 fois plus souvent qu’une case sûre. Carte de chaleur dans l’écran du mode ; les 10 cases les plus faibles
  dans le rapport pour Claude (section « Échiquier »).

`;
const rng = seeded(2026);
for (const l of BOARD_LESSONS) {
  const ch = CHAPTERS.find((c) => c.n === l.chapter)!;
  md += `## Chapitre ${l.chapter}. ${ch.title}\n\n**Objectif :** ${fig(l.goal)}\n\n### Méthode\n\n`;
  md += l.method.map((m, i) => `${i + 1}. ${fig(m)}`).join('\n') + '\n\n';
  md += `### Astuce\n\n${fig(l.tip)}\n\n### Exemples\n\n` + l.examples.map((e) => `- ${fig(e)}`).join('\n') + '\n\n### Exercices\n\n';
  for (const lv of levelsOf(l.chapter)) {
    md += `- **${lv.id}. ${lv.title}** — ${fig(l.exercises[lv.id] ?? '')} ${lv.test.type === 'none' ? '' : `_${testRule(lv)}_`}\n`;
    if (!['replay', 'blind'].includes(lv.kind)) {
      let prev;
      const ex: string[] = [];
      for (let i = 0; i < 3; i++) { const q = makeQuestion(lv, rng, {}, prev); prev = q; ex.push(`« ${fig(q.prompt)} » → ${fig(expectedLabel(q))}`); }
      md += `  - Exemples de questions : ${ex.join(' ; ')}\n`;
    }
  }
  md += '\n';
}
md += '## Parties courtes à rejouer (7a)\n\n' + SHORT_GAMES.map((g) => `- **${g.name}** : ${fig(g.moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.${m}` : m)).join(' '))} — ${g.note}`).join('\n') + '\n';
writeFileSync('docs/LECONS-ECHIQUIER.md', md);
console.log('docs/LECONS-ECHIQUIER.md écrit');
