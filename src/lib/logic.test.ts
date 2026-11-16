import { describe, expect, it } from 'vitest';
import { botRating, expectedScore, kFactor, updateRating, RATING_MAX, RATING_MIN } from './rating';
import { classify, winPercentFromCp, winPercent, isReviewMoveOk } from './winpct';
import { addDays, schedule, newCard, isDue } from './srs';
import { pickMove } from './maiaPick';

describe('niveau', () => {
  it('bot = R + 50, borné', () => {
    expect(botRating(900)).toBe(950);
    expect(botRating(2590)).toBe(2600);
  });
  it('score attendu', () => {
    expect(expectedScore(900, 900)).toBeCloseTo(0.5);
    expect(expectedScore(900, 950)).toBeCloseTo(0.4285, 3);
  });
  it('K = 80 les 10 premières parties puis 32', () => {
    expect(kFactor(0)).toBe(80);
    expect(kFactor(9)).toBe(80);
    expect(kFactor(10)).toBe(32);
  });
  it('mise à jour : victoire, nulle, défaite en calibration', () => {
    const e = expectedScore(900, 950);
    expect(updateRating(900, 950, 1, 0)).toBeCloseTo(900 + 80 * (1 - e));
    expect(updateRating(900, 950, 0.5, 0)).toBeCloseTo(900 + 80 * (0.5 - e));
    expect(updateRating(900, 950, 0, 0)).toBeCloseTo(900 - 80 * e);
    expect(updateRating(900, 950, 1, 0)).toBeCloseTo(945.71, 1);
  });
  it('mise à jour après calibration (K=32)', () => {
    expect(updateRating(1200, 1250, 0, 25)).toBeCloseTo(1200 - 32 * expectedScore(1200, 1250));
  });
  it('bornes 550–2600 ; au plancher, Maia joue à 600', () => {
    expect(RATING_MIN).toBe(550);
    expect(updateRating(560, 610, 0, 0)).toBe(RATING_MIN);
    expect(updateRating(2590, 2600, 1, 0)).toBe(RATING_MAX);
    expect(botRating(RATING_MIN)).toBe(600);
    expect(updateRating(610, 660, 0, 0)).toBeCloseTo(610 - 80 * expectedScore(610, 660)); // plus de plancher à 600
  });
});

describe('% de gain et classement', () => {
  it('formule Lichess', () => {
    expect(winPercentFromCp(0)).toBeCloseTo(50);
    expect(winPercentFromCp(100)).toBeCloseTo(59.1, 1);
    expect(winPercentFromCp(-100)).toBeCloseTo(40.9, 1);
    expect(winPercent({ mate: 3 })).toBeGreaterThan(97);
    expect(winPercent({ mate: -2 })).toBeLessThan(3);
  });
  it('seuils 10 / 20 / 30', () => {
    expect(classify(9.99)).toBe('ok');
    expect(classify(10)).toBe('inaccuracy');
    expect(classify(19.9)).toBe('inaccuracy');
    expect(classify(20)).toBe('mistake');
    expect(classify(29.9)).toBe('mistake');
    expect(classify(30)).toBe('blunder');
    expect(classify(-5)).toBe('ok');
  });
  it('tolérance de révision 5 pts', () => {
    expect(isReviewMoveOk(true, 50)).toBe(true);
    expect(isReviewMoveOk(false, 5)).toBe(true);
    expect(isReviewMoveOk(false, 5.1)).toBe(false);
  });
});

describe('intervalles', () => {
  const today = '2026-11-15';
  it('addDays traverse les mois', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 30)).toBe('2027-01-30');
  });
  it('nouvelle carte à J+1', () => {
    expect(newCard(today)).toEqual({ step: 0, due: '2026-11-16' });
  });
  it('réussites successives : J+3, J+7, J+14, J+30, J+30', () => {
    let s = newCard(today);
    const got: string[] = [];
    for (let i = 0; i < 5; i++) {
      s = schedule(s, true, today);
      got.push(s.due);
    }
    expect(got).toEqual(['2026-11-18', '2026-11-22', '2026-11-29', '2026-12-15', '2026-12-15']);
  });
  it('raté → J+1 et retour au début', () => {
    const s = schedule({ step: 3, due: today }, false, today);
    expect(s).toEqual({ step: 0, due: '2026-11-16' });
    expect(schedule(s, true, today).due).toBe('2026-11-18');
  });
  it('échéance', () => {
    expect(isDue({ step: 0, due: '2026-11-15' }, today)).toBe(true);
    expect(isDue({ step: 0, due: '2026-11-16' }, today)).toBe(false);
  });
});

describe('tirage Maia', () => {
  const probs: [string, number][] = [['e2e4', 0.6], ['d2d4', 0.37], ['a2a3', 0.029]];
  it('ignore les coups < 3 %', () => {
    for (let i = 0; i < 200; i++) expect(pickMove(probs, () => i / 200)).not.toBe('a2a3');
  });
  it('respecte les proportions', () => {
    expect(pickMove(probs, () => 0)).toBe('e2e4');
    expect(pickMove(probs, () => 0.999)).toBe('d2d4');
  });
  it('garde le meilleur coup si tout est < 3 %', () => {
    expect(pickMove([['a', 0.01], ['b', 0.02]], () => 0.5)).toBe('b');
  });
});

import { colorForNewGame, gamesSinceCalibration, inCalibration, nextColorAfter, withManualRating, type ProfileData } from './profile';

describe('profil : couleur et calibration', () => {
  const base: ProfileData = { rating: 900, gamesPlayed: 0, nextColor: 'w' };
  it('« Alterner » par défaut : Blancs, Noirs, Blancs…', () => {
    let p = { ...base };
    const colors: string[] = [];
    for (let i = 0; i < 4; i++) {
      const c = colorForNewGame(p);
      colors.push(c);
      p = { ...p, gamesPlayed: p.gamesPlayed + 1, nextColor: nextColorAfter(p, c) }; // fin de partie (abandon compris)
    }
    expect(colors).toEqual(['w', 'b', 'w', 'b']);
  });
  it('partie à thème : l’alternance n’avance pas', () => {
    expect(nextColorAfter({ ...base, nextColor: 'b' }, 'w', true)).toBe('b');
  });
  it('couleur fixe : toujours la même ; retour à « Alterner » : l’inverse de la dernière partie', () => {
    let p: ProfileData = { ...base, colorMode: 'b' };
    for (let i = 0; i < 3; i++) {
      expect(colorForNewGame(p)).toBe('b');
      p = { ...p, gamesPlayed: p.gamesPlayed + 1, nextColor: nextColorAfter(p, 'b') };
    }
    expect(colorForNewGame({ ...p, colorMode: 'alternate' })).toBe('w');
  });
  it('niveau à la main : borné à 550–2600, arrondi, et retour en calibration (K = 80 pour 10 parties)', () => {
    const p = { ...base, gamesPlayed: 37 };
    expect(inCalibration(p)).toBe(false);
    const q = withManualRating(p, 1234.6);
    expect(q.rating).toBe(1235);
    expect(gamesSinceCalibration(q)).toBe(0);
    expect(kFactor(gamesSinceCalibration(q))).toBe(80);
    expect(kFactor(gamesSinceCalibration({ ...q, gamesPlayed: 46 }))).toBe(80);  // 9e partie après le réglage
    expect(kFactor(gamesSinceCalibration({ ...q, gamesPlayed: 47 }))).toBe(32);  // 11e
    expect(withManualRating(p, 400).rating).toBe(550);
    expect(withManualRating(p, 3000).rating).toBe(2600);
  });
});
