// « Ce que je pensais » au bon moment : mes erreurs et gaffes pas encore commentées (réponse en un toucher).
import type { Game } from '../db';
import { ANALYSIS_SINCE } from './analysisQueue';

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
 * Toutes mes erreurs et gaffes à commenter, parties jouées depuis `since` (le 16/11/2026, comme l'analyse
 * automatique des parties importées) : les parties les plus récentes d'abord, puis dans l'ordre de la partie.
 */
export function errorsToComment(games: G[], since = ANALYSIS_SINCE): ToComment[] {
  return games
    .filter((g) => g.analysis && g.date >= since)
    .sort((a, b) => b.date - a.date)
    .flatMap(gameErrorsToComment);
}
