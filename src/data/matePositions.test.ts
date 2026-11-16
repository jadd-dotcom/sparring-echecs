import { describe, expect, it } from 'vitest';
import data from './matePositions.json';
import { applySymmetry, isValidExercise, MATE_LEVELS } from '../lib/mates';

// Mats les plus longs possibles (tables de finales) : D+R 10, T+T 7, T+R 16, F+F 19.
const MAX_DTM: Record<string, number> = { kq: 10, krr: 7, kr: 16, kbb: 19 };

describe('positions de mat précalculées', () => {
  it('métadonnées', () => {
    expect(data.engine).toMatch(/Stockfish 16 \(natif/);
    expect(data.movetimeMs).toBe(5000);
    expect(data.exact).toMatch(/rétrograde/);
  });
  for (const level of MATE_LEVELS.filter((l) => l.available)) {
    it(`${level.name} : 150 positions légales, uniques, 2 < mat exact ≤ Stockfish et ≤ ${MAX_DTM[level.id]}, 8 symétries valides`, () => {
      const list = (data.levels as Record<string, { fen: string; mate: number; sf: number }[]>)[level.id];
      expect(list.length).toBe(150);
      expect(new Set(list.map((p) => p.fen)).size).toBe(150);
      for (const p of list) {
        expect(p.mate).toBeGreaterThan(2);
        expect(p.mate).toBeLessThanOrEqual(p.sf);              // un mat trouvé par Stockfish est un vrai mat : borne haute
        expect(p.mate).toBeLessThanOrEqual(MAX_DTM[level.id]);
        for (let k = 0; k < 8; k++) expect(isValidExercise(applySymmetry(p.fen, k), level), `${p.fen} / ${k}`).toBe(true);
      }
    });
  }
});
