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
    expect(a).toEqual({ step: 1, due: '2026-11-30', attempts: [{ date: 1, ok: true }] });
    expect(afterAnswer(a, false, '2026-11-28', 2).due).toBe('2026-11-29');
  });
});
