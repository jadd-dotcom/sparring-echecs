import { describe, expect, it } from 'vitest';
import type { Game, MoveAnalysis } from '../db';
import { errorsToComment, gameErrorsToComment } from './commentQueue';
import { ANALYSIS_SINCE } from './analysisQueue';

const a = (ply: number, severity: MoveAnalysis['severity']): MoveAnalysis =>
  ({ ply, san: 'e4', uci: 'e2e4', bestUci: 'd2d4', bestSan: 'd4', wpBefore: 50, wpAfter: 40, drop: 10, severity });
const g = (id: number, date: number, an: MoveAnalysis[] | undefined, tags?: Game['thoughtTags']) =>
  ({ id, date, analysis: an, thoughtTags: tags }) as Game;

describe('erreurs à commenter', () => {
  it('une partie : erreurs et gaffes sans réponse, dans l’ordre (imprécisions exclues)', () => {
    const x = g(1, ANALYSIS_SINCE + 5, [a(9, 'blunder'), a(3, 'mistake'), a(5, 'inaccuracy'), a(7, 'ok'), a(11, 'mistake')], { 11: 'menace' });
    expect(gameErrorsToComment(x).map((t) => t.ply)).toEqual([3, 9]);
  });
  it('toutes les parties depuis le 16/11/2026, les plus récentes d’abord ; parties non analysées ignorées', () => {
    const list = errorsToComment([
      g(1, ANALYSIS_SINCE + 10, [a(4, 'blunder')]),
      g(2, ANALYSIS_SINCE + 20, [a(2, 'mistake'), a(6, 'blunder')], { 2: 'trop-vite' }),
      g(3, ANALYSIS_SINCE - 1, [a(1, 'blunder')]),       // trop ancienne
      g(4, ANALYSIS_SINCE + 30, undefined),              // pas encore analysée
    ]);
    expect(list.map((t) => [t.gameId, t.ply])).toEqual([[2, 6], [1, 4]]);
  });
});
