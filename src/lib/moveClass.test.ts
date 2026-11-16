import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { bookLength, classifyMove, classSummary, evalBar, mergeIndexes, moveSentence } from './moveClass';
import { buildIndex, parsePgn } from './repertoire';

describe('classement des coups', () => {
  it('seuils façon Chess.com', () => {
    expect(classifyMove({ isBest: true, drop: 0 })).toBe('best');
    expect(classifyMove({ isBest: false, drop: 0 })).toBe('excellent');
    expect(classifyMove({ isBest: false, drop: 3 })).toBe('excellent');
    expect(classifyMove({ isBest: false, drop: 3.1 })).toBe('good');
    expect(classifyMove({ isBest: false, drop: 9.9 })).toBe('good');
    expect(classifyMove({ isBest: false, drop: 10 })).toBe('inaccuracy');
    expect(classifyMove({ isBest: false, drop: 19.9 })).toBe('inaccuracy');
    expect(classifyMove({ isBest: false, drop: 20 })).toBe('mistake');
    expect(classifyMove({ isBest: false, drop: 29.9 })).toBe('mistake');
    expect(classifyMove({ isBest: false, drop: 30 })).toBe('blunder');
  });
  it('Livre prioritaire, même sur un coup qui n’est pas le meilleur', () => {
    expect(classifyMove({ isBest: false, drop: 12, isBook: true })).toBe('book');
  });
  it('phrase sous l’échiquier', () => {
    expect(moveSentence('♔d2', 'blunder', '♕h5+')).toBe('♔d2 est une gaffe. Meilleur : ♕h5+');
    expect(moveSentence('♘f3', 'best', '♘f3')).toBe('♘f3 est le meilleur coup.');
    expect(moveSentence('e4', 'book', 'd4')).toBe('e4 est un coup du livre (ton répertoire).');
  });
});

describe('livre et bilan', () => {
  const uci = (sans: string[]) => { const c = new Chess(); return sans.map((s) => { const m = c.move(s); return m.from + m.to; }); };
  const qgd = buildIndex(parsePgn('1. d4 d5 2. c4 e6 3. Nc3 Nf6 *').root);
  const fr = buildIndex(parsePgn('1. e4 e6 2. d4 d5 *').root);
  it('phase « livre » : coups du répertoire depuis le début (les deux camps)', () => {
    expect(bookLength(qgd, new Chess().fen(), uci(['d4', 'd5', 'c4', 'e6', 'Nf3']))).toBe(4);
    expect(bookLength(qgd, new Chess().fen(), uci(['d4', 'Nf6', 'c4']))).toBe(1);
    expect(bookLength(mergeIndexes([qgd, fr]), new Chess().fen(), uci(['e4', 'e6', 'd4', 'd5', 'Nc3']))).toBe(4);
  });
  it('bilan par catégorie, pour moi et pour Maia', () => {
    const plies = [0, 1, 2, 3, 4, 5].map((ply) => ({ ply, cls: (['best', 'good', 'blunder', 'excellent', 'mistake', 'best'] as const)[ply] }));
    const s = classSummary(plies, 'b', 2);
    expect(s.maia).toMatchObject({ book: 1, blunder: 1, mistake: 1 });
    expect(s.me).toMatchObject({ book: 1, excellent: 1, best: 1 });
  });
  it('barre d’évaluation (point de vue des Blancs)', () => {
    expect(evalBar({ cp: 120 }, 'w').label).toBe('+1.2');
    expect(evalBar({ cp: 120 }, 'b').label).toBe('-1.2');
    expect(evalBar({ mate: 3 }, 'b')).toEqual({ wpWhite: 0, label: '-M3' });
    expect(evalBar({ mate: 0 }, 'b')).toEqual({ wpWhite: 100, label: '1-0' });
    expect(evalBar({ cp: 0 }, 'w').wpWhite).toBeCloseTo(50);
  });
});
