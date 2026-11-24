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

describe('répertoire Noirs : réponses aux sorties réelles de mes adversaires (24/11)', async () => {
  const { G6_ATTACKS_PGN } = await import('./openings');
  const checks = (await import('./repertoire-checks.json')).default as Record<string, Record<string, { loss: number }>>;
  const { Chess } = await import('chess.js');
  const { fenKey } = await import('../lib/repertoire');
  const g6 = BUILTIN_OPENINGS.find((o) => o.id === 'g6-system')!;
  const full = parsePgn(g6.pgn).root;
  const adds = lines(parsePgn(G6_ATTACKS_PGN).root);
  const has = (l: string[]) => { let n = full; for (const s of l) { const c = n.children.find((x) => x.san === s); if (!c) return false; n = c; } return true; };

  it('ajouts fusionnés dans le répertoire complet (nouvelle installation) et proposés en mise à jour (rev 1)', () => {
    expect(adds.length).toBe(12);
    for (const l of adds) expect(has(l), l.join(' ')).toBe(true);
    expect(g6.updates).toEqual([{ rev: 1, pgn: G6_ATTACKS_PGN }]);
  });

  it('couvre les sorties vues au moins 2 fois : ♕h5, ♕f3, ♗c4 + ♕f3/♕h5, ♕g3, ♗b5 tôt, 3.c3, 1.e3, 2.d3, 2.c4', () => {
    const txt = adds.map((l) => l.join(' '));
    for (const start of ['e4 c5 Qh5 d6 Bc4', 'e4 c5 Qf3 Nc6 Bc4', 'e4 c5 Bc4 Nc6 Qf3', 'e4 c5 Bc4 Nc6 Qh5', 'e4 c5 Nc3 Nc6 Bc4',
      'e4 c5 Nc3 Nc6 Bb5', 'e4 c5 Nf3 Nc6 c3', 'e3 c5', 'e4 c5 d3', 'e4 c5 c4']) {
      expect(txt.some((t) => t.startsWith(start)), start).toBe(true);
    }
    expect(txt.some((t) => / Qg3 /.test(t))).toBe(true);
  });

  it('système …c5/…g6 : …c5 au 1er coup, pas de …e5 précoce, ~8 de mes coups par ligne', () => {
    for (const l of adds) {
      const mine = l.filter((_, i) => i % 2 === 1);
      expect(mine[0], l.join(' ')).toBe('c5');
      expect(mine.slice(0, 6), l.join(' ')).not.toContain('e5');
      expect(mine.length, l.join(' ')).toBe(8);
    }
  });

  it('vérifié par Stockfish : aucun de mes coups ne perd plus de 0,5 pion', () => {
    for (const l of adds) {
      const c = new Chess();
      l.forEach((s, i) => {
        const fen = c.fen();
        const m = c.move(s);
        if (i % 2 === 1) {
          const k = fenKey(fen) + ' ' + m.from + m.to + (m.promotion ?? '');
          expect(checks['g6-system'][k], `${s} (${l.slice(0, i + 1).join(' ')})`).toBeDefined();
          expect(checks['g6-system'][k].loss, `${s} (${l.slice(0, i + 1).join(' ')})`).toBeLessThanOrEqual(50);
        }
      });
    }
  });
});
