// Plan du jour : plafond et priorités de la révision, étapes de la séance, piège du jour.
import { describe, expect, it } from 'vitest';
import { allowance, nextStep, pickTrap, prioritize, reviewedToday, sessionSteps, type SessionInput } from './dailyPlan';

const card = (id: number, kind: string, due: string, motif?: string) => ({ id, kind, due, createdAt: id, motif, attempts: [] as { date: number; uci: string; ok: boolean }[] });

describe('révision plafonnée', () => {
  it('d’abord les motifs de l’objectif, puis Lis la menace, puis les plus anciennes', () => {
    const cs = [card(1, 'mistake', '2026-11-20', 'gain-rate'), card(2, 'threat', '2026-11-25'), card(3, 'mistake', '2026-11-26', 'piece-en-prise'),
      card(4, 'drill', '2026-11-10'), card(5, 'mistake', '2026-11-22', 'menace-ignoree')];
    const out = prioritize(cs as never[], (c: { motif?: string }) => c.motif as never, ['menace-ignoree', 'piece-en-prise']).map((c: { id: number }) => c.id);
    expect(out).toEqual([5, 3, 2, 4, 1]);
  });
  it('plafond moins les cartes déjà revues aujourd’hui ; 0 = sans limite', () => {
    expect(allowance(15, 4)).toBe(11);
    expect(allowance(10, 12)).toBe(0);
    expect(allowance(0, 50)).toBe(Infinity);
    const now = Date.now();
    expect(reviewedToday([{ attempts: [{ date: now, uci: '', ok: true }] }, { attempts: [{ date: now - 3 * 86400000, uci: '', ok: false }] }, { attempts: [] }])).toBe(1);
  });
});

describe('séance du jour', () => {
  const base: SessionInput = { warmupDone: false, dueChapter: 3, trap: { id: 'englund', name: 'Gambit Englund' }, trapDone: false,
    threatLeft: 2, threatDoneToday: 0, reviseLeft: 15, reviseDoneToday: 0, gameToday: false };
  it('5 étapes avec durée ; « Continuer » = la première non faite', () => {
    const s = sessionSteps(base);
    expect(s.map((x) => x.id)).toEqual(['warmup', 'trap', 'threat', 'revise', 'game']);
    expect(s.map((x) => x.minutes)).toEqual([3, 4, 5, 10, 15]);
    expect(s[0].detail).toBe('chapitre 3 à revoir');
    expect(nextStep(s)!.id).toBe('warmup');
    expect(nextStep(sessionSteps({ ...base, warmupDone: true }))!.id).toBe('trap');
  });
  it('étapes sans objet cochées : plus de piège, rien à lire, rien à réviser ; tout fait → plus d’étape', () => {
    const s = sessionSteps({ ...base, warmupDone: true, trap: null, threatLeft: 0, reviseLeft: 0, reviseDoneToday: 7 });
    expect(s.filter((x) => x.done).map((x) => x.id)).toEqual(['warmup', 'trap', 'threat', 'revise']);
    expect(s[2].detail).toBe('rien aujourd’hui');
    expect(s[3].detail).toBe('faite');
    expect(nextStep(s)!.id).toBe('game');
    expect(nextStep(sessionSteps({ ...base, warmupDone: true, trapDone: true, threatLeft: 0, reviseLeft: 0, gameToday: true }))).toBeNull();
  });
  it('piège du jour : non maîtrisé, mes ouvertures d’abord', () => {
    const traps = [{ id: 'berger', chapter: 'mats' }, { id: 'petrov', chapter: 'dame' }, { id: 'englund', chapter: 'mes' }, { id: 'g6', chapter: 'mes' }];
    expect(pickTrap(traps, () => false)!.id).toBe('englund');
    expect(pickTrap(traps, (id) => id === 'englund' || id === 'g6')!.id).toBe('berger');
    expect(pickTrap(traps, () => true)).toBeNull();
  });
});
