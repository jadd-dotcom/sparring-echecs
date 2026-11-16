import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { bestExactMove, dtmWhite, exactMoves, type DtmPiece, type DtmTable } from './dtmLookup';
import { applySymmetry } from './mates';
import data from '../data/matePositions.json';

const load = (id: string, types: DtmPiece[]): DtmTable => {
  const b = gunzipSync(readFileSync(`public/dtm/${id}.dtm`));
  return { types, data: new Int8Array(b.buffer, b.byteOffset, b.byteLength) };
};
const T = { kq: load('kq', ['Q']), kr: load('kr', ['R']), krr: load('krr', ['R', 'R']), kbb: load('kbb', ['B', 'B']) };

describe('tables exactes pour le navigateur (public/dtm)', () => {
  it('maximums théoriques retrouvés : 10, 16, 7, 19', () => {
    const max = (t: DtmTable) => t.data.reduce((m, x) => Math.max(m, x), -1);
    expect([max(T.kq), max(T.kr), max(T.krr), max(T.kbb)]).toEqual([10, 16, 7, 19]);
  });
  it('les 600 positions précalculées (et leurs 8 symétries) donnent la même distance exacte', () => {
    for (const [id, list] of Object.entries(data.levels as Record<string, { fen: string; mate: number }[]>)) {
      const t = T[id as keyof typeof T];
      for (const p of list) for (let k = 0; k < 8; k++) expect(dtmWhite(t, applySymmetry(p.fen, k)), `${id} ${p.fen} / ${k}`).toBe(p.mate);
    }
  });
  it('évaluation exacte des coups : meilleur coup = distance − 1 au coup suivant', () => {
    const fen = '8/4Q3/k7/2K5/8/8/8/8 w - - 12 7'; // leçon Dame : Qc7 ferait pat
    const moves = exactMoves(T.kq, fen);
    expect(moves.find((m) => m.san === 'Qc7')!.mateIn).toBeNull();   // pat → ne gagne plus
    const best = bestExactMove(T.kq, fen)!;
    expect(best.mateIn).toBe(dtmWhite(T.kq, fen));
    expect(best.san).not.toBe('Qc7');
  });
  it('deux tours : une prise de tour renvoie à la table tour seule', () => {
    const fen = '8/8/8/3k4/8/2R5/8/R3K3 w - - 0 1';
    const best = bestExactMove(T.krr, fen, T.kr)!;
    expect(best.mateIn).toBe(dtmWhite(T.krr, fen));
  });
});
