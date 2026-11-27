// Import Chess.com automatique : à chaque ouverture de l'appli avec Internet, si un pseudo est enregistré,
// on importe les nouvelles parties (mêmes règles de politesse que le bouton) puis on lance leur analyse
// en arrière-plan, comme après un import manuel. Aucune erreur affichée : l'import manuel reste dans les Réglages.
import { db } from './db';
import { getChesscomUser, importChesscom, pendingImports, startAnalysis, type FetchFn } from './chesscomImport';

/** Pas deux imports automatiques à moins de 2 minutes (rechargements successifs). */
export const AUTO_MIN_GAP_MS = 2 * 60 * 1000;

export interface AutoImportResult { status: 'skipped' | 'done' | 'error'; reason?: string; added: number }

let started: Promise<AutoImportResult> | null = null;
const subs = new Set<(r: AutoImportResult) => void>();

/** Message discret à afficher après un import automatique (null si aucune nouvelle partie). */
export function autoImportMessage(r: AutoImportResult): string | null {
  if (r.status !== 'done' || r.added === 0) return null;
  return `${r.added} nouvelle${r.added > 1 ? 's' : ''} partie${r.added > 1 ? 's' : ''} importée${r.added > 1 ? 's' : ''}`;
}

export function onAutoImport(f: (r: AutoImportResult) => void) { subs.add(f); return () => { subs.delete(f); }; }

/** Une seule fois par ouverture de l'appli. */
export function autoImportOnStart(opts: { fetchFn?: FetchFn; delayMs?: number; now?: number; online?: boolean } = {}): Promise<AutoImportResult> {
  if (!started) {
    started = run(opts).then((r) => { subs.forEach((f) => f(r)); return r; });
  }
  return started;
}

async function run(opts: { fetchFn?: FetchFn; delayMs?: number; now?: number; online?: boolean }): Promise<AutoImportResult> {
  const now = opts.now ?? Date.now();
  if (!(opts.online ?? navigator.onLine)) return { status: 'skipped', reason: 'hors ligne', added: 0 };
  const user = await getChesscomUser();
  if (!user) return { status: 'skipped', reason: 'pas de pseudo', added: 0 };
  const last = (await db.meta.get('chesscomAutoAt'))?.value as number | undefined;
  if (last && now - last < AUTO_MIN_GAP_MS) return { status: 'skipped', reason: 'import récent', added: 0 };
  await db.meta.put({ key: 'chesscomAutoAt', value: now });
  try {
    const r = await importChesscom(user, { fetchFn: opts.fetchFn, delayMs: opts.delayMs, now });
    if ((await pendingImports()).recent.length) startAnalysis('recent').catch(console.error);
    return { status: 'done', added: r.added };
  } catch (e) {
    return { status: 'error', reason: (e as Error).message, added: 0 };
  }
}
