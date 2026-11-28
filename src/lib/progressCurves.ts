// Courbes de l'onglet Progrès (fonctions pures) : pièces données par partie, réussite sans aide en révision, classement
// Chess.com Rapid des parties importées (séparé du niveau Maia).
import type { Card, Game } from '../db';
import { dayKey } from './srs';

export const CURVE_GAMES = 30;
/** Motifs comptés comme « pièce donnée ». */
export const GIVEN_MOTIFS = ['piece-en-prise', 'menace-ignoree'] as const;

/** Une valeur par partie analysée (les 30 dernières, des plus anciennes aux plus récentes). */
export interface CurvePoint { date: number; value: number; label: string }

/** Gaffes « pièce laissée en prise » + « menace ignorée » de chaque partie analysée (Maia et Chess.com, sans aide). */
export function piecesGivenCurve(games: Game[], n = CURVE_GAMES): CurvePoint[] {
  return games.filter((g) => g.analysis && !g.assisted).sort((a, b) => a.date - b.date).slice(-n).map((g) => ({
    date: g.date,
    value: g.analysis!.filter((a) => a.severity === 'blunder' && a.detail && (GIVEN_MOTIFS as readonly string[]).includes(a.detail.motif)).length,
    label: new Date(g.date).toLocaleDateString('fr-FR'),
  }));
}

/**
 * Réussite sans aide en révision, par jour (les 30 derniers jours d'activité) : part des cartes dont la 1re tentative du
 * jour est juste et sans indice. Les tentatives enregistrées avant le 28/11/2026 n'ont pas de compteur d'indices :
 * elles comptent comme sans indice.
 */
export function unaidedReviewCurve(cards: Card[], n = CURVE_GAMES): CurvePoint[] {
  const byDay = new Map<string, { ok: number; total: number; date: number }>();
  for (const c of cards) {
    const seen = new Set<string>();
    for (const a of [...c.attempts].sort((x, y) => x.date - y.date)) {
      const d = dayKey(new Date(a.date));
      if (seen.has(d)) continue;           // seule la 1re tentative du jour compte
      seen.add(d);
      const e = byDay.get(d) ?? { ok: 0, total: 0, date: a.date };
      e.total++;
      if (a.ok && !(a.hints ?? 0)) e.ok++;
      byDay.set(d, e);
    }
  }
  return [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-n)
    .map(([d, e]) => ({ date: e.date, value: Math.round((100 * e.ok) / e.total), label: d }));
}

/** Classement Chess.com Rapid (le mien) des parties importées, dans l'ordre. */
export function rapidRatingCurve(games: Game[], n = CURVE_GAMES): CurvePoint[] {
  return games.filter((g) => g.source === 'chesscom' && g.ext?.timeClass === 'rapid' && typeof g.ext.me.rating === 'number')
    .sort((a, b) => a.date - b.date).slice(-n)
    .map((g) => ({ date: g.date, value: g.ext!.me.rating!, label: new Date(g.date).toLocaleDateString('fr-FR') }));
}
