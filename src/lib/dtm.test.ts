// Solveur rétrograde (scripts/dtm.ts) : finales à 3 pièces (rapides). Les finales à 4 pièces (T+T, F+F) sont
// vérifiées par scripts/annotate-mates.ts (maximums 7 et 19, cohérence avec Stockfish).
import { describe, expect, it } from 'vitest';
import { dtmOf, solve } from '../../scripts/dtm';
import { applySymmetry } from './mates';

describe('distance exacte au mat (analyse rétrograde)', () => {
  const kq = solve(['Q']);
  const kr = solve(['R']);
  const max = (w: Int8Array) => w.reduce((m, x) => Math.max(m, x), -1);
  it('maximums théoriques : D+R 10, T+R 16', () => {
    expect(max(kq.wRes)).toBe(10);
    expect(max(kr.wRes)).toBe(16);
  });
  it('positions connues', () => {
    expect(dtmOf(kq, '7k/8/6K1/8/8/8/Q7/8 w - - 0 1')).toBe(1);   // Qa8#
    expect(dtmOf(kq, '7k/8/6K1/8/8/8/8/Q7 w - - 0 1')).toBe(-1);  // illégal : roi noir en échec, trait aux Blancs
    expect(dtmOf(kr, '6k1/8/6K1/8/8/8/8/R7 w - - 0 1')).toBe(1);  // Ra8#
    expect(dtmOf(kr, '7k/8/5K2/8/8/8/8/6R1 w - - 0 1')).toBe(2);  // Kf7 (attente) puis Rh1#
  });
  it('invariant par les 8 symétries', () => {
    const fen = '3R4/8/5k2/8/8/K7/8/8 w - - 0 1';
    const d = dtmOf(kr, fen);
    for (let k = 0; k < 8; k++) expect(dtmOf(kr, applySymmetry(fen, k))).toBe(d);
  });
});
