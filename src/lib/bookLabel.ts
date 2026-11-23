// Libellés courts du suivi de mon répertoire dans une partie (statistiques, rapport).
import type { BookExit } from './repertoire';

const moveNo = (ply: number) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}`;

/** « 📖 » si je suis resté dans mon répertoire, sinon « sorti au coup 5. » ; undefined = pas de répertoire de cette couleur. */
export function bookLabel(exit: BookExit | null | undefined): string | undefined {
  if (exit === undefined) return undefined;
  if (exit === null) return '📖 répertoire jusqu’au bout';
  if (exit.ply === 0) return exit.by === 'me' ? 'hors répertoire dès le 1er coup' : 'adversaire hors répertoire dès le 1er coup';
  if (exit.by === 'end') return `📖 jusqu’au bout de la ligne (coup ${moveNo(exit.ply)})`;
  if (exit.by === 'opponent') return `📖 (l’adversaire en sort au coup ${moveNo(exit.ply)})`;
  return `sorti au coup ${moveNo(exit.ply)} (${exit.playedSan} au lieu de ${exit.expectedSan.join(' ou ')})`;
}

/** Suis-je resté dans mon répertoire jusqu'au coup `n` inclus (sans en sortir moi-même avant) ? */
export function stayedUntil(exit: BookExit | null | undefined, n = 8): 'yes' | 'me' | 'opponent' | 'none' {
  if (exit === undefined) return 'none';
  if (exit === null || exit.ply >= 2 * n) return 'yes';
  if (exit.by === 'me') return 'me';
  return exit.by === 'end' ? 'yes' : 'opponent';
}
