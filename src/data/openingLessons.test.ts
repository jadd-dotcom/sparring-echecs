import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { BUILTIN_OPENINGS } from './openings';
import { firstAppearances, GLOSSARY, lessonBlocks, lessonTexts, OPENING_LESSONS, plainText, termsOf } from './openingLessons';
import { drillPositions, fenKey, parsePgn } from '../lib/repertoire';

describe('leçons d’ouvertures', () => {
  it('ordre conseillé : Londres, GDR, Française', () => {
    expect(OPENING_LESSONS.map((l) => l.openingId)).toEqual(['london', 'qgd', 'french']);
  });
  for (const l of OPENING_LESSONS) {
    const o = BUILTIN_OPENINGS.find((x) => x.id === l.openingId)!;
    const root = parsePgn(o.pgn).root;
    it(`${l.openingId} : la ligne de la leçon est la ligne principale du répertoire`, () => {
      const main: string[] = [];
      for (let n = root; n.children.length; n = n.children[0]) main.push(n.children[0].san);
      expect(l.moves.map((m) => m.san)).toEqual(main);
    });
    it(`${l.openingId} : légale, une phrase simple par coup`, () => {
      const c = new Chess();
      for (const m of l.moves) {
        expect(() => c.move(m.san), m.san).not.toThrow();
        const t = plainText(m.why);
        expect(t.length, t).toBeLessThan(160);
        expect(t.trim().endsWith('.'), t).toBe(true);
        expect(t.slice(0, -1).match(/[.!?](\s|$)/g), `une seule phrase : ${t}`).toBeNull();
      }
    });
    it(`${l.openingId} : chaque coup appris est une carte de drill`, () => {
      const drill = new Map(drillPositions(root, o.color).map((d) => [d.key, d]));
      const c = new Chess();
      for (const m of l.moves) {
        if (c.turn() === o.color) {
          const d = drill.get(fenKey(c.fen()));
          expect(d, `position avant ${m.san}`).toBeDefined();
          expect(d!.acceptSan).toContain(m.san);
        }
        c.move(m.san);
      }
    });
    it(`${l.openingId} : blocs de 3 coups, plan en 3 phrases, mots techniques définis à leur 1re apparition`, () => {
      const blocks = lessonBlocks(l.moves.length);
      expect(blocks[0]).toEqual([0, 6]);
      expect(blocks[blocks.length - 1][1]).toBe(l.moves.length);
      expect(l.plan).toHaveLength(3);
      const all = lessonTexts(l).flatMap((x) => termsOf(x.text));
      for (const k of all) expect(GLOSSARY[k], k).toBeDefined();
      const first = Object.values(firstAppearances(l)).flat();
      expect(new Set(first).size).toBe(first.length);       // chaque terme expliqué une seule fois
      expect(new Set(first)).toEqual(new Set(all));          // et tous le sont
    });
    it(`${l.openingId} : partie type légale (suite de la ligne principale), moments clés commentés`, () => {
      const c = new Chess();
      for (const m of l.moves) c.move(m.san);
      for (const s of l.model.moves) expect(() => c.move(s), s).not.toThrow();
      const keys = Object.keys(l.model.notes).map(Number);
      expect(keys.length).toBeGreaterThanOrEqual(5);
      for (const k of keys) expect(k).toBeLessThan(l.model.moves.length);
      for (const t of Object.values(l.model.notes)) expect(plainText(t).slice(0, -1).match(/[.!?](\s|$)/g), t).toBeNull();
    });
  }
});
