// Téléchargement d'une sauvegarde JSON et import sûr (sauvegarde de l'état actuel d'abord, puis rechargement).
import { exportAll, importAll } from './db';
import { getMeta, putMeta } from './metaKeys';
import { migrateBackup } from './lib/backup';

/** Télécharge toutes les données en JSON et retient la date de cette sauvegarde. */
export async function downloadBackup(label = ''): Promise<{ games: number; cards: number; at: number }> {
  const data = await exportAll();
  const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sparring-echecs-${new Date().toISOString().slice(0, 10)}${label ? '-' + label : ''}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  const at = Date.now();
  await putMeta('lastBackupAt', at);
  return { games: data.games.length, cards: data.cards.length, at };
}

/**
 * Import d'un fichier : sauvegarde de l'état actuel téléchargée d'abord, puis remplacement (version contrôlée, ancien
 * format migré). La date de la sauvegarde automatique est conservée après l'import.
 */
export async function safeImport(text: string): Promise<{ migratedFrom: number; games: number; cards: number }> {
  const parsed = JSON.parse(text) as unknown;
  migrateBackup(parsed); // refus (fichier invalide, version plus récente) avant toute sauvegarde ou écriture
  const before = await downloadBackup('avant-import');
  const r = await importAll(parsed);
  await putMeta('lastBackupAt', before.at);
  return r;
}

export const lastBackupAt = () => getMeta('lastBackupAt');
