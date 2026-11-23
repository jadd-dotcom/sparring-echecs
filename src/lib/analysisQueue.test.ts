import { describe, expect, it } from 'vitest';
import { ANALYSIS_SINCE, estimateRemaining, formatEta, splitPending } from './analysisQueue';

const day = (d: number, h = 12) => new Date(2026, 10, d, h).getTime();

describe('file d’analyse des parties importées', () => {
  it('date par défaut : 16/11/2026 à 0 h', () => {
    expect(new Date(ANALYSIS_SINCE).toLocaleDateString('fr-FR')).toBe('16/11/2026');
    expect(new Date(ANALYSIS_SINCE).getHours()).toBe(0);
  });
  it('récentes (depuis le 16/11) et anciennes, chacune de la plus récente à la plus ancienne', () => {
    const gs = [{ id: 1, date: day(2) }, { id: 2, date: day(20) }, { id: 3, date: day(16, 0) }, { id: 4, date: day(15, 23) }, { id: 5, date: day(23) }];
    const { recent, old } = splitPending(gs);
    expect(recent.map((g) => g.id)).toEqual([5, 2, 3]);
    expect(old.map((g) => g.id)).toEqual([4, 1]);
  });
  it('temps restant d’après la vitesse observée (demi-coups)', () => {
    expect(estimateRemaining({ elapsedMs: 1000, pliesDone: 40, pliesTotal: 400 })).toBeNull();   // trop tôt
    expect(estimateRemaining({ elapsedMs: 20000, pliesDone: 40, pliesTotal: 400 })).toBe(180);   // 0,5 s par demi-coup
    expect(estimateRemaining({ elapsedMs: 20000, pliesDone: 400, pliesTotal: 400 })).toBe(0);
  });
  it('affichage du temps restant', () => {
    expect(formatEta(null)).toBe('calcul en cours…');
    expect(formatEta(42)).toBe('moins d’une minute');
    expect(formatEta(12 * 60 + 10)).toBe('≈ 12 min');
    expect(formatEta(65 * 60)).toBe('≈ 1 h 05 min');
  });
});
