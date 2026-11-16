// Mats élémentaires contre un roi seul : niveaux, positions aléatoires légales,
// issue d'un exercice, alertes (pat frôlé, pièce sans protection), validation d'un niveau.
import { Chess, type Square } from 'chess.js';

export type MateLevelId = 'kq' | 'krr' | 'kr' | 'kbb' | 'kbn';

export interface MateLevel {
  id: MateLevelId;
  name: string;
  short: string;
  pieces: ('Q' | 'R' | 'B' | 'N')[];   // mes pièces en plus du roi
  available: boolean;                  // « plus tard » = false
}

export const MATE_LEVELS: MateLevel[] = [
  { id: 'kq', name: 'Dame + roi contre roi', short: 'D+R', pieces: ['Q'], available: true },
  { id: 'krr', name: 'Deux tours contre roi (l’échelle)', short: 'T+T', pieces: ['R', 'R'], available: true },
  { id: 'kr', name: 'Tour + roi contre roi (la boîte)', short: 'T+R', pieces: ['R'], available: true },
  { id: 'kbb', name: 'Deux fous + roi contre roi', short: 'F+F+R', pieces: ['B', 'B'], available: true },
  { id: 'kbn', name: 'Fou + cavalier + roi contre roi', short: 'F+C+R', pieces: ['B', 'N'], available: false },
];

/** Niveau validé après 3 réussites d'affilée dans la limite de coups. */
export const STREAK_TO_VALIDATE = 3;
export const EXTRA_MOVES_ALLOWED = 10;
export const MAX_MOVE_LIMIT = 50;

/**
 * Limite de coups pour qu'un mat compte : max(minimum + 10, 2 × minimum), plafonnée à 50.
 * (Avec le minimum exact, +10 seul est trop strict pour une méthode humaine comme la boîte.)
 */
export const moveLimit = (minMoves: number) => Math.min(MAX_MOVE_LIMIT, Math.max(minMoves + EXTRA_MOVES_ALLOWED, 2 * minMoves));

// ---------------------------------------------------------------- hasard reproductible

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FILES = 'abcdefgh';
const sqName = (f: number, r: number) => (FILES[f] + (r + 1)) as Square;
const sqCoords = (s: string) => [FILES.indexOf(s[0]), Number(s[1]) - 1] as const;
const isLight = (s: string) => { const [f, r] = sqCoords(s); return (f + r) % 2 === 1; };
const kingDist = (a: string, b: string) => { const [af, ar] = sqCoords(a); const [bf, br] = sqCoords(b); return Math.max(Math.abs(af - bf), Math.abs(ar - br)); };

function fenFromPlacement(pl: Record<string, string>, turn: 'w' | 'b'): string {
  const rows: string[] = [];
  for (let r = 7; r >= 0; r--) {
    let row = '', empty = 0;
    for (let f = 0; f < 8; f++) {
      const p = pl[sqName(f, r)];
      if (p) { if (empty) row += empty; empty = 0; row += p; } else empty++;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  return `${rows.join('/')} ${turn} - - 0 1`;
}

/** Même position, trait à l'autre camp. */
const flip = (fen: string) => { const f = fen.split(' '); f[1] = f[1] === 'w' ? 'b' : 'w'; f[3] = '-'; return f.join(' '); };

/** Mes pièces attaquées par le roi adverse et non protégées (cases). */
export function hangingPieces(fen: string, me: 'w' | 'b'): string[] {
  const c = new Chess(fen);
  const opp = me === 'w' ? 'b' : 'w';
  const out: string[] = [];
  for (const row of c.board()) for (const p of row) {
    if (!p || p.color !== me || p.type === 'k') continue;
    if (c.isAttacked(p.square, opp) && !c.isAttacked(p.square, me)) out.push(p.square);
  }
  return out;
}

export interface GenOptions { centerBias?: number }

/**
 * Position de départ aléatoire et légale : j'ai les Blancs et le trait ; le roi noir est plutôt au centre.
 * Rejette : roi noir en échec, pièce blanche attaquée et non protégée, roi noir avec moins de 2 cases,
 * fous de même couleur.
 */
export function generatePosition(level: MateLevel, rand: () => number, opts: GenOptions = {}): string {
  const centerBias = opts.centerBias ?? 0.8;
  const pick = (squares: string[]) => squares[Math.floor(rand() * squares.length)];
  const all: string[] = [];
  for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) all.push(sqName(f, r));
  const center = all.filter((s) => { const [f, r] = sqCoords(s); return f >= 2 && f <= 5 && r >= 2 && r <= 5; });
  const inner = all.filter((s) => { const [f, r] = sqCoords(s); return f >= 1 && f <= 6 && r >= 1 && r <= 6; });
  for (let attempt = 0; attempt < 10000; attempt++) {
    const pl: Record<string, string> = {};
    const bk = rand() < centerBias ? pick(center) : pick(inner);
    pl[bk] = 'k';
    const wk = pick(all.filter((s) => kingDist(s, bk) >= 2));
    pl[wk] = 'K';
    let ok = true;
    for (const piece of level.pieces) {
      const free = all.filter((s) => !pl[s]);
      const s = pick(free);
      pl[s] = piece;
    }
    const bishops = Object.entries(pl).filter(([, p]) => p === 'B').map(([s]) => s);
    if (bishops.length === 2 && isLight(bishops[0]) === isLight(bishops[1])) ok = false;
    if (!ok) continue;
    const fen = fenFromPlacement(pl, 'w');
    let c: Chess;
    try { c = new Chess(fen); } catch { continue; }
    if (new Chess(flip(fen)).inCheck()) continue;           // roi noir en échec avec le trait aux Blancs : illégal
    if (hangingPieces(fen, 'w').length) continue;           // pas de pièce en prise au départ
    if (new Chess(flip(fen)).moves().length < 2) continue;  // roi noir pas déjà presque pat
    if (c.isGameOver()) continue;
    return fen;
  }
  throw new Error('génération impossible');
}

/** Vérifie qu'une position d'exercice est légale et conforme au niveau. */
export function isValidExercise(fen: string, level: MateLevel): boolean {
  let c: Chess;
  try { c = new Chess(fen); } catch { return false; }
  if (c.turn() !== 'w') return false;
  const pieces = c.board().flat().filter((p) => p !== null);
  const black = pieces.filter((p) => p!.color === 'b');
  const white = pieces.filter((p) => p!.color === 'w').map((p) => p!.type.toUpperCase()).filter((t) => t !== 'K').sort();
  if (black.length !== 1 || black[0]!.type !== 'k') return false;
  if (white.join() !== [...level.pieces].sort().join()) return false;
  if (new Chess(flip(fen)).inCheck()) return false;
  const kings = pieces.filter((p) => p!.type === 'k').map((p) => p!.square);
  if (kingDist(kings[0], kings[1]) < 2) return false;
  return true;
}

// ---------------------------------------------------------------- issue d'un exercice

export type MateOutcome = 'mate' | 'stalemate' | 'piece-lost' | 'fifty-moves' | 'repetition';

export const OUTCOME_LABEL: Record<MateOutcome, string> = {
  mate: 'Échec et mat !',
  stalemate: 'Pat : partie nulle',
  'piece-lost': 'Pièce perdue',
  'fifty-moves': 'Règle des 50 coups',
  repetition: 'Triple répétition',
};

/** Issue après un coup (null = l'exercice continue). `pieceCount` = nombre de mes pièces au départ (roi exclu). */
export function exerciseOutcome(c: Chess, pieceCount: number): MateOutcome | null {
  if (c.isCheckmate()) return 'mate';
  if (c.isStalemate()) return 'stalemate';
  const mine = c.board().flat().filter((p) => p && p.color === 'w' && p.type !== 'k').length;
  if (mine < pieceCount) return 'piece-lost';
  if (Number(c.fen().split(' ')[4]) >= 100) return 'fifty-moves';
  if (c.isThreefoldRepetition()) return 'repetition';
  return null;
}

/** Alerte d'un exercice : après mon coup `san` (demi-coup `ply`), une de mes pièces attaquée par le roi noir et non défendue. */
export interface MoveFlag { ply: number; san: string; kind: 'unprotected' }

/** Pièce sans protection après un de mes coups (position après le coup, roi noir au trait). */
export function flagsAfterMyMove(fenAfter: string, ply: number, san: string): MoveFlag[] {
  const c = new Chess(fenAfter);
  if (c.isGameOver()) return [];
  return hangingPieces(fenAfter, 'w').length ? [{ ply, san, kind: 'unprotected' }] : [];
}

/** Mes coups légaux qui feraient pat dans cette position (à moi de jouer), en SAN — pour les leçons. */
export function stalemateTraps(fen: string): string[] {
  const c = new Chess(fen);
  const out: string[] = [];
  for (const m of c.moves({ verbose: true })) {
    c.move(m);
    if (c.isStalemate()) out.push(m.san);
    c.undo();
  }
  return out;
}

export interface MateRunLike { outcome: MateOutcome; myMoves: number; minMoves: number }

/** Réussite qui compte pour la validation : mat dans la limite de coups. */
export const countsForStreak = (r: MateRunLike) => r.outcome === 'mate' && r.myMoves <= moveLimit(r.minMoves);

/** Série actuelle de réussites (en partant de la plus récente) et validation. */
export function levelProgress(runs: MateRunLike[]): { streak: number; validated: boolean } {
  let streak = 0;
  let validated = false;
  for (const r of runs) {
    streak = countsForStreak(r) ? streak + 1 : 0;
    if (streak >= STREAK_TO_VALIDATE) validated = true;
  }
  return { streak, validated };
}

/** Niveaux débloqués dans l'ordre : le suivant s'ouvre quand le précédent est validé. */
export function unlockedLevels(validated: Set<MateLevelId>): Set<MateLevelId> {
  const out = new Set<MateLevelId>();
  for (const l of MATE_LEVELS) {
    if (!l.available) break;
    out.add(l.id);
    if (!validated.has(l.id)) break;
  }
  return out;
}

// ---------------------------------------------------------------- symétries du plateau

/**
 * Les 8 symétries du carré (rotations et miroirs). Sans pions ni roque, elles conservent les règles,
 * la légalité et la distance au mat ; deux fous de couleurs opposées le restent.
 */
export const SYMMETRIES: ((f: number, r: number) => [number, number])[] = [
  (f, r) => [f, r],           // identité
  (f, r) => [7 - f, r],       // miroir gauche-droite
  (f, r) => [f, 7 - r],       // miroir haut-bas
  (f, r) => [7 - f, 7 - r],   // rotation 180°
  (f, r) => [r, f],           // diagonale a1-h8
  (f, r) => [7 - r, 7 - f],   // diagonale a8-h1
  (f, r) => [r, 7 - f],       // rotation 90°
  (f, r) => [7 - r, f],       // rotation 270°
];

/** Applique la symétrie n° k (0-7) à une position sans pions ; trait et compteurs inchangés. */
export function applySymmetry(fen: string, k: number): string {
  const [board, ...rest] = fen.split(' ');
  const pl: Record<string, string> = {};
  board.split('/').forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { f += Number(ch); continue; }
      const [nf, nr] = SYMMETRIES[k](f, 7 - i);
      pl[sqName(nf, nr)] = ch;
      f++;
    }
  });
  const placed = fenFromPlacement(pl, rest[0] as 'w' | 'b').split(' ')[0];
  return [placed, rest[0], '-', '-', ...rest.slice(3)].join(' ');
}

export interface PrecomputedPosition { fen: string; mate: number }

/** Tire une position précalculée et lui applique une symétrie au hasard. */
export function pickPrecomputed(list: PrecomputedPosition[], rand: () => number): { fen: string; minMoves: number; index: number; symmetry: number } | null {
  if (!list.length) return null;
  const index = Math.floor(rand() * list.length);
  const symmetry = Math.floor(rand() * 8);
  return { fen: applySymmetry(list[index].fen, symmetry), minMoves: list[index].mate, index, symmetry };
}
