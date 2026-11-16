// Faits calculés sur une position : matériel, phase, plateau ASCII, suites en SAN.
import { Chess } from 'chess.js';
import type { Color } from '../repertoire';

export const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Matériel total (pions compris) et hors pions, par camp. */
export function material(fen: string) {
  const out = { w: 0, b: 0, wNonPawn: 0, bNonPawn: 0 };
  const board = fen.split(' ')[0];
  for (const ch of board) {
    const t = ch.toLowerCase();
    if (!(t in PIECE_VALUES)) continue;
    const side = ch === t ? 'b' : 'w';
    out[side] += PIECE_VALUES[t];
    if (t !== 'p') out[side === 'w' ? 'wNonPawn' : 'bNonPawn'] += PIECE_VALUES[t];
  }
  return out;
}

/** Bilan matériel de mon point de vue (moi − adversaire). */
export function balance(fen: string, me: Color): number {
  const m = material(fen);
  return me === 'w' ? m.w - m.b : m.b - m.w;
}

export type Phase = 'ouverture' | 'milieu' | 'finale';
export const ENDGAME_NON_PAWN_MAX = 13;

/** Ouverture = coups 1 à 10 ; finale = chaque camp ≤ 13 pts de pièces hors pions ; sinon milieu. */
export function phaseOf(ply: number, fenBefore: string): Phase {
  if (Math.floor(ply / 2) + 1 <= 10) return 'ouverture';
  const m = material(fenBefore);
  if (m.wNonPawn <= ENDGAME_NON_PAWN_MAX && m.bNonPawn <= ENDGAME_NON_PAWN_MAX) return 'finale';
  return 'milieu';
}

/** Libellé d'un demi-coup : « 12. Nf3 » ou « 12… Nf6 ». */
export function moveLabel(ply: number, san: string) {
  const n = Math.floor(ply / 2) + 1;
  return ply % 2 === 0 ? `${n}. ${san}` : `${n}… ${san}`;
}

/** Plateau ASCII, `bottom` en bas (majuscules = Blancs, minuscules = Noirs, . = vide). */
export function asciiBoard(fen: string, bottom: Color): string {
  const rows = fen.split(' ')[0].split('/').map((r) => r.replace(/\d/g, (d) => '.'.repeat(Number(d))).split(''));
  let ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  let files = 'abcdefgh'.split('');
  let grid = rows;
  if (bottom === 'b') {
    ranks = ranks.reverse();
    files = files.reverse();
    grid = rows.slice().reverse().map((r) => r.slice().reverse());
  }
  const lines = ['  +-----------------+'];
  grid.forEach((r, i) => lines.push(`${ranks[i]} | ${r.join(' ')} |`));
  lines.push('  +-----------------+', `    ${files.join(' ')}`);
  return lines.join('\n');
}

/** Rejoue une suite UCI ; renvoie les SAN, la FEN finale et le nombre de coups légaux joués. */
export function playPv(fen: string, pv: string[], maxPlies = Infinity) {
  const c = new Chess(fen);
  const san: string[] = [];
  for (const u of pv.slice(0, maxPlies)) {
    try {
      san.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san);
    } catch { break; }
  }
  return { san, fen: c.fen(), chess: c };
}

/** Suite en notation lisible : « 13. Bxf7+ Kxf7 14. Ng5+ ». */
export function formatPv(fen: string, sans: string[]): string {
  const plyStart = (Number(fen.split(' ')[5]) - 1) * 2 + (fen.split(' ')[1] === 'b' ? 1 : 0);
  return sans.map((s, i) => {
    const ply = plyStart + i;
    if (ply % 2 === 0) return `${Math.floor(ply / 2) + 1}. ${s}`;
    return i === 0 ? `${Math.floor(ply / 2) + 1}… ${s}` : s;
  }).join(' ');
}

/** Gain matériel de l'adversaire sur les `plies` premiers demi-coups d'une suite (positif = il gagne). */
export function opponentGain(fen: string, pv: string[], me: Color, plies = 2): number {
  const end = playPv(fen, pv, plies).fen;
  return balance(fen, me) - balance(end, me);
}

/** Même position, trait à l'adversaire (« s'il rejouait ») ; prise en passant effacée. */
export function flipTurn(fen: string): string {
  const f = fen.split(' ');
  f[1] = f[1] === 'w' ? 'b' : 'w';
  f[3] = '-';
  return f.join(' ');
}
