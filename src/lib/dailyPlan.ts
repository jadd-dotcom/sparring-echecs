// Plan du jour (fonctions pures) : plafond de la révision (10 / 15 / 25 / sans limite) avec priorités — d'abord les
// cartes des motifs de mon objectif, puis « Lis la menace », puis les plus anciennes — et les 5 étapes de la séance
// du jour (échauffement, un piège, Lis la menace, révision, une partie contre Maia).
import type { Card } from '../db';
import { dayKey } from './srs';
import type { Motif } from './report/motifs';

export const REVISE_CAPS = [10, 15, 25, 0] as const;      // 0 = sans limite
export const DEFAULT_REVISE_CAP = 15;

/** Cartes déjà revues aujourd'hui (au moins une tentative datée d'aujourd'hui). */
export function reviewedToday(cards: Pick<Card, 'attempts'>[], today = dayKey()): number {
  return cards.filter((c) => c.attempts.some((a) => dayKey(new Date(a.date)) === today)).length;
}

/**
 * Ordre de la révision : 0 = carte d'erreur d'un motif de l'objectif, 1 = « Lis la menace », 2 = le reste ;
 * à rang égal, les plus anciennes d'abord (échéance, puis création).
 */
export function prioritize<T extends Pick<Card, 'kind' | 'due' | 'createdAt'>>(cards: T[], motifOf: (c: T) => Motif | undefined, goalMotifs: Motif[]): T[] {
  const rank = (c: T) => {
    const m = motifOf(c);
    if ((c.kind ?? 'mistake') === 'mistake' && m && goalMotifs.includes(m)) return 0;
    if (c.kind === 'threat') return 1;
    return 2;
  };
  return [...cards].sort((a, b) => rank(a) - rank(b) || a.due.localeCompare(b.due) || a.createdAt - b.createdAt);
}

/** Cartes permises aujourd'hui : plafond moins celles déjà revues (0 = sans limite). */
export const allowance = (cap: number, done: number) => (cap === 0 ? Infinity : Math.max(0, cap - done));

/** Étape « Lis la menace » de la séance : au plus 5 positions par jour. */
export const THREAT_STEP_MAX = 5;

/**
 * Cartes du jour (déjà triées par priorité) : les `left` premières (plafond). L'étape « Lis la menace » en prend au
 * plus 5 (moins celles déjà revues aujourd'hui) ; la Révision a les autres, sans recompter ces positions. Le reste
 * attend les jours suivants.
 */
export function splitToday<T extends Pick<Card, 'kind'>>(all: T[], left: number, threatDoneToday: number): { threat: T[]; revise: T[]; waiting: number } {
  const today = left === Infinity ? all : all.slice(0, left);
  const threat = today.filter((c) => c.kind === 'threat').slice(0, Math.max(0, THREAT_STEP_MAX - threatDoneToday));
  const inThreat = new Set(threat);
  return { threat, revise: today.filter((c) => !inThreat.has(c)), waiting: all.length - today.length };
}

// ---------------------------------------------------------------- séance du jour

export type StepId = 'warmup' | 'trap' | 'threat' | 'revise' | 'game';

export interface StepState {
  id: StepId;
  label: string;
  /** Précision (chapitre dû, nom du piège, nombre de cartes…). */
  detail: string;
  minutes: number;
  done: boolean;
}

export interface SessionInput {
  warmupDone: boolean;
  dueChapter: number | null;
  trap: { id: string; name: string } | null;   // null : tous les pièges sont maîtrisés
  trapDone: boolean;
  threatLeft: number;
  threatDoneToday: number;
  reviseLeft: number;
  reviseDoneToday: number;
  gameToday: boolean;
}

const pl = (n: number, w: string) => `${n} ${w}${n > 1 ? 's' : ''}`;

export function sessionSteps(s: SessionInput): StepState[] {
  return [
    { id: 'warmup', label: 'Échauffement échiquier', minutes: 3, done: s.warmupDone,
      detail: s.dueChapter ? `chapitre ${s.dueChapter} à revoir` : 'mes cases les plus faibles' },
    { id: 'trap', label: 'Un piège d’ouverture', minutes: 4, done: !s.trap || s.trapDone,
      detail: s.trap ? s.trap.name : 'tous les pièges sont maîtrisés' },
    { id: 'threat', label: 'Lis la menace', minutes: 5, done: s.threatLeft === 0,   // au plus 5 positions (THREAT_STEP_MAX)
      detail: s.threatLeft ? pl(s.threatLeft, 'position') : s.threatDoneToday ? 'fait' : 'rien aujourd’hui' },
    { id: 'revise', label: 'Révision', minutes: 10, done: s.reviseLeft === 0,
      detail: s.reviseLeft ? pl(s.reviseLeft, 'carte') : s.reviseDoneToday ? 'faite' : 'rien aujourd’hui' },
    { id: 'game', label: 'Une partie contre Maia', minutes: 15, done: s.gameToday, detail: s.gameToday ? 'jouée' : 'sans aide' },
  ];
}

export const nextStep = (steps: StepState[]) => steps.find((s) => !s.done) ?? null;

/** Piège du jour : un piège non maîtrisé, ceux de mes ouvertures d'abord (ordre de la liste ensuite). */
export function pickTrap<T extends { id: string; chapter: string }>(traps: T[], mastered: (id: string) => boolean): T | null {
  const order = ['mes', 'mats', 'dame'];
  const open = traps.filter((t) => !mastered(t.id));
  return [...open].sort((a, b) => order.indexOf(a.chapter) - order.indexOf(b.chapter))[0] ?? null;
}
