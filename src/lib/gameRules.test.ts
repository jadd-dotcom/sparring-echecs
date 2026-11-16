import { describe, expect, it } from 'vitest';
import { canCancel, myMovesPlayed } from './gameRules';

const moves = (n: number) => Array.from({ length: n }, () => 'a2a3');

describe('annulation d’une partie', () => {
  it('compte mes coups (Blancs et Noirs)', () => {
    expect(myMovesPlayed({ myColor: 'w', uci: moves(0) })).toBe(0);
    expect(myMovesPlayed({ myColor: 'w', uci: moves(9) })).toBe(5);
    expect(myMovesPlayed({ myColor: 'b', uci: moves(9) })).toBe(4);
    expect(myMovesPlayed({ myColor: 'b', uci: moves(10) })).toBe(5);
  });
  it('possible pendant mes 5 premiers coups, refusée après le 5e', () => {
    expect(canCancel({ myColor: 'w', uci: moves(8) })).toBe(true);   // 4 coups joués : je joue mon 5e
    expect(canCancel({ myColor: 'w', uci: moves(9) })).toBe(false);  // 5e coup joué
    expect(canCancel({ myColor: 'b', uci: moves(9) })).toBe(true);   // Noirs : 4 coups joués
    expect(canCancel({ myColor: 'b', uci: moves(10) })).toBe(false);
  });
});
