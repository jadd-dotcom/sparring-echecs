// Mode « Examen » d'une ouverture : 10 positions tirées au hasard dans le répertoire (mes coups), sans indice et sans la
// ligne qui y mène ; score sur 10 ; les positions ratées sont « à refaire » (elles reviennent dans le drill).
import type { DrillPosition } from './repertoire';
import { shuffled } from './shuffle';

export const EXAM_SIZE = 10;

export interface ExamAnswer { key: string; uci: string; ok: boolean }
export interface ExamResult { date: number; score: number; total: number; missed: string[] }

/** Les positions de l'examen : `n` positions distinctes, au hasard. */
export function pickExam(positions: DrillPosition[], n = EXAM_SIZE, rand: () => number = Math.random): DrillPosition[] {
  return shuffled(positions, rand).slice(0, Math.min(n, positions.length));
}

/** Réponse juste : un coup de mon répertoire depuis cette position. */
export const examOk = (p: DrillPosition, uci: string) => p.accept.includes(uci);

/** Résultat : score, nombre de questions, positions ratées (clés). */
export function examResult(answers: ExamAnswer[], date = Date.now()): ExamResult {
  return { date, score: answers.filter((a) => a.ok).length, total: answers.length, missed: answers.filter((a) => !a.ok).map((a) => a.key) };
}
