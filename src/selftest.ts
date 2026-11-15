// Auto-test exposé sur window : N parties Maia contre un joueur aléatoire.
import { Chess } from 'chess.js';
import { maia } from './engines/maia';
import { stockfish } from './engines/stockfish';
import { db } from './db';
import { buildIndex, fenKey, parsePgn } from './lib/repertoire';

export interface SelfTestReport {
  games: number; crashes: number; illegal: number; plies: number[]; results: string[];
  maiaMs: { mean: number; p50: number; p95: number; max: number; n: number };
  errors: string[];
}

async function selftest(n = 20, rating = 900): Promise<SelfTestReport> {
  await maia.load();
  const times: number[] = [];
  const rep: SelfTestReport = { games: 0, crashes: 0, illegal: 0, plies: [], results: [], maiaMs: { mean: 0, p50: 0, p95: 0, max: 0, n: 0 }, errors: [] };
  for (let g = 0; g < n; g++) {
    const maiaColor = g % 2 === 0 ? 'w' : 'b';
    const c = new Chess();
    const uci: string[] = [];
    try {
      while (!c.isGameOver() && uci.length < 1000) {
        let u: string;
        if (c.turn() === maiaColor) {
          const t0 = performance.now();
          u = (await maia.chooseMove(c.fen(), uci, rating + 50, rating)).uci;
          times.push(performance.now() - t0);
          const legal = c.moves({ verbose: true }).some((m) => m.from + m.to + (m.promotion ?? '') === u);
          if (!legal) { rep.illegal++; throw new Error(`coup illégal ${u} dans ${c.fen()}`); }
        } else {
          const ms = c.moves({ verbose: true });
          const m = ms[Math.floor(Math.random() * ms.length)];
          u = m.from + m.to + (m.promotion ?? '');
        }
        c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
        uci.push(u);
      }
      rep.results.push(`${maiaColor === 'w' ? 'Maia=B' : 'Maia=N'} ${c.isCheckmate() ? (c.turn() === maiaColor ? 'Maia matée' : 'Maia mate') : c.isDraw() ? 'nulle' : 'limite'}`);
    } catch (e) {
      rep.crashes++;
      rep.errors.push(String((e as Error).message));
    }
    rep.games++;
    rep.plies.push(uci.length);
  }
  const s = [...times].sort((a, b) => a - b);
  rep.maiaMs = {
    n: s.length, mean: s.reduce((a, b) => a + b, 0) / Math.max(1, s.length),
    p50: s[Math.floor(s.length * 0.5)] ?? 0, p95: s[Math.floor(s.length * 0.95)] ?? 0, max: s[s.length - 1] ?? 0,
  };
  return rep;
}

async function sfBench(fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3') {
  const t0 = performance.now();
  const r = await stockfish.analyse(fen, 500);
  return { ...r, ms: performance.now() - t0 };
}

/** Coup du répertoire depuis une position (pour les tests automatiques), sinon null. */
async function repMove(openingId: string, fen: string): Promise<string | null> {
  const o = await db.openings.get(openingId);
  if (!o) return null;
  const e = buildIndex(parsePgn(o.pgn).root).get(fenKey(fen));
  return e ? [...e.moves.keys()][0] : null;
}

Object.assign(globalThis, { __selftest: selftest, __sfBench: sfBench, __db: db, __repMove: repMove });
