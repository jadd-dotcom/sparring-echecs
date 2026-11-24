// Révision « Trouve le bon coup » : origine d'une carte (partie, adversaire, date, coup) et détail de l'erreur
// (repris de l'analyse de la partie, ou calculé une fois puis enregistré).
import { Chess } from 'chess.js';
import { db, type Card, type Game } from './db';
import { computeErrorDetail, DETAIL_VERSION, type ErrorDetail } from './lib/report/motifs';
import { browserEngine } from './engines/stockfish';

export interface CardOrigin {
  source: string;        // « Chess.com », « Maia », « PGN importé », « Partie supprimée »
  opponent?: string;     // « LupinMomo (285) », « Maia-3 (950) »
  date?: number;
  ply?: number;          // demi-coup de l'erreur dans la partie
  game?: Game;
}

/** Demi-coup où la position de la carte apparaît dans la partie (avant mon coup). */
function plyOf(g: Game, fen: string, playedUci: string): number | undefined {
  const c = new Chess(g.startFen);
  const key = fen.split(' ').slice(0, 4).join(' ');
  for (let i = 0; i < g.uci.length; i++) {
    if (g.uci[i] === playedUci && c.fen().split(' ').slice(0, 4).join(' ') === key) return i;
    const u = g.uci[i];
    c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  }
  return undefined;
}

export async function cardOrigin(card: Card): Promise<CardOrigin> {
  const g = card.gameId ? await db.games.get(card.gameId) : undefined;
  if (!g) return { source: card.source === 'chesscom' ? 'Chess.com (partie supprimée)' : 'Partie supprimée' };
  const imported = g.source === 'chesscom';
  return {
    source: imported ? (g.ext?.site === 'pgn' ? 'PGN importé' : 'Chess.com') : 'Maia',
    opponent: imported
      ? `${g.ext?.opp.name ?? 'adversaire'}${g.ext?.opp.rating ? ` (${g.ext.opp.rating})` : ''}`
      : `Maia-3${g.botElo ? ` (${Math.round(g.botElo)})` : ''}`,
    date: g.date,
    ply: plyOf(g, card.fen, card.playedUci),
    game: g,
  };
}

/** Détail de l'erreur d'une carte : depuis l'analyse de la partie, sinon calculé avec Stockfish et enregistré. */
export async function cardDetail(card: Card, origin?: CardOrigin): Promise<ErrorDetail | null> {
  const o = origin ?? await cardOrigin(card);
  const g = o.game;
  const a = g?.analysis && o.ply !== undefined ? g.analysis.find((x) => x.ply === o.ply) : undefined;
  if (a?.detail?.motifs && (a.detail.v ?? 1) >= DETAIL_VERSION) return a.detail;
  try {
    const d = await computeErrorDetail(browserEngine, card.fen, card.playedUci, card.myColor, undefined, card.bestUci);
    if (g?.analysis && a) {
      const analysis = g.analysis.map((x) => (x.ply === a.ply ? { ...x, detail: d } : x));
      await db.games.update(g.id!, { analysis });
    }
    return d;
  } catch { return null; }
}
