// analyseGame : seules les cartes d'erreur d'une partie sont remplacées, les cartes « Lis la menace » restent.
import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { db, type Card } from './db';
import { replaceMistakeCards } from './analysis';

const card = (kind: Card['kind'] | undefined, gameId: number, step = 2): Card => ({
  ...(kind ? { kind } : {}), gameId, source: 'app', fen: 'f', myColor: 'w', playedUci: 'a', playedSan: 'a', bestUci: 'b', bestSan: 'b',
  wpBefore: 50, drop: 30, severity: 'blunder', step, due: '2026-12-01', createdAt: 1, attempts: [],
});

describe('remplacement des cartes d’une partie', () => {
  it('cartes d’erreur remplacées ; cartes menace et autres parties intactes', async () => {
    await db.cards.bulkAdd([card('mistake', 1), card(undefined, 1), card('threat', 1, 3), card('mistake', 2)]);
    await replaceMistakeCards(1, [card('mistake', 1, 0)]);
    const all = await db.cards.toArray();
    expect(all.filter((c) => c.gameId === 1 && (c.kind ?? 'mistake') === 'mistake').map((c) => c.step)).toEqual([0]);
    expect(all.filter((c) => c.kind === 'threat').map((c) => c.step)).toEqual([3]);
    expect(all.filter((c) => c.gameId === 2)).toHaveLength(1);
  });
});
