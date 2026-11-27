// Explications en mots, sans notation : nom des pièces (« ton cavalier », « sa dame »), légende d'un coup en une
// phrase (« Son cavalier prend ton pion f7 : échec. », « … : il attaque ta dame et ta tour en même temps
// (fourchette). », « … : ta dame n'est plus défendue. », « … : échec et mat. »). Règles simples, sans moteur.
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';

const NAME: Record<PieceSymbol, { n: string; f: boolean }> = {
  p: { n: 'pion', f: false }, n: { n: 'cavalier', f: false }, b: { n: 'fou', f: false },
  r: { n: 'tour', f: true }, q: { n: 'dame', f: true }, k: { n: 'roi', f: false },
};
export const VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

/** « ton cavalier », « ta dame », « son fou », « sa tour ». */
export function pieceWords(type: PieceSymbol, color: Color, me: Color): string {
  const { n, f } = NAME[type];
  return `${color === me ? (f ? 'ta' : 'ton') : (f ? 'sa' : 'son')} ${n}`;
}

export const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Joue un coup (UCI ou SAN) ; null s'il est illégal. */
export function tryMove(fen: string, mv: string): { move: Move; after: Chess } | null {
  const c = new Chess(fen);
  try {
    const move = /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(mv)
      ? c.move({ from: mv.slice(0, 2), to: mv.slice(2, 4), promotion: mv[4] })
      : c.move(mv);
    return { move, after: c };
  } catch { return null; }
}

/** Bilan matériel (pion 1, cavalier et fou 3, tour 5, dame 9) du point de vue de `me`. */
export function material(fen: string, me: Color): number {
  let s = 0;
  for (const row of new Chess(fen).board()) for (const p of row) if (p && p.type !== 'k') s += (p.color === me ? 1 : -1) * VALUE[p.type];
  return s;
}

/** « +2 », « −3 », « égal ». */
export const materialWords = (n: number) => (n === 0 ? 'matériel égal' : n > 0 ? `tu as ${n} point${n > 1 ? 's' : ''} de matériel en plus` : `tu as ${-n} point${n < -1 ? 's' : ''} de matériel en moins`);

/** Les pièces adverses qu'une pièce attaque depuis `sq` (après le coup), les plus précieuses d'abord. */
function attacked(after: Chess, sq: Square, by: Color): { sq: Square; type: PieceSymbol }[] {
  const out: { sq: Square; type: PieceSymbol }[] = [];
  for (const row of after.board()) {
    for (const p of row) {
      if (!p || p.color === by) continue;
      if (after.attackers(p.square, by).includes(sq)) out.push({ sq: p.square, type: p.type });
    }
  }
  return out.sort((a, b) => VALUE[b.type] - VALUE[a.type]);
}

/** Une cible qui compte : le roi, une pièce plus précieuse que l'attaquant, ou une pièce (≥ 3) non défendue. */
function worthy(after: Chess, t: { sq: Square; type: PieceSymbol }, attacker: PieceSymbol, victim: Color): boolean {
  if (t.type === 'k') return true;
  if (VALUE[t.type] > VALUE[attacker]) return true;
  return VALUE[t.type] >= 3 && after.attackers(t.sq, victim).length === 0;
}

const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} et ${xs[xs.length - 1]}`);

/**
 * Légende d'un coup, en une phrase, du point de vue de `me` (« ton » / « son »).
 * `mv` : coup UCI ou SAN joué depuis `fenBefore`.
 */
export function moveCaption(fenBefore: string, mv: string, me: Color): string {
  const r = tryMove(fenBefore, mv);
  if (!r) return '';
  const { move, after } = r;
  const actor = move.color;
  const victim: Color = actor === 'w' ? 'b' : 'w';
  const mine = actor === me;
  const who = mine ? 'tu attaques' : 'il attaque';
  let base: string;
  if (move.isKingsideCastle() || move.isQueensideCastle()) base = mine ? 'Tu roques' : 'Il roque';
  else if (move.captured) {
    const where = move.isEnPassant() ? `${move.to[0]}${move.from[1]} (en passant)` : move.to;
    base = `${capFirst(pieceWords(move.piece, actor, me))} prend ${pieceWords(move.captured, victim, me)} ${where}`;
  } else base = `${capFirst(pieceWords(move.piece, actor, me))} va en ${move.to}`;
  if (move.promotion) base += ` et devient ${move.promotion === 'q' ? 'une dame' : move.promotion === 'r' ? 'une tour' : move.promotion === 'b' ? 'un fou' : 'un cavalier'}`;

  if (after.isCheckmate()) return `${base} : échec et mat.`;
  const piece = (move.promotion ?? move.piece) as PieceSymbol;
  const targets = attacked(after, move.to as Square, actor).filter((t) => worthy(after, t, piece, victim));
  const check = after.inCheck();
  if (targets.length >= 2) {
    const others = targets.filter((t) => t.type !== 'k').map((t) => pieceWords(t.type, victim, me));
    if (check) return `${base} : échec, et ${who} aussi ${list(others.slice(0, 2))} (fourchette).`;
    return `${base} : ${who} ${list(others.slice(0, 2))} en même temps (fourchette).`;
  }
  if (check) return `${base} : échec.`;
  // Une pièce de l'autre camp qui était défendue ne l'est plus (le défenseur a été pris ou a bougé).
  const before = new Chess(fenBefore);
  const lost = after.board().flat()
    .filter((p): p is NonNullable<typeof p> => !!p && p.color === victim && p.type !== 'k' && p.type !== 'p')
    .filter((p) => before.get(p.square)?.type === p.type && before.attackers(p.square, victim).length > 0
      && after.attackers(p.square, victim).length === 0 && after.attackers(p.square, actor).length > 0)
    .sort((a, b) => VALUE[b.type] - VALUE[a.type]);
  if (lost.length) return `${base} : ${pieceWords(lost[0].type, victim, me)} n’est plus défendu${NAME[lost[0].type].f ? 'e' : ''}.`;
  if (targets.length === 1) return `${base} et attaque ${pieceWords(targets[0].type, victim, me)}.`;
  return `${base}.`;
}

/** Suite numérotée en SAN (« 12… Nf6 13. Bxf7+ Kxf7 ») → liste de coups SAN. */
export function sanList(line: string): string[] {
  return line.replace(/\d+\.(\.\.)?|…/g, ' ').split(/\s+/).filter((t) => t && !/^\d+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
}

/** Coups SAN joués depuis `fen` → coups UCI (on s'arrête au premier coup illisible). */
export function toUci(fen: string, sans: string[]): string[] {
  const c = new Chess(fen);
  const out: string[] = [];
  for (const s of sans) {
    try { const m = c.move(s); out.push(m.from + m.to + (m.promotion ?? '')); } catch { break; }
  }
  return out;
}

/** Position avec le trait donné à l'autre camp (coup nul) : prise en passant effacée. */
export function nullMove(fen: string): string {
  const f = fen.split(' ');
  f[1] = f[1] === 'w' ? 'b' : 'w';
  f[3] = '-';
  return f.join(' ');
}
