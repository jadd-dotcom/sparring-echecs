// Génère docs/LECONS-OUVERTURES.md depuis src/data/openingLessons.ts (notation anglaise standard).
import { writeFileSync } from 'node:fs';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { firstAppearances, GLOSSARY, lessonBlocks, OPENING_LESSONS, plainText } from '../src/data/openingLessons';

const num = (ply: number, san: string) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '...' : '.'} ${san}`;
let md = `# Leçons d'ouvertures (mode Leçon)\n\nContenu affiché dans l'appli, généré depuis \`src/data/openingLessons.ts\` ` +
  `(\`npm run lessons-doc\`). Ordre conseillé : Londres, puis Gambit Dame refusé, puis Défense française ; pour chacune : ` +
  `1. Leçon → 2. Drill → 3. Partie à thème.\n\nDéroulé d'une leçon : (1) la ligne principale par blocs de 3 coups, une phrase ` +
  `par coup ; (2) après chaque bloc, l'élève rejoue ses coups (1re erreur : case de départ surlignée ; 2e : solution) ; ` +
  `(3) le plan en 3 phrases ; (4) une partie type commentée. Les coups appris entrent dans le drill (1re révision le lendemain).\n\n` +
  `Les parties types prolongent la ligne principale avec Stockfish 16 (1 s par coup, les deux camps) : ce ne sont pas des parties de joueurs réels.\n\n`;
md += '## Glossaire (expliqué à la 1re apparition dans chaque leçon)\n\n' + Object.entries(GLOSSARY).map(([k, v]) => `- **${k}** : ${v}`).join('\n') + '\n\n';
for (const l of OPENING_LESSONS) {
  const o = BUILTIN_OPENINGS.find((x) => x.id === l.openingId)!;
  const fresh = firstAppearances(l);
  const termsNote = (where: string) => (fresh[where] ? ` _(mot expliqué : ${fresh[where].join(', ')})_` : '');
  md += `## ${o.name} (${o.color === 'w' ? 'Blancs' : 'Noirs'})\n\n${l.intro}\n\n### 1-2. Ligne principale, par blocs\n\n`;
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
}
writeFileSync('docs/LECONS-OUVERTURES.md', md);
console.log('docs/LECONS-OUVERTURES.md écrit');
