// « Pourquoi » en mots, sans suite en notation (2 phrases au plus) : pièces en mots + cases, à partir du détail
// d'erreur déjà calculé (meilleure suite, réfutation, menace). La notation reste disponible à part (repliée).
import type { Color } from 'chess.js';
import type { ErrorDetail } from './report/motifs';
import { firstSan } from './reason';
import { moveCaption, nullMove, tryMove } from './words';

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const noDot = (s: string) => s.replace(/\.$/, '');

/** Position après mon coup. */
function fenAfterMine(fenBefore: string, myUci: string): string | null {
  return tryMove(fenBefore, myUci)?.after.fen() ?? null;
}

/** Légende du 1er coup d'une suite numérotée, depuis `fen` (sans point final), ou null. */
function firstCaption(fen: string | null, line: string | undefined, me: Color): string | null {
  if (!fen || !line) return null;
  const san = firstSan(line);
  if (!san) return null;
  const c = moveCaption(fen, san, me);
  return c ? noDot(c) : null;
}

/**
 * Raison d'une erreur en mots (une proposition, sans notation), pour la phrase de la revue :
 * ex. « son fou prend ta dame g4 », « il menaçait : son cavalier prend ta dame d4 », « tu pouvais mater ».
 */
export function reasonWords(d: ErrorDetail, fenBefore: string, myUci: string, me: Color): string | null {
  switch (d.motif) {
    case 'piece-en-prise': {
      const c = firstCaption(fenAfterMine(fenBefore, myUci), d.refutation, me);
      return c ? `après ton coup, ${lowerFirst(c)}` : null;
    }
    case 'menace-ignoree': {
      const c = firstCaption(nullMove(fenBefore), d.threatLine, me);
      return c ? `il menaçait ceci : ${lowerFirst(c)}` : 'tu n’as pas paré sa menace';
    }
    case 'mat-rate': return 'tu pouvais mater';
    case 'mat-ouvert': return 'après ton coup, il peut te mater';
    case 'gain-rate': {
      const c = firstCaption(fenBefore, d.bestLine, me);
      return c ? `tu pouvais gagner du matériel : ${lowerFirst(c)}` : 'tu pouvais gagner du matériel';
    }
    default: return null;
  }
}

/**
 * « Pourquoi », en 2 phrases au plus : pourquoi le bon coup est bon, puis pourquoi le mien l'était moins.
 * `bestUci` : meilleur coup ; `myUci` : mon coup de la partie.
 */
export function whyWords(d: ErrorDetail, fenBefore: string, myUci: string, bestUci: string, me: Color): [string, string] {
  const best = noDot(moveCaption(fenBefore, bestUci, me));
  const after = fenAfterMine(fenBefore, myUci);
  const reply = firstCaption(after, d.refutation, me);
  let first: string;
  switch (d.motif) {
    case 'mat-rate': first = `Le bon coup mène au mat : ${lowerFirst(best)}.`; break;
    case 'gain-rate': first = `Le bon coup gagne du matériel : ${lowerFirst(best)}.`; break;
    case 'menace-ignoree': first = `Le bon coup pare sa menace : ${lowerFirst(best)}.`; break;
    case 'mat-ouvert': first = `Le bon coup évite le mat : ${lowerFirst(best)}.`; break;
    default: first = `Le bon coup : ${lowerFirst(best)}.`;
  }
  let second: string;
  switch (d.motif) {
    case 'menace-ignoree': {
      const t = firstCaption(nullMove(fenBefore), d.threatLine, me);
      second = t ? `Ton coup laissait faire sa menace : ${lowerFirst(t)}.` : 'Ton coup laissait faire sa menace.';
      break;
    }
    case 'mat-ouvert': second = reply ? `Après ton coup, il fait mat : ${lowerFirst(reply)}.` : 'Après ton coup, il peut te mater.'; break;
    case 'gain-rate': second = 'Ton coup laisse passer ce gain.'; break;
    case 'mat-rate': second = 'Ton coup laisse passer le mat.'; break;
    default: second = reply ? `Après ton coup, ${lowerFirst(reply)}.` : 'Ton coup donne moins de chances à ton camp.';
  }
  return [first, second];
}
