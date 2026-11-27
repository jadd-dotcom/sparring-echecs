import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { BUILTIN_OPENINGS } from './openings';
import { firstAppearances, GLOSSARY, lessonBlocks, lessonTexts, OPENING_LESSONS, plainText, termsOf } from './openingLessons';
import { drillPositions, fenKey, parsePgn } from '../lib/repertoire';

describe('leçons d’ouvertures', () => {
  it('ordre conseillé : Blancs (Anglaise, Londres), Noirs (…c5/…g6, Londres en défense) ; puis les leçons archivées (GDR, Française)', () => {
    expect(OPENING_LESSONS.map((l) => l.openingId)).toEqual(['english', 'london', 'g6-system', 'london-def', 'qgd', 'french']);
    const arch = BUILTIN_OPENINGS.filter((o) => o.archived).map((o) => o.id);
    expect(arch).toEqual(['g6-old', 'qgd', 'french']);
  });
  it('corrections de la relecture : 7.Bg3 (Londres), 7.Bh4 (GDR)', () => {
    const why = (id: string, ply: number) => OPENING_LESSONS.find((l) => l.openingId === id)!.moves[ply];
    expect(why('london', 12)).toMatchObject({ san: 'Bg3' });
    expect(why('london', 12).why).toContain('tu reprends avec le pion h (hxg3)');
    expect(why('qgd', 12)).toMatchObject({ san: 'Bh4' });
    expect(why('qgd', 12).why).toContain('Ce n’est plus un clouage');
  });
  for (const l of OPENING_LESSONS) {
    const o = BUILTIN_OPENINGS.find((x) => x.id === l.openingId)!;
    const root = parsePgn(o.pgn).root;
    it(`${l.openingId} : la ligne de la leçon est la ligne principale du répertoire`, () => {
      const main: string[] = [];
      for (let n = root; n.children.length; n = n.children[0]) main.push(n.children[0].san);
      expect(l.moves.map((m) => m.san)).toEqual(main);
    });
    it(`${l.openingId} : légale, une phrase simple par coup (deux au plus quand une précision s’impose)`, () => {
      const c = new Chess();
      for (const m of l.moves) {
        expect(() => c.move(m.san), m.san).not.toThrow();
        const t = plainText(m.why);
        expect(t.length, t).toBeLessThan(160);
        expect(t.trim().endsWith('.'), t).toBe(true);
        expect((t.slice(0, -1).match(/[.!?](\s|$)/g) ?? []).length, `deux phrases au plus : ${t}`).toBeLessThanOrEqual(1);
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
      if (l.openingId === 'french') expect(l.model.notes[3]).toMatch(/^Tu roques côté roi pour quitter le centre/);  // 12…O-O
      const c = new Chess();
      for (const m of l.moves) c.move(m.san);
      for (const s of l.model.moves) expect(() => c.move(s), s).not.toThrow();
      const keys = Object.keys(l.model.notes).map(Number);
      expect(keys.length).toBeGreaterThanOrEqual(5);
      for (const k of keys) expect(k).toBeLessThan(l.model.moves.length);
      for (const t of Object.values(l.model.notes)) expect((plainText(t).slice(0, -1).match(/[.!?](\s|$)/g) ?? []).length, t).toBeLessThanOrEqual(1);
    });
  }
});

describe('bloc « Contre les attaques rapides sur f7 » (système …c5/…g6)', () => {
  const l = OPENING_LESSONS.find((x) => x.openingId === 'g6-system')!;
  const o = BUILTIN_OPENINGS.find((x) => x.id === 'g6-system')!;
  const root = parsePgn(o.pgn).root;
  const drill = new Map(drillPositions(root, 'b').map((d) => [d.key, d]));
  const x = l.extras?.find((e) => e.id === 'f7');
  it('existe, avec une introduction et 6 lignes', () => {
    expect(x?.title).toBe('Contre les attaques rapides sur f7');
    expect(x!.lines).toHaveLength(6);
  });
  for (const [j, ln] of (x?.lines ?? []).entries()) {
    it(`ligne ${j + 1} (${ln.name}) : dans le répertoire, une phrase par coup, mes coups dans le drill`, () => {
      const c = new Chess();
      let n = root;
      for (const s of ln.start) { c.move(s); n = n.children.find((k) => k.san === s)!; expect(n, s).toBeDefined(); }
      for (const m of ln.moves) {
        if (c.turn() === 'b') {
          const d = drill.get(fenKey(c.fen()));
          expect(d, `position avant ${m.san}`).toBeDefined();
          expect(d!.acceptSan).toContain(m.san);
        }
        expect(() => c.move(m.san), m.san).not.toThrow();
        n = n.children.find((k) => k.san === m.san)!;
        expect(n, `${m.san} dans l’arbre du répertoire`).toBeDefined();
        const t = plainText(m.why);
        expect(t.length, t).toBeLessThan(160);
        expect(t.trim().endsWith('.'), t).toBe(true);
        expect((t.slice(0, -1).match(/[.!?](\s|$)/g) ?? []).length, `deux phrases au plus : ${t}`).toBeLessThanOrEqual(1);
      }
    });
  }
  it('les menaces annoncées sont vraies : mat en f7 contre ♕f3/♕h5 + ♗c4, échec seulement après 2.♕h5 d6 3.♗c4', () => {
    const after = (sans: string) => { const c = new Chess(); sans.split(' ').forEach((s) => c.move(s)); return c; };
    const mates = (sans: string, mv: string) => { const c = after(sans); c.move('a6'); c.move(mv); return c.isCheckmate(); };
    expect(mates('e4 c5 Qf3 Nc6 Bc4', 'Qxf7#')).toBe(true);
    expect(mates('e4 c5 Bc4 Nc6 Qh5', 'Qxf7#')).toBe(true);
    expect(mates('e4 c5 Nc3 Nc6 Bc4 g6 Qf3', 'Qxf7#')).toBe(true);
    expect(mates('e4 c5 Qh5 d6 Bc4', 'Qxf7+')).toBe(false);
    // …g6 trop tôt contre ♕h5 : la dame prend c5.
    expect(() => after('e4 c5 Qh5 g6 Qxc5')).not.toThrow();
  });
});

describe('blocs supplémentaires de toutes les leçons', () => {
  for (const l of OPENING_LESSONS) {
    const o = BUILTIN_OPENINGS.find((x) => x.id === l.openingId)!;
    const root = parsePgn(o.pgn).root;
    const drill = new Map(drillPositions(root, o.color).map((d) => [d.key, d]));
    for (const x of l.extras ?? []) {
      for (const [j, ln] of x.lines.entries()) {
        it(`${l.openingId} / ${x.id} / ligne ${j + 1} (${ln.name}) : dans le répertoire, une phrase par coup, mes coups dans le drill`, () => {
          const c = new Chess();
          let n = root;
          for (const m of ln.start) { c.move(m); n = n.children.find((k) => k.san === m)!; expect(n, m).toBeDefined(); }
          for (const m of ln.moves) {
            if (c.turn() === o.color) {
              const d = drill.get(fenKey(c.fen()));
              expect(d, `position avant ${m.san}`).toBeDefined();
              expect(d!.acceptSan).toContain(m.san);
            }
            expect(() => c.move(m.san), m.san).not.toThrow();
            n = n.children.find((k) => k.san === m.san)!;
            expect(n, `${m.san} dans l’arbre du répertoire`).toBeDefined();
            const t = plainText(m.why);
            expect(t.length, t).toBeLessThan(160);
            expect(t.trim().endsWith('.'), t).toBe(true);
            expect((t.slice(0, -1).match(/[.!?](\s|$)/g) ?? []).length, `deux phrases au plus : ${t}`).toBeLessThanOrEqual(1);
          }
        });
      }
    }
  }
});

describe('Londres (Blancs) et Londres en défense (Noirs) : affirmations des leçons', () => {
  const after = (sans: string) => { const c = new Chess(); sans.split(' ').forEach((s) => c.move(s)); return c; };
  it('gambit Englund : le piège 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1 est bien mat ; après 4.Bg5 Qb4+ 5.Nc3 Qxb2 6.Bd2, Rb1 attaque la dame', () => {
    expect(after('d4 e5 dxe5 Nc6 Nf3 Qe7 Bf4 Qb4+ Bd2 Qxb2 Bc3 Bb4 Qd2 Bxc3 Qxc3 Qc1#').isCheckmate()).toBe(true);
    const c = after('d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 Qb4+ Nc3 Qxb2 Bd2 a6 Rb1');
    expect(c.get('b2')).toMatchObject({ type: 'q', color: 'b' });
    expect(c.isAttacked('b2', 'w')).toBe(true);
  });
  it('Londres en défense : après 2.e3 Bf5 3.c4 e6 4.Qb3 Nc6, si Qxb7 alors Nb4 menace Nc2+ (roi et tour a1)', () => {
    const c = after('d4 d5 e3 Bf5 c4 e6 Qb3 Nc6 Qxb7 Nb4 a3');
    const m = c.move('Nc2+');
    expect(c.inCheck()).toBe(true);
    expect(m.to).toBe('c2');
  });
  it('Londres en défense : le fou d6 et la dame c7 visent h2 (rien entre eux)', () => {
    const c = after('d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6 Nh4 Bg6 Nxg6 hxg6 Bd3 Bd6 Qb3 Qc7');
    for (const sq of ['e5', 'f4', 'g3'] as const) expect(c.get(sq)).toBeFalsy();
    expect(c.get('h2')).toMatchObject({ type: 'p', color: 'w' });
  });
});
