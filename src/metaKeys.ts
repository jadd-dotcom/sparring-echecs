// Registre typé des clés de la table `meta` (clé/valeur). Toute clé lue ou écrite dans l'appli doit figurer ici :
// src/metaKeys.test.ts parcourt le code et refuse une clé non déclarée. Aucune clé n'est renommée (données de l'iPad).
import { db, type CurrentGame, type Meta } from './db';
import type { ProfileData } from './lib/profile';
import type { PieceSet, ThemePref } from './prefs';
import type { TrapProgress } from './lib/traps';
import type { GoalState } from './lib/goals';
import type { BoardProgress } from './lib/board/levels';
import type { SquareStats } from './lib/board/stats';
import type { LineProgress } from './lib/lineTrainer';
import type { LineSession } from './linesService';
import type { LessonProgress } from './openings';
import type { LessonState } from './lib/lessonPlan';
import type { CrossProgress } from './lib/crossroadTrainer';

/** Clés fixes et type de leur valeur. */
export interface MetaValues {
  profile: ProfileData;
  current: CurrentGame;
  theme: ThemePref;
  pieces: PieceSet;
  sound: boolean;
  reviseCap: number;
  reviseShowMine: boolean;
  warmupDay: string;
  sessionTrap: { day: string; id: string | null };
  traps: Record<string, TrapProgress>;
  threatScanned: string[];
  chesscomUser: string;
  chesscomSync: { user: string; done: string[] };
  chesscomAutoAt: number;
  goals: GoalState;
  lastReportAt: number;
  boardProgress: BoardProgress;
  boardStats: SquareStats;
  lineProgress: Record<string, LineProgress>;
  lineSession: LineSession;
  openingLessons: Record<string, LessonProgress>;
  openingsSeeded: string[];
  openingsArchived: string[];
  openingsRev: Record<string, number>;
  drillIntroduced: { day: string; count: number };
  /** Date (ms) de la dernière sauvegarde téléchargée (export, ou sauvegarde automatique avant import). */
  lastBackupAt: number;
}

/** Clés construites à partir d'un identifiant d'ouverture. */
export interface MetaPatternValues {
  'lessonState:': LessonState;
  'crossroads:': CrossProgress;
}

export type MetaKey = keyof MetaValues;
export type MetaPattern = keyof MetaPatternValues;

export const META_KEYS = [
  'profile', 'current', 'theme', 'pieces', 'sound', 'reviseCap', 'reviseShowMine', 'warmupDay', 'sessionTrap', 'traps',
  'threatScanned', 'chesscomUser', 'chesscomSync', 'chesscomAutoAt', 'goals', 'lastReportAt', 'boardProgress', 'boardStats',
  'lineProgress', 'lineSession', 'openingLessons', 'openingsSeeded', 'openingsArchived', 'openingsRev', 'drillIntroduced',
  'lastBackupAt',
] as const satisfies readonly MetaKey[];

export const META_PATTERNS = ['lessonState:', 'crossroads:'] as const satisfies readonly MetaPattern[];

/** Une clé stockée appartient-elle au registre ? */
export function isKnownMetaKey(key: string): boolean {
  return (META_KEYS as readonly string[]).includes(key) || META_PATTERNS.some((p) => key.startsWith(p) && key.length > p.length);
}

/** Valeur typée d'une clé fixe (undefined si absente). */
export async function getMeta<K extends MetaKey>(key: K): Promise<MetaValues[K] | undefined> {
  return (await db.meta.get(key))?.value as MetaValues[K] | undefined;
}

/** Écrit une clé fixe. */
export async function putMeta<K extends MetaKey>(key: K, value: MetaValues[K]): Promise<void> {
  await db.meta.put({ key, value } satisfies Meta);
}
