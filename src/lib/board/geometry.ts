// Géométrie de l'échiquier, sans échiquier : cases, couleurs, diagonales, cavalier, fou. Fonctions pures.

export const FILES = 'abcdefgh';
export const RANKS = '12345678';
export const SQUARES: string[] = [...RANKS].flatMap((r) => [...FILES].map((f) => f + r));

/** Colonne 1..8 (a=1 … h=8) et rangée 1..8. */
export const fileNo = (sq: string) => FILES.indexOf(sq[0]) + 1;
export const rankNo = (sq: string) => Number(sq[1]);
export const sq = (file: number, rank: number) => FILES[file - 1] + rank;
export const isSquare = (s: string) => /^[a-h][1-8]$/.test(s);

/** Couleur d'une case : colonne + rangée paire → foncée (a1 foncée, h1 claire). */
export const isDark = (s: string) => (fileNo(s) + rankNo(s)) % 2 === 0;
export const colorName = (s: string) => (isDark(s) ? 'foncée' : 'claire');

/** Même diagonale : écart de colonnes = écart de rangées (et cases différentes). */
export function sameDiagonal(a: string, b: string): boolean {
  const df = Math.abs(fileNo(a) - fileNo(b));
  const dr = Math.abs(rankNo(a) - rankNo(b));
  return df === dr && df > 0;
}

/** Cases strictement entre a et b sur leur diagonale (vide si pas sur la même diagonale). */
export function between(a: string, b: string): string[] {
  if (!sameDiagonal(a, b)) return [];
  const sf = Math.sign(fileNo(b) - fileNo(a)), sr = Math.sign(rankNo(b) - rankNo(a));
  const out: string[] = [];
  for (let f = fileNo(a) + sf, r = rankNo(a) + sr; f !== fileNo(b); f += sf, r += sr) out.push(sq(f, r));
  return out;
}

const KNIGHT: [number, number][] = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const inBoard = (f: number, r: number) => f >= 1 && f <= 8 && r >= 1 && r <= 8;

/** Cases atteintes par un cavalier (échiquier vide), triées a1 → h8. */
export function knightMoves(s: string): string[] {
  const f = fileNo(s), r = rankNo(s);
  return KNIGHT.filter(([df, dr]) => inBoard(f + df, r + dr)).map(([df, dr]) => sq(f + df, r + dr)).sort(bySquare);
}

/** Nombre minimum de coups de cavalier de a à b (échiquier vide). */
export function knightDistance(a: string, b: string): number {
  if (a === b) return 0;
  const dist = new Map<string, number>([[a, 0]]);
  const queue = [a];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const n of knightMoves(cur)) {
      if (dist.has(n)) continue;
      dist.set(n, dist.get(cur)! + 1);
      if (n === b) return dist.get(n)!;
      queue.push(n);
    }
  }
  return -1;
}

/** Cases attaquées par un fou (échiquier vide). */
export function bishopMoves(s: string): string[] {
  return SQUARES.filter((t) => sameDiagonal(s, t)).sort(bySquare);
}

/** Un fou en `from` attaque-t-il `to` (échiquier vide) ? */
export const bishopAttacks = (from: string, to: string) => sameDiagonal(from, to);

/** Tri des cases : par colonne puis par rangée (a1, a2, …, h8). */
export function bySquare(a: string, b: string): number {
  return fileNo(a) - fileNo(b) || rankNo(a) - rankNo(b);
}

/** Case vue à l'écran (ligne, colonne 0..7 depuis le haut à gauche) selon le côté (Blancs en bas ou Noirs en bas). */
export function screenPos(s: string, side: 'w' | 'b'): { row: number; col: number } {
  return side === 'w' ? { row: 8 - rankNo(s), col: fileNo(s) - 1 } : { row: rankNo(s) - 1, col: 8 - fileNo(s) };
}
