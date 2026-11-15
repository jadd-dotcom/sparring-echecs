import Dexie, { type Table } from 'dexie';
import type { Severity } from './lib/winpct';
import { RATING_START, type Score } from './lib/rating';

/** Origine d'une partie — prévu pour l'import Chess.com (V2). */
export type GameSource = 'app' | 'chesscom';
export type Color = 'w' | 'b';

export interface MoveAnalysis {
  ply: number;          // index du demi-coup (0 = 1er coup des Blancs)
  san: string;
  uci: string;
  bestUci: string | null;
  bestSan: string | null;
  wpBefore: number;     // % de gain (mon point de vue) avec le meilleur coup
  wpAfter: number;      // % de gain après mon coup
  drop: number;
  severity: Severity;
}

export interface Game {
  id?: number;
  source: GameSource;
  externalId?: string;  // ex. URL Chess.com (V2)
  date: number;
  myColor: Color;
  startFen: string;
  uci: string[];
  san: string[];
  result: '1-0' | '0-1' | '1/2-1/2';
  score: Score;
  termination: string;
  ratingBefore?: number;
  ratingAfter?: number;
  botElo?: number;
  maiaMs?: number[];
  analysis?: MoveAnalysis[];
  counts?: { inaccuracy: number; mistake: number; blunder: number };
}

export interface Card {
  id?: number;
  gameId: number;
  source: GameSource;
  fen: string;
  myColor: Color;
  playedUci: string;
  playedSan: string;
  bestUci: string;
  bestSan: string;
  wpBefore: number;
  drop: number;
  severity: Severity;
  step: number;
  due: string;
  createdAt: number;
  attempts: { date: number; uci: string; ok: boolean }[];
}

export interface Meta { key: string; value: unknown }

export interface Profile {
  rating: number;
  gamesPlayed: number;
  nextColor: Color;
}

/** Partie en cours, sauvegardée à chaque coup (reprise après rechargement). */
export interface CurrentGame {
  myColor: Color;
  startFen: string;
  uci: string[];
  rating: number;
  botElo: number;
  maiaMs: number[];
  startedAt: number;
}

class SparringDB extends Dexie {
  games!: Table<Game, number>;
  cards!: Table<Card, number>;
  meta!: Table<Meta, string>;
  constructor() {
    super('sparring-echecs');
    this.version(1).stores({
      games: '++id, date, source, externalId',
      cards: '++id, due, gameId, source',
      meta: 'key',
    });
  }
}

export const db = new SparringDB();

export async function getProfile(): Promise<Profile> {
  const m = await db.meta.get('profile');
  return (m?.value as Profile) ?? { rating: RATING_START, gamesPlayed: 0, nextColor: 'w' };
}
export const setProfile = (p: Profile) => db.meta.put({ key: 'profile', value: p });

export async function getCurrent(): Promise<CurrentGame | null> {
  return ((await db.meta.get('current'))?.value as CurrentGame) ?? null;
}
export const setCurrent = (g: CurrentGame | null) =>
  g ? db.meta.put({ key: 'current', value: g }) : db.meta.delete('current');

// ---------- Export / import JSON ----------
export interface Backup { app: 'sparring-echecs'; version: 1; exportedAt: string; games: Game[]; cards: Card[]; meta: Meta[] }

export async function exportAll(): Promise<Backup> {
  return {
    app: 'sparring-echecs', version: 1, exportedAt: new Date().toISOString(),
    games: await db.games.toArray(), cards: await db.cards.toArray(), meta: await db.meta.toArray(),
  };
}

export async function importAll(data: Backup) {
  if (data?.app !== 'sparring-echecs' || !Array.isArray(data.games) || !Array.isArray(data.cards)) {
    throw new Error('Fichier de sauvegarde invalide');
  }
  await db.transaction('rw', db.games, db.cards, db.meta, async () => {
    await Promise.all([db.games.clear(), db.cards.clear(), db.meta.clear()]);
    await db.games.bulkPut(data.games);
    await db.cards.bulkPut(data.cards);
    await db.meta.bulkPut(data.meta ?? []);
  });
}
