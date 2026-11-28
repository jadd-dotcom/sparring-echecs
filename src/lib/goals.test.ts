// « Mon objectif » : partie propre, maîtrise (7/10), objectif suivant, retour d'un objectif (≤ 5/10), À surveiller.
import { describe, expect, it } from 'vitest';
import type { Game, MoveAnalysis } from '../db';
import type { Motif } from './report/motifs';
import { GOALS, baselineOn10, goalBlunderPlies, goalProgress, initialGoalState, isClean, masteryThreshold, toWatch, updateGoals, type ExitInfo } from './goals';

const DAY = 86400000;
const T0 = new Date(2026, 10, 1).getTime();
let nextId = 1;
/** Partie de `moves` coups à moi ; `blunders` : motifs principaux de mes gaffes. */
function game(day: number, blunders: Motif[] = [], moves = 20, extra: Partial<MoveAnalysis>[] = []): Game {
  const analysis: MoveAnalysis[] = Array.from({ length: moves }, (_, i) => ({
    ply: 2 * i, san: 'a3', uci: 'a2a3', bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 50, drop: 0, severity: 'ok' as const,
  }));
  blunders.forEach((m, i) => Object.assign(analysis[i], { severity: 'blunder', drop: 35,
    detail: { depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: [m], motif: m } }));
  extra.forEach((e, i) => Object.assign(analysis[blunders.length + i], e));
  return { id: nextId++, source: 'app', date: T0 + day * DAY, myColor: 'w', startFen: '', uci: [], san: [], result: '1-0', score: 1,
    termination: '', analysis } as unknown as Game;
}
const [G1, G2, G3] = GOALS;

describe('« Mon objectif » : partie propre', () => {
  it('objectif 1 : aucune gaffe « Menace ignorée » ni « Pièce laissée en prise » ; les autres motifs et les erreurs ne comptent pas', () => {
    expect(isClean(G1, game(1))).toBe(true);
    expect(isClean(G1, game(1, ['piece-en-prise']))).toBe(false);
    expect(isClean(G1, game(1, ['menace-ignoree']))).toBe(false);
    expect(isClean(G1, game(1, ['gain-rate', 'mat-ouvert']))).toBe(true);
    const err = game(1, [], 20, [{ severity: 'mistake', drop: 25, detail: { depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: ['piece-en-prise'], motif: 'piece-en-prise' } }]);
    expect(isClean(G1, err)).toBe(true);                                  // erreur (< 30 pts), pas une gaffe
    expect(isClean(G2, game(1, ['mat-rate']))).toBe(false);
    expect(goalBlunderPlies(G2, game(1, ['gain-rate']))).toEqual([0]);
  });
  it('objectif 3 : aucune sortie du répertoire par moi', () => {
    const g = game(1, ['piece-en-prise']);
    expect(isClean(G3, g, { by: 'me', ply: 6 })).toBe(false);
    expect(goalBlunderPlies(G3, g, { by: 'me', ply: 6 })).toEqual([6]);
    expect(isClean(G3, g, { by: 'opponent', ply: 5 })).toBe(true);
    expect(isClean(G3, g, null)).toBe(true);
  });
});

describe('« Mon objectif » : mesure, maîtrise, objectif suivant, retour', () => {
  const since = T0 + 20 * DAY;
  it('mesure depuis le début (10 coups au moins), 10 dernières, point de départ = 10 parties d’avant', () => {
    const before = [...Array.from({ length: 12 }, (_, i) => game(i, i % 2 ? ['piece-en-prise'] : []))];
    const short = game(21, ['piece-en-prise'], 6);                      // moins de 10 coups : pas mesurée
    const after = Array.from({ length: 4 }, (_, i) => game(22 + i, i === 0 ? ['menace-ignoree'] : []));
    const p = goalProgress(G1, [...before, short, ...after], since);
    expect(p.total).toBe(4);
    expect(p.last.map((x) => x.clean)).toEqual([false, true, true, true]);
    expect(p.clean).toBe(3);
    expect(p.baseline).toEqual({ clean: 5, n: 10 });
    expect(p.mastered).toBe(false);
  });
  it('partie avec aide : jamais mesurée', () => {
    const after = Array.from({ length: 3 }, (_, i) => game(22 + i));
    const helped = { ...game(26), assisted: true };
    expect(goalProgress(G1, [...after, helped], since).total).toBe(3);
  });
  /** 10 parties avant le début, dont `clean` propres (point de départ). */
  const start = (clean: number) => Array.from({ length: 10 }, (_, i) => game(i, i < clean ? [] : ['piece-en-prise']));
  it('seuil de maîtrise = point de départ + 3, borné entre 5 et 7 (départs 0, 2, 4, 6)', () => {
    expect([0, 2, 4, 6].map(masteryThreshold)).toEqual([5, 5, 7, 7]);
    for (const [b, th] of [[0, 5], [2, 5], [4, 7], [6, 7]] as const) {
      const p = (n: number) => goalProgress(G1, [...start(b), ...Array.from({ length: 10 }, (_, i) => game(21 + i, i < 10 - n ? ['piece-en-prise'] : []))], since);
      expect(p(th).baseline).toEqual({ clean: b, n: 10 });
      expect(p(th).threshold).toBe(th);
      expect(p(th).mastered, `départ ${b} : ${th}/10`).toBe(true);
      expect(p(th - 1).mastered, `départ ${b} : ${th - 1}/10`).toBe(false);
    }
    // Sans partie avant le début : départ 0, seuil 5.
    expect(goalProgress(G1, [], since).threshold).toBe(5);
    expect(baselineOn10({ clean: 2, n: 4 })).toBe(5);
  });
  it('maîtrisé : seuil atteint sur les 10 dernières (10 parties au moins) → message, l’objectif suivant devient actif', () => {
    const six = [...start(4), ...Array.from({ length: 10 }, (_, i) => game(21 + i, i < 4 ? ['piece-en-prise'] : []))];   // 6/10, seuil 7
    let s = updateGoals({ ...initialGoalState(since) }, six, T0 + 40 * DAY);
    expect(s.active).toBe(0);
    expect(s.messages).toEqual([]);
    const seven = [...six, game(31)];                                                                           // 7/10
    s = updateGoals(s, seven, T0 + 41 * DAY);
    expect(s.active).toBe(1);
    expect(s.since).toBe(T0 + 41 * DAY);
    expect(s.mastered['rien-donner']).toBe(T0 + 41 * DAY);
    expect(s.messages[0]).toMatch(/Objectif maîtrisé : « Ne rien donner » \(7\/10 parties propres, seuil 7\/10\)\. Nouvel objectif : « Ne rien laisser passer »/);
    expect(s.thresholds?.['rien-donner']).toBe(7);
    // 9 parties seulement depuis le début : jamais maîtrisé, même toutes propres.
    expect(goalProgress(G1, Array.from({ length: 9 }, (_, i) => game(21 + i)), since).mastered).toBe(false);
  });
  it('retour : un objectif maîtrisé qui retombe à son seuil − 2 ou moins redevient actif, avec un message', () => {
    const base = [...start(4), ...Array.from({ length: 10 }, (_, i) => game(21 + i))];                             // seuil 7 → retour à 5
    const state0 = updateGoals(initialGoalState(since), base, T0 + 31 * DAY);
    expect(state0.thresholds?.['rien-donner']).toBe(7);
    let s = state0;
    expect(s.active).toBe(1);
    const bad = [...base, ...Array.from({ length: 4 }, (_, i) => game(32 + i, ['piece-en-prise']))];          // 6/10 : pas encore
    s = updateGoals({ ...s, messages: [] }, bad, T0 + 36 * DAY);
    expect(s.active).toBe(1);
    const worse = [...bad, game(37, ['menace-ignoree'])];                                                       // 5/10
    s = updateGoals(s, worse, T0 + 37 * DAY);
    expect(s.active).toBe(0);
    expect(s.mastered['rien-donner']).toBeUndefined();
    expect(s.since).toBe(T0 + 37 * DAY);
    expect(s.messages[0]).toMatch(/« Ne rien donner » retombe à 5\/10 parties propres : cet objectif redevient actif/);
    // Seuil 5 (départ 0) : retour seulement à 3/10 ou moins.
    const low = { ...initialGoalState(T0 + 55 * DAY), active: 1, mastered: { 'rien-donner': 1 }, thresholds: { 'rien-donner': 5 } };
    const four = Array.from({ length: 10 }, (_, i) => game(40 + i, i < 6 ? ['piece-en-prise'] : []));            // 4/10
    expect(updateGoals(low, four, T0 + 60 * DAY).active).toBe(1);
    const three = Array.from({ length: 10 }, (_, i) => game(40 + i, i < 7 ? ['piece-en-prise'] : []));           // 3/10
    expect(updateGoals(low, three, T0 + 60 * DAY).active).toBe(0);
  });
  it('À surveiller : gaffes des autres motifs sur les 10 dernières parties (et sorties du répertoire)', () => {
    const gs = [game(1, ['gain-rate', 'gain-rate']), game(2, ['piece-en-prise', 'mat-ouvert']), game(3, ['autre'])];
    const exits: Record<number, ExitInfo> = { [gs[0].id!]: { by: 'me', ply: 4 } };
    expect(toWatch(G1, gs, exits)).toEqual([{ label: 'gain-rate', count: 2 }, { label: 'mat-ouvert', count: 1 }, { label: 'autre', count: 1 }, { label: 'repertoire', count: 1 }]);
    expect(toWatch(G3, gs, exits).some((x) => x.label === 'repertoire')).toBe(false);
  });
});
