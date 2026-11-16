// Raison d'une erreur, en une proposition, tirée du motif déjà calculé (ErrorDetail).
import { Chess } from 'chess.js';
import { fig } from './notation';
import type { ErrorDetail } from './report/motifs';

const NAME: Record<string, { sym: string; fem: boolean }> = {
  k: { sym: '♔', fem: false }, q: { sym: '♕', fem: true }, r: { sym: '♖', fem: true },
  b: { sym: '♗', fem: false }, n: { sym: '♘', fem: false }, p: { sym: 'pion ', fem: false },
};
const theP = (piece: string, sq: string) => `${NAME[piece].fem ? 'la' : 'le'} ${NAME[piece].sym}${sq}`;
const myP = (piece: string, sq: string) => `${NAME[piece].fem ? 'ta' : 'ton'} ${NAME[piece].sym}${sq}`;

/** Premier coup SAN d'une suite numérotée (« 12… Nf6 13. Bxf7+ » → « Nf6 »). */
export const firstSan = (line: string) => line.replace(/^\s*\d+(\.\.\.|…|\.)\s*/, '').split(/\s+/)[0] ?? '';

/**
 * Raison (sans le libellé du motif) d'une erreur : ex. « le ♗e7 menaçait de prendre ta ♕h4 ».
 * `fenBefore` = position avant mon coup ; `myUci` = mon coup.
 */
export function errorReason(d: ErrorDetail, fenBefore: string, myUci: string): string | null {
  const flip = (fen: string) => { const f = fen.split(' '); f[1] = f[1] === 'w' ? 'b' : 'w'; f[3] = '-'; return f.join(' '); };
  const after = new Chess(fenBefore);
  after.move({ from: myUci.slice(0, 2), to: myUci.slice(2, 4), promotion: myUci[4] });
  const tryMove = (fen: string, san: string) => { try { return new Chess(fen).move(san); } catch { return null; } };
  switch (d.motif) {
    case 'menace-ignoree': {
      const m = d.threatLine ? tryMove(flip(fenBefore), firstSan(d.threatLine)) : null;
      if (m?.captured) return `${theP(m.piece, m.from)} menaçait de prendre ${myP(m.captured, m.to)}`;
      if (m && (m.san.endsWith('#') || /#/.test(d.threatLine ?? ''))) return `l’adversaire menaçait de mater (${fig(d.threatLine!)})`;
      return d.threatLine ? `l’adversaire menaçait ${fig(firstSan(d.threatLine))}` : null;
    }
    case 'piece-en-prise': {
      const m = tryMove(after.fen(), firstSan(d.refutation));
      return m?.captured ? `${theP(m.piece, m.from)} peut prendre ${myP(m.captured, m.to)}` : null;
    }
    case 'mat-rate':
      return `tu pouvais mater : ${fig(d.bestLine)}`;
    case 'mat-ouvert':
      return `il permet un mat : ${fig(d.refutation)}`;
    default:
      return null;
  }
}
