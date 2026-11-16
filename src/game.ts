import { Chess } from 'chess.js';
import { db, getProfile, setCurrent, setProfile, type Color, type CurrentGame, type Game } from './db';
import { botRating, updateRating, type Score } from './lib/rating';
import { replay } from './analysis';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** Nouvelle partie ; avec `openingId`, partie à thème dans la couleur de l'ouverture. */
export async function newCurrentGame(openingId?: string): Promise<CurrentGame> {
  const p = await getProfile();
  const o = openingId ? await db.openings.get(openingId) : undefined;
  const g: CurrentGame = {
    myColor: o ? o.color : p.nextColor, startFen: START_FEN, uci: [],
    rating: p.rating, botElo: botRating(p.rating), maiaMs: [], startedAt: Date.now(),
    ...(o ? { openingId: o.id } : {}),
  };
  await setCurrent(g);
  return g;
}

export function chessFrom(g: { startFen: string; uci: string[] }) {
  const c = new Chess(g.startFen);
  for (const u of g.uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  return c;
}

/** Fin de partie automatique (règles), sinon null. */
export function autoResult(c: Chess): { result: Game['result']; termination: string } | null {
  if (c.isCheckmate()) return { result: c.turn() === 'w' ? '0-1' : '1-0', termination: 'Échec et mat' };
  if (c.isStalemate()) return { result: '1/2-1/2', termination: 'Pat' };
  if (c.isInsufficientMaterial()) return { result: '1/2-1/2', termination: 'Matériel insuffisant' };
  if (c.isThreefoldRepetition()) return { result: '1/2-1/2', termination: 'Triple répétition' };
  if (c.isDraw()) return { result: '1/2-1/2', termination: 'Règle des 50 coups' };
  return null;
}

export function scoreFor(result: Game['result'], me: Color): Score {
  if (result === '1/2-1/2') return 0.5;
  return (result === '1-0') === (me === 'w') ? 1 : 0;
}

/** Enregistre la partie, met à jour le niveau, alterne la couleur. */
export async function finishGame(cur: CurrentGame, result: Game['result'], termination: string): Promise<number> {
  const p = await getProfile();
  const score = scoreFor(result, cur.myColor);
  const ratingAfter = updateRating(cur.rating, cur.botElo, score, p.gamesPlayed);
  const { san } = replay(cur.startFen, cur.uci);
  const id = await db.transaction('rw', db.games, db.meta, async () => {
    const id = await db.games.add({
      source: 'app', date: Date.now(), myColor: cur.myColor, startFen: cur.startFen,
      uci: cur.uci, san, result, score, termination,
      ratingBefore: cur.rating, ratingAfter, botElo: cur.botElo, maiaMs: cur.maiaMs,
      ...(cur.openingId ? { openingId: cur.openingId } : {}),
    });
    // Les parties à thème comptent pour le niveau mais ne changent pas l'alternance des couleurs.
    const nextColor = cur.openingId ? p.nextColor : cur.myColor === 'w' ? 'b' : 'w';
    await setProfile({ rating: ratingAfter, gamesPlayed: p.gamesPlayed + 1, nextColor });
    await setCurrent(null);
    return id;
  });
  return id;
}
