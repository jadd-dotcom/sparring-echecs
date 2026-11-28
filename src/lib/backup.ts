// Sauvegarde JSON : contrôle de version et migration des anciens fichiers (fonctions pures, testées).
import type { Card, Game, Hole, MateRun, Meta, Opening } from '../db';

/** Version du format de sauvegarde produit par cette version de l'appli (= version du schéma Dexie). */
export const BACKUP_VERSION = 3;

export interface Backup {
  app: 'sparring-echecs';
  version: number;
  exportedAt: string;
  games: Game[];
  cards: Card[];
  /** Absent : la table meta actuelle est conservée à l'import. */
  meta?: Meta[];
  /** Absent : les ouvertures actuelles sont conservées à l'import. */
  openings?: Opening[];
  holes: Hole[];
  mateRuns: MateRun[];
}

export class BackupError extends Error {}

/**
 * Valide un fichier de sauvegarde et le met au format actuel.
 * - version plus récente que l'appli : refus ;
 * - v1 (avant les ouvertures) : cartes sans type → « mistake », pas de trous ni de mats ;
 * - v2 (avant les mats) : pas d'exercices de mats.
 * Un fichier sans version est traité comme une v1.
 */
export function migrateBackup(raw: unknown): Backup & { migratedFrom: number } {
  const d = raw as Partial<Backup> | null;
  if (!d || typeof d !== 'object' || d.app !== 'sparring-echecs' || !Array.isArray(d.games) || !Array.isArray(d.cards)) {
    throw new BackupError('Fichier de sauvegarde invalide');
  }
  const version = d.version === undefined ? 1 : Number(d.version);
  if (!Number.isInteger(version) || version < 1) throw new BackupError('Version de sauvegarde invalide');
  if (version > BACKUP_VERSION) {
    throw new BackupError(`Sauvegarde créée par une version plus récente de l’appli (format ${version}, cette appli lit jusqu’au format ${BACKUP_VERSION}) : mets l’appli à jour avant d’importer.`);
  }
  if (d.meta !== undefined && !Array.isArray(d.meta)) throw new BackupError('Fichier de sauvegarde invalide (meta)');
  const cards = d.cards.map((c) => ({ ...c, kind: c.kind ?? 'mistake' }));
  return {
    app: 'sparring-echecs',
    version: BACKUP_VERSION,
    exportedAt: typeof d.exportedAt === 'string' ? d.exportedAt : '',
    games: d.games,
    cards,
    meta: d.meta,
    openings: version >= 2 && Array.isArray(d.openings) ? d.openings : undefined,
    holes: version >= 2 && Array.isArray(d.holes) ? d.holes : [],
    mateRuns: version >= 3 && Array.isArray(d.mateRuns) ? d.mateRuns : [],
    migratedFrom: version,
  };
}

/** Jours entiers depuis la dernière sauvegarde (null : jamais). */
export function daysSince(at: number | undefined, now = Date.now()): number | null {
  if (!at) return null;
  return Math.max(0, Math.floor((now - at) / 86_400_000));
}

/** Rappel discret sur « Aujourd'hui » : plus de 14 jours sans sauvegarde, ou aucune alors que des parties existent. */
export const BACKUP_REMINDER_DAYS = 14;
export function backupReminderDue(at: number | undefined, hasData: boolean, now = Date.now()): boolean {
  const d = daysSince(at, now);
  return d === null ? hasData : d > BACKUP_REMINDER_DAYS;
}

/** « aujourd’hui », « hier », « il y a 3 jours », « jamais ». */
export function backupAgeText(at: number | undefined, now = Date.now()): string {
  const d = daysSince(at, now);
  if (d === null) return 'jamais';
  if (d === 0) return 'aujourd’hui';
  if (d === 1) return 'hier';
  return `il y a ${d} jours`;
}
