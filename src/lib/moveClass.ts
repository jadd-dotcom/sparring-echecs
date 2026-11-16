// Classement de chaque coup (les miens et ceux de Maia), façon Chess.com, d'après la chute de % de gain du joueur qui joue.
import { Chess } from 'chess.js';
import { fenKey, type IndexEntry } from './repertoire';
import type { Eval } from './winpct';
import { evalToCp, winPercent } from './winpct';

export type MoveClass = 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'blunder';

export const CLASS_ORDER: MoveClass[] = ['book', 'best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder'];
export const CLASS_ICON: Record<MoveClass, string> = {
  best: '★', excellent: '👍', good: '✓', book: '📖', inaccuracy: '?!', mistake: '?', blunder: '??',
};
export const CLASS_LABEL: Record<MoveClass, string> = {
  best: 'Meilleur', excellent: 'Excellent', good: 'Bon', book: 'Livre', inaccuracy: 'Imprécision', mistake: 'Erreur', blunder: 'Gaffe',
};
/** Couleurs des pastilles (texte blanc). */
export const CLASS_COLOR: Record<MoveClass, string> = {
  best: '#3e9b4f', excellent: '#5a9e3a', good: '#7a9a5c', book: '#a5845c', inaccuracy: '#d4a017', mistake: '#e07b1f', blunder: '#c9322b',
};

/**
 * Classe d'un coup : Livre (coup de mon répertoire en ouverture) ; Meilleur (= coup de Stockfish) ;
 * sinon selon la chute de % de gain : Excellent ≤ 3, Bon < 10, Imprécision 10-20, Erreur 20-30, Gaffe ≥ 30.
 */
export function classifyMove(o: { isBest: boolean; drop: number; isBook?: boolean }): MoveClass {
  if (o.isBook) return 'book';
  if (o.isBest) return 'best';
  if (o.drop <= 3) return 'excellent';
  if (o.drop < 10) return 'good';
  if (o.drop < 20) return 'inaccuracy';
  if (o.drop < 30) return 'mistake';
  return 'blunder';
}

/**
 * Phrase sous l'échiquier, ex. « ♔d2 est une gaffe : le ♗e7 menaçait de prendre ta ♕h4 (menace ignorée). Meilleur : ♕h5+ ».
 * (`san`, `best` et `reason` déjà mis en forme ; `motif` = libellé du motif.)
 */
export function moveSentence(san: string, cls: MoveClass, best?: string | null, reason?: string | null, motif?: string | null): string {
  const what: Record<MoveClass, string> = {
    best: 'le meilleur coup', excellent: 'excellent', good: 'un bon coup', book: 'un coup du livre (ton répertoire)',
    inaccuracy: 'une imprécision', mistake: 'une erreur', blunder: 'une gaffe',
  };
  const why = reason ? ` : ${reason}${motif ? ` (${motif.toLowerCase()})` : ''}` : '';
  const s = `${san} est ${what[cls]}${why}.`;
  return best && cls !== 'best' && cls !== 'book' ? `${s} Meilleur : ${best}` : s;
}

/** Nombre de demi-coups initiaux joués « dans le livre » (positions et coups présents dans l'index du répertoire). */
export function bookLength(idx: Map<string, IndexEntry>, startFen: string, uci: string[]): number {
  const c = new Chess(startFen);
  let n = 0;
  for (const u of uci) {
    const e = idx.get(fenKey(c.fen()));
    if (!e || !e.moves.has(u)) break;
    c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    n++;
  }
  return n;
}

/** Fusionne plusieurs index de répertoire (ex. toutes les ouvertures de ma couleur pour une partie libre). */
export function mergeIndexes(list: Map<string, IndexEntry>[]): Map<string, IndexEntry> {
  const out = new Map<string, IndexEntry>();
  for (const idx of list) for (const [k, e] of idx) {
    const cur = out.get(k);
    if (!cur) out.set(k, { moves: new Map(e.moves), path: e.path });
    else for (const [u, s] of e.moves) cur.moves.set(u, s);
  }
  return out;
}

export interface PlyLike { ply: number; cls: MoveClass }

/** Bilan par catégorie, pour moi et pour Maia. `bookPlies` = longueur de la phase « livre ». */
export function classSummary(plies: PlyLike[], myColor: 'w' | 'b', bookPlies = 0, whiteStarts = true) {
  const empty = () => Object.fromEntries(CLASS_ORDER.map((c) => [c, 0])) as Record<MoveClass, number>;
  const me = empty(), maia = empty();
  for (const p of plies) {
    const cls = p.ply < bookPlies ? 'book' : p.cls;
    const white = whiteStarts ? p.ply % 2 === 0 : p.ply % 2 === 1;
    ((white ? 'w' : 'b') === myColor ? me : maia)[cls]++;
  }
  return { me, maia };
}

/** Barre d'évaluation : % de gain des Blancs et libellé (+1.2, M3, -M2, 1-0). Éval donnée du point de vue du camp au trait. */
export function evalBar(e: Eval, sideToMove: 'w' | 'b'): { wpWhite: number; label: string } {
  const sign = sideToMove === 'w' ? 1 : -1;
  if ('mate' in e) {
    if (e.mate === 0) return sideToMove === 'w' ? { wpWhite: 0, label: '0-1' } : { wpWhite: 100, label: '1-0' };
    const m = e.mate * sign;
    return { wpWhite: m > 0 ? 100 : 0, label: `${m > 0 ? '' : '-'}M${Math.abs(m)}` };
  }
  const cpWhite = evalToCp(e) * sign;
  const wp = winPercent({ cp: cpWhite });
  return { wpWhite: wp, label: `${cpWhite >= 0 ? '+' : ''}${(cpWhite / 100).toFixed(1)}` };
}
