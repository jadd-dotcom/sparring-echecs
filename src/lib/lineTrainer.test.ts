import { describe, expect, it } from 'vitest';
import { parsePgn } from './repertoire';
import {
  checkMove, emptyProgress, fenAfter, lessonWhy, lineKey, linePlan, myMoveCount, orderedLines, pickLine, refusalStep,
  startRound, validatedCount, withError, withLineDone, type LineProgress,
} from './lineTrainer';
import { BUILTIN_OPENINGS } from '../data/openings';
import { OPENING_LESSONS } from '../data/openingLessons';

// Répertoire Blancs de test : deux de mes coups possibles après 1.e4 e5 (2.Nf3 ou 2.Bc4), et une transposition
// (1.Nf3 Nc6 2.e4 e5 = 1.e4 e5 2.Nf3 Nc6).
const PGN = '[Orientation "white"]\n\n1. e4 e5 (1... c5 2. Nf3 d6 3. d4) 2. Nf3 (2. Bc4 Nf6 3. d3) 2... Nc6 3. Bb5 a6 4. Ba4 * ' +
  '\n\n[Orientation "white"]\n\n1. Nf3 Nc6 2. e4 e5 3. d4 *';
const root = parsePgn(PGN).root;
const ordered = orderedLines(root);
const L = (s: string) => ordered.find((l) => lineKey(l) === s)!;

describe('« Jouer les lignes » : ordre et choix des lignes', () => {
  it('ordre : ligne principale d’abord, puis l’ordre de l’arbre', () => {
    expect(ordered.map(lineKey)).toEqual([
      'e4 e5 Nf3 Nc6 Bb5 a6 Ba4', 'e4 e5 Bc4 Nf6 d3', 'e4 c5 Nf3 d6 d4', 'Nf3 Nc6 e4 e5 d4',
    ]);
  });
  it('ordre de la leçon : les lignes des blocs supplémentaires avant les autres (Londres)', () => {
    const o = BUILTIN_OPENINGS.find((x) => x.id === 'london')!;
    const lesson = OPENING_LESSONS.find((l) => l.openingId === 'london')!;
    const ls = orderedLines(parsePgn(o.pgn).root, lesson);
    expect(ls[0]).toEqual(lesson.moves.map((m) => m.san));               // ligne principale de la leçon
    expect(ls[1].slice(0, 2)).toEqual(['d4', 'e6']);                      // 1re ligne du bloc « autres premiers coups »
    expect(ls.length).toBe(13);
  });
  it('choix : d’abord « à refaire », puis jamais jouées, dans l’ordre ; quand tout a le ✓, nouveau tour', () => {
    let p: LineProgress = emptyProgress();
    expect(pickLine(ordered, p)).toEqual({ index: 0, newRound: false });
    p = withLineDone(p, ordered[0], true);
    expect(pickLine(ordered, p)).toEqual({ index: 1, newRound: false });
    p = withError(p, ordered[2], 4, 'c3');
    expect(pickLine(ordered, p)).toEqual({ index: 2, newRound: false });   // « à refaire » passe avant la ligne 2 jamais jouée
    p = withLineDone(p, ordered[2], true);
    expect(pickLine(ordered, p).index).toBe(1);
    for (const l of ordered) p = withLineDone(p, l, true);
    expect(validatedCount(ordered, p)).toBe(4);
    expect(pickLine(ordered, p)).toEqual({ index: 0, newRound: true });
    const q = startRound(p);
    expect(q.round).toBe(2);
    expect(validatedCount(ordered, q)).toBe(0);
    expect(q.errors).toHaveLength(1);                                       // l’historique des erreurs est gardé
  });
  it('fin de ligne : ✓ seulement sans erreur', () => {
    const p = withLineDone(emptyProgress(), ordered[1], false);
    expect(p.lines[lineKey(ordered[1])]).toMatchObject({ status: 'redo', plays: 1 });
  });
});

describe('« Jouer les lignes » : mes coups', () => {
  const main = L('e4 e5 Nf3 Nc6 Bb5 a6 Ba4');
  it('coup du répertoire attendu : accepté', () => {
    expect(checkMove(ordered, emptyProgress(), main, 2, fenAfter(main, 2), 'Nf3')).toEqual({ kind: 'ok' });
  });
  it('autre coup du répertoire au même endroit : accepté, on bascule sur la ligne correspondante', () => {
    const r = checkMove(ordered, emptyProgress(), main, 2, fenAfter(main, 2), 'Bc4');
    expect(r).toEqual({ kind: 'switch', line: L('e4 e5 Bc4 Nf6 d3'), ply: 3 });
  });
  it('bascule par transposition : même position atteinte par un autre ordre de coups', () => {
    const tr = L('Nf3 Nc6 e4 e5 d4');
    const r = checkMove(ordered, emptyProgress(), tr, 4, fenAfter(tr, 4), 'Bb5');
    expect(r).toEqual({ kind: 'switch', line: main, ply: 5 });
  });
  it('coup hors répertoire : refusé ; 1er refus = réessaie, 2e = solution', () => {
    expect(checkMove(ordered, emptyProgress(), main, 2, fenAfter(main, 2), 'Nc3')).toEqual({ kind: 'refused', expected: 'Nf3' });
    expect(refusalStep(1)).toBe('retry');
    expect(refusalStep(2)).toBe('solution');
    const p = withError(emptyProgress(), main, 2, 'Nc3', 123);
    expect(p.lines[lineKey(main)].status).toBe('redo');
    expect(p.errors).toEqual([{ line: lineKey(main), ply: 2, expected: 'Nf3', played: 'Nc3', date: 123 }]);
  });
  it('un coup qui existe ailleurs dans le répertoire, mais pas depuis cette position : refusé', () => {
    // 2.d4 après 1.e4 e5 : d4 n’est joué dans le répertoire que depuis d’autres positions.
    expect(checkMove(ordered, emptyProgress(), main, 2, fenAfter(main, 2), 'd4')).toEqual({ kind: 'refused', expected: 'Nf3' });
    // Mais après 1.e4 e5 2.Nf3 Nc6, 3.d4 est le coup de la ligne 1.Nf3 Nc6 2.e4 e5 3.d4 (même position) : accepté.
    expect(checkMove(ordered, emptyProgress(), main, 4, fenAfter(main, 4), 'd4')).toEqual({ kind: 'switch', line: L('Nf3 Nc6 e4 e5 d4'), ply: 5 });
  });
  it('compteur « coup 3/4 » : mes coups dans la ligne', () => {
    expect(myMoveCount(main, 0, 'w')).toEqual({ current: 1, total: 4 });
    expect(myMoveCount(main, 4, 'w')).toEqual({ current: 3, total: 4 });
    expect(myMoveCount(['d4', 'd5', 'c4', 'c6'], 1, 'b')).toEqual({ current: 1, total: 2 });
  });
});

describe('« Jouer les lignes » : textes de la leçon', () => {
  const lesson = OPENING_LESSONS.find((l) => l.openingId === 'london')!;
  it('commentaire de la leçon pour le coup attendu (ligne principale et bloc supplémentaire)', () => {
    expect(lessonWhy(lesson, fenAfter(['d4', 'd5'], 2), 'Bf4')).toMatch(/signature du Londres/);
    expect(lessonWhy(lesson, fenAfter(['d4', 'e5', 'dxe5', 'Nc6', 'Nf3', 'Qe7'], 6), 'Bg5')).toMatch(/Piège à éviter/);
    expect(lessonWhy(lesson, fenAfter(['d4', 'd5'], 2), 'h4')).toBeNull();
  });
  it('plan de fin de ligne : celui de la leçon, avec le bloc qui couvre la ligne', () => {
    const englund = ['d4', 'e5', 'dxe5', 'Nc6', 'Nf3', 'Qe7', 'Bg5', 'Qb4+', 'Nc3', 'Qa5'];
    expect(linePlan(lesson, englund)?.block?.title).toBe('Contre les autres premiers coups noirs');
    expect(linePlan(lesson, lesson.moves.map((m) => m.san))).toEqual({ plan: lesson.plan });
    expect(linePlan(undefined, englund)).toBeNull();
  });
});
