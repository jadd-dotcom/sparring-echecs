// Cartes « Lis la menace » : choix des positions de MES parties (Sparring et Chess.com) juste après un coup adverse
// qui a créé une vraie menace, parée ou non. Les menaces ignorées (motif « Menace ignorée ») d'abord, puis les
// parties les plus récentes. Au plus 5 nouvelles cartes par jour. Fonctions pures (le moteur confirme ensuite).
import { Chess, type Color } from 'chess.js';
import type { Card, Game, GameSource, MoveAnalysis } from '../db';
import { dayKey } from './srs';
import { threatsAgainst } from './threats';
import { nullMove } from './words';

export const THREAT_NEW_PER_DAY = 5;

export interface ThreatCandidate {
  gameId: number;
  source: GameSource;
  date: number;
  ply: number;          // mon demi-coup (la position est juste avant)
  fen: string;          // juste après son coup, à moi de jouer
  prevFen: string;      // avant son coup
  lastMoveUci: string;  // son coup
  me: Color;
  ignored: boolean;     // motif « Menace ignorée » dans l'analyse
  a: MoveAnalysis;
}

export const threatKey = (gameId: number, ply: number) => `threat:${gameId}:${ply}`;

/** Nouvelles cartes « Lis la menace » encore permises aujourd'hui. */
export function threatQuotaLeft(cards: Pick<Card, 'kind' | 'createdAt'>[], today = dayKey()): number {
  const made = cards.filter((c) => c.kind === 'threat' && dayKey(new Date(c.createdAt)) === today).length;
  return Math.max(0, THREAT_NEW_PER_DAY - made);
}

/** L'adversaire a-t-il un mat en 1 s'il rejoue (coup nul) ? */
function mateInOneIfHeMoves(fen: string): boolean {
  let c: Chess;
  try { c = new Chess(nullMove(fen)); } catch { return false; }
  for (const m of c.moves({ verbose: true })) {
    c.move(m.san);
    const mate = c.isCheckmate();
    c.undo();
    if (mate) return true;
  }
  return false;
}

/**
 * Tri rapide, sans moteur : son coup a-t-il créé une menace probable ?
 * (une prise gagnante qu'il n'avait pas avant son coup, ou un mat en 1 s'il rejouait)
 */
export function looksLikeNewThreat(prevFen: string, fen: string, me: Color): boolean {
  const before = new Set(threatsAgainst(prevFen, me).map((t) => t.from + t.to));
  if (threatsAgainst(fen, me).some((t) => !before.has(t.from + t.to))) return true;
  return mateInOneIfHeMoves(fen);
}

/**
 * Positions candidates, dans l'ordre où le moteur les vérifiera : menaces ignorées d'abord (parties récentes d'abord),
 * puis les autres positions où son coup semble créer une menace. `taken` : clés déjà utilisées ou déjà vérifiées.
 */
export function threatCandidates(games: Game[], taken: Set<string>): ThreatCandidate[] {
  const ignored: ThreatCandidate[] = [];
  const others: ThreatCandidate[] = [];
  const sorted = [...games].filter((g) => g.id !== undefined && g.analysis?.length).sort((x, y) => y.date - x.date);
  for (const g of sorted) {
    const byPly = new Map(g.analysis!.map((a) => [a.ply, a]));
    const c = new Chess(g.startFen);
    let prevFen = c.fen();
    for (let i = 0; i < g.uci.length; i++) {
      const fen = c.fen();
      const a = byPly.get(i);
      if (a && i > 0 && !taken.has(threatKey(g.id!, i)) && !c.inCheck() && c.turn() === g.myColor) {
        const cand: ThreatCandidate = {
          gameId: g.id!, source: g.source, date: g.date, ply: i, fen, prevFen, lastMoveUci: g.uci[i - 1], me: g.myColor,
          ignored: a.detail?.motif === 'menace-ignoree', a,
        };
        if (cand.ignored) ignored.push(cand);
        else if (looksLikeNewThreat(prevFen, fen, g.myColor)) others.push(cand);
      }
      prevFen = fen;
      const u = g.uci[i];
      try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    }
  }
  return [...ignored, ...others];
}
