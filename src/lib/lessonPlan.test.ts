// Sommaire de leçon : entrées, statuts, compteurs, bloc suivant.
import { describe, expect, it } from 'vitest';
import { OPENING_LESSONS } from '../data/openingLessons';
import { emptyLessonState, entryStatus, lessonCounts, lessonEntries, nextEntry, withBlock } from './lessonPlan';

describe('sommaire de leçon', () => {
  const l = OPENING_LESSONS.find((x) => x.openingId === 'london-def')!;
  const es = lessonEntries(l);
  it('blocs de la ligne principale, le plan, la partie type, puis les lignes supplémentaires', () => {
    const kinds = es.map((e) => e.kind);
    expect(kinds.indexOf('plan')).toBeGreaterThan(0);
    expect(kinds.indexOf('model')).toBe(kinds.indexOf('plan') + 1);
    expect(kinds.filter((k) => k === 'main').length).toBe(Math.ceil(l.moves.length / 6));
    expect(es[0].title).toBe('Bloc 1 · coups 1 à 3');
    expect(es.filter((e) => e.kind === 'extra').every((e) => e.group && e.seq && e.s !== undefined)).toBe(true);
  });
  it('statuts : pas commencé → en cours (regardé) → fait (rejoué) ; plan et partie type : vus', () => {
    let st = emptyLessonState();
    expect(entryStatus(es[0], st)).toBe('new');
    st = withBlock(st, 'main:0', (b) => ({ ...b, watched: 1 }));
    expect(entryStatus(es[0], st)).toBe('started');
    st = withBlock(st, 'main:0', (b) => ({ ...b, replays: 1, errors: 2 }));
    expect(entryStatus(es[0], st)).toBe('done');
    st = withBlock(st, 'plan', (b) => ({ ...b, watched: 1 }));
    expect(lessonCounts(es, st)).toEqual({ done: 2, total: es.length });
    expect(entryStatus(es[1], { ...st, resume: { key: 'main:1', stage: 'watch', k: 2, at: 0 } })).toBe('started');
    expect(nextEntry(es, 'main:0')!.key).toBe('main:1');
    expect(nextEntry(es, es[es.length - 1].key)).toBeNull();
  });
});
