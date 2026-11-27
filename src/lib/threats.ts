// Prises adverses gagnantes contre mes pièces s'il rejouait (tri rapide, sans moteur, des cartes « Lis la menace »).
import { Chess, type Square } from 'chess.js';
import { PIECE_VALUES } from './report/facts';

export interface Threat { from: string; to: string; attacker: string; target: string }

/**
 * Prises adverses gagnantes contre mes pièces : cible non défendue, ou cible de plus grande valeur que l'attaquant.
 * (Position lue avec le trait inversé, comme « si l'adversaire rejouait ».)
 */
export function threatsAgainst(fen: string, me: 'w' | 'b'): Threat[] {
  const f = fen.split(' ');
  f[1] = me === 'w' ? 'b' : 'w';
  f[3] = '-';
  let c: Chess;
  try { c = new Chess(f.join(' ')); } catch { return []; }
  const out: Threat[] = [];
  const seen = new Set<string>();
  for (const m of c.moves({ verbose: true })) {
    if (!m.captured || m.captured === 'k') continue;
    const defended = c.isAttacked(m.to as Square, me);
    const gain = PIECE_VALUES[m.captured] - (defended ? PIECE_VALUES[m.piece] : 0);
    const key = m.from + m.to;
    if (gain > 0 && !seen.has(key)) { seen.add(key); out.push({ from: m.from, to: m.to, attacker: m.piece, target: m.captured }); }
  }
  return out;
}
