import { describe, expect, it } from 'vitest';
import type { Card, Game, MoveAnalysis } from '../db';
import { piecesGivenCurve, rapidRatingCurve, unaidedReviewCurve } from './progressCurves';
import { pickExam, examOk, examResult } from './exam';
import { seeded, shuffled } from './shuffle';
import type { DrillPosition } from './repertoire';

const blunder = (motif: string): MoveAnalysis => ({ ply: 0, san: 'a', uci: 'a', bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 10, drop: 40, severity: 'blunder',
  detail: { v: 3, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: [motif], motif } } as unknown as MoveAnalysis);
const g = (date: number, extra: Partial<Game>): Game => ({ source: 'app', date, myColor: 'w', startFen: '', uci: [], san: [], result: '1-0', score: 1, termination: '', ...extra } as Game);

describe('courbes de Progrès', () => {
  it('pièces données par partie : gaffes « pièce en prise » + « menace ignorée », parties analysées sans aide, 30 dernières', () => {
    const games = [
      g(3, { analysis: [blunder('piece-en-prise'), blunder('menace-ignoree'), blunder('gain-rate')] }),
      g(1, { analysis: [] }),
      g(2, { analysis: [blunder('piece-en-prise')], assisted: true }),
      g(4, {}),
    ];
    expect(piecesGivenCurve(games).map((p) => p.value)).toEqual([0, 2]);
    const many = Array.from({ length: 40 }, (_, i) => g(i, { analysis: [] }));
    expect(piecesGivenCurve(many)).toHaveLength(30);
  });
  it('réussite sans aide en révision : 1re tentative du jour, juste et sans indice', () => {
    const t = (d: number, h: number) => new Date(2026, 10, d, h).getTime();
    const card = (attempts: Card['attempts']) => ({ attempts } as Card);
    const cards = [
      card([{ date: t(27, 9), uci: '', ok: true, hints: 0 }, { date: t(27, 10), uci: '', ok: false }]),
      card([{ date: t(27, 9), uci: '', ok: true, hints: 1 }]),
      card([{ date: t(28, 9), uci: '', ok: true }]),
    ];
    expect(unaidedReviewCurve(cards).map((p) => [p.label, p.value])).toEqual([['2026-11-27', 50], ['2026-11-28', 100]]);
  });
  it('classement Chess.com Rapid : parties importées en rapide seulement, dans l’ordre', () => {
    const ext = (timeClass: string, rating?: number) => ({ site: 'chess.com' as const, timeClass, me: { name: 'moi', rating }, opp: { name: 'x' } });
    const games = [
      g(2, { source: 'chesscom', ext: ext('rapid', 640) }), g(1, { source: 'chesscom', ext: ext('rapid', 610) }),
      g(3, { source: 'chesscom', ext: ext('blitz', 500) }), g(4, { source: 'chesscom', ext: ext('rapid') }), g(5, { ratingAfter: 950 }),
    ];
    expect(rapidRatingCurve(games).map((p) => p.value)).toEqual([610, 640]);
  });
});

describe('mélange et examen', () => {
  it('mélange : mêmes éléments, ordre changé, reproductible avec une graine', () => {
    const xs = Array.from({ length: 10 }, (_, i) => i);
    const a = shuffled(xs, seeded(1));
    expect([...a].sort((x, y) => x - y)).toEqual(xs);
    expect(a).not.toEqual(xs);
    expect(shuffled(xs, seeded(1))).toEqual(a);
  });
  it('examen : 10 positions distinctes au hasard, juste = coup du répertoire, ratées → à refaire', () => {
    const pos = Array.from({ length: 25 }, (_, i) => ({ key: 'k' + i, fen: 'f', accept: ['e2e4'], acceptSan: ['e4'], path: [], order: i } as DrillPosition));
    const exam = pickExam(pos, 10, seeded(2));
    expect(exam).toHaveLength(10);
    expect(new Set(exam.map((p) => p.key)).size).toBe(10);
    expect(examOk(exam[0], 'e2e4')).toBe(true);
    expect(examOk(exam[0], 'd2d4')).toBe(false);
    const r = examResult(exam.map((p, i) => ({ key: p.key, uci: i < 7 ? 'e2e4' : 'd2d4', ok: i < 7 })), 5);
    expect(r).toEqual({ date: 5, score: 7, total: 10, missed: exam.slice(7).map((p) => p.key) });
    expect(pickExam(pos.slice(0, 4))).toHaveLength(4);
  });
});
