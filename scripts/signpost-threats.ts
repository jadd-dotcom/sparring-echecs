// Menaces des coups-panneaux (Carrefours) : pour chaque carte du répertoire actif, la position juste après son coup,
// avec le trait rendu à l'adversaire (« s'il rejouait », comme « Qu'est-ce qu'il menace ? »). Stockfish 19 lite
// (Node), profondeur 16, suite prolongée à 4 demi-coups (lui, moi, lui, moi) : mat en 3 au plus, ou gain de matériel
// d'au moins 2 points (1/3/3/5/9). Sortie : src/data/signpostThreats.ts. Usage : npm run signpost-threats
import { writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { parsePgn, fenKey } from '../src/lib/repertoire';
import { signpostCards } from '../src/lib/crossroads';
import type { SignpostThreat } from '../src/lib/signposts';
import { stopEngine, threatOf } from './threatEngine';

const DEPTH = Number(process.env.DEPTH ?? 16);

(async () => {
  const out: Record<string, SignpostThreat> = {};
  let n = 0;
  for (const o of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
    for (const card of signpostCards(parsePgn(o.pgn).root, o.color)) {
      const c = new Chess(card.crossroad.fen);
      c.move(card.his);
      const k = fenKey(c.fen());
      if (k in out) continue;
      n++;
      const t = await threatOf(c.fen(), DEPTH);
      if (t) { out[k] = t; console.log(`${o.id} ${card.id} → ${t.mate ? `mat en ${t.mate}` : `+${t.gain}`} ${t.line.join(' ')}`); }
    }
  }
  writeFileSync('src/data/signpostThreats.ts', `// Généré par scripts/signpost-threats.ts (npm run signpost-threats) : ne pas modifier à la main.
// Menace de son coup-panneau (position après son coup, trait rendu à l'adversaire), Stockfish profondeur ${DEPTH},
// 4 demi-coups : mat en 3 au plus, ou gain d'au moins 2 points. Clé : position après son coup (fenKey).
import type { SignpostThreat } from '../lib/signposts';

export const SIGNPOST_THREATS: Record<string, SignpostThreat> = ${JSON.stringify(out, null, 1)};
`);
  console.log(`${n} positions, ${Object.keys(out).length} menaces → src/data/signpostThreats.ts`);
  stopEngine();
  process.exit(0);
})();
