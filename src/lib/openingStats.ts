// Statistiques par ouverture (parties à thème).
export interface StatGame {
  openingId?: string;
  score: number;
  bookExit?: { by: 'me' | 'opponent' | 'end' } | null;
  counts?: { blunder: number };
}

export interface OpeningStat {
  games: number;
  winPct: number;            // victoires / parties × 100
  myExits: number;           // parties où je suis sorti de mon répertoire
  oppExits: number;          // parties où l'adversaire en est sorti (trou)
  blundersPerGame: number | null; // sur les parties analysées
  analysed: number;
}

export function openingStats(games: StatGame[]): Record<string, OpeningStat> {
  const out: Record<string, OpeningStat> = {};
  const by = new Map<string, StatGame[]>();
  for (const g of games) if (g.openingId) by.set(g.openingId, [...(by.get(g.openingId) ?? []), g]);
  for (const [id, gs] of by) {
    const analysed = gs.filter((g) => g.counts);
    out[id] = {
      games: gs.length,
      winPct: (100 * gs.filter((g) => g.score === 1).length) / gs.length,
      myExits: gs.filter((g) => g.bookExit?.by === 'me').length,
      oppExits: gs.filter((g) => g.bookExit?.by === 'opponent').length,
      blundersPerGame: analysed.length ? analysed.reduce((s, g) => s + g.counts!.blunder, 0) / analysed.length : null,
      analysed: analysed.length,
    };
  }
  return out;
}
