// Notation affichée dans l'interface : figurines (♔ ♕ ♖ ♗ ♘), rien pour les pions, comme Chess.com en français.
// Ne sert QU'À L'AFFICHAGE : le PGN, l'export JSON et le rapport pour Claude restent en notation anglaise (K Q R B N).

export const FIGURINES: Record<string, string> = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘' };

// Un coup SAN de pièce : lettre, désambiguïsation facultative, prise facultative, case d'arrivée.
// Un mot français (« Refusée », « Nouvelle ») ne contient pas de case, il n'est donc jamais touché.
const PIECE_MOVE = /(^|[^A-Za-z0-9])([KQRBN])(?=[a-h]?[1-8]?x?[a-h][1-8])/g;
const PROMOTION = /([a-h][18])=([QRBN])/g;

/** Remplace les lettres de pièces des coups SAN par des figurines (coup seul, suite de coups ou phrase). */
export function fig(text: string): string {
  return text
    .replace(PIECE_MOVE, (_, before: string, p: string) => before + FIGURINES[p])
    .replace(PROMOTION, (_, sq: string, p: string) => `${sq}=${FIGURINES[p]}`);
}

/** Inverse (tests automatiques) : figurines → lettres anglaises. */
export function unfig(text: string): string {
  return text.replace(/[♔♕♖♗♘]/g, (c) => Object.keys(FIGURINES).find((k) => FIGURINES[k] === c)!);
}
