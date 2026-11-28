// Migration Dexie réelle : une base créée au schéma v1 (première version de l'appli) s'ouvre en v3 sans perte.
import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { describe, expect, it } from 'vitest';

describe('migration du schéma Dexie 1 → 3', () => {
  it('cartes sans type → « mistake », parties et meta conservées, nouvelles tables créées', async () => {
    const old = new Dexie('sparring-echecs');
    old.version(1).stores({ games: '++id, date, source, externalId', cards: '++id, due, gameId, source', meta: 'key' });
    await old.table('games').add({ source: 'app', date: 1, uci: ['e2e4'] });
    await old.table('cards').bulkAdd([{ due: '2026-11-20', gameId: 1, source: 'app', attempts: [] }, { due: '2026-11-21', gameId: 1, source: 'app', attempts: [] }]);
    await old.table('meta').put({ key: 'profile', value: { rating: 950, gamesPlayed: 4, nextColor: 'w' } });
    old.close();

    const { db } = await import('./db'); // ouverture par l'appli : upgrades v2 et v3
    await db.open();
    expect(db.verno).toBe(3);
    expect((await db.cards.toArray()).map((c) => c.kind)).toEqual(['mistake', 'mistake']);
    expect(await db.cards.where('kind').equals('mistake').count()).toBe(2);
    expect(await db.games.count()).toBe(1);
    expect((await db.meta.get('profile'))?.value).toEqual({ rating: 950, gamesPlayed: 4, nextColor: 'w' });
    expect(await db.openings.count()).toBe(0);
    expect(await db.holes.count()).toBe(0);
    expect(await db.mateRuns.count()).toBe(0);
    db.close();
  });
});
