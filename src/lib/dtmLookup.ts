// Lecture des tables de distance exacte au mat (générées par scripts/build-dtm-tables.ts) et évaluation exacte
// des coups blancs. Tables réduites par symétrie : roi blanc ramené dans le triangle a1-d1-d4 (10 cases).
import { Chess } from 'chess.js';
import { SYMMETRIES } from './mates';

export type DtmPiece = 'Q' | 'R' | 'B';
export interface DtmTable { types: DtmPiece[]; data: Int8Array }

export const TRIANGLE = [0, 1, 2, 3, 9, 10, 11, 18, 19, 27]; // a1 b1 c1 d1 b2 c2 d2 c3 d3 d4
const SQ_SYM = SYMMETRIES.map((fn) => Array.from({ length: 64 }, (_, s) => { const [f, r] = fn(s & 7, s >> 3); return r * 8 + f; }));
const TRI_INDEX = new Int8Array(64).fill(-1);
TRIANGLE.forEach((s, i) => { TRI_INDEX[s] = i; });

/** Indice réduit d'une position (trait aux Blancs) : roi blanc, roi noir, pièces blanches (dans l'ordre des types). */
export function reducedIndex(n: number, wk: number, bk: number, ps: number[]): number {
  for (let k = 0; k < 8; k++) {
    const t = TRI_INDEX[SQ_SYM[k][wk]];
    if (t < 0) continue;
    let rest = SQ_SYM[k][bk] | (SQ_SYM[k][ps[0]] << 6);
    if (n === 2) rest |= SQ_SYM[k][ps[1]] << 12;
    return t * (1 << (6 + 6 * n)) + rest;
  }
  throw new Error('symétrie introuvable');
}

/** Cases (0-63, a1 = 0) des rois et des pièces blanches d'une position. */
function squares(c: Chess, types: DtmPiece[]) {
  let wk = -1, bk = -1;
  const pool: Record<string, number[]> = {};
  for (const row of c.board()) for (const p of row) {
    if (!p) continue;
    const s = (Number(p.square[1]) - 1) * 8 + 'abcdefgh'.indexOf(p.square[0]);
    if (p.type === 'k') { if (p.color === 'w') wk = s; else bk = s; } else if (p.color === 'w') (pool[p.type.toUpperCase()] ??= []).push(s);
  }
  const ps: number[] = [];
  for (const t of types) { const s = pool[t]?.shift(); if (s === undefined) return null; ps.push(s); }
  if (Object.values(pool).some((v) => v.length)) return null;
  return { wk, bk, ps };
}

/** Distance exacte au mat (coups blancs), trait aux Blancs ; -1 = pas de gain ; null = position hors table. */
export function dtmWhite(table: DtmTable, fen: string): number | null {
  const c = new Chess(fen);
  if (c.turn() !== 'w') return null;
  const sq = squares(c, table.types);
  if (!sq) return null;
  return table.data[reducedIndex(table.types.length, sq.wk, sq.bk, sq.ps)];
}

export interface ExactMove { san: string; uci: string; mateIn: number | null } // null = ne gagne plus (pat, nulle, pièce perdue)

/**
 * Évaluation exacte de chaque coup blanc : « mat en N » depuis la position (en comptant ce coup).
 * `sub` = table après la prise d'une pièce (ex. deux tours → tour seule).
 */
export function exactMoves(table: DtmTable, fen: string, sub?: DtmTable): ExactMove[] {
  const c = new Chess(fen);
  const out: ExactMove[] = [];
  for (const m of c.moves({ verbose: true })) {
    c.move(m);
    let mateIn: number | null;
    if (c.isCheckmate()) mateIn = 1;
    else if (c.isGameOver()) mateIn = null;
    else {
      let worst = -1;
      for (const b of c.moves({ verbose: true })) {
        c.move(b);
        const t = b.captured ? sub : table;
        const v = t ? dtmWhite(t, c.fen()) : -1;
        c.undo();
        if (v === null || v < 0) { worst = -1; break; }
        worst = Math.max(worst, v);
        if (worst === 0) break;
      }
      mateIn = worst < 0 ? null : worst + 1;
    }
    c.undo();
    out.push({ san: m.san, uci: m.from + m.to + (m.promotion ?? ''), mateIn });
  }
  return out;
}

/** Meilleur coup exact (mat le plus court). */
export function bestExactMove(table: DtmTable, fen: string, sub?: DtmTable): ExactMove | null {
  const moves = exactMoves(table, fen, sub).filter((m) => m.mateIn !== null);
  moves.sort((a, b) => a.mateIn! - b.mateIn!);
  return moves[0] ?? null;
}
