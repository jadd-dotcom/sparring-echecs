// Phrase-panneau d'un carrefour, en une phrase : ce que son coup change → ma réponse
// (ex. « Il menace ♕xf7 mat → ton cavalier bloque la colonne f : f7 est à l’abri (…♘f6) »).
// Partie gauche : d'abord la menace de son coup (s'il rejouait, 4 demi-coups, calculée avec Stockfish :
// src/data/signpostThreats.ts) ; sinon le « pourquoi » de la leçon pour son coup. Partie droite : le « pourquoi » de la
// leçon pour mon coup ; sinon ce que mon coup fait contre la menace (prend, s'écarte, bouche la ligne, défend).
// En dernier recours, règles simples sur la position. La liste complète est dans docs/CARREFOURS.md pour relecture.
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import { pieceWords, VALUE } from './words';
import type { SignpostCard } from './crossroads';
import { fenKey } from './repertoire';
import { lessonWhy } from './lineTrainer';
import { flipTurn } from './report/facts';
import { plainText, type OpeningLesson } from '../data/openingLessons';
import { SIGNPOST_THREATS } from '../data/signpostThreats';

/** Menace de son coup-panneau : son meilleur coup s'il rejouait, mat en N (≤ 3) ou gain en points (≥ 2). */
export interface SignpostThreat {
  san: string;
  line: string[];
  mate: number | null;
  gain: number;
  /** Ma pièce la plus chère qu'il prend dans la suite (4 demi-coups). */
  captured?: { type: PieceSymbol; sq: string };
}

const CENTER = new Set(['c4', 'd4', 'e4', 'f4', 'c5', 'd5', 'e5', 'f5']);
const FEM: Record<PieceSymbol, boolean> = { p: false, n: false, b: false, r: true, q: true, k: false };
const lePron = (t: PieceSymbol) => (FEM[t] ? 'la' : 'le');

/**
 * Pièces de l'autre camp attaquées par la pièce qui vient d'arriver en `sq`, et pas déjà attaquées par elle avant :
 * une pièce plus précieuse que l'attaquant ou non défendue, ou un pion du centre.
 */
function newTargets(before: Chess, after: Chess, sq: Square, by: Color, attacker: PieceSymbol): { sq: Square; type: PieceSymbol }[] {
  const out: { sq: Square; type: PieceSymbol }[] = [];
  for (const row of after.board()) for (const p of row) {
    if (!p || p.color === by || p.type === 'k') continue;
    if (!after.attackers(p.square, by).includes(sq)) continue;
    if (before.get(p.square)?.type === p.type && before.attackers(p.square, by).includes(sq)) continue;
    if (p.type === 'p') { if (!CENTER.has(p.square)) continue; }
    else if (!(VALUE[p.type] > VALUE[attacker] || after.attackers(p.square, p.color).length === 0)) continue;
    out.push({ sq: p.square, type: p.type });
  }
  return out.sort((a, b) => VALUE[b.type] - VALUE[a.type]);
}

function hisPart(before: Chess, m: Move, after: Chess, me: Color): { text: string; target?: { sq: Square; type: PieceSymbol }; check?: boolean } {
  const him = m.color;
  if (m.isKingsideCastle() || m.isQueensideCastle()) return { text: 'Il roque' };
  if (m.captured) return { text: `Il prend ${pieceWords(m.captured, me, me)} ${m.to}` };
  if (after.inCheck()) return { text: 'Il te met en échec', check: true };
  const t = newTargets(before, after, m.to as Square, him, m.piece)[0];
  if (t) return { text: `Il attaque ${pieceWords(t.type, me, me)} ${t.sq}`, target: t };
  if (m.piece === 'p') {
    if (['g3', 'b3', 'g6', 'b6'].includes(m.to)) return { text: 'Il prépare le fianchetto de son fou' };
    if (CENTER.has(m.to)) return { text: `Il prend de la place au centre avec son pion ${m.to}` };
    return { text: `Il avance son pion en ${m.to}` };
  }
  const home = him === 'w' ? '1' : '8';
  if (m.from[1] === home) return { text: `Il sort ${pieceWords(m.piece, him, me)} en ${m.to}` };
  return { text: `${pieceWords(m.piece, him, me).replace(/^son/, 'Son').replace(/^sa/, 'Sa')} va en ${m.to}` };
}

function myPart(pos: Chess, m: Move, after: Chess, a: { target?: { sq: Square; type: PieceSymbol }; check?: boolean }): string {
  const me = m.color;
  const home = me === 'w' ? '1' : '8';
  if (m.isKingsideCastle() || m.isQueensideCastle()) return a.check ? 'tu pares l’échec en roquant' : 'tu roques';
  if (a.check) return 'tu pares l’échec';
  if (m.captured) return 'tu prends';
  const t = a.target;
  if (t) {
    if (m.from === t.sq) return `tu ${lePron(t.type)} mets à l’abri`;
    if (after.attackers(t.sq, me).length > pos.attackers(t.sq, me).length) return t.type === 'p' ? 'tu le soutiens' : `tu ${lePron(t.type)} défends`;
    const him = me === 'w' ? 'b' : 'w';
    if (after.attackers(t.sq, him).length < pos.attackers(t.sq, him).length) return 'tu bloques son attaque';
  }
  if (after.inCheck()) return 'tu donnes échec';
  const mine = newTargets(pos, after, m.to as Square, me, m.piece)[0];
  if (mine && m.piece !== 'p') return `tu attaques ${pieceWords(mine.type, mine.type === 'k' ? me : (me === 'w' ? 'b' : 'w'), me)} ${mine.sq}`;
  if (m.piece === 'p') {
    if (['g3', 'b3', 'g6', 'b6'].includes(m.to)) return 'tu prépares ton fianchetto';
    if (CENTER.has(m.to)) return 'tu prends ta part du centre';
    return 'tu avances ton pion';
  }
  if (m.from[1] === home) return t ? 'tu continues ton développement' : `tu sors ${pieceWords(m.piece, me, me)}`;
  return `tu joues ${pieceWords(m.piece, me, me)}`;
}

const sentence = (t: string) => plainText(t).trim().replace(/\.$/, '');
const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** « Il menace Qxf7 mat », « Il menace de prendre ton fou c5 ». */
export function threatText(t: SignpostThreat, me: Color): string {
  const mv = t.san.replace(/[+#]$/, '');
  if (t.mate === 1) return `Il menace ${mv} mat`;
  if (t.mate) return `Il menace un mat en ${t.mate} coups, en commençant par ${mv}`;
  if (t.captured) return `Il menace de prendre ${pieceWords(t.captured.type, me, me)} ${t.captured.sq}`;
  return `Il menace de gagner du matériel avec ${mv}`;
}

/** Cases strictement entre a et b (même ligne, colonne ou diagonale), sinon []. */
function between(a: string, b: string): string[] {
  const fa = a.charCodeAt(0), ra = Number(a[1]), fb = b.charCodeAt(0), rb = Number(b[1]);
  const df = Math.sign(fb - fa), dr = Math.sign(rb - ra);
  if (!(fa === fb || ra === rb || Math.abs(fb - fa) === Math.abs(rb - ra))) return [];
  const out: string[] = [];
  for (let f = fa + df, r = ra + dr; f !== fb || r !== rb; f += df, r += dr) out.push(String.fromCharCode(f) + r);
  return out;
}

/** Ce que mon coup fait contre sa menace : je prends, je m'écarte, je bouche la ligne, je défends ; sinon null. */
export function counterText(pos: Chess, mine: Move, after: Chess, t: SignpostThreat): string | null {
  const me = mine.color;
  const opp: Color = me === 'w' ? 'b' : 'w';
  if (mine.captured) return `tu prends ${pieceWords(mine.captured as PieceSymbol, opp, me)} ${mine.to}`;
  let tm: Move;
  try { tm = new Chess(flipTurn(pos.fen())).move(t.san); } catch { return null; }
  const target = (t.captured?.sq ?? tm.to) as Square;
  const piece = pos.get(target);
  if (mine.from === target && piece) return `tu mets ${pieceWords(piece.type, me, me)} à l’abri`;
  // Je me place entre la case visée et sa pièce qui joue la menace, ou une pièce à longue portée qui la soutient.
  const lines = pos.attackers(tm.to as Square, opp).filter((sq) => 'bqr'.includes(pos.get(sq)!.type));
  if (lines.some((sq) => between(sq, tm.to).includes(mine.to))) return 'tu bouches la ligne';
  if (after.attackers(target, me).length > pos.attackers(target, me).length) return `tu défends ${target}`;
  return null;
}

/**
 * « Il menace Qxf7 mat → ton cavalier bloque la colonne f : f7 est à l’abri (…Nf6) » (mon coup en notation, …coup
 * pour les Noirs). `threat` : la menace de son coup (par défaut, celle calculée pour cette position).
 */
export function signpostSentence(card: SignpostCard, me: Color, opts: { lesson?: OpeningLesson; threat?: SignpostThreat | null } = {}): string {
  const before = new Chess(card.crossroad.fen);
  const pos = new Chess(card.crossroad.fen);
  const his = pos.move(card.his);
  const threat = opts.threat !== undefined ? opts.threat : SIGNPOST_THREATS[fenKey(pos.fen())] ?? null;
  const a = hisPart(before, his, pos, me);
  const hisWhy = lessonWhy(opts.lesson, card.crossroad.fen, card.his);
  const left = threat ? threatText(threat, me) : hisWhy ? sentence(hisWhy) : a.text;
  if (!card.mine) return `${left} → fin de la ligne`;
  const after = new Chess(pos.fen());
  const mine = after.move(card.mine);
  const myWhy = lessonWhy(opts.lesson, pos.fen(), card.mine);
  const right = myWhy ? lowerFirst(sentence(myWhy)) : (threat && counterText(pos, mine, after, threat)) || myPart(pos, mine, after, a);
  return `${left} → ${right} (${me === 'b' ? '…' : ''}${mine.san})`;
}
