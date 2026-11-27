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
    expect(g6.updates).toEqual([{ rev: 1, pgn: G6_ATTACKS_PGN }, { rev: 2, removeRoot: ['d4', 'c4', 'Nf3'] }]);
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

describe('Londres (27/11) : Blancs et « Londres en défense »', async () => {
  const { LONDON_ADDS_PGN, G6_OLD_PGN } = await import('./openings');
  const checks = (await import('./repertoire-checks.json')).default as Record<string, Record<string, { loss: number }>>;
  const { Chess } = await import('chess.js');
  const { fenKey } = await import('../lib/repertoire');
  const byId = (id: string) => BUILTIN_OPENINGS.find((o) => o.id === id)!;
  const firstMoves = (id: string) => parsePgn(byId(id).pgn).root.children.map((c) => c.san);

  it('répertoire actif : Anglaise (1.c4) et Londres (1.d4) avec les Blancs ; …c5/…g6 (1.e4) et Londres en défense (1.d4, 1.c4, 1.Nf3) avec les Noirs', () => {
    expect(BUILTIN_OPENINGS.filter((o) => !o.archived).map((o) => o.id)).toEqual(['english', 'london', 'g6-system', 'london-def']);
    expect(firstMoves('english')).toEqual(['c4']);
    expect(firstMoves('london')).toEqual(['d4']);
    expect(firstMoves('g6-system').sort()).toEqual(['e3', 'e4']);
    expect(firstMoves('london-def').sort()).toEqual(['Nf3', 'c4', 'd4']);
    expect(byId('london').updates).toEqual([{ rev: 1, pgn: LONDON_ADDS_PGN, archived: false }]);
    expect(byId('london-def').forced).toEqual(['d4|c4|Nf3']);
  });

  it('anciennes lignes …c5/…g6 contre 1.d4, 1.c4 et 1.Nf3 : dans les Archives', () => {
    expect(byId('g6-old').archived).toBe(true);
    expect(parsePgn(G6_OLD_PGN).root.children.map((c) => c.san).sort()).toEqual(['Nf3', 'c4', 'd4']);
  });

  it('Londres (Blancs) : lignes contre 1…d5, 1…Nf6, 1…e6, 1…c5, 1…g6, 1…f5 et 1…e5, environ 10 de mes coups', () => {
    const root = parsePgn(byId('london').pgn).root.children[0];
    expect(root.children.map((c) => c.san).sort()).toEqual(['Nf6', 'c5', 'd5', 'e5', 'e6', 'f5', 'g6']);
    for (const l of lines(parsePgn(LONDON_ADDS_PGN).root)) expect(l.filter((_, i) => i % 2 === 0).length, l.join(' ')).toBeGreaterThanOrEqual(10);
    // Gambit Englund : jamais 4.Bf4 (le piège).
    const englund = lines(parsePgn(byId('london').pgn).root).filter((l) => l[1] === 'e5');
    expect(englund.length).toBeGreaterThan(0);
    for (const l of englund) expect(l[6]).toBe('Bg5');
  });

  it('Londres en défense : même placement (…d5, …c6, …Nf6, …Bf5, …e6, …Bd6, …Nbd7) ; …Bf5 jamais trop tôt contre c4 + Nc3', () => {
    const ls = lines(parsePgn(byId('london-def').pgn).root);
    const mine = new Set(ls.flatMap((l) => l.filter((_, i) => i % 2 === 1)));
    for (const m of ['d5', 'c6', 'Nf6', 'Bf5', 'e6', 'Bd6', 'Nbd7']) expect(mine.has(m), m).toBe(true);
    for (const l of ls) {
      const c = new Chess();
      l.forEach((s, i) => {
        if (i % 2 === 1 && s === 'Bf5') {
          // Au moment de …Bf5 : pas à la fois un pion c4 et un cavalier c3 blancs avec le pion e3 qui laisse Qb3 (sauf la ligne principale où e3 précède Nc3).
          const both = c.get('c4')?.type === 'p' && c.get('c3')?.type === 'n';
          expect(both, `${l.slice(0, i + 1).join(' ')}`).toBe(false);
        }
        c.move(s);
      });
    }
  });

  for (const id of ['london', 'london-def']) {
    it(`${id} : vérifié par Stockfish, aucun de mes coups ne perd plus de 0,5 pion`, () => {
      const o = byId(id);
      for (const l of lines(parsePgn(o.pgn).root)) {
        const c = new Chess();
        l.forEach((s, i) => {
          const fen = c.fen();
          const m = c.move(s);
          if ((i % 2 === 0) === (o.color === 'w')) {
            const k = fenKey(fen) + ' ' + m.from + m.to + (m.promotion ?? '');
            expect(checks[id]?.[k], `${s} (${l.slice(0, i + 1).join(' ')})`).toBeDefined();
            expect(checks[id][k].loss, `${s} (${l.slice(0, i + 1).join(' ')})`).toBeLessThanOrEqual(50);
          }
        });
      }
    });
  }
});
