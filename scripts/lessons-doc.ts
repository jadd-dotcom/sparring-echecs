// Génère docs/LECONS-OUVERTURES.md depuis src/data/openingLessons.ts (notation anglaise standard).
import { writeFileSync } from 'node:fs';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { firstAppearances, GLOSSARY, lessonBlocks, OPENING_LESSONS, plainText } from '../src/data/openingLessons';

const num = (ply: number, san: string) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '...' : '.'} ${san}`;
let md = `# Leçons d'ouvertures (mode Leçon)\n\nContenu affiché dans l'appli, généré depuis \`src/data/openingLessons.ts\` ` +
  `(\`npm run lessons-doc\`). Ordre conseillé : l’Anglaise (Blancs), puis le système …c5/…g6 (Noirs) ; pour chacune : ` +
  `1. Leçon → 2. Drill → 3. Partie à thème. Les leçons de l’ancien répertoire (Londres, Gambit Dame refusé, Défense française) ` +
  `restent consultables dans l’onglet « Archives » ; elles sont reprises en fin de document.\n\nDéroulé d'une leçon : (1) la ligne principale par blocs de 3 coups, une phrase ` +
  `par coup ; (2) après chaque bloc, l'élève rejoue ses coups (1re erreur : case de départ surlignée ; 2e : solution) ; ` +
  `(3) le plan en 3 phrases ; (4) une partie type commentée ; (5) pour le système …c5/…g6, un bloc supplémentaire ` +
  `« Contre les attaques rapides sur f7 » (lignes de côté vues dans mes parties Chess.com). Les coups appris entrent dans le drill (1re révision le lendemain).\n\n` +
  `Toutes les lignes du répertoire et leur vérification Stockfish : \`docs/REPERTOIRE.md\`.\n\n` +
  `Les parties types prolongent la ligne principale avec Stockfish 16 (1 s par coup, les deux camps) : ce ne sont pas des parties de joueurs réels.\n\n`;
md += '## Glossaire (expliqué à la 1re apparition dans chaque leçon)\n\n' + Object.entries(GLOSSARY).map(([k, v]) => `- **${k}** : ${v}`).join('\n') + '\n\n';
for (const l of OPENING_LESSONS) {
  const o = BUILTIN_OPENINGS.find((x) => x.id === l.openingId)!;
  const fresh = firstAppearances(l);
  const termsNote = (where: string) => (fresh[where] ? ` _(mot expliqué : ${fresh[where].join(', ')})_` : '');
  if (o.archived && !OPENING_LESSONS.slice(0, OPENING_LESSONS.indexOf(l)).some((x) => BUILTIN_OPENINGS.find((y) => y.id === x.openingId)?.archived)) {
    md += '---\n\n# Archives (ancien répertoire)\n\n';
  }
  md += `## ${o.name} (${o.color === 'w' ? 'Blancs' : 'Noirs'})${o.archived ? ' — archivée' : ''}\n\n${l.intro}\n\n### 1-2. Ligne principale, par blocs\n\n`;
  lessonBlocks(l.moves.length).forEach(([s, e], b) => {
    md += `**Bloc ${b + 1}**\n\n`;
    for (let i = s; i < e; i++) md += `- ${num(i, l.moves[i].san)} — ${plainText(l.moves[i].why)}${termsNote(`move:${i}`)}\n`;
    md += '\n';
  });
  md += '### 3. Le plan\n\n' + l.plan.map((p, i) => `${i + 1}. ${plainText(p)}${termsNote(`plan:${i}`)}`).join('\n') + '\n\n';
  md += '### 4. Partie type (Stockfish contre lui-même)\n\n';
  const start = l.moves.length;
  md += 'Coups : ' + l.model.moves.map((s, i) => num(start + i, s)).join(' ') + '\n\nMoments clés :\n\n';
  for (const [k, v] of Object.entries(l.model.notes)) md += `- ${num(start + Number(k), l.model.moves[Number(k)])} — ${plainText(v)}${termsNote(`model:${k}`)}\n`;
  md += `\nFin : ${l.model.end}\n\n`;
  for (const x of l.extras ?? []) {
    md += `### 5. Bloc supplémentaire : ${x.title}\n\n${plainText(x.intro)}${termsNote(`extra:${x.id}:intro`)}\n\n` +
      'Chaque ligne se regarde puis se rejoue comme un bloc de la leçon ; ses coups entrent dans le drill. ' +
      'Accès direct : écran Ouvertures → « Leçon : contre les attaques rapides sur f7 ».\n\n';
    x.lines.forEach((ln, j) => {
      md += `**Ligne ${j + 1} — ${ln.name}**${ln.start.length ? ` (début : ${ln.start.map((s, i) => (i % 2 ? '' : `${i / 2 + 1}. `) + s).join(' ')})` : ''}\n\n`;
      ln.moves.forEach((m, i) => { md += `- ${num(ln.start.length + i, m.san)} — ${plainText(m.why)}${termsNote(`extra:${x.id}:${j}:${i}`)}\n`; });
      md += '\n';
    });
  }
}
writeFileSync('docs/LECONS-OUVERTURES.md', md);
console.log('docs/LECONS-OUVERTURES.md écrit');
