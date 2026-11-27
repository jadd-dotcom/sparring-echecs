// Liste de tous les carrefours du répertoire actif et de leurs phrases-panneaux → docs/CARREFOURS.md (relecture).
// Usage : npx esbuild scripts/crossroads-doc.ts --bundle --platform=node --format=esm --outfile=scripts/.cx.mjs && node scripts/.cx.mjs
import { writeFileSync } from 'node:fs';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { parsePgn } from '../src/lib/repertoire';
import { crossroads, moveLabel, signpostCards } from '../src/lib/crossroads';
import { signpostSentence } from '../src/lib/signposts';
import { OPENING_LESSONS } from '../src/data/openingLessons';

const L: string[] = ['# Carrefours du répertoire — phrases-panneaux', '',
  'Un carrefour : une position où l’adversaire a au moins 2 coups dans mon arbre (son coup change ma réponse). Une carte',
  'par coup-panneau ; sa phrase-panneau dit ce que son coup change → ma réponse (src/lib/signposts.ts).', '',
  '- Partie gauche : d’abord la menace de son coup, calculée « s’il rejouait » sur 4 demi-coups (comme « Qu’est-ce qu’il',
  '  menace ? », Stockfish 19 lite profondeur 16 : src/data/signpostThreats.ts, `npm run signpost-threats`) : mat → « Il',
  '  menace Qxf7 mat » ; gain d’au moins 2 points → « Il menace de prendre ta pièce… ». Sinon, le « pourquoi » de la leçon',
  '  pour son coup.',
  '- Partie droite : le « pourquoi » de la leçon pour mon coup ; s’il n’y en a pas, ce que mon coup fait contre la menace',
  '  (prend, s’écarte, bouche la ligne, défend). Mon coup entre parenthèses. Génération : `npm run crossroads-doc`.', ''];
let total = 0;
for (const o of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
  const root = parsePgn(o.pgn).root;
  const lesson = OPENING_LESSONS.find((l) => l.openingId === o.id);
  const cs = crossroads(root, o.color);
  const cards = signpostCards(root, o.color);
  total += cards.length;
  L.push(`## ${o.name} (${o.color === 'w' ? 'Blancs' : 'Noirs'}) — ${cs.length} carrefours, ${cards.length} cartes`, '');
  for (const c of cs) {
    const after = c.path.length ? c.path.map((m, i) => (i % 2 ? '' : `${i / 2 + 1}.`) + m).join(' ') : 'position de départ';
    L.push(`### Après ${after}`, '');
    for (const card of cards.filter((x) => x.crossroad.path.join(' ') === c.path.join(' '))) {
      L.push(`- **${moveLabel(card.ply, card.his)}** → ${card.mine ? moveLabel(card.ply + 1, card.mine) : '—'} : « ${signpostSentence(card, o.color, { lesson })} »`);
    }
    L.push('');
  }
}
L.splice(2, 0, `${total} cartes au total.`, '');
writeFileSync('docs/CARREFOURS.md', L.join('\n'));
console.log(`docs/CARREFOURS.md : ${total} cartes`);
