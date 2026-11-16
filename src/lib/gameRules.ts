// Règles de partie : annulation (5 premiers coups) et parties non comptées.
import type { Color } from './profile';

/** On peut annuler pendant ses 5 premiers coups ; après le 5e, seulement nulle ou abandon. */
export const CANCEL_MAX_MY_MOVES = 5;

/** Nombre de coups déjà joués par moi. */
export function myMovesPlayed(g: { myColor: Color; uci: string[]; startFen?: string }): number {
  const whiteStarts = !g.startFen || g.startFen.split(' ')[1] === 'w';
  const n = g.uci.length;
  const whiteMoves = whiteStarts ? Math.ceil(n / 2) : Math.floor(n / 2);
  return g.myColor === 'w' ? whiteMoves : n - whiteMoves;
}

export const canCancel = (g: { myColor: Color; uci: string[]; startFen?: string }) => myMovesPlayed(g) < CANCEL_MAX_MY_MOVES;
