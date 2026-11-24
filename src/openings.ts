// Service « ouvertures » : stockage du répertoire, cartes de drill, trous, vérification Stockfish.
import { Chess } from 'chess.js';
import { db, DUE_NEW, type Card, type Game, type Hole, type MoveCheck, type Opening } from './db';
import { BUILTIN_OPENINGS } from './data/openings';
import builtinChecks from './data/repertoire-checks.json';
import {
  addLine, buildIndex, drillPositions, fenKey, findBookExit, lines, myMoves, parsePgn, toPgn, type BookExit, type RepNode,
} from './lib/repertoire';
import { stockfish } from './engines/stockfish';
import { evalToCp, type Eval } from './lib/winpct';
import { addDays, dayKey, INTERVALS } from './lib/srs';

export const MAX_LOSS_CP = 50;         // 0,5 pion
export const NEW_DRILL_PER_DAY = 10;   // nouvelles positions de répertoire introduites par jour

export const checkKey = (fen: string, uci: string) => fenKey(fen) + ' ' + uci;

export function treeOf(o: Opening): RepNode {
  return parsePgn(o.pgn).root;
}

/**
 * Crée les ouvertures pré-chargées au premier lancement (et après une mise à jour de l'appli),
 * et range une seule fois dans les Archives celles qui y sont passées (on peut ensuite les en ressortir).
 */
export async function ensureOpenings() {
  const seeded = (await db.meta.get('openingsSeeded'))?.value as string[] | undefined;
  const archivedOnce = new Set(((await db.meta.get('openingsArchived'))?.value as string[] | undefined) ?? []);
  const done = new Set(seeded ?? []);
  let changed = false;
  let archChanged = false;
  for (const def of BUILTIN_OPENINGS) {
    const { archived, ...rest } = def;
    if (!done.has(def.id)) {
      if (!(await db.openings.get(def.id))) {
        const checks = (builtinChecks as Record<string, Record<string, MoveCheck>>)[def.id] ?? {};
        await db.openings.put({ ...rest, builtin: true, checks, updatedAt: Date.now(), ...(archived ? { archived: true } : {}) });
        await syncDrillCards(def.id);
      }
      done.add(def.id);
      changed = true;
    }
    if (archived && !archivedOnce.has(def.id)) {
      await db.openings.update(def.id, { archived: true });
      archivedOnce.add(def.id);
      archChanged = true;
    }
  }
  if (changed) await db.meta.put({ key: 'openingsSeeded', value: [...done] });
  if (archChanged) await db.meta.put({ key: 'openingsArchived', value: [...archivedOnce] });
  await applyBuiltinUpdates();
}

/**
 * Lignes ajoutées après coup à une ouverture pré-chargée (`updates`) : fusionnées une seule fois dans le répertoire
 * déjà enregistré, sans toucher aux lignes que j'ai ajoutées ou retirées moi-même ; leurs vérifications Stockfish
 * sont reprises et les nouvelles positions entrent dans le drill.
 */
export async function applyBuiltinUpdates() {
  const revs = { ...(((await db.meta.get('openingsRev'))?.value as Record<string, number> | undefined) ?? {}) };
  let changed = false;
  for (const def of BUILTIN_OPENINGS) {
    const last = Math.max(0, ...(def.updates ?? []).map((u) => u.rev));
    if (!last || (revs[def.id] ?? 0) >= last) continue;
    const o = await db.openings.get(def.id);
    if (o) {
      const root = treeOf(o);
      let added = 0;
      for (const u of def.updates!.filter((x) => x.rev > (revs[def.id] ?? 0))) {
        for (const l of lines(parsePgn(u.pgn).root)) {
          try { added += addLine(root, l); } catch { /* ligne devenue illégale : ignorée */ }
        }
      }
      if (added) {
        const builtin = (builtinChecks as Record<string, Record<string, MoveCheck>>)[def.id] ?? {};
        await saveTree(def.id, root, { ...builtin, ...o.checks });
      }
    }
    revs[def.id] = last;
    changed = true;
  }
  if (changed) await db.meta.put({ key: 'openingsRev', value: revs });
}

/** Range une ouverture dans les Archives, ou l'en ressort. */
export async function setArchived(id: string, archived: boolean) {
  await db.openings.update(id, { archived });
}

/** Identifiants des ouvertures archivées. */
export async function archivedIds(): Promise<Set<string>> {
  return new Set((await db.openings.toArray()).filter((o) => o.archived).map((o) => o.id));
}

/** Mes ouvertures actives (hors Archives), éventuellement d'une couleur. */
export async function activeOpenings(color?: 'w' | 'b'): Promise<Opening[]> {
  return (await db.openings.toArray()).filter((o) => !o.archived && (!color || o.color === color));
}

/** Enregistre un nouvel arbre pour une ouverture et resynchronise cartes et trous. */
export async function saveTree(id: string, root: RepNode, checks?: Record<string, MoveCheck>) {
  const o = await db.openings.get(id);
  if (!o) throw new Error('ouverture introuvable');
  await db.openings.update(id, {
    pgn: toPgn(root, { Event: o.name, Orientation: o.color === 'w' ? 'white' : 'black' }),
    checks: checks ?? o.checks, updatedAt: Date.now(),
  });
  await syncDrillCards(id);
  // Les trous désormais couverts par le répertoire disparaissent.
  const idx = buildIndex(root);
  const holes = await db.holes.where('openingId').equals(id).toArray();
  await db.holes.bulkDelete(holes.filter((h) => idx.get(h.key)?.moves.size).map((h) => h.id!));
}

/** Une carte par position du répertoire où c'est à moi de jouer. */
export async function syncDrillCards(id: string) {
  const o = await db.openings.get(id);
  if (!o) return;
  const positions = drillPositions(treeOf(o), o.color);
  const byKey = new Map(positions.map((p) => [p.key, p]));
  await db.transaction('rw', db.cards, async () => {
    const existing = await db.cards.where('openingId').equals(id).filter((c) => c.kind === 'drill').toArray();
    const have = new Set<string>();
    for (const c of existing) {
      const p = byKey.get(c.key!);
      if (!p) { await db.cards.delete(c.id!); continue; }
      have.add(c.key!);
      await db.cards.update(c.id!, {
        accept: p.accept, acceptSan: p.acceptSan, path: p.path, order: p.order,
        bestUci: p.accept[0], bestSan: p.acceptSan.join(' ou '),
      });
    }
    const add: Card[] = positions.filter((p) => !have.has(p.key)).map((p) => ({
      kind: 'drill', gameId: 0, source: 'app', fen: p.fen, myColor: o.color,
      playedUci: '', playedSan: '', bestUci: p.accept[0], bestSan: p.acceptSan.join(' ou '),
      wpBefore: 0, drop: 0, severity: 'ok', step: 0, due: DUE_NEW, createdAt: Date.now(), attempts: [],
      openingId: id, key: p.key, accept: p.accept, acceptSan: p.acceptSan, path: p.path, order: p.order,
    }));
    if (add.length) await db.cards.bulkAdd(add);
  });
}

// ---------------------------------------------------------------- file de révision

async function introducedToday(): Promise<number> {
  const m = (await db.meta.get('drillIntroduced'))?.value as { day: string; count: number } | undefined;
  return m && m.day === dayKey() ? m.count : 0;
}

export async function markIntroduced() {
  const n = await introducedToday();
  await db.meta.put({ key: 'drillIntroduced', value: { day: dayKey(), count: n + 1 } });
}

/**
 * Cartes à revoir aujourd'hui : échues + nouvelles positions de répertoire (quota quotidien).
 * Avec `openingId`, seulement cette ouverture, et jusqu'à 10 nouvelles positions quel que soit le quota.
 */
export async function reviewQueue(openingId?: string): Promise<Card[]> {
  const today = dayKey();
  let due = await db.cards.where('due').belowOrEqual(today).sortBy('due');
  let fresh = await db.cards.where('due').equals(DUE_NEW).toArray();
  if (openingId) {
    due = due.filter((c) => c.openingId === openingId);
    fresh = fresh.filter((c) => c.openingId === openingId);
  } else {
    // Le drill quotidien ignore les ouvertures archivées.
    const arch = await archivedIds();
    due = due.filter((c) => !c.openingId || !arch.has(c.openingId));
    fresh = fresh.filter((c) => !c.openingId || !arch.has(c.openingId));
  }
  fresh.sort((a, b) => (a.openingId ?? '').localeCompare(b.openingId ?? '') || (a.order ?? 0) - (b.order ?? 0));
  const quota = openingId ? NEW_DRILL_PER_DAY : Math.max(0, NEW_DRILL_PER_DAY - (await introducedToday()));
  return [...due, ...fresh.slice(0, quota)];
}

// ---------------------------------------------------------------- suivi du répertoire (toutes les parties)

export interface RepertoireInfo {
  /** Ouverture de mon répertoire suivie (au moins un coup du livre), sinon absent. */
  repOpeningId?: string;
  /** Première sortie du répertoire (null : toute la partie dans le livre) ; absent si je n'ai pas de répertoire de cette couleur. */
  bookExit?: BookExit | null;
}

/**
 * Jusqu'où une partie a suivi mon répertoire actif de sa couleur. S'il y a plusieurs ouvertures,
 * on garde celle suivie le plus longtemps.
 */
export function repertoireInfoWith(openings: Opening[], g: Pick<Game, 'startFen' | 'uci' | 'myColor'>): RepertoireInfo {
  let best: RepertoireInfo | null = null;
  let bestLen = -1;
  for (const o of openings) {
    if (o.archived || o.color !== g.myColor) continue;
    const exit = findBookExit(buildIndex(treeOf(o)), g.startFen, g.uci, o.color);
    const len = exit === null ? Infinity : exit.ply;
    if (len > bestLen) { bestLen = len; best = { bookExit: exit, ...(len > 0 ? { repOpeningId: o.id } : {}) }; }
  }
  return best ?? {};
}

export async function repertoireInfo(g: Pick<Game, 'startFen' | 'uci' | 'myColor'>): Promise<RepertoireInfo> {
  return repertoireInfoWith(await db.openings.toArray(), g);
}

// ---------------------------------------------------------------- partie à thème

/** Calcule la sortie du répertoire d'une partie à thème et enregistre un éventuel trou. */
export async function recordBookExit(gameId: number): Promise<Game | undefined> {
  const g = await db.games.get(gameId);
  if (!g?.openingId) return g;
  const o = await db.openings.get(g.openingId);
  if (!o) return g;
  const exit = findBookExit(buildIndex(treeOf(o)), g.startFen, g.uci, o.color);
  await db.games.update(gameId, { bookExit: exit });
  if (exit?.by === 'opponent' && !new Chess(exit.fenAfter).isGameOver()) {
    const key = fenKey(exit.fenAfter);
    const prev = await db.holes.where('[openingId+key]').equals([o.id, key]).first();
    if (prev) await db.holes.update(prev.id!, { count: prev.count + 1, gameId });
    else {
      const r = await stockfish.analyse(exit.fenAfter, 1000);
      const bestSan = r.bestMove ? new Chess(exit.fenAfter).move({ from: r.bestMove.slice(0, 2), to: r.bestMove.slice(2, 4), promotion: r.bestMove[4] }).san : null;
      const hole: Hole = {
        openingId: o.id, key, fen: exit.fenAfter, path: g.san.slice(0, exit.ply + 1), oppSan: exit.playedSan,
        bestUci: r.bestMove, bestSan, gameId, count: 1, createdAt: Date.now(),
      };
      await db.holes.add(hole);
    }
  }
  return db.games.get(gameId);
}

// ---------------------------------------------------------------- vérification Stockfish (navigateur)

/** Perte (cp) de chacun de mes coups non encore vérifiés. */
export async function checkMyMoves(
  root: RepNode, o: Pick<Opening, 'color' | 'checks'>, onProgress?: (d: number, t: number) => void, ms = 800,
): Promise<Record<string, MoveCheck>> {
  const checks = { ...o.checks };
  const todo = myMoves(root, o.color).filter((m) => !checks[checkKey(m.fen, m.uci)]);
  let done = 0;
  onProgress?.(0, todo.length);
  for (const m of todo) {
    const best = await stockfish.analyse(m.fen, ms);
    let loss = 0;
    let bestSan = m.san;
    if (best.bestMove && best.bestMove !== m.uci) {
      const mine = await stockfish.analyse(m.fen, ms, m.uci);
      loss = Math.max(0, evalToCp(best.eval as Eval) - evalToCp(mine.eval as Eval));
      bestSan = new Chess(m.fen).move({ from: best.bestMove.slice(0, 2), to: best.bestMove.slice(2, 4), promotion: best.bestMove[4] }).san;
    }
    checks[checkKey(m.fen, m.uci)] = { loss, bestSan, depth: 0 };
    onProgress?.(++done, todo.length);
  }
  return checks;
}

/** Perte maximale de mes coups sur une ligne (undefined si un coup n'est pas vérifié). */
export function lineLoss(o: Pick<Opening, 'color' | 'checks'>, sans: string[], startFen?: string) {
  const c = new Chess(startFen);
  let max = 0;
  const bad: string[] = [];
  for (const s of sans) {
    const fen = c.fen();
    const m = c.move(s);
    if (fen.split(' ')[1] !== o.color) continue;
    const r = o.checks[checkKey(fen, m.from + m.to + (m.promotion ?? ''))];
    if (!r) return { max: undefined, bad };
    if (r.loss > MAX_LOSS_CP) bad.push(`${m.san} (−${r.loss} cp, Stockfish : ${r.bestSan})`);
    max = Math.max(max, r.loss);
  }
  return { max, bad };
}

// ---------------------------------------------------------------- mode Leçon

export interface LessonProgress { blocksDone: number; done: boolean; at: number }

export async function getLessonProgress(): Promise<Record<string, LessonProgress>> {
  return ((await db.meta.get('openingLessons'))?.value as Record<string, LessonProgress>) ?? {};
}

export async function saveLessonProgress(id: string, p: LessonProgress) {
  const all = await getLessonProgress();
  const prev = all[id];
  all[id] = { blocksDone: Math.max(prev?.blocksDone ?? 0, p.blocksDone), done: !!(prev?.done || p.done), at: p.at };
  await db.meta.put({ key: 'openingLessons', value: all });
}

/**
 * Les coups appris en leçon entrent dans le drill : leurs cartes « nouvelles » sont programmées pour demain
 * (sans compter dans le quota de nouvelles positions du jour). Renvoie le nombre de cartes introduites.
 */
export async function introduceDrillCards(openingId: string, fens: string[]): Promise<number> {
  const due = addDays(dayKey(), INTERVALS[0]);
  let n = 0;
  for (const fen of fens) {
    const card = await db.cards.where('[openingId+key]').equals([openingId, fenKey(fen)]).first();
    if (card && card.due === DUE_NEW) { await db.cards.update(card.id!, { due, step: 0 }); n++; }
  }
  return n;
}
