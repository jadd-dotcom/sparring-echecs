// Phrase-panneau d'un carrefour, en une phrase : ce que son coup change → ma réponse
// (ex. « Il attaque ton pion d5 → tu le soutiens : …c6 »). Règles simples sur la position (pas de moteur) ;
// la liste complète est dans docs/CARREFOURS.md pour relecture.
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import { pieceWords, VALUE } from './words';
import type { SignpostCard } from './crossroads';

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

/** « Il attaque ton pion d5 → tu le soutiens : …c6 » (mon coup en notation, …coup pour les Noirs). */
export function signpostSentence(card: SignpostCard, me: Color): string {
  const before = new Chess(card.crossroad.fen);
  const pos = new Chess(card.crossroad.fen);
  const his = pos.move(card.his);
  const a = hisPart(before, his, pos, me);
  if (!card.mine) return `${a.text} → fin de la ligne`;
  const after = new Chess(pos.fen());
  const mine = after.move(card.mine);
  const b = myPart(pos, mine, after, a);
  return `${a.text} → ${b} : ${me === 'b' ? '…' : ''}${mine.san}`;
}
