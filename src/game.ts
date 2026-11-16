import { Chess } from 'chess.js';
import { db, getProfile, setCurrent, setProfile, type Color, type CurrentGame, type Game } from './db';
import { botRating, updateRating, type Score } from './lib/rating';
import { colorForNewGame, gamesSinceCalibration, nextColorAfter } from './lib/profile';
import { replay } from './analysis';
import { canCancel } from './lib/gameRules';
import { getCurrent } from './db';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Nouvelle partie ; avec `openingId`, partie à thème dans la couleur de l'ouverture.
 * `unrated` : partie non comptée (analysée normalement, sans effet sur le niveau).
 */
export async function newCurrentGame(openingId?: string, opts: { unrated?: boolean } = {}): Promise<CurrentGame> {
  const p = await getProfile();
  const o = openingId ? await db.openings.get(openingId) : undefined;
  const g: CurrentGame = {
    myColor: o ? o.color : colorForNewGame(p), startFen: START_FEN, uci: [],
    rating: p.rating, botElo: botRating(p.rating), maiaMs: [], startedAt: Date.now(),
    ...(o ? { openingId: o.id } : {}),
    ...(opts.unrated ? { unrated: true } : {}),
  };
  await setCurrent(g);
  return g;
}

/** Annule la partie en cours (pendant mes 5 premiers coups) : supprimée, sans aucun effet sur le profil. */
export async function cancelCurrentGame(): Promise<void> {
  const cur = await getCurrent();
  if (!cur) return;
  if (!canCancel(cur)) throw new Error('Annulation impossible après le 5e coup : propose la nulle ou abandonne.');
  await setCurrent(null);
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

/** Enregistre la partie, met à jour le niveau (sauf partie non comptée), alterne la couleur. */
export async function finishGame(cur: CurrentGame, result: Game['result'], termination: string): Promise<number> {
  const p = await getProfile();
  const score = scoreFor(result, cur.myColor);
  const ratingAfter = cur.unrated ? cur.rating : updateRating(cur.rating, cur.botElo, score, gamesSinceCalibration(p));
  const { san } = replay(cur.startFen, cur.uci);
  const id = await db.transaction('rw', db.games, db.meta, async () => {
    const id = await db.games.add({
      source: 'app', date: Date.now(), myColor: cur.myColor, startFen: cur.startFen,
      uci: cur.uci, san, result, score, termination,
      ratingBefore: cur.rating, ratingAfter, botElo: cur.botElo, maiaMs: cur.maiaMs,
      ...(cur.openingId ? { openingId: cur.openingId } : {}),
      ...(cur.unrated ? { unrated: true } : {}),
    });
    // Les parties à thème comptent pour le niveau mais ne changent pas l'alternance des couleurs.
    // Une partie non comptée ne change ni le niveau ni la calibration (gamesPlayed), mais fait alterner la couleur.
    await setProfile({
      ...p,
      rating: cur.unrated ? p.rating : ratingAfter,
      gamesPlayed: cur.unrated ? p.gamesPlayed : p.gamesPlayed + 1,
      nextColor: nextColorAfter(p, cur.myColor, !!cur.openingId),
    });
    await setCurrent(null);
    return id;
  });
  return id;
}
