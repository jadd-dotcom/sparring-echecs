// « Ce que je pensais » au bon moment : mes erreurs et gaffes pas encore commentées (réponse en un toucher).
import type { Game } from '../db';

/**
 * Badge « X erreurs à commenter » et écran correspondant : seulement les parties jouées à partir du 27/11/2026, 0 h
 * (heure de l'appareil). Les erreurs plus anciennes restent commentables dans la revue, sans badge.
 */
export const COMMENT_SINCE = new Date(2026, 10, 27).getTime();

export interface ToComment { gameId: number; ply: number; date: number }

type G = Pick<Game, 'id' | 'date' | 'analysis' | 'thoughtTags'>;

/** Erreurs et gaffes d'une partie sans réponse, dans l'ordre de la partie. */
export function gameErrorsToComment(g: G): ToComment[] {
  return (g.analysis ?? [])
    .filter((a) => (a.severity === 'mistake' || a.severity === 'blunder') && !g.thoughtTags?.[a.ply])
    .sort((x, y) => x.ply - y.ply)
    .map((a) => ({ gameId: g.id!, ply: a.ply, date: g.date }));
}

/**
 * Toutes mes erreurs et gaffes à commenter, parties jouées depuis `since` (le 27/11/2026) : les parties les plus
 * récentes d'abord, puis dans l'ordre de la partie.
 */
export function errorsToComment(games: G[], since = COMMENT_SINCE): ToComment[] {
  return games
    .filter((g) => g.analysis && g.date >= since)
    .sort((a, b) => b.date - a.date)
    .flatMap(gameErrorsToComment);
}
