// Conversion éval → % de gain (formule Lichess) et classement des erreurs.

/** Éval moteur normalisée, du point de vue d'un camp donné. */
export type Eval = { cp: number } | { mate: number };

const MATE_CP = 10000;

/** Centipions équivalents (un mat vaut ±10000 moins la distance). */
export function evalToCp(e: Eval): number {
  if ('cp' in e) return e.cp;
  if (e.mate === 0) return -MATE_CP; // côté au trait maté
  return e.mate > 0 ? MATE_CP - e.mate * 10 : -MATE_CP - e.mate * 10;
}

export function winPercentFromCp(cp: number): number {
  const c = Math.max(-1000, Math.min(1000, cp)); // Lichess borne à ±1000
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1);
}

export const winPercent = (e: Eval) => winPercentFromCp(evalToCp(e));

export type Severity = 'ok' | 'inaccuracy' | 'mistake' | 'blunder';

export const THRESHOLDS = { inaccuracy: 10, mistake: 20, blunder: 30 } as const;

/** Classement d'un coup selon la chute de % de gain (en points). */
export function classify(drop: number): Severity {
  if (drop >= THRESHOLDS.blunder) return 'blunder';
  if (drop >= THRESHOLDS.mistake) return 'mistake';
  if (drop >= THRESHOLDS.inaccuracy) return 'inaccuracy';
  return 'ok';
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  ok: 'Bon coup',
  inaccuracy: 'Imprécision',
  mistake: 'Erreur',
  blunder: 'Gaffe',
};

/** Tolérance en révision : juste si le coup perd ≤ 5 pts. */
export const REVIEW_TOLERANCE = 5;
export const isReviewMoveOk = (isBest: boolean, drop: number) => isBest || drop <= REVIEW_TOLERANCE;
