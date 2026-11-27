// Pièges d'ouverture : progression (IndexedDB, clé `traps`), maîtrise → carte de révision espacée (kind 'trap').
import { db, type Card } from './db';
import { addDays, dayKey, INTERVALS } from './lib/srs';
import { isMastered, type TrapMode, type TrapProgress } from './lib/traps';
import { TRAPS } from './data/traps';

const KEY = 'traps';

export async function getTrapProgress(): Promise<Record<string, TrapProgress>> {
  return ((await db.meta.get(KEY))?.value as Record<string, TrapProgress> | undefined) ?? {};
}

/** Enregistre un exercice. Renvoie `mastered: true` si le piège vient d'être maîtrisé (une carte de révision est créée). */
export async function recordTrapAttempt(id: string, mode: TrapMode, ok: boolean, clean: boolean): Promise<{ mastered: boolean; progress: TrapProgress }> {
  const all = await getTrapProgress();
  const prev = all[id] ?? { attempts: [] };
  const progress: TrapProgress = { ...prev, attempts: [...prev.attempts, { date: Date.now(), mode, ok, clean }] };
  let mastered = false;
  if (!progress.masteredAt && isMastered(progress.attempts)) {
    progress.masteredAt = Date.now();
    mastered = true;
    const t = TRAPS.find((x) => x.id === id)!;
    const exists = await db.cards.filter((c) => c.kind === 'trap' && c.trapId === id).count();
    if (!exists) {
      const today = dayKey();
      const card: Card = {
        kind: 'trap', trapId: id, gameId: 0, source: 'app', fen: '', myColor: 'w', playedUci: '', playedSan: '',
        bestUci: '', bestSan: t.punish[0], wpBefore: 0, drop: 0, severity: 'ok',
        step: 1, due: addDays(today, INTERVALS[1]), createdAt: Date.now(), attempts: [],
      };
      await db.cards.add(card);
    }
  }
  await db.meta.put({ key: KEY, value: { ...all, [id]: progress } });
  return { mastered, progress };
}
