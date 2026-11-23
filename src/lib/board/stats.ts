// Statistiques par case (erreurs, temps de réponse) : faiblesse, tirage pondéré, cases les plus faibles.
import { SQUARES } from './geometry';

export interface SquareStat { n: number; err: number; ms: number }   // réponses, erreurs, temps total (ms)
export type SquareStats = Record<string, SquareStat>;

export type Rng = () => number;

/** Générateur pseudo-aléatoire reproductible (tests). */
export function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function recordAnswer(stats: SquareStats, square: string, ok: boolean, ms: number): SquareStats {
  const s = stats[square] ?? { n: 0, err: 0, ms: 0 };
  return { ...stats, [square]: { n: s.n + 1, err: s.err + (ok ? 0 : 1), ms: s.ms + Math.max(0, Math.round(ms)) } };
}

/**
 * Faiblesse d'une case, de 0 (sûre) à 1 : 70 % taux d'erreur, 30 % lenteur (au-delà de 1,5 s en moyenne).
 * Une case jamais vue vaut 0,3 (elle sort assez souvent pour être découverte).
 */
export function weakness(s?: SquareStat): number {
  if (!s || s.n === 0) return 0.3;
  const errRate = s.err / s.n;
  const slow = Math.min(1, Math.max(0, (s.ms / s.n - 1500) / 3000));
  return 0.7 * errRate + 0.3 * slow;
}

/** Poids de tirage : une case faible sort jusqu'à 7 fois plus souvent qu'une case sûre. */
export const weightOf = (s?: SquareStat) => 1 + 6 * weakness(s);

/** Tire une case parmi `candidates`, pondérée par la faiblesse ; `avoid` (ex. la question précédente) est exclue si possible. */
export function pickSquare(rng: Rng, stats: SquareStats, candidates: string[] = SQUARES, avoid?: string): string {
  const pool = candidates.length > 1 && avoid ? candidates.filter((c) => c !== avoid) : candidates;
  const w = pool.map((c) => weightOf(stats[c]));
  let x = rng() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { x -= w[i]; if (x <= 0) return pool[i]; }
  return pool[pool.length - 1];
}

/** Les `n` cases les plus faibles parmi celles déjà vues au moins `minN` fois. */
export function weakestSquares(stats: SquareStats, n = 10, minN = 2): { square: string; stat: SquareStat; weakness: number }[] {
  return Object.entries(stats)
    .filter(([, s]) => s.n >= minN)
    .map(([square, stat]) => ({ square, stat, weakness: weakness(stat) }))
    .sort((a, b) => b.weakness - a.weakness || b.stat.err - a.stat.err || a.square.localeCompare(b.square))
    .slice(0, n);
}
