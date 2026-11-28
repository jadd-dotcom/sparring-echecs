import { describe, expect, it } from 'vitest';
import { BACKUP_VERSION, BackupError, backupAgeText, backupReminderDue, daysSince, migrateBackup } from './backup';

const base = { app: 'sparring-echecs', exportedAt: '2026-11-01T00:00:00Z', games: [], cards: [] };
const DAY = 86_400_000;

describe('sauvegarde : version et migration', () => {
  it('version plus récente que l’appli : refus clair', () => {
    expect(() => migrateBackup({ ...base, version: BACKUP_VERSION + 1 })).toThrow(BackupError);
    expect(() => migrateBackup({ ...base, version: BACKUP_VERSION + 1 })).toThrow(/plus récente/);
  });
  it('fichier invalide : refus', () => {
    expect(() => migrateBackup(null)).toThrow(/invalide/);
    expect(() => migrateBackup({ ...base, app: 'autre' })).toThrow(/invalide/);
    expect(() => migrateBackup({ ...base, games: undefined })).toThrow(/invalide/);
    expect(() => migrateBackup({ ...base, version: 0 })).toThrow(/invalide/);
    expect(() => migrateBackup({ ...base, version: 3, meta: 'x' })).toThrow(/meta/);
  });
  it('v1 : cartes sans type → « mistake », pas de trous ni de mats, ouvertures conservées', () => {
    const r = migrateBackup({ ...base, version: 1, cards: [{ id: 1, due: '2026-11-02' }], meta: [{ key: 'profile', value: {} }] });
    expect(r.migratedFrom).toBe(1);
    expect(r.version).toBe(BACKUP_VERSION);
    expect(r.cards[0].kind).toBe('mistake');
    expect(r.holes).toEqual([]);
    expect(r.mateRuns).toEqual([]);
    expect(r.openings).toBeUndefined();
    expect(r.meta).toHaveLength(1);
  });
  it('sans version : traité comme une v1', () => {
    expect(migrateBackup({ ...base }).migratedFrom).toBe(1);
  });
  it('v2 : ouvertures et trous repris, pas de mats', () => {
    const r = migrateBackup({ ...base, version: 2, openings: [{ id: 'x' }], holes: [{ id: 1 }], mateRuns: [{ id: 9 }] });
    expect(r.openings).toHaveLength(1);
    expect(r.holes).toHaveLength(1);
    expect(r.mateRuns).toEqual([]);
  });
  it('v3 : tout est repris tel quel ; un type de carte existant n’est pas modifié', () => {
    const r = migrateBackup({ ...base, version: 3, cards: [{ kind: 'threat' }], openings: [], holes: [], mateRuns: [{ id: 1 }] });
    expect(r.cards[0].kind).toBe('threat');
    expect(r.mateRuns).toHaveLength(1);
    expect(r.meta).toBeUndefined();
  });
});

describe('dernière sauvegarde', () => {
  const now = Date.UTC(2026, 10, 28, 12);
  it('jours écoulés et texte', () => {
    expect(daysSince(undefined, now)).toBeNull();
    expect(backupAgeText(undefined, now)).toBe('jamais');
    expect(backupAgeText(now - 3600_000, now)).toBe('aujourd’hui');
    expect(backupAgeText(now - DAY, now)).toBe('hier');
    expect(backupAgeText(now - 5 * DAY, now)).toBe('il y a 5 jours');
  });
  it('rappel au-delà de 14 jours, ou jamais sauvegardé avec des parties', () => {
    expect(backupReminderDue(now - 14 * DAY, true, now)).toBe(false);
    expect(backupReminderDue(now - 15 * DAY, true, now)).toBe(true);
    expect(backupReminderDue(undefined, true, now)).toBe(true);
    expect(backupReminderDue(undefined, false, now)).toBe(false);
  });
});
