import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import {
  addLine, buildIndex, drillPositions, fenKey, findBookExit, forcedMove, lines, myMoves,
  newRoot, parsePgn, removeLine, START_FEN, toPgn,
} from './repertoire';

const QGD = `[Event "GDR"]

1. d4 d5 2. c4 e6 3. Nc3 (3. Nf3 Nf6 4. g3 Be7) 3... Nf6 4. Bg5 Be7 {Orthodoxe} 5. e3 O-O!? $1 *`;

/** Rejoue des SAN et renvoie les coups UCI. */
function fenAfter(sans: string[]) {
  const c = new Chess();
  sans.forEach((s) => c.move(s));
  return c.fen();
}
function uci(sans: string[]) {
  const c = new Chess();
  return sans.map((s) => { const m = c.move(s); return m.from + m.to + (m.promotion ?? ''); });
}

describe('PGN', () => {
  it('lit les variantes, commentaires et NAG', () => {
    const { root, games } = parsePgn(QGD);
    expect(games).toBe(1);
    expect(lines(root).map((l) => l.join(' '))).toEqual([
      'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O',
      'd4 d5 c4 e6 Nf3 Nf6 g3 Be7',
    ]);
  });
  it('réécrit en PGN puis relit à l’identique', () => {
    const { root } = parsePgn(QGD);
    const pgn = toPgn(root);
    expect(pgn).toContain('3. Nc3 (3. Nf3 Nf6 4. g3 Be7) 3... Nf6');
    expect(lines(parsePgn(pgn).root)).toEqual(lines(root));
  });
  it('fusionne plusieurs chapitres (étude Lichess) et ignore les FEN non standard', () => {
    const study = `[Event "Étude: A"]\n[ChapterName "A"]\n\n1. e4 e6 2. d4 d5 *\n\n[Event "Étude: B"]\n[ChapterName "B"]\n\n1. e4 e6 2. d3 d5 *\n\n[Event "Étude: C"]\n[FEN "8/8/8/8/8/8/8/K6k w - - 0 1"]\n\n1. Kb1 *\n`;
    const r = parsePgn(study);
    expect(r.games).toBe(2);
    expect(r.skipped.length).toBe(1);
    expect(lines(r.root).length).toBe(2);
  });
  it('refuse un coup illégal avec un message clair', () => {
    expect(() => parsePgn('1. e4 e5 2. Ke3 *')).toThrow(/illégal « Ke3 » après 1. e4 e5/);
  });
});

describe('lignes', () => {
  it('ajout et suppression', () => {
    const root = newRoot();
    expect(addLine(root, ['e4', 'e6', 'd4', 'd5'])).toBe(4);
    expect(addLine(root, ['e4', 'e6', 'd3', 'd5'])).toBe(2);
    expect(lines(root).length).toBe(2);
    expect(removeLine(root, ['e4', 'e6', 'd3', 'd5'])).toBe(true);
    expect(lines(root)).toEqual([['e4', 'e6', 'd4', 'd5']]);
    expect(removeLine(root, ['e4', 'e6'])).toBe(false); // pas une ligne complète
    expect(removeLine(root, ['e4', 'e6', 'd4', 'd5'])).toBe(true);
    expect(root.children.length).toBe(0);
  });
});

describe('coups forcés', () => {
  const GDR = ['d4', 'c4'];
  it('GDR : 1.d4 puis 2.c4 imposés, ensuite libre', () => {
    expect(forcedMove(START_FEN, 0, 'b', GDR)).toBe('d2d4');
    const c = new Chess(); c.move('d4'); c.move('d5');
    expect(forcedMove(c.fen(), 2, 'b', GDR)).toBe('c2c4');
    c.move('c4'); c.move('e6');
    expect(forcedMove(c.fen(), 4, 'b', GDR)).toBeNull();
  });
  it('GDR : 2.c4 imposé aussi après 1...Nf6 (toujours légal)', () => {
    const c = new Chess(); c.move('d4'); c.move('Nf6');
    expect(forcedMove(c.fen(), 2, 'b', GDR)).toBe('c2c4');
  });
  it('jamais sur mes coups, et ignoré si illégal', () => {
    expect(forcedMove(START_FEN, 0, 'w', ['e5'])).toBeNull();
    const c = new Chess(); c.move('c4'); // c4 déjà joué → 2.c4 impossible
    c.move('e6');
    expect(forcedMove(c.fen(), 2, 'b', ['c3', 'c4'])).toBeNull();
  });
  it('Française : seulement 1.e4', () => {
    expect(forcedMove(START_FEN, 0, 'b', ['e4'])).toBe('e2e4');
    const c = new Chess(); c.move('e4'); c.move('e6');
    expect(forcedMove(c.fen(), 2, 'b', ['e4'])).toBeNull();
  });
});

describe('sortie du répertoire', () => {
  const { root } = parsePgn(QGD);
  const idx = buildIndex(root);
  it('aucune sortie si la partie suit le livre', () => {
    expect(findBookExit(idx, START_FEN, uci(['d4', 'd5', 'c4', 'e6']), 'b')).toBeNull();
  });
  it('sortie par moi : coup prévu signalé', () => {
    const ex = findBookExit(idx, START_FEN, uci(['d4', 'd5', 'c4', 'c6']), 'b')!;
    expect(ex).toMatchObject({ ply: 3, by: 'me', playedSan: 'c6', expectedSan: ['e6'] });
  });
  it('sortie par l’adversaire : trou du répertoire', () => {
    const ex = findBookExit(idx, START_FEN, uci(['d4', 'd5', 'c4', 'e6', 'cxd5']), 'b')!;
    expect(ex).toMatchObject({ ply: 4, by: 'opponent', playedSan: 'cxd5', expectedSan: ['Nc3', 'Nf3'] });
    expect(fenKey(ex.fenAfter)).toBe(fenKey(fenAfter(['d4', 'd5', 'c4', 'e6', 'cxd5'])));
  });
  it('fin du livre (feuille) : pas une erreur', () => {
    const ex = findBookExit(idx, START_FEN, uci(['d4', 'd5', 'c4', 'e6', 'Nf3', 'Nf6', 'g3', 'Be7', 'Bg2']), 'b')!;
    expect(ex.by).toBe('end');
    expect(ex.ply).toBe(8);
  });
  it('transposition reconnue', () => {
    // 1.c4 e6 2.d4 d5 → même position que 1.d4 d5 2.c4 e6 : la partie reste dans le livre.
    const { root: r2 } = parsePgn('1. d4 d5 2. c4 e6 3. Nc3 Nf6 *');
    const ex = findBookExit(buildIndex(r2), START_FEN, uci(['c4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6']), 'b');
    expect(ex?.ply).toBe(0); // 1.c4 n'est pas dans le livre…
    const ex2 = findBookExit(buildIndex(r2), START_FEN, uci(['d4', 'e6', 'c4', 'd5', 'Nc3', 'Nf6']), 'b');
    expect(ex2?.ply).toBe(1); // …ni 1...e6, mais
    const idx2 = buildIndex(parsePgn('1. d4 d5 (1... e6 2. c4 d5 3. Nc3 Nf6) 2. c4 e6 3. Nc3 Nf6 *').root);
    // 1.d4 e6 2.c4 d5 et 1.d4 d5 2.c4 e6 : même position, coups fusionnés (3.Nc3).
    expect(idx2.get(fenKey(fenAfter(['d4', 'd5', 'c4', 'e6'])))!.moves.size).toBe(1);
    expect(findBookExit(idx2, START_FEN, uci(['d4', 'e6', 'c4', 'd5', 'Nc3', 'Nf6']), 'b')).toBeNull();
  });
});

describe('cartes de drill', () => {
  it('une carte par position où c’est à moi de jouer', () => {
    const { root } = parsePgn(QGD);
    const d = drillPositions(root, 'b');
    // Noirs : après 1.d4, 2.c4, 3.Nc3, 3.Nf3, 4.Bg5, 4.g3 (feuille : Be7 joué), 5.e3
    expect(d.map((x) => x.acceptSan.join('/'))).toEqual(['d5', 'e6', 'Nf6', 'Be7', 'O-O', 'Nf6', 'Be7']);
    expect(new Set(d.map((x) => x.key)).size).toBe(d.length);
    expect(d[0].order).toBe(0);
  });
  it('les Blancs ont leurs propres positions', () => {
    const { root } = parsePgn(QGD);
    expect(drillPositions(root, 'w').map((x) => x.acceptSan.join('/'))).toEqual(['d4', 'c4', 'Nc3/Nf3', 'Bg5', 'e3', 'g3']);
  });
  it('myMoves liste les coups de mon camp à vérifier', () => {
    const { root } = parsePgn(QGD);
    expect(myMoves(root, 'b').map((m) => m.san)).toEqual(['d5', 'e6', 'Nf6', 'Be7', 'O-O', 'Nf6', 'Be7']);
  });
});

import { openingStats } from './openingStats';
describe('stats par ouverture', () => {
  it('parties, % de victoires, sorties, gaffes par partie', () => {
    const s = openingStats([
      { openingId: 'qgd', score: 1, bookExit: { by: 'me' }, counts: { blunder: 2 } },
      { openingId: 'qgd', score: 0, bookExit: { by: 'opponent' }, counts: { blunder: 0 } },
      { openingId: 'qgd', score: 0.5, bookExit: null },
      { openingId: 'french', score: 0, bookExit: { by: 'end' } },
      { score: 1 }, // partie libre : ignorée
    ]);
    expect(Object.keys(s).sort()).toEqual(['french', 'qgd']);
    expect(s.qgd).toMatchObject({ games: 3, myExits: 1, oppExits: 1, blundersPerGame: 1, analysed: 2 });
    expect(s.qgd.winPct).toBeCloseTo(33.33, 1);
    expect(s.french.blundersPerGame).toBeNull();
  });
});
