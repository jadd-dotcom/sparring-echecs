import Dexie, { type Table } from 'dexie';
import type { Severity } from './lib/winpct';
import type { BookExit } from './lib/repertoire';
import type { ErrorDetail } from './lib/report/motifs';
import type { MoveClass } from './lib/moveClass';
import type { MateLevelId, MateOutcome, MoveFlag } from './lib/mates';
import { RATING_START, type Score } from './lib/rating';
import type { ProfileData } from './lib/profile';
import type { ExternalMeta } from './lib/chesscom';
import type { ThoughtTag } from './lib/thoughts';

/** Origine d'une partie : contre Maia dans l'appli, ou importée de Chess.com (sans effet sur le niveau). */
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
  /** Erreurs et gaffes : suites Stockfish, bilans matériels, motif. */
  detail?: ErrorDetail;
}

/** Un coup (des deux camps) classé façon Chess.com. Le « Livre » est ajouté à l'affichage. */
export interface PlyEval {
  ply: number;
  san: string;
  uci: string;
  bestUci: string | null;
  bestSan: string | null;
  wpBefore: number;   // % de gain du joueur qui joue, avec le meilleur coup
  wpAfter: number;    // après le coup joué
  drop: number;
  cls: MoveClass;
}

/** Barre d'évaluation d'une position : % de gain des Blancs et libellé (+1.2, M3…). */
export interface EvalBarPoint { wpWhite: number; label: string }

export interface Game {
  id?: number;
  source: GameSource;
  externalId?: string;  // URL Chess.com de la partie (ou identifiant d'un PGN collé)
  /** Partie importée : site, cadence, joueurs et classements, ouverture selon Chess.com. */
  ext?: ExternalMeta;
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
  /** Tous les coups classés (les miens et ceux de Maia) et barre d'évaluation (fens[0..n]). */
  plies?: PlyEval[];
  bars?: EvalBarPoint[];
  /** Partie à thème : ouverture choisie et première sortie du répertoire. */
  openingId?: string;
  bookExit?: BookExit | null;
  /** Partie importée : ouverture de mon répertoire suivie (la sortie est dans `bookExit`). */
  repOpeningId?: string;
  /** Partie non comptée (sans effet sur le niveau). */
  unrated?: boolean;
  /** « Ce que je pensais », saisi pendant la revue : demi-coup → texte. */
  thoughts?: Record<number, string>;
  /** « Ce que je pensais » en un toucher (erreurs et gaffes), avant de voir le meilleur coup : demi-coup → réponse. */
  thoughtTags?: Record<number, ThoughtTag>;
}

export type CardKind = 'mistake' | 'drill' | 'mate';

export interface Card {
  id?: number;
  /** 'mistake' = erreur d'une partie ; 'drill' = position du répertoire. */
  kind?: CardKind;
  gameId: number;       // 0 pour une carte de drill
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
  // --- cartes de drill ---
  openingId?: string;
  key?: string;          // clé de position (fenKey)
  accept?: string[];     // coups du répertoire acceptés (UCI)
  acceptSan?: string[];
  path?: string[];       // coups menant à la position (SAN)
  order?: number;        // ordre d'apprentissage
  // --- cartes de mat élémentaire (position ratée à rejouer jusqu'au mat) ---
  mateLevel?: MateLevelId;
  minMoves?: number;
}

/** Un exercice de mat élémentaire. */
export interface MateRun {
  id?: number;
  level: MateLevelId;
  fen: string;
  minMoves: number;
  myMoves: number;
  outcome: MateOutcome;
  flags: MoveFlag[];
  moves: string[];       // SAN, les deux camps
  date: number;
  review?: boolean;      // rejouée depuis le paquet de révision (ne compte pas pour la validation)
}

/** Statut « nouvelle carte » (pas encore introduite) : trié après toute date. */
export const DUE_NEW = 'new';

export interface MoveCheck { loss: number; bestSan: string; depth: number }

export interface Opening {
  id: string;
  name: string;
  color: Color;
  forced: string[];
  pgn: string;
  builtin: boolean;
  /** Ouverture rangée dans les Archives : consultable, mais hors drill quotidien, Livre et parties à thème. */
  archived?: boolean;
  /** Vérif Stockfish de mes coups : clé = fenKey + ' ' + uci. */
  checks: Record<string, MoveCheck>;
  updatedAt: number;
}

/** Position où l'adversaire a quitté mon répertoire. */
export interface Hole {
  id?: number;
  openingId: string;
  key: string;
  fen: string;           // position (à moi de jouer)
  path: string[];        // coups depuis le départ (SAN), coup adverse inclus
  oppSan: string;
  bestUci: string | null;
  bestSan: string | null;
  gameId: number;
  count: number;
  createdAt: number;
}

export interface Meta { key: string; value: unknown }

export type Profile = ProfileData;

/** Partie en cours, sauvegardée à chaque coup (reprise après rechargement). */
export interface CurrentGame {
  myColor: Color;
  startFen: string;
  uci: string[];
  rating: number;
  botElo: number;
  maiaMs: number[];
  startedAt: number;
  openingId?: string;
  /** Partie non comptée : analysée normalement, sans effet sur le niveau. */
  unrated?: boolean;
}

class SparringDB extends Dexie {
  games!: Table<Game, number>;
  cards!: Table<Card, number>;
  meta!: Table<Meta, string>;
  openings!: Table<Opening, string>;
  holes!: Table<Hole, number>;
  mateRuns!: Table<MateRun, number>;
  constructor() {
    super('sparring-echecs');
    this.version(1).stores({
      games: '++id, date, source, externalId',
      cards: '++id, due, gameId, source',
      meta: 'key',
    });
    this.version(2).stores({
      games: '++id, date, source, externalId, openingId',
      cards: '++id, due, gameId, source, kind, openingId, [openingId+key]',
      meta: 'key',
      openings: 'id',
      holes: '++id, openingId, [openingId+key]',
    }).upgrade((tx) => tx.table('cards').toCollection().modify((c: Card) => { c.kind ??= 'mistake'; }));
    this.version(3).stores({ mateRuns: '++id, level, date' });
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
export interface Backup { app: 'sparring-echecs'; version: 1 | 2 | 3; exportedAt: string; games: Game[]; cards: Card[]; meta: Meta[]; openings?: Opening[]; holes?: Hole[]; mateRuns?: MateRun[] }

export async function exportAll(): Promise<Backup> {
  return {
    app: 'sparring-echecs', version: 3, exportedAt: new Date().toISOString(),
    games: await db.games.toArray(), cards: await db.cards.toArray(), meta: await db.meta.toArray(),
    openings: await db.openings.toArray(), holes: await db.holes.toArray(), mateRuns: await db.mateRuns.toArray(),
  };
}

export async function importAll(data: Backup) {
  if (data?.app !== 'sparring-echecs' || !Array.isArray(data.games) || !Array.isArray(data.cards)) {
    throw new Error('Fichier de sauvegarde invalide');
  }
  await db.transaction('rw', [db.games, db.cards, db.meta, db.openings, db.holes, db.mateRuns], async () => {
    await Promise.all([db.games.clear(), db.cards.clear(), db.meta.clear(), db.holes.clear()]);
    await db.games.bulkPut(data.games);
    await db.cards.bulkPut(data.cards.map((c) => ({ ...c, kind: c.kind ?? 'mistake' })));
    await db.meta.bulkPut(data.meta ?? []);
    if (data.openings) { await db.openings.clear(); await db.openings.bulkPut(data.openings); }
    await db.holes.bulkPut(data.holes ?? []);
    await db.mateRuns.clear();
    await db.mateRuns.bulkPut(data.mateRuns ?? []);
  });
}
