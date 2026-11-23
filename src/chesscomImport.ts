// Import des parties Chess.com : API publique (archives mensuelles), poliment (requêtes une à une,
// pause entre deux, mois passés jamais redemandés, revalidation ETag du mois en cours par le navigateur).
// Plan B : PGN collé. Les parties importées n'ont aucun effet sur le niveau Maia.
import { db, type Game } from './db';
import {
  archivesUrl, convertGame, convertPgn, isPastMonth, monthOf, splitPgns, type CcGame, type ImportedGame,
} from './lib/chesscom';
import { repertoireInfoWith } from './openings';
import { analyseGame } from './analysis';

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export interface ImportReport {
  added: number;
  already: number;
  ignored: Record<string, number>;   // raison → nombre
  months: string[];                  // mois demandés à Chess.com
  skippedMonths: number;             // mois passés déjà importés (non redemandés)
}

interface SyncState { user: string; done: string[] }

export async function getChesscomUser(): Promise<string> {
  return ((await db.meta.get('chesscomUser'))?.value as string | undefined) ?? '';
}

export async function setChesscomUser(user: string) {
  await db.meta.put({ key: 'chesscomUser', value: user.trim() });
}

async function getSync(user: string): Promise<SyncState> {
  const s = (await db.meta.get('chesscomSync'))?.value as SyncState | undefined;
  return s && s.user === user.toLowerCase() ? s : { user: user.toLowerCase(), done: [] };
}

class ImportError extends Error {}

async function getJson(fetchFn: FetchFn, url: string, cache: RequestCache): Promise<unknown> {
  let r: Response;
  try {
    r = await fetchFn(url, { cache, headers: { Accept: 'application/json' } });
  } catch {
    throw new ImportError('Connexion à Chess.com impossible (es-tu hors ligne ?). Tu peux aussi coller un PGN.');
  }
  if (r.status === 404) throw new ImportError('Pseudo introuvable sur Chess.com : vérifie l’orthographe dans les Réglages.');
  if (r.status === 429 || r.status === 403) throw new ImportError('Chess.com limite les requêtes : réessaie dans quelques minutes.');
  if (!r.ok) throw new ImportError(`Chess.com a répondu ${r.status} : réessaie plus tard.`);
  return r.json();
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

/** Enregistre des parties converties : sans doublon, avec le suivi de mon répertoire. */
export async function saveImported(games: ImportedGame[]): Promise<{ added: number; already: number; ids: number[] }> {
  const openings = await db.openings.toArray();
  let added = 0;
  let already = 0;
  const ids: number[] = [];
  for (const g of games) {
    if (await db.games.where('externalId').equals(g.externalId).count()) { already++; continue; }
    const info = repertoireInfoWith(openings, g);
    const rec: Game = { ...g, ...(info.bookExit !== undefined ? { bookExit: info.bookExit } : {}), ...(info.repOpeningId ? { repOpeningId: info.repOpeningId } : {}) };
    ids.push(await db.games.add(rec));
    added++;
  }
  return { added, already, ids };
}

/**
 * Importe mes parties Chess.com pas encore importées.
 * Les mois passés déjà importés ne sont pas redemandés ; le mois en cours est revalidé (ETag) par le cache du navigateur.
 */
export async function importChesscom(
  user: string,
  opts: { fetchFn?: FetchFn; delayMs?: number; now?: number; onProgress?: (msg: string) => void } = {},
): Promise<ImportReport> {
  const name = user.trim();
  if (!name) throw new ImportError('Indique d’abord ton pseudo Chess.com.');
  const fetchFn = opts.fetchFn ?? ((u, i) => fetch(u, i));
  const delay = opts.delayMs ?? 1500;
  const now = opts.now ?? Date.now();
  const sync = await getSync(name);
  opts.onProgress?.('Liste de tes mois de parties…');
  const data = (await getJson(fetchFn, archivesUrl(name), 'no-cache')) as { archives?: string[] };
  const months = (data.archives ?? []).filter((u) => !sync.done.includes(monthOf(u)));
  const report: ImportReport = { added: 0, already: 0, ignored: {}, months: [], skippedMonths: (data.archives ?? []).length - months.length };
  for (const url of months) {
    await wait(delay);
    opts.onProgress?.(`Parties de ${monthOf(url).replace('/', '-')}…`);
    const past = isPastMonth(url, now);
    const res = (await getJson(fetchFn, url, past ? 'default' : 'no-cache')) as { games?: CcGame[] };
    report.months.push(monthOf(url));
    const converted: ImportedGame[] = [];
    for (const g of res.games ?? []) {
      const c = convertGame(g, name);
      if (c.ok) converted.push(c.game);
      else report.ignored[c.reason] = (report.ignored[c.reason] ?? 0) + 1;
    }
    const s = await saveImported(converted);
    report.added += s.added;
    report.already += s.already;
    if (past) {
      sync.done.push(monthOf(url));
      await db.meta.put({ key: 'chesscomSync', value: sync });
    }
  }
  return report;
}

/** Plan B : importe un ou plusieurs PGN collés. */
export async function importPgnText(text: string, user: string, color?: 'w' | 'b'): Promise<ImportReport> {
  const report: ImportReport = { added: 0, already: 0, ignored: {}, months: [], skippedMonths: 0 };
  const converted: ImportedGame[] = [];
  for (const pgn of splitPgns(text)) {
    const c = convertPgn(pgn, user, color);
    if (c.ok) converted.push(c.game);
    else report.ignored[c.reason] = (report.ignored[c.reason] ?? 0) + 1;
  }
  const s = await saveImported(converted);
  report.added = s.added;
  report.already = s.already;
  return report;
}

/** Parties importées pas encore analysées, des plus récentes aux plus anciennes. */
export async function pendingImports(): Promise<Game[]> {
  const gs = await db.games.where('source').equals('chesscom').filter((g) => !g.analysis).toArray();
  return gs.sort((a, b) => b.date - a.date);
}

/**
 * Analyse les parties importées une à une (comme une partie contre Maia : classement des coups,
 * cartes de révision pour mes erreurs). S'arrête entre deux parties si `stop()` renvoie vrai.
 */
export async function analysePending(onProgress: (i: number, n: number, pct: number) => void, stop: () => boolean): Promise<number> {
  const todo = await pendingImports();
  let done = 0;
  for (let i = 0; i < todo.length && !stop(); i++) {
    await analyseGame(todo[i].id!, (d, t) => onProgress(i, todo.length, Math.round((100 * d) / t)));
    done++;
  }
  return done;
}

export function describeReport(r: ImportReport): string {
  const parts = [`${r.added} partie${r.added > 1 ? 's' : ''} importée${r.added > 1 ? 's' : ''}`];
  if (r.already) parts.push(`${r.already} déjà présente${r.already > 1 ? 's' : ''}`);
  const ign = Object.entries(r.ignored).map(([k, v]) => `${v} ignorée${v > 1 ? 's' : ''} (${k})`);
  return parts.concat(ign).join(' · ') + '.';
}

export { ImportError };
