// Sauvegarde et restauration réelles sur une base IndexedDB simulée (fake-indexeddb) : toutes les tables, toutes les clés.
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { db, exportAll, importAll, type Card, type Game } from './db';
import { META_KEYS, META_PATTERNS } from './metaKeys';
import { BACKUP_VERSION } from './lib/backup';

const game = (id: number): Game => ({
  id, source: 'app', date: 1_700_000_000_000 + id, myColor: 'w', startFen: 'startpos', uci: ['e2e4'], san: ['e4'],
  result: '1-0', score: 1, termination: 'Mat',
});
const card = (id: number, kind?: Card['kind']): Card => ({
  id, ...(kind ? { kind } : {}), gameId: 1, source: 'app', fen: 'f', myColor: 'w', playedUci: 'a', playedSan: 'a',
  bestUci: 'b', bestSan: 'b', wpBefore: 50, drop: 30, severity: 'blunder', step: 0, due: '2026-11-29', createdAt: 1, attempts: [],
});

async function seed() {
  await db.games.bulkPut([game(1), game(2)]);
  await db.cards.bulkPut([card(1, 'mistake'), card(2, 'threat'), card(3, 'drill')]);
  await db.openings.put({ id: 'english', name: 'Anglaise', color: 'w', forced: [], pgn: '1. c4 *', builtin: true, checks: {}, updatedAt: 1 });
  await db.holes.put({ id: 1, openingId: 'english', key: 'k', fen: 'f', path: ['c4'], oppSan: 'e5', bestUci: null, bestSan: null, gameId: 1, count: 1, createdAt: 1 });
  await db.mateRuns.put({ id: 1, level: 'kq', fen: 'f', minMoves: 5, myMoves: 6, outcome: 'mate', flags: [], moves: [], date: 1 });
  // Toutes les clés du registre, avec une valeur propre à chacune.
  await db.meta.bulkPut([
    ...META_KEYS.map((key, i) => ({ key, value: { marker: key, i } })),
    ...META_PATTERNS.map((p) => ({ key: p + 'english', value: { marker: p } })),
  ]);
}

async function snapshot() {
  return {
    games: await db.games.toArray(), cards: await db.cards.toArray(), meta: await db.meta.orderBy('key').toArray(),
    openings: await db.openings.toArray(), holes: await db.holes.toArray(), mateRuns: await db.mateRuns.toArray(),
  };
}

beforeEach(async () => { await Promise.all(db.tables.map((t) => t.clear())); });

describe('sauvegarde et restauration (IndexedDB simulée)', () => {
  it('aller-retour export → import : toutes les tables et toutes les clés meta identiques', async () => {
    await seed();
    const before = await snapshot();
    expect(before.meta).toHaveLength(META_KEYS.length + META_PATTERNS.length);
    const file = JSON.parse(JSON.stringify(await exportAll()));
    expect(file.version).toBe(BACKUP_VERSION);
    await Promise.all(db.tables.map((t) => t.clear()));
    await db.games.put(game(99)); // données à remplacer
    const r = await importAll(file);
    expect(r.migratedFrom).toBe(BACKUP_VERSION);
    expect(await snapshot()).toEqual(before);
  });

  it('un fichier sans meta n’efface pas la table meta', async () => {
    await seed();
    const metaBefore = await db.meta.orderBy('key').toArray();
    const file = JSON.parse(JSON.stringify(await exportAll()));
    delete file.meta;
    file.games = [game(5)];
    await importAll(file);
    expect(await db.meta.orderBy('key').toArray()).toEqual(metaBefore);
    expect((await db.games.toArray()).map((g) => g.id)).toEqual([5]);
  });

  it('import d’un ancien fichier (format 1) : cartes typées, ouvertures actuelles conservées, trous et mats vides', async () => {
    await seed();
    const v1 = {
      app: 'sparring-echecs', version: 1, exportedAt: '2026-11-15T10:00:00Z',
      games: [game(7)], cards: [{ ...card(4), kind: undefined }],
      meta: [{ key: 'profile', value: { rating: 1000, gamesPlayed: 3, nextColor: 'b' } }],
    };
    const r = await importAll(JSON.parse(JSON.stringify(v1)));
    expect(r.migratedFrom).toBe(1);
    expect((await db.cards.toArray()).map((c) => c.kind)).toEqual(['mistake']);
    expect(await db.openings.count()).toBe(1);
    expect(await db.holes.count()).toBe(0);
    expect(await db.mateRuns.count()).toBe(0);
    expect((await db.meta.get('profile'))?.value).toEqual({ rating: 1000, gamesPlayed: 3, nextColor: 'b' });
  });

  it('fichier d’une version plus récente : refus, aucune donnée modifiée', async () => {
    await seed();
    const before = await snapshot();
    await expect(importAll({ ...(await exportAll()), version: BACKUP_VERSION + 1 })).rejects.toThrow(/plus récente/);
    expect(await snapshot()).toEqual(before);
  });
});
