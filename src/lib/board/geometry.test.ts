import { describe, expect, it } from 'vitest';
import {
  between, bishopAttacks, colorName, fileNo, isDark, knightDistance, knightMoves, rankNo, sameDiagonal, screenPos, SQUARES,
} from './geometry';

describe('géométrie de l’échiquier', () => {
  it('64 cases, colonnes a=1 … h=8', () => {
    expect(SQUARES).toHaveLength(64);
    expect([fileNo('a1'), fileNo('e4'), fileNo('h8'), rankNo('c6')]).toEqual([1, 5, 8, 6]);
  });
  it('couleur des cases : somme paire → foncée', () => {
    expect([isDark('a1'), isDark('h1'), isDark('h8'), isDark('a8')]).toEqual([true, false, true, false]);
    expect(colorName('f5')).toBe('claire');          // 6 + 5 = 11
    expect(colorName('e4')).toBe('claire');          // 5 + 4 = 9
    expect(colorName('d4')).toBe('foncée');          // 4 + 4 = 8
    expect(colorName('d1')).toBe('claire');          // la dame blanche sur sa couleur
    expect(colorName('d8')).toBe('foncée');
    expect(SQUARES.filter(isDark)).toHaveLength(32);
  });
  it('diagonales : écart de colonnes = écart de rangées', () => {
    expect(sameDiagonal('c1', 'h6')).toBe(true);
    expect(sameDiagonal('a1', 'h8')).toBe(true);
    expect(sameDiagonal('h1', 'a8')).toBe(true);
    expect(sameDiagonal('c1', 'h7')).toBe(false);
    expect(sameDiagonal('e4', 'e4')).toBe(false);
    expect(between('b2', 'f6')).toEqual(['c3', 'd4', 'e5']);
    expect(between('f6', 'b2')).toEqual(['e5', 'd4', 'c3']);
    expect(between('h3', 'f5')).toEqual(['g4']);
    expect(between('c4', 'd5')).toEqual([]);
    expect(between('a1', 'a5')).toEqual([]);
    expect(bishopAttacks('c4', 'f7')).toBe(true);
    expect(bishopAttacks('c4', 'f6')).toBe(false);
  });
  it('cavalier : cases et distances exactes', () => {
    expect(knightMoves('g1')).toEqual(['e2', 'f3', 'h3']);
    expect(knightMoves('b1')).toEqual(['a3', 'c3', 'd2']);
    expect(knightMoves('a1')).toEqual(['b3', 'c2']);
    expect(knightMoves('e4')).toHaveLength(8);
    expect(knightMoves('d4')).toEqual(['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5']);
    expect(knightDistance('b1', 'd4')).toBe(3);   // b1-c3-b5-d4 (pas en 2)
    expect(knightDistance('g1', 'f3')).toBe(1);
    expect(knightDistance('b1', 'c3')).toBe(1);
    expect(knightDistance('e4', 'e5')).toBe(3);
    expect(knightDistance('a1', 'b2')).toBe(4);   // le cas célèbre : coin et case voisine en diagonale
    expect(knightDistance('a1', 'h8')).toBe(6);
    expect(knightDistance('d4', 'd4')).toBe(0);
    // Distance maximale sur l'échiquier : 6
    expect(Math.max(...SQUARES.flatMap((a) => SQUARES.map((b) => knightDistance(a, b))))).toBe(6);
  });
  it('position à l’écran selon le côté', () => {
    expect(screenPos('a1', 'w')).toEqual({ row: 7, col: 0 });
    expect(screenPos('a1', 'b')).toEqual({ row: 0, col: 7 });
    expect(screenPos('h8', 'b')).toEqual({ row: 7, col: 0 });
  });
});
