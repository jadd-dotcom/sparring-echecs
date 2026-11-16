import { describe, expect, it } from 'vitest';
import { BUILTIN_OPENINGS } from './openings';
import { drillPositions, lines, parsePgn } from '../lib/repertoire';

describe('répertoire pré-chargé', () => {
  for (const o of BUILTIN_OPENINGS) {
    it(`${o.name} : PGN légal (chess.js)`, () => {
      const { root, skipped } = parsePgn(o.pgn);
      expect(skipped).toEqual([]);
      const ls = lines(root);
      expect(ls.length).toBeGreaterThanOrEqual(4);
      for (const l of ls) expect(l.length).toBeGreaterThanOrEqual(10); // au moins 5 coups complets
      expect(drillPositions(root, o.color).length).toBeGreaterThan(20);
    });
  }
});
