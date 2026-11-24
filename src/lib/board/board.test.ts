// Maîtrise de l'échiquier : questions exactes, critères de maîtrise, révisions, tirage adaptatif.
import { describe, expect, it } from 'vitest';
import { Chess, type Square } from 'chess.js';
import { checkAnswer, makeQuestion, visuSequence, type Question } from './questions';
import {
  addDaysKey, dueChapters, emptyProgress, LEVELS, levelById, levelUnlocked, chapterUnlocked, median, recordReview,
  recordTest, replayPassed, reviewLevel, testPassed,
} from './levels';
import { pickSquare, recordAnswer, seeded, weakestSquares, weakness, type SquareStats } from './stats';
import { fileNo, rankNo, SQUARES } from './geometry';
import { OPENING_LINES, SHORT_GAMES } from '../../data/boardGames';
import { unfig } from '../notation';

const L = (id: string) => levelById(id)!;
const many = (id: string, n = 400, seed = 7): Question[] => {
  const rng = seeded(seed);
  const out: Question[] = [];
  for (let i = 0; i < n; i++) out.push(makeQuestion(L(id), rng, {}, out[out.length - 1]));
  return out;
};
// Vérifications indépendantes (sans le code testé) :
const kMoves = (s: string) => SQUARES.filter((t) => { const df = Math.abs(fileNo(t) - fileNo(s)), dr = Math.abs(rankNo(t) - rankNo(s)); return (df === 1 && dr === 2) || (df === 2 && dr === 1); });
const onDiag = (a: string, b: string) => a !== b && Math.abs(fileNo(a) - fileNo(b)) === Math.abs(rankNo(a) - rankNo(b));
const parse = (p: string) => p.match(/[a-h][1-8]/g)!;

describe('questions exactes', () => {
  it('1a/1b : colonnes et rangées (toucher n’importe quelle case de la bonne colonne / rangée)', () => {
    for (const q of many('1a', 50)) {
      expect(q.prompt).toBe(`Touche la colonne ${q.expected}`);
      expect(checkAnswer(q, `${q.expected}5`)).toBe(true);
      expect(checkAnswer(q, `${q.expected === 'a' ? 'b' : 'a'}5`)).toBe(false);
    }
    for (const q of many('1b', 50)) {
      expect(checkAnswer(q, `c${q.expected}`)).toBe(true);
      expect(checkAnswer(q, `c${q.expected === '1' ? '2' : '1'}`)).toBe(false);
    }
  });
  it('1c-1e, 2c-2e : trouver / nommer une case', () => {
    for (const id of ['1c', '1d', '2c', '2d']) for (const q of many(id, 60)) {
      expect(q.prompt).toBe(`Touche la case ${q.expected}`);
      expect(checkAnswer(q, q.expected as string)).toBe(true);
    }
    for (const q of many('1e', 60)) { expect(q.highlight).toBe(q.expected); expect(q.input).toBe('keypad'); }
    expect(L('2e').side).toBe('b');
  });
  it('3 : couleur des cases = couleur réelle (chess.js)', () => {
    const c = new Chess();
    for (const q of many('3')) {
      const s = parse(q.prompt)[0];
      expect(q.expected).toBe(c.squareColor(s as Square) === 'dark' ? 'foncée' : 'claire');
    }
    const f5 = { ...many('3', 1)[0], prompt: 'f5', expected: 'claire' };
    expect(checkAnswer(f5, 'claire')).toBe(true);
  });
  it('4 : diagonales (même diagonale ? cases entre)', () => {
    let yes = 0, lists = 0;
    for (const q of many('4')) {
      const [a, b] = parse(q.prompt);
      if (q.input === 'choice') {
        expect(q.expected).toBe(onDiag(a, b) ? 'oui' : 'non');
        if (q.expected === 'oui') yes++;
      } else {
        lists++;
        expect(onDiag(a, b)).toBe(true);
        const mid = SQUARES.filter((t) => onDiag(a, t) && onDiag(b, t)
          && Math.min(fileNo(a), fileNo(b)) < fileNo(t) && fileNo(t) < Math.max(fileNo(a), fileNo(b))
          && Math.min(rankNo(a), rankNo(b)) < rankNo(t) && rankNo(t) < Math.max(rankNo(a), rankNo(b)));
        expect([...(q.expected as string[])].sort()).toEqual(mid.sort());
        expect(q.units).toBe(mid.length);
        expect(checkAnswer(q, [...mid].reverse())).toBe(true);          // ordre indifférent
        expect(checkAnswer(q, mid.slice(1))).toBe(mid.length === 0);    // incomplet → faux
      }
    }
    expect(yes).toBeGreaterThan(50);
    expect(lists).toBeGreaterThan(100);
  });
  it('5 : pièces (cases du cavalier, fou, distance du cavalier)', () => {
    let k = 0, b = 0, d = 0;
    for (const q of many('5', 600)) {
      const sqs = parse(q.prompt);
      if (q.input === 'multi') { k++; expect([...(q.expected as string[])].sort()).toEqual(kMoves(sqs[0]).sort()); }
      else if (q.prompt.includes('attaque')) { b++; expect(q.expected).toBe(onDiag(sqs[0], sqs[1]) ? 'oui' : 'non'); }
      else {
        d++;
        // distance indépendante : parcours en largeur avec kMoves
        const seen = new Map([[sqs[0], 0]]); const queue = [sqs[0]];
        while (queue.length) { const x = queue.shift()!; for (const y of kMoves(x)) if (!seen.has(y)) { seen.set(y, seen.get(x)! + 1); queue.push(y); } }
        expect(Number(q.expected)).toBe(seen.get(sqs[1]));
      }
    }
    expect(Math.min(k, b, d)).toBeGreaterThan(120);
    const g1 = many('5', 600).find((q) => q.input === 'multi' && q.prompt.includes('g1'));
    if (g1) expect([...(g1.expected as string[])].sort()).toEqual(['e2', 'f3', 'h3']);
  });
  it('6 : visualisation (suite légale de la bonne longueur ; réponse = position réelle)', () => {
    for (const id of ['6-2', '6-4', '6-6', '6-8', '6-12', '6-16']) for (const q of many(id, 80)) {
      const plies = L(id).plies!;
      expect(q.moves).toHaveLength(plies);
      const c = new Chess();
      for (const m of q.moves!) c.move(m);
      const s = q.square! as Square;
      if (q.choices!.length > 2) {
        const p = c.get(s);
        expect(q.expected).toBe(p ? p.color + p.type.toUpperCase() : 'none');
      } else {
        const p = c.get(s)!;
        expect(q.expected).toBe(c.isAttacked(s, p.color) ? 'oui' : 'non');
      }
      expect(unfig(q.prompt)).toContain(q.moves!.length > 1 ? q.moves![1] : q.moves![0]);
    }
  });
  it('débuts et parties courtes : coups légaux ; parties courtes finies par un mat', () => {
    for (const l of OPENING_LINES) { const c = new Chess(); for (const m of l) c.move(m); expect(l.length).toBe(16); }
    for (const g of SHORT_GAMES) { const c = new Chess(); for (const m of g.moves) c.move(m); expect(c.isCheckmate(), g.name).toBe(true); }
    const r = seeded(3);
    for (let i = 0; i < 200; i++) expect(visuSequence(r, 8)).toHaveLength(8);
    for (let i = 0; i < 200; i++) expect(visuSequence(r, 16)).toHaveLength(16);
    expect(LEVELS.filter((l) => l.chapter === 6).map((l) => l.plies)).toEqual([2, 4, 6, 8, 12, 16]);
  });
});

describe('critères de maîtrise', () => {
  const t30 = L('1a').test, q20 = L('3').test, q10 = L('6-4').test, blind = L('7b').test;
  it('ch. 1-2 : 30 s, ≥ 25 bonnes réponses et ≤ 1 erreur (1e et 2e, nommer une case : ≥ 20)', () => {
    for (const id of ['1a', '1b', '1c', '1d', '2c', '2d']) expect(L(id).test).toMatchObject({ type: 'timed', seconds: 30, minCorrect: 25, maxErrors: 1, passesNeeded: 3 });
    for (const id of ['1e', '2e']) {
      expect(L(id).test).toMatchObject({ type: 'timed', seconds: 30, minCorrect: 20, maxErrors: 1, passesNeeded: 3 });
      expect(testPassed(L(id).test, { correct: 20, errors: 1 })).toBe(true);
      expect(testPassed(L(id).test, { correct: 19, errors: 0 })).toBe(false);
      expect(testPassed(L(id).test, { correct: 24, errors: 2 })).toBe(false);
    }
    expect(testPassed(t30, { correct: 25, errors: 1 })).toBe(true);
    expect(testPassed(t30, { correct: 24, errors: 0 })).toBe(false);
    expect(testPassed(t30, { correct: 30, errors: 2 })).toBe(false);
  });
  it('ch. 3-5 : 20 questions, ≥ 19 justes, temps médian ≤ 3 s', () => {
    const t = (ms: number) => Array(20).fill(ms);
    expect(testPassed(q20, { correct: 19, total: 20, timesMs: t(3000) })).toBe(true);
    expect(testPassed(q20, { correct: 18, total: 20, timesMs: t(1000) })).toBe(false);
    expect(testPassed(q20, { correct: 20, total: 20, timesMs: t(3001) })).toBe(false);
    expect(testPassed(q20, { correct: 19, total: 19, timesMs: t(1000) })).toBe(false);
    expect(median([5, 1, 3])).toBe(3);
    expect(median([1, 2, 3, 10])).toBe(2.5);
  });
  it('ch. 6 : 10 questions, ≥ 9 justes (pas de limite de temps)', () => {
    expect(testPassed(q10, { correct: 9, total: 10, timesMs: Array(10).fill(60000) })).toBe(true);
    expect(testPassed(q10, { correct: 8, total: 10, timesMs: [] })).toBe(false);
  });
  it('ch. 7 : partie à l’aveugle finie avec ≤ 3 coups d’œil (abandon : au moins 30 coups joués)', () => {
    expect(testPassed(blind, { finished: true, reason: 'mate', myMoves: 15, peeks: 3 })).toBe(true);
    expect(testPassed(blind, { finished: true, reason: 'mate', myMoves: 15, peeks: 4 })).toBe(false);
    expect(testPassed(blind, { finished: true, reason: 'resign', myMoves: 5, peeks: 0 })).toBe(false);
    expect(testPassed(blind, { finished: true, reason: 'resign', myMoves: 29, peeks: 0 })).toBe(false);
    expect(testPassed(blind, { finished: true, reason: 'resign', myMoves: 30, peeks: 0 })).toBe(true);
    expect(testPassed(blind, { finished: false, reason: 'mate', myMoves: 30, peeks: 0 })).toBe(false);
  });
  it('validation : 3 réussites pour un niveau des ch. 1-2, une seule ensuite ; déblocage dans l’ordre', () => {
    let p = emptyProgress();
    expect(levelUnlocked(p, '1a')).toBe(true);
    expect(levelUnlocked(p, '1b')).toBe(false);
    expect(chapterUnlocked(p, 2)).toBe(false);
    for (let i = 0; i < 2; i++) p = recordTest(p, '1a', true, '26/30 s', 26, '2026-11-23');
    p = recordTest(p, '1a', false, '20/30 s', 20, '2026-11-23');
    expect(p.levels['1a']).toMatchObject({ passes: 2, attempts: 3, validated: false, best: '26/30 s' });
    p = recordTest(p, '1a', true, '28/30 s', 28, '2026-11-23');
    expect(p.levels['1a']).toMatchObject({ validated: true, best: '28/30 s' });
    expect(levelUnlocked(p, '1b')).toBe(true);
    for (const id of ['1b', '1c', '1d', '1e']) for (let i = 0; i < 3; i++) p = recordTest(p, id, true, 'ok', 25, '2026-11-23');
    expect(chapterUnlocked(p, 2)).toBe(true);
    expect(p.chapters[1]).toMatchObject({ step: 0, due: '2026-11-24', toReview: false });
    p = recordTest(p, '3', true, '20/20', 20, '2026-11-23');
    expect(p.levels['3'].validated).toBe(false);            // chapitre 3 verrouillé (chapitre 2 non validé) : pas validé
  });
});

describe('révisions des chapitres validés', () => {
  const base = () => {
    let p = emptyProgress();
    for (const id of ['1a', '1b', '1c', '1d', '1e']) for (let i = 0; i < 3; i++) p = recordTest(p, id, true, 'ok', 25, '2026-11-01');
    return p;
  };
  it('J+1, J+3, J+7, puis tous les 7 jours', () => {
    let p = base();
    const dues = [p.chapters[1].due];
    let day = p.chapters[1].due;
    for (let i = 0; i < 4; i++) { p = recordReview(p, 1, reviewLevel(p, 1), true, day); day = p.chapters[1].due; dues.push(day); }
    expect(dues).toEqual(['2026-11-02', '2026-11-05', '2026-11-12', '2026-11-19', '2026-11-26']);
  });
  it('épreuve ratée → « à revoir », due le lendemain ; réussie ensuite → on repart de J+1', () => {
    let p = base();
    p = recordReview(p, 1, '1a', false, '2026-11-02');
    expect(p.chapters[1]).toMatchObject({ toReview: true, due: '2026-11-03' });
    expect(dueChapters(p, '2026-11-02')).toEqual([1]);       // « à revoir » : dû tout de suite
    p = recordReview(p, 1, '1b', true, '2026-11-03');
    expect(p.chapters[1]).toMatchObject({ toReview: false, step: 0, due: '2026-11-04' });
  });
  it('chapitres dus : « à revoir » d’abord ; niveau testé à tour de rôle', () => {
    let p = base();
    expect(dueChapters(p, '2026-11-01')).toEqual([]);
    expect(dueChapters(p, '2026-11-02')).toEqual([1]);
    expect(reviewLevel(p, 1)).toBe('1a');
    p = recordReview(p, 1, '1a', true, '2026-11-02');
    expect(reviewLevel(p, 1)).toBe('1b');
    expect(addDaysKey('2026-12-30', 3)).toBe('2027-01-02');
    expect(reviewLevel(p, 7)).toBe('7a');
    expect(replayPassed({ errors: 2, peeks: 1 })).toBe(true);
    expect(replayPassed({ errors: 3, peeks: 0 })).toBe(false);
    expect(replayPassed({ errors: 0, peeks: 2 })).toBe(false);
  });
});

describe('adaptatif : statistiques par case', () => {
  it('faiblesse : erreurs et lenteur ; case jamais vue = 0,3', () => {
    expect(weakness(undefined)).toBe(0.3);
    expect(weakness({ n: 10, err: 0, ms: 10000 })).toBe(0);
    expect(weakness({ n: 10, err: 5, ms: 10000 })).toBeCloseTo(0.35);
    expect(weakness({ n: 2, err: 0, ms: 9000 })).toBeCloseTo(0.3);   // 4,5 s en moyenne
  });
  it('les cases faibles sortent plus souvent', () => {
    let stats: SquareStats = {};
    for (const s of SQUARES) for (let i = 0; i < 5; i++) stats = recordAnswer(stats, s, true, 900);
    for (let i = 0; i < 5; i++) stats = recordAnswer(stats, 'c6', false, 4000);
    const rng = seeded(11);
    const n = 20000;
    let c6 = 0, e4 = 0;
    for (let i = 0; i < n; i++) { const s = pickSquare(rng, stats); if (s === 'c6') c6++; if (s === 'e4') e4++; }
    expect(c6 / e4).toBeGreaterThan(3);
    expect(weakestSquares(stats, 3)[0].square).toBe('c6');
  });
  it('les 10 cases les plus faibles (vues au moins 2 fois)', () => {
    let s: SquareStats = {};
    s = recordAnswer(s, 'a1', false, 1000); s = recordAnswer(s, 'a1', false, 1000);
    s = recordAnswer(s, 'b2', false, 1000); s = recordAnswer(s, 'b2', true, 1000);
    s = recordAnswer(s, 'h8', false, 1000);                      // vue une seule fois : ignorée
    expect(weakestSquares(s).map((x) => x.square)).toEqual(['a1', 'b2']);
  });
  it('tous les niveaux sont définis dans l’ordre des chapitres', () => {
    expect(LEVELS.map((l) => l.chapter)).toEqual([...LEVELS.map((l) => l.chapter)].sort((a, b) => a - b));
  });
});
