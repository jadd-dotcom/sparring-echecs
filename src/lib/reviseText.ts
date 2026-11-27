// Révision « Trouve le bon coup » : textes de l'indice (motif en mots) et de l'explication après la réponse.
// Fonctions pures, à partir du détail d'erreur (suites Stockfish, motif) déjà calculé pour la revue.
import { Chess, type Square } from 'chess.js';
import { fig } from './notation';
import { errorReason, firstSan } from './reason';
import { MOTIF_LABEL, type ErrorDetail } from './report/motifs';
import { reasonWords } from './whyWords';

/** Premier indice : le motif en mots, sans donner le coup. */
export function motifHint(d: ErrorDetail, fen: string, playedUci: string): string {
  // En mots (« son fou prend ta dame g4 »), sans notation.
  const reason = reasonWords(d, fen, playedUci, new Chess(fen).turn());
  switch (d.motif) {
    case 'mat-rate':
      return 'Tu as un mat en quelques coups : cherche les échecs.';
    case 'mat-ouvert':
      return 'Ton coup permettait un mat : cherche un coup qui met ton roi à l’abri.';
    case 'menace-ignoree':
      return `L’adversaire avait une menace${reason?.startsWith('il menaçait ceci : ') ? ` : ${reason.slice('il menaçait ceci : '.length)}` : ''}. Cherche un coup qui la pare.`;
    case 'piece-en-prise':
      return `Ton coup laissait une pièce sans défense${reason ? ` (${reason})` : ''}. Cherche un coup qui garde tes pièces protégées.`;
    case 'gain-rate': {
      if (/#/.test(d.bestLine)) return 'Tu as un mat forcé : cherche les échecs.';
      let b = null;
      try { b = new Chess(fen).move(firstSan(d.bestLine)); } catch { /* suite illisible */ }
      if (b?.captured) {
        const c = new Chess(fen);
        const them = c.turn() === 'w' ? 'b' : 'w';
        const defended = c.isAttacked(b.to as Square, them);
        return defended ? 'Tu peux gagner du matériel par une prise.' : 'Une pièce adverse n’est pas défendue : cherche une prise.';
      }
      return 'Tu peux gagner du matériel : cherche une double attaque (deux cibles à la fois).';
    }
    default:
      return 'Pas de piège tactique simple : cherche le coup qui améliore le plus ta position (pièce mal placée, roi à l’abri, centre).';
  }
}

/** Bilan matériel lisible, de mon point de vue (« +3 », « −1 », « 0 »). */
const bilan = (x: number) => `bilan matériel pour toi : ${x > 0 ? `+${x}` : x < 0 ? `−${-x}` : '0'}`;

/** Pièce prise par le premier coup d'une suite (« le ♗f2 »), si c'est une prise. */
function captureOf(fen: string, line: string): string | null {
  try {
    const m = new Chess(fen).move(firstSan(line));
    if (!m.captured) return null;
    const name: Record<string, string> = { q: 'la ♕', r: 'la ♖', b: 'le ♗', n: 'le ♘', p: 'le pion ' };
    return `${name[m.captured]}${m.to}`;
  } catch { return null; }
}

/** Pourquoi le bon coup est bon (une phrase, avec la suite de Stockfish). */
export function whyBest(d: ErrorDetail, fen: string, playedUci: string, bestSan: string): string {
  const best = fig(bestSan);
  const line = `suite : ${fig(d.bestLine)}, ${bilan(d.bestMaterial)}`;
  const reason = errorReason(d, fen, playedUci);
  switch (d.motif) {
    case 'mat-rate': return `${best} mate : ${fig(d.bestLine)}.`;
    case 'gain-rate': {
      if (/#/.test(d.bestLine)) return `${best} mène au mat : ${fig(d.bestLine)}.`;
      const cap = captureOf(fen, d.bestLine);
      return cap ? `${best} prend ${cap}, qui n’était pas assez défendu (${line}).` : `${best} gagne du matériel (${line}).`;
    }
    case 'menace-ignoree': return `${best} pare la menace${reason ? ` (${reason})` : ''} ; ${line}.`;
    case 'piece-en-prise': return `${best} garde tes pièces protégées ; ${line}.`;
    case 'mat-ouvert': return `${best} évite le mat ; ${line}.`;
    default: return `${best} est le coup de Stockfish ; ${line}.`;
  }
}

/** Pourquoi mon coup de la partie était moins bon, sans répéter la phrase sur le bon coup, + la suite qui le réfute. */
export function whyPlayed(d: ErrorDetail, fen: string, playedUci: string, playedSan: string, severity: 'mistake' | 'blunder' | 'inaccuracy'): string {
  const mine = fig(playedSan);
  const what = severity === 'blunder' ? 'une gaffe' : severity === 'mistake' ? 'une erreur' : 'une imprécision';
  const reason = errorReason(d, fen, playedUci);
  let because: string | null = null;
  switch (d.motif) {
    case 'gain-rate': {
      const cap = /#/.test(d.bestLine) ? null : captureOf(fen, d.bestLine);
      because = /#/.test(d.bestLine) ? 'il laisse passer le mat' : cap ? `il laisse filer ${cap}` : 'il laisse passer ce gain';
      break;
    }
    case 'mat-rate': because = 'il laisse passer le mat'; break;
    default: because = reason;
  }
  const s = `${mine} était ${what} (${MOTIF_LABEL[d.motif].toLowerCase()})${because ? ` : ${because}` : ''}.`;
  return d.refutation ? `${s} Après ${mine} : ${fig(d.refutation)}, ${bilan(d.refutationMaterial)}.` : s;
}

/** Numéro de coup lisible d'un demi-coup (0 = 1er coup des Blancs) : « 4. » ou « 4… ». */
export const moveNo = (ply: number) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}`;
