// Menaces des coups-panneaux (Carrefours) : pour chaque carte du répertoire actif, la position juste après son coup,
// avec le trait rendu à l'adversaire (« s'il rejouait », comme « Qu'est-ce qu'il menace ? »). Stockfish 19 lite
// (Node), profondeur 16, suite prolongée à 4 demi-coups (lui, moi, lui, moi) : mat en 3 au plus, ou gain de matériel
// d'au moins 2 points (1/3/3/5/9). Sortie : src/data/signpostThreats.ts. Usage : npm run signpost-threats
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Chess, type PieceSymbol } from 'chess.js';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { parsePgn, fenKey } from '../src/lib/repertoire';
import { signpostCards } from '../src/lib/crossroads';
import { flipTurn, opponentGain, playPv } from '../src/lib/report/facts';
import { GAIN_THRESHOLD, LOSS_PLIES, MATE_HORIZON } from '../src/lib/report/motifs';
import { VALUE } from '../src/lib/words';
import type { SignpostThreat } from '../src/lib/signposts';

const require = createRequire(import.meta.url);
const DEPTH = Number(process.env.DEPTH ?? 16);
let onLine: (l: string) => void = () => {};
const sf = require('stockfish')('lite-single', (l: string) => onLine(l));
const send = (c: string) => sf.processCommand(c);
const keep = setInterval(() => {}, 1000);   // garde Node en vie pendant les recherches

function search(fen: string): Promise<{ mate: number | null; cp: number; pv: string[] }> {
  return new Promise((resolve) => {
    let mate: number | null = null, cp = 0, pv: string[] = [];
    onLine = (l) => {
      if (l.startsWith('info') && / pv /.test(l) && !/bound/.test(l)) {
        const m = l.match(/ score (cp|mate) (-?\d+)/);
        if (m) { if (m[1] === 'mate') { mate = +m[2]; cp = 0; } else { mate = null; cp = +m[2]; } }
        pv = l.split(' pv ')[1].trim().split(' ');
      }
      if (l.startsWith('bestmove')) resolve({ mate, cp, pv });
    };
    send('position fen ' + fen); send(`go depth ${DEPTH}`);
  });
}

async function threatOf(fenAfterHis: string, me: 'w' | 'b'): Promise<SignpostThreat | null> {
  if (new Chess(fenAfterHis).inCheck()) return null;          // je suis en échec : pas de coup nul
  const flipped = flipTurn(fenAfterHis);
  let r = await search(flipped);
  let pv = r.pv;
  // Suite écourtée : on la prolonge jusqu'à 4 demi-coups.
  for (let g = 0; g < LOSS_PLIES; g++) {
    const p = playPv(flipped, pv);
    if (p.san.length >= LOSS_PLIES || p.chess.isGameOver() || p.san.length < pv.length) break;
    const more = await search(p.fen);
    if (!more.pv.length) break;
    pv = [...pv, ...more.pv];
  }
  const mate = r.mate !== null && r.mate > 0 && r.mate <= MATE_HORIZON ? r.mate : null;
  const gain = opponentGain(flipped, pv, me, LOSS_PLIES);
  if (mate === null && gain < GAIN_THRESHOLD) return null;
  const c = new Chess(flipped);
  const line: string[] = [];
  let captured: SignpostThreat['captured'];
  for (const u of pv.slice(0, mate ?? LOSS_PLIES)) {
    const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    line.push(m.san);
    if (m.color !== me && m.captured && (!captured || VALUE[m.captured as PieceSymbol] > VALUE[captured.type])) captured = { type: m.captured as PieceSymbol, sq: m.to };
  }
  return { san: line[0], line, mate, gain, ...(captured ? { captured } : {}) };
}

(async () => {
  send('uci'); send('setoption name Hash value 64'); send('isready');
  const out: Record<string, SignpostThreat> = {};
  let n = 0;
  for (const o of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
    for (const card of signpostCards(parsePgn(o.pgn).root, o.color)) {
      const c = new Chess(card.crossroad.fen);
      c.move(card.his);
      const k = fenKey(c.fen());
      if (k in out) continue;
      n++;
      const t = await threatOf(c.fen(), o.color);
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
  clearInterval(keep);
  process.exit(0);
})();
