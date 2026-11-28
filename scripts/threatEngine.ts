// Menace « s'il rejouait » (comme « Qu'est-ce qu'il menace ? ») calculée avec Stockfish 19 lite en Node, pour les
// scripts de génération (phrases-panneaux, « pourquoi » des leçons) : position après son coup, trait rendu à celui qui
// vient de jouer ; suite prolongée à 4 demi-coups (lui, moi, lui, moi) ; mat en 3 au plus, ou gain de matériel d'au
// moins 2 points (1/3/3/5/9).
import { createRequire } from 'node:module';
import { Chess, type PieceSymbol } from 'chess.js';
import { flipTurn, opponentGain, playPv } from '../src/lib/report/facts';
import { GAIN_THRESHOLD, LOSS_PLIES, MATE_HORIZON } from '../src/lib/report/motifs';
import { VALUE } from '../src/lib/words';
import type { SignpostThreat } from '../src/lib/signposts';

const require = createRequire(import.meta.url);
let onLine: (l: string) => void = () => {};
let sf: { processCommand: (c: string) => void } | null = null;
let keep: ReturnType<typeof setInterval> | null = null;

function engine() {
  if (!sf) {
    sf = require('stockfish')('lite-single', (l: string) => onLine(l));
    sf!.processCommand('uci'); sf!.processCommand('setoption name Hash value 64'); sf!.processCommand('isready');
    keep = setInterval(() => {}, 1000);   // garde Node en vie pendant les recherches
  }
  return sf!;
}

/** Arrête le moteur (fin du script). */
export function stopEngine() { if (keep) clearInterval(keep); }

function search(fen: string, depth: number): Promise<{ mate: number | null; pv: string[] }> {
  const e = engine();
  return new Promise((resolve) => {
    let mate: number | null = null, pv: string[] = [];
    onLine = (l) => {
      if (l.startsWith('info') && / pv /.test(l) && !/bound/.test(l)) {
        const m = l.match(/ score (cp|mate) (-?\d+)/);
        if (m) mate = m[1] === 'mate' ? +m[2] : null;
        pv = l.split(' pv ')[1].trim().split(' ');
      }
      if (l.startsWith('bestmove')) resolve({ mate, pv });
    };
    e.processCommand('position fen ' + fen); e.processCommand(`go depth ${depth}`);
  });
}

/** Menace de celui qui vient de jouer, dans `fenAfter` (le camp au trait se défend) ; null s'il n'y en a pas. */
export async function threatOf(fenAfter: string, depth = 16): Promise<SignpostThreat | null> {
  const pos = new Chess(fenAfter);
  if (pos.inCheck() || pos.isGameOver()) return null;      // en échec : pas de coup nul
  const me = pos.turn();
  const flipped = flipTurn(fenAfter);
  const r = await search(flipped, depth);
  let pv = r.pv;
  for (let g = 0; g < LOSS_PLIES; g++) {                     // suite écourtée : on la prolonge à 4 demi-coups
    const p = playPv(flipped, pv);
    if (p.san.length >= LOSS_PLIES || p.chess.isGameOver() || p.san.length < pv.length) break;
    const more = await search(p.fen, depth);
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
