import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { material, moveCaption, nullMove, pieceWords, sanList, toUci } from './words';

const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };

describe('légendes en mots (une phrase, sans notation)', () => {
  it('pièces en mots, de mon point de vue', () => {
    expect(pieceWords('n', 'w', 'w')).toBe('ton cavalier');
    expect(pieceWords('q', 'b', 'w')).toBe('sa dame');
    expect(pieceWords('r', 'w', 'w')).toBe('ta tour');
  });
  it('« Son cavalier prend ton pion f7 » + fourchette dame et tour', () => {
    const fen = fenOf(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5']);
    expect(moveCaption(fen, 'Nxf7', 'b')).toBe('Son cavalier prend ton pion f7 : il attaque ta dame et ta tour en même temps (fourchette).');
    expect(moveCaption(fen, 'g5f7', 'w')).toBe('Ton cavalier prend son pion f7 : tu attaques sa dame et sa tour en même temps (fourchette).');
  });
  it('« Mat »', () => {
    const fen = fenOf(['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6']);
    expect(moveCaption(fen, 'Qxf7#', 'b')).toBe('Sa dame prend ton pion f7 : échec et mat.');
  });
  it('« Échec »', () => {
    const fen = fenOf(['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4']);
    expect(moveCaption(fen, 'Bxf7+', 'b')).toBe('Son fou prend ton pion f7 : échec.');
  });
  it('« Ta dame n’est plus défendue »', () => {
    const fen = '3rk3/8/8/8/3Q2b1/5N2/6PP/6K1 b - - 0 1';
    expect(moveCaption(fen, 'Bxf3', 'w')).toBe('Son fou prend ton cavalier f3 : ta dame n’est plus défendue.');
  });
  it('coup simple, attaque d’une pièce, roque', () => {
    expect(moveCaption(fenOf(['e4', 'e5']), 'Nf3', 'w')).toBe('Ton cavalier va en f3.');
    expect(moveCaption(fenOf(['e4', 'e5', 'Qh5']), 'Nf6', 'w')).toBe('Son cavalier va en f6 et attaque ta dame.');
    expect(moveCaption(fenOf(['e4', 'e5', 'Nf3', 'Nc6']), 'Bb5', 'b')).toBe('Son fou va en b5.');   // cavalier défendu par des pions : pas de cible
    expect(moveCaption(fenOf(['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5']), 'O-O', 'w')).toBe('Tu roques.');
  });
  it('suite en notation → coups ; coup nul ; matériel', () => {
    expect(sanList('12… Nf6 13. Bxf7+ Kxf7')).toEqual(['Nf6', 'Bxf7+', 'Kxf7']);
    expect(sanList('4. ♔xf2 Nf6 1-0')).toEqual(['♔xf2', 'Nf6']);
    expect(toUci(fenOf(['e4', 'e5']), ['Nf3', 'Nc6', 'Zz9'])).toEqual(['g1f3', 'b8c6']);
    expect(nullMove('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2')).toBe('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2');
    expect(material(fenOf(['e4', 'd5', 'exd5']), 'w')).toBe(1);
  });
});
