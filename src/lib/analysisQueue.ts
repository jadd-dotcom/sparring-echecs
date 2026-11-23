// File d'analyse des parties importées : les plus récentes d'abord ; par défaut, seulement celles jouées depuis
// le 16/11/2026 (les plus anciennes restent importées sans analyse, analysables à la demande) ; temps restant estimé.

/** Date à partir de laquelle les parties importées sont analysées automatiquement : 16/11/2026, 0 h (heure de l'appareil). */
export const ANALYSIS_SINCE = new Date(2026, 10, 16).getTime();

export type AnalysisScope = 'recent' | 'old';

/** Sépare les parties à analyser : récentes (≥ `since`) et anciennes, chacune de la plus récente à la plus ancienne. */
export function splitPending<T extends { date: number }>(games: T[], since = ANALYSIS_SINCE): { recent: T[]; old: T[] } {
  const sorted = [...games].sort((a, b) => b.date - a.date);
  return { recent: sorted.filter((g) => g.date >= since), old: sorted.filter((g) => g.date < since) };
}

/**
 * Temps restant (secondes) d'après la vitesse observée, en demi-coups analysés (le travail est à peu près
 * proportionnel au nombre de positions). null tant qu'on n'a pas assez de recul (< 3 s ou < 6 demi-coups).
 */
export function estimateRemaining(o: { elapsedMs: number; pliesDone: number; pliesTotal: number }): number | null {
  if (o.elapsedMs < 3000 || o.pliesDone < 6) return null;
  const left = Math.max(0, o.pliesTotal - o.pliesDone);
  return (left * o.elapsedMs) / o.pliesDone / 1000;
}

/** « moins d'une minute », « ≈ 12 min », « ≈ 1 h 05 min ». */
export function formatEta(sec: number | null): string {
  if (sec === null) return 'calcul en cours…';
  if (sec < 60) return 'moins d’une minute';
  const min = Math.round(sec / 60);
  if (min < 60) return `≈ ${min} min`;
  return `≈ ${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
}
