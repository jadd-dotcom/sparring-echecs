import { describe, expect, it } from 'vitest';
import { fig, unfig } from './notation';

describe('notation à figurines', () => {
  it('coups de pièces', () => {
    expect(fig('Nf3')).toBe('♘f3');
    expect(fig('Bxf7+')).toBe('♗xf7+');
    expect(fig('Qa3#')).toBe('♕a3#');
    expect(fig('Kc6')).toBe('♔c6');
    expect(fig('Rxe8')).toBe('♖xe8');
  });
  it('désambiguïsation', () => {
    expect(fig('Nbd2')).toBe('♘bd2');
    expect(fig('R1a3')).toBe('♖1a3');
    expect(fig('Qh4xe1')).toBe('♕h4xe1');
  });
  it('rien pour les pions ; promotions et roques', () => {
    expect(fig('e4')).toBe('e4');
    expect(fig('exd5')).toBe('exd5');
    expect(fig('e8=Q+')).toBe('e8=♕+');
    expect(fig('bxa1=N')).toBe('bxa1=♘');
    expect(fig('O-O-O')).toBe('O-O-O');
  });
  it('suites numérotées et phrases', () => {
    expect(fig('1. d4 d5 2. Bf4 Nf6 3. e3')).toBe('1. d4 d5 2. ♗f4 ♘f6 3. e3');
    expect(fig('12… Nf6 13. Bxf7+ Kxf7')).toBe('12… ♘f6 13. ♗xf7+ ♔xf7');
    expect(fig('Refusée (perte > 0,5 pion) : Qg5 (−858 cp, Stockfish : Nf6)')).toBe('Refusée (perte > 0,5 pion) : ♕g5 (−858 cp, Stockfish : ♘f6)');
    expect(fig('Nouvelle ligne, Bravo, Roi, Quand, Ka')).toBe('Nouvelle ligne, Bravo, Roi, Quand, Ka');
    expect(fig('Ici, Qc7 ferait pat : on amène plutôt le roi.')).toBe('Ici, ♕c7 ferait pat : on amène plutôt le roi.');
  });
  it('aller-retour', () => {
    const s = '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. O-O b5 5. e8=Q';
    expect(unfig(fig(s))).toBe(s);
  });
});
