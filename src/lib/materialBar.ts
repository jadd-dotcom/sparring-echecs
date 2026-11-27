// Matériel pendant la partie (comme Chess.com) : à côté du nom de chaque joueur, les pièces qu'il a prises (lues dans
// l'historique des coups, groupées : pions, cavaliers, fous, tours, dame) et « +N » pour le camp qui a plus de
// matériel sur l'échiquier (1/3/3/5/9 ; une promotion compte). Égalité : rien. Fonctions pures.
import { Chess, type Color, type PieceSymbol } from 'chess.js';

export const POINTS: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const ORDER: PieceSymbol[] = ['p', 'n', 'b', 'r', 'q'];
const START: Record<PieceSymbol, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
const NAMES: Record<PieceSymbol, [string, string]> = { p: ['pion', 'pions'], n: ['cavalier', 'cavaliers'], b: ['fou', 'fous'], r: ['tour', 'tours'], q: ['dame', 'dames'], k: ['roi', 'rois'] };
export const SIDE = { w: 'Les Blancs', b: 'Les Noirs' } as const;

export interface MaterialState {
  /** Pièces prises par chaque camp (des pièces adverses), dans l'ordre pions, cavaliers, fous, tours, dame. */
  captured: Record<Color, PieceSymbol[]>;
  /** Points sur l'échiquier : Blancs − Noirs. */
  diff: number;
}

/** Points de chaque camp sur l'échiquier (le roi ne compte pas ; une pièce promue compte pour ce qu'elle est). */
export function boardPoints(fen: string): Record<Color, number> {
  const out = { w: 0, b: 0 };
  for (const row of new Chess(fen).board()) for (const p of row) if (p) out[p.color] += POINTS[p.type];
  return out;
}

/** Pièces qui manquent dans une position de départ autre que l'initiale (prises avant le début de l'historique). */
function missingAt(fen: string): Record<Color, PieceSymbol[]> {
  const count: Record<Color, Record<PieceSymbol, number>> = { w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 } };
  for (const row of new Chess(fen).board()) for (const p of row) if (p) count[p.color][p.type]++;
  const out: Record<Color, PieceSymbol[]> = { w: [], b: [] };
  for (const victim of ['w', 'b'] as Color[]) {
    const promoted = ORDER.slice(1).reduce((n, t) => n + Math.max(0, count[victim][t] - START[t]), 0);
    const takenBy: Color = victim === 'w' ? 'b' : 'w';
    for (const t of ORDER) {
      const miss = Math.max(0, START[t] - count[victim][t] - (t === 'p' ? promoted : 0));
      for (let i = 0; i < miss; i++) out[takenBy].push(t);
    }
  }
  return out;
}

const sortPieces = (xs: PieceSymbol[]) => [...xs].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

/** État matériel après les coups `uci` joués depuis `startFen`. */
export function materialState(startFen: string, uci: string[]): MaterialState {
  const c = new Chess(startFen);
  const captured = missingAt(startFen);
  for (const u of uci) {
    const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    if (m.captured) captured[m.color].push(m.captured as PieceSymbol);
  }
  const pts = boardPoints(c.fen());
  return { captured: { w: sortPieces(captured.w), b: sortPieces(captured.b) }, diff: pts.w - pts.b };
}

/** « +N » d'un camp (null : il n'a pas plus de matériel). */
export const advantageOf = (s: MaterialState, side: Color): number | null => {
  const n = side === 'w' ? s.diff : -s.diff;
  return n > 0 ? n : null;
};

/** « Les Noirs ont 3 points de plus ». */
export const advantageLabel = (side: Color, n: number) => `${SIDE[side]} ont ${n} point${n > 1 ? 's' : ''} de plus`;

/** « Pièces prises par les Blancs : 2 pions, 1 cavalier » ; null s'il n'y en a pas. */
export function capturedLabel(side: Color, pieces: PieceSymbol[]): string | null {
  if (!pieces.length) return null;
  const parts = ORDER.map((t) => [t, pieces.filter((x) => x === t).length] as const).filter(([, n]) => n)
    .map(([t, n]) => `${n} ${NAMES[t][n > 1 ? 1 : 0]}`);
  return `Pièces prises par ${SIDE[side].toLowerCase()} : ${parts.join(', ')}`;
}

/** Pièces prises regroupées par type (pour l'affichage : un groupe = des icônes qui se chevauchent). */
export const groups = (pieces: PieceSymbol[]) => ORDER.map((t) => ({ type: t, n: pieces.filter((x) => x === t).length })).filter((g) => g.n);

/**
 * Le « +N » de l'adversaire doit-il pulser ? Oui quand son dernier coup m'a fait perdre au moins 2 points nets
 * (mon avance avant son coup − après) et qu'il a alors plus de matériel.
 */
export function lossPulse(startFen: string, uci: string[], me: Color): boolean {
  if (!uci.length) return false;
  const c = new Chess(startFen);
  uci.slice(0, -1).forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
  if (c.turn() === me) return false;                    // le dernier coup est le mien
  const before = boardPoints(c.fen());
  const u = uci[uci.length - 1];
  c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  const after = boardPoints(c.fen());
  const opp: Color = me === 'w' ? 'b' : 'w';
  const mine = (p: Record<Color, number>) => p[me] - p[opp];
  return mine(before) - mine(after) >= 2 && mine(after) < 0;
}
