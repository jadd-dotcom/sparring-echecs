// « Ta séance du jour » : état des 5 étapes à partir des données (échauffement fait, piège du jour, Lis la menace,
// révision plafonnée, partie contre Maia jouée aujourd'hui). L'étape lancée depuis « Aujourd'hui » est retenue le
// temps de la faire (sessionStorage) pour proposer « Retour à Aujourd'hui » à la fin.
import { db, getCurrent, getProfile } from './db';
import { dayKey } from './lib/srs';
import { dueChapters } from './lib/board/levels';
import { getBoardProgress } from './boardService';
import { nextStep, pickTrap, reviewedToday, sessionSteps, type StepId, type StepState } from './lib/dailyPlan';
import { reviewQueue } from './openings';
import { getTrapProgress } from './trapService';
import { trapStatus } from './lib/traps';
import { TRAPS } from './data/traps';
import { errorsToComment } from './lib/commentQueue';
import { botRating } from './lib/rating';
import { getMeta } from './metaKeys';
import { backupReminderDue, daysSince } from './lib/backup';

export interface TodayData {
  steps: StepState[];
  next: StepState | null;
  rating: number;
  bot: number;
  trapId: string | null;
  toComment: number;
  inProgress: boolean;
  reviseLeft: number;
  /** Jours depuis la dernière sauvegarde (null : jamais) et rappel discret (au-delà de 14 jours). */
  backupDays: number | null;
  backupDue: boolean;
}

export const markWarmupDone = () => db.meta.put({ key: 'warmupDay', value: dayKey() });

export async function loadToday(): Promise<TodayData> {
  const today = dayKey();
  const [prof, warm, bp, tp, cards, games, current, stored, backupAt] = await Promise.all([
    getProfile(), db.meta.get('warmupDay'), getBoardProgress(), getTrapProgress(), db.cards.toArray(), db.games.toArray(), getCurrent(),
    db.meta.get('sessionTrap'), getMeta('lastBackupAt'),
  ]);
  // Piège du jour : gardé toute la journée (même s'il devient maîtrisé entre-temps).
  let trapId = (stored?.value as { day: string; id: string | null } | undefined)?.day === today ? (stored!.value as { id: string | null }).id : undefined;
  if (trapId === undefined) {
    trapId = pickTrap(TRAPS, (id) => trapStatus(tp[id]) === 'maîtrisé')?.id ?? null;
    await db.meta.put({ key: 'sessionTrap', value: { day: today, id: trapId } });
  }
  const trap = trapId ? TRAPS.find((t) => t.id === trapId) ?? null : null;
  const todayAttempts = (trapId ? tp[trapId]?.attempts ?? [] : []).filter((a) => dayKey(new Date(a.date)) === today);
  const [threatQ, reviseQ] = await Promise.all([reviewQueue(undefined, { only: 'threat' }), reviewQueue()]);
  const steps = sessionSteps({
    warmupDone: warm?.value === today,
    dueChapter: dueChapters(bp, today)[0] ?? null,
    trap: trap ? { id: trap.id, name: trap.name } : null,
    trapDone: todayAttempts.some((a) => a.mode === 'defend') && todayAttempts.some((a) => a.mode === 'punish'),
    threatLeft: threatQ.length,
    threatDoneToday: reviewedToday(cards.filter((c) => c.kind === 'threat'), today),
    reviseLeft: reviseQ.length,
    reviseDoneToday: reviewedToday(cards, today),
    gameToday: games.some((g) => g.source === 'app' && !g.assisted && dayKey(new Date(g.date)) === today),
  });
  return {
    steps, next: nextStep(steps), rating: prof.rating, bot: botRating(prof.rating), trapId,
    toComment: errorsToComment(games).length, inProgress: !!current, reviseLeft: reviseQ.length,
    backupDays: daysSince(backupAt), backupDue: backupReminderDue(backupAt, games.length > 0),
  };
}

// ---------------------------------------------------------------- étape en cours (pour « Retour à Aujourd'hui »)

const KEY = 'seance';
export function startStep(id: StepId) { try { sessionStorage.setItem(KEY, id); } catch { /* stockage indisponible */ } }
export function activeStep(): StepId | null { try { return sessionStorage.getItem(KEY) as StepId | null; } catch { return null; } }
export function endStep() { try { sessionStorage.removeItem(KEY); } catch { /* stockage indisponible */ } }
