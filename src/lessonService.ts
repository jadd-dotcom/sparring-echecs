// Leçons d'ouverture : état du sommaire (blocs regardés, rejoués, erreurs, tours de boucle) et point de reprise.
import { db } from './db';
import { emptyLessonState, type LessonState } from './lib/lessonPlan';

const key = (id: string) => `lessonState:${id}`;

let queue: Promise<unknown> = Promise.resolve();

const read = async (id: string) => ((await db.meta.get(key(id)))?.value as LessonState | undefined) ?? emptyLessonState();

/** État de la leçon, après les mises à jour en attente (on ne lit jamais un état périmé). */
export async function getLessonState(id: string): Promise<LessonState> {
  await queue;
  return read(id);
}

/** Met à jour l'état (lecture puis écriture), une mise à jour après l'autre : aucune ne s'écrase. */
export function updateLessonState(id: string, fn: (s: LessonState) => LessonState): Promise<LessonState> {
  const run = async () => {
    const next = fn(await read(id));
    await db.meta.put({ key: key(id), value: next });
    return next;
  };
  const p = queue.then(run, run);
  queue = p.catch(() => undefined);
  return p;
}
