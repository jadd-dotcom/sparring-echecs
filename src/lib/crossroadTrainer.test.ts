// Mode Carrefours : file, choix de ligne, coups acceptés, répétition espacée.
import { describe, expect, it } from 'vitest';
import { parsePgn } from './repertoire';
import { signpostCards } from './crossroads';
import { acceptedReplies, afterAnswer, crossQueue, lineChoices } from './crossroadTrainer';
import type { OpeningLesson } from '../data/openingLessons';

const PGN = `[Orientation "black"]

1. d4 d5 2. c4 (2. Nf3 Nf6 (2... c6)) (2. Bf4 Bf5) 2... c6 *`;
const root = parsePgn(PGN).root;
const cards = signpostCards(root, 'b');

describe('mode Carrefours', () => {
  it('file : cartes échues d’abord (plus anciennes), puis nouvelles (au plus N)', () => {
    expect(cards.length).toBe(3);
    const p = { [cards[1].id]: { step: 1, due: '2026-11-26', attempts: [] }, [cards[2].id]: { step: 1, due: '2026-11-20', attempts: [] } };
    expect(crossQueue(cards, p, '2026-11-27', 1).map((c) => c.id)).toEqual([cards[2].id, cards[1].id, cards[0].id]);
    expect(crossQueue(cards, { ...p, [cards[1].id]: { step: 2, due: '2026-12-10', attempts: [] } }, '2026-11-27', 0).map((c) => c.id)).toEqual([cards[2].id]);
  });
  it('Q1 : une entrée par branche, nom de la leçon sinon coup-panneau', () => {
    const lesson = { moves: [{ san: 'd4' }, { san: 'd5' }, { san: 'c4' }], extras: [{ lines: [{ name: 'Contre le Londres', start: ['d4', 'd5'], moves: [{ san: 'Bf4' }, { san: 'Bf5' }] }] }] } as unknown as OpeningLesson;
    const card = cards.find((c) => c.id === 'd4 d5 Nf3')!;
    expect(lineChoices(card, lesson)).toEqual([{ his: 'c4', name: 'Ligne principale' }, { his: 'Nf3', name: '2.Nf3' }, { his: 'Bf4', name: 'Contre le Londres' }]);
  });
  it('Q2 : tous mes coups du répertoire à cette position sont acceptés', () => {
    expect(acceptedReplies(root, cards.find((c) => c.id === 'd4 d5 Nf3')!)).toEqual(['Nf6', 'c6']);
  });
  it('répétition espacée : réussie → J+3 ; ratée → demain', () => {
    const a = afterAnswer(undefined, true, '2026-11-27', 1);
    expect(a).toEqual({ step: 1, due: '2026-11-30', attempts: [{ date: 1, ok: true, hints: 0 }] });
    expect(afterAnswer(a, false, '2026-11-28', 2).due).toBe('2026-11-29');
  });
  it('« Refaire » le même jour : noté, mais la carte n’avance jamais (seule la 1re réponse du jour compte)', () => {
    const t = (h: number) => new Date(2026, 10, 28, h).getTime();
    const failed = afterAnswer(undefined, false, '2026-11-28', t(10));
    expect(failed.step).toBe(0);
    const redone = afterAnswer(failed, true, '2026-11-28', t(11));
    expect(redone.step).toBe(0);
    expect(redone.due).toBe(failed.due);
    expect(redone.attempts[redone.attempts.length - 1]).toEqual({ date: t(11), ok: true, hints: 0, retry: true });
    const ok = afterAnswer(undefined, true, '2026-11-28', t(10), 1);
    const again = afterAnswer(ok, true, '2026-11-28', t(11));
    expect([again.step, again.due]).toEqual([ok.step, ok.due]);
    expect(ok.attempts[0].hints).toBe(1);
    // Le lendemain, la réponse compte de nouveau.
    expect(afterAnswer(failed, true, '2026-11-29', new Date(2026, 10, 29, 9).getTime()).step).toBe(1);
  });
});
