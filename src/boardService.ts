// Mode « Maîtrise de l'échiquier » : progression (niveaux, chapitres, révisions) et statistiques par case,
// stockées dans la base (meta) — donc dans la sauvegarde JSON et hors ligne.
import { db } from './db';
import { dayKey } from './lib/srs';
import { emptyProgress, recordReview, recordTest, type BoardProgress } from './lib/board/levels';
import { recordAnswer, type SquareStats } from './lib/board/stats';

const P_KEY = 'boardProgress';
const S_KEY = 'boardStats';

export async function getBoardProgress(): Promise<BoardProgress> {
  return ((await db.meta.get(P_KEY))?.value as BoardProgress | undefined) ?? emptyProgress();
}
export async function getBoardStats(): Promise<SquareStats> {
  return ((await db.meta.get(S_KEY))?.value as SquareStats | undefined) ?? {};
}

let chain: Promise<unknown> = Promise.resolve();

/** Une réponse sur une case (statistiques par case). Les écritures sont enchaînées : aucune réponse perdue. */
export function saveSquareAnswer(square: string, ok: boolean, ms: number): Promise<unknown> {
  chain = chain.then(async () => {
    const s = await getBoardStats();
    await db.meta.put({ key: S_KEY, value: recordAnswer(s, square, ok, ms) });
  }).catch(console.error);
  return chain;
}

/** Une épreuve terminée (hors révision). */
export async function saveTest(levelId: string, passed: boolean, scoreText: string, score: number): Promise<BoardProgress> {
  const p = recordTest(await getBoardProgress(), levelId, passed, scoreText, score, dayKey());
  await db.meta.put({ key: P_KEY, value: p });
  return p;
}

/** Une révision de chapitre terminée. */
export async function saveReview(chapter: number, levelId: string, passed: boolean): Promise<BoardProgress> {
  const p = recordReview(await getBoardProgress(), chapter, levelId, passed, dayKey());
  await db.meta.put({ key: P_KEY, value: p });
  return p;
}
