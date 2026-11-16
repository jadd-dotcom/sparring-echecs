// Précision (%) façon Lichess — formule publique (lila, AccuracyPercent.scala).
// Précision d'un coup = 103,1668 × exp(−0,04354 × chute de % de gain) − 3,1669, + 1 (bonus d'incertitude), bornée à [0, 100] ;
// 100 si le % de gain ne baisse pas. Précision d'une partie, par camp = moyenne de la moyenne pondérée (poids = volatilité :
// écart-type du % de gain sur une fenêtre glissante, borné à [0,5 ; 12]) et de la moyenne harmonique.
import { winPercentFromCp } from './winpct';

/** Éval de départ utilisée par Lichess (15 centipions pour les Blancs). */
export const INITIAL_CP = 15;

export function moveAccuracy(before: number, after: number): number {
  if (after >= before) return 100;
  const raw = 103.1668100711649 * Math.exp(-0.04354415386753951 * (before - after)) - 3.166924740191411;
  return Math.min(100, Math.max(0, raw + 1));
}

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const stdDev = (a: number[]) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length); };

/**
 * Précision des deux camps. `winWhite` = % de gain des Blancs APRÈS chaque demi-coup (un par coup joué) ;
 * la position de départ vaut 15 cp, comme chez Lichess. `whiteStarts` = les Blancs jouent le 1er coup.
 */
export function gameAccuracy(winWhite: number[], whiteStarts = true): { w: number | null; b: number | null } {
  if (!winWhite.length) return { w: null, b: null };
  const all = [winPercentFromCp(INITIAL_CP), ...winWhite];
  const windowSize = Math.min(8, Math.max(2, Math.floor(winWhite.length / 10)));
  const windows: number[][] = [];
  for (let i = 0; i < windowSize - 2; i++) windows.push(all.slice(0, windowSize));
  for (let i = 0; i + windowSize <= all.length; i++) windows.push(all.slice(i, i + windowSize));
  const weights = windows.map((xs) => Math.min(12, Math.max(0.5, stdDev(xs))));
  const per: Record<'w' | 'b', { acc: number; w: number }[]> = { w: [], b: [] };
  for (let i = 0; i + 1 < all.length; i++) {
    const white = (i % 2 === 0) === whiteStarts;
    const [prev, next] = [all[i], all[i + 1]];
    const acc = white ? moveAccuracy(prev, next) : moveAccuracy(100 - prev, 100 - next);
    per[white ? 'w' : 'b'].push({ acc, w: weights[i] ?? weights[weights.length - 1] });
  }
  const colorAcc = (xs: { acc: number; w: number }[]) => {
    if (!xs.length) return null;
    const sw = xs.reduce((s, x) => s + x.w, 0);
    const weighted = xs.reduce((s, x) => s + x.acc * x.w, 0) / sw;
    const harmonic = xs.length / xs.reduce((s, x) => s + 1 / Math.max(1, x.acc), 0);
    return (weighted + harmonic) / 2;
  };
  return { w: colorAcc(per.w), b: colorAcc(per.b) };
}
