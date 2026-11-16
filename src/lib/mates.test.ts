import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import {
  applySymmetry, pickPrecomputed, exerciseOutcome, flagsAfterMyMove, moveLimit, stalemateTraps, generatePosition, hangingPieces, isValidExercise, levelProgress,
  MATE_LEVELS, mulberry32, unlockedLevels,
} from './mates';

const play = (fen: string, sans: string[]) => { const c = new Chess(fen); sans.forEach((s) => c.move(s)); return c; };

describe('positions générées', () => {
  for (const level of MATE_LEVELS.filter((l) => l.available)) {
    it(`${level.name} : 200 positions légales et conformes`, () => {
      const rand = mulberry32(42);
      let central = 0;
      for (let i = 0; i < 200; i++) {
        const fen = generatePosition(level, rand);
        expect(isValidExercise(fen, level), fen).toBe(true);
        expect(hangingPieces(fen, 'w'), fen).toEqual([]);
        const bk = new Chess(fen).board().flat().find((p) => p && p.type === 'k' && p.color === 'b')!.square;
        if ('cdef'.includes(bk[0]) && '3456'.includes(bk[1])) central++;
        if (level.id === 'kbb') {
          const bs = new Chess(fen).board().flat().filter((p) => p && p.type === 'b').map((p) => p!.square);
          const light = (s: string) => ('abcdefgh'.indexOf(s[0]) + Number(s[1]) - 1) % 2 === 1;
          expect(light(bs[0])).not.toBe(light(bs[1])); // fous de couleurs opposées
        }
      }
      expect(central).toBeGreaterThan(130); // roi adverse plutôt au centre
    });
  }
  it('reproductible avec la même graine', () => {
    const l = MATE_LEVELS[0];
    expect(generatePosition(l, mulberry32(7))).toBe(generatePosition(l, mulberry32(7)));
  });
  it('rejette les positions illégales', () => {
    const kq = MATE_LEVELS[0];
    expect(isValidExercise('8/8/8/3k4/8/8/8/3QK3 w - - 0 1', kq)).toBe(false); // roi noir en échec, trait aux Blancs
    expect(isValidExercise('8/8/8/3k4/3K4/8/8/7Q w - - 0 1', kq)).toBe(false); // rois adjacents
    expect(isValidExercise('8/8/8/3k4/8/8/7Q/4K3 w - - 0 1', kq)).toBe(true);
    expect(isValidExercise('8/8/8/3k4/8/8/8/4K2Q w - - 0 1', kq)).toBe(false); // échec par la diagonale h1-d5
    expect(isValidExercise('8/8/8/3k4/8/8/8/4K2R w - - 0 1', kq)).toBe(false); // mauvaises pièces
  });
});

describe('issue de l’exercice', () => {
  it('mat détecté', () => {
    const c = play('7k/8/6K1/8/8/8/Q7/8 w - - 0 1', ['Qa8#']);
    expect(exerciseOutcome(c, 1)).toBe('mate');
  });
  it('pat détecté', () => {
    const c = play('7k/8/5K2/8/8/8/8/6Q1 w - - 0 1', ['Qg6']);
    expect(c.isStalemate()).toBe(true);
    expect(exerciseOutcome(c, 1)).toBe('stalemate');
  });
  it('pièce perdue', () => {
    const c = play('8/8/8/3k4/8/2R5/8/6K1 w - - 0 1', ['Rc4', 'Kxc4']);
    expect(exerciseOutcome(c, 1)).toBe('piece-lost');
  });
  it('règle des 50 coups', () => {
    const c = new Chess('8/8/8/3k4/8/2R5/8/6K1 w - - 98 80');
    c.move('Rc2'); c.move('Ke4');
    expect(exerciseOutcome(c, 1)).toBe('fifty-moves');
  });
  it('partie en cours', () => {
    expect(exerciseOutcome(play('8/8/8/3k4/8/2R5/8/6K1 w - - 0 1', ['Rc2']), 1)).toBeNull();
  });
});

describe('alertes', () => {
  it('coups pièges (pour les leçons) : coups légaux qui feraient pat', () => {
    // Roi noir h8, roi blanc f6, dame g1 : Qg6 fait pat (Qg7# mate, la plupart des autres coups sont neutres).
    const traps = stalemateTraps('7k/8/5K2/8/8/8/8/6Q1 w - - 0 1');
    expect(traps).toContain('Qg6');
    expect(traps).not.toContain('Qg7#');
    expect(stalemateTraps('8/8/8/3k4/8/2R5/8/6K1 w - - 0 1')).toEqual([]); // roi au centre : aucun pat possible
  });
  it('pièce sans protection', () => {
    const c = play('8/8/8/3k4/8/2R5/8/6K1 w - - 0 1', ['Rc4']);
    expect(flagsAfterMyMove(c.fen(), 0, 'Rc4').map((f) => f.kind)).toEqual(['unprotected']);
  });
  it('rien à signaler', () => {
    const c = play('8/8/8/3k4/8/2R5/8/6K1 w - - 0 1', ['Rc1']);
    expect(flagsAfterMyMove(c.fen(), 0, 'Rc1')).toEqual([]);
  });
});

describe('validation et déblocage', () => {
  const ok = { outcome: 'mate' as const, myMoves: 12, minMoves: 9 };
  const slow = { outcome: 'mate' as const, myMoves: 20, minMoves: 9 };   // limite max(19, 18) = 19
  const fail = { outcome: 'stalemate' as const, myMoves: 15, minMoves: 9 };
  it('limite = max(minimum + 10, 2 × minimum), plafonnée à 50', () => {
    expect(moveLimit(3)).toBe(13);    // +10 l'emporte
    expect(moveLimit(10)).toBe(20);   // égalité
    expect(moveLimit(16)).toBe(32);   // 2 × minimum (tour seule, la boîte)
    expect(moveLimit(19)).toBe(38);   // deux fous, cas le plus long
    expect(moveLimit(30)).toBe(50);   // plafond
  });
  it('un mat compte s’il est dans la limite', () => {
    expect(levelProgress([{ outcome: 'mate', myMoves: 32, minMoves: 16 }]).streak).toBe(1);
    expect(levelProgress([{ outcome: 'mate', myMoves: 33, minMoves: 16 }]).streak).toBe(0);
    expect(levelProgress([{ outcome: 'mate', myMoves: 13, minMoves: 3 }]).streak).toBe(1);
    expect(levelProgress([{ outcome: 'mate', myMoves: 14, minMoves: 3 }]).streak).toBe(0);
  });
  it('3 réussites d’affilée dans la limite', () => {
    expect(levelProgress([ok, ok]).validated).toBe(false);
    expect(levelProgress([ok, ok, ok]).validated).toBe(true);
    expect(levelProgress([ok, ok, slow, ok]).streak).toBe(1);
    expect(levelProgress([ok, fail, ok, ok]).validated).toBe(false);
    expect(levelProgress([ok, ok, ok, fail])).toEqual({ streak: 0, validated: true }); // validé reste validé
  });
  it('déblocage dans l’ordre, niveau 5 « plus tard »', () => {
    expect([...unlockedLevels(new Set())]).toEqual(['kq']);
    expect([...unlockedLevels(new Set(['kq']))]).toEqual(['kq', 'krr']);
    expect([...unlockedLevels(new Set(['kq', 'krr', 'kr', 'kbb']))]).toEqual(['kq', 'krr', 'kr', 'kbb']);
  });
});

describe('symétries du plateau', () => {
  const fen = '1B6/8/K7/3B1k2/8/8/8/8 w - - 0 1';
  it('les 8 symétries donnent 8 positions distinctes, légales et conformes', () => {
    const kbb = MATE_LEVELS.find((l) => l.id === 'kbb')!;
    const out = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => applySymmetry(fen, k));
    expect(new Set(out).size).toBe(8);
    for (const f of out) expect(isValidExercise(f, kbb), f).toBe(true);
    expect(out[0]).toBe(fen);
    expect(applySymmetry(fen, 1)).toBe('6B1/8/7K/2k1B3/8/8/8/8 w - - 0 1'); // miroir gauche-droite : d5→e5, f5→c5
  });
  it('appliquer deux fois un miroir revient au départ', () => {
    for (const k of [1, 2, 3, 4, 5]) expect(applySymmetry(applySymmetry(fen, k), k)).toBe(fen);
    expect(applySymmetry(applySymmetry(fen, 6), 7)).toBe(fen); // 90° puis 270°
  });
  it('le mat en 1 reste un mat en 1 après symétrie', () => {
    const m1 = '7k/8/6K1/8/8/8/Q7/8 w - - 0 1'; // Qa8#
    for (let k = 0; k < 8; k++) {
      const c = new Chess(applySymmetry(m1, k));
      const mates = c.moves({ verbose: true }).filter((m) => { c.move(m); const ok = c.isCheckmate(); c.undo(); return ok; });
      expect(mates.length, `symétrie ${k}`).toBeGreaterThan(0);
    }
  });
  it('tirage : position, symétrie et mat en N', () => {
    const r = pickPrecomputed([{ fen, mate: 16 }], mulberry32(3))!;
    expect(r.minMoves).toBe(16);
    expect(r.fen).toBe(applySymmetry(fen, r.symmetry));
    expect(pickPrecomputed([], Math.random)).toBeNull();
  });
});
