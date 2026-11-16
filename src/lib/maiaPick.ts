// Choix du coup de Maia : tirage selon ses probabilités, coups < 3 % ignorés.
export const MIN_MOVE_PROB = 0.03;

export function pickMove(
  probs: Iterable<[string, number]>,
  rand: () => number = Math.random,
  minProb = MIN_MOVE_PROB,
): string {
  const all = [...probs].sort((a, b) => b[1] - a[1]);
  if (all.length === 0) throw new Error('aucun coup');
  let kept = all.filter(([, p]) => p >= minProb);
  if (kept.length === 0) kept = [all[0]];
  const total = kept.reduce((s, [, p]) => s + p, 0);
  let x = rand() * total;
  for (const [m, p] of kept) {
    x -= p;
    if (x < 0) return m;
  }
  return kept[kept.length - 1][0];
}
