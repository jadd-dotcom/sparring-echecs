import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { MATE_LESSONS } from './mateLessons';
import { isValidExercise, MATE_LEVELS, stalemateTraps } from '../lib/mates';

describe('leçons des mats', () => {
  for (const l of MATE_LESSONS) {
    it(`${l.level} : ligne légale qui finit par un mat, étapes cohérentes`, () => {
      const level = MATE_LEVELS.find((x) => x.id === l.level)!;
      expect(isValidExercise(l.fen, level)).toBe(true);
      expect(l.steps.length).toBeGreaterThanOrEqual(3);
      expect(l.steps.length).toBeLessThanOrEqual(5);
      const c = new Chess(l.fen);
      const used = new Set<number>();
      l.moves.forEach((m, i) => {
        expect(() => c.move(m.san), `${i}: ${m.san}`).not.toThrow();
        if (i % 2 === 0) {
          expect(m.s, `étape du coup ${m.san}`).toBeGreaterThanOrEqual(1);
          expect(m.s).toBeLessThanOrEqual(l.steps.length);
          used.add(m.s!);
        } else expect(m.s).toBeUndefined();
      });
      expect(c.isCheckmate()).toBe(true);
      expect(used.size).toBe(l.steps.length);
    });
  }
  for (const l of MATE_LESSONS.filter((x) => x.level === 'kq' || x.level === 'kbb')) {
    it(`${l.level} : étape « piège du pat » avec un coup qui fait vraiment pat`, () => {
      expect(l.traps?.length).toBeGreaterThan(0);
      expect(l.steps.some((s) => s.startsWith('Piège du pat'))).toBe(true);
      for (const t of l.traps!) {
        const c = new Chess(l.fen);
        l.moves.slice(0, t.at).forEach((m) => c.move(m.san));
        expect(c.turn()).toBe('w');
        expect(stalemateTraps(c.fen())).toContain(t.san);
        const d = new Chess(c.fen()); d.move(t.san);
        expect(d.isStalemate()).toBe(true);                       // le coup piège fait pat
        const e = new Chess(c.fen()); e.move(l.moves[t.at].san);
        expect(e.isStalemate()).toBe(false);                      // le coup de la leçon, non
      }
    });
  }
});
