// « Mon objectif » : une règle à la fois. Trois objectifs dans l'ordre, un seul actif. Mesure : mes parties analysées
// (Sparring et Chess.com, 10 coups au moins) jouées depuis le début de l'objectif. Partie « propre » = aucune gaffe
// (≥ 30 points) des motifs de l'objectif (objectif 3 : aucune sortie du répertoire par moi). Maîtrisé : 7 propres sur
// les 10 dernières (10 parties au moins depuis le début) ; l'objectif suivant devient actif. Un objectif maîtrisé qui
// retombe à 5/10 ou moins redevient actif. Fonctions pures.
import type { Game } from '../db';
import { MOTIF_ORDER, type Motif } from './report/motifs';

export type GoalId = 'rien-donner' | 'rien-laisser' | 'repertoire';

export interface GoalDef {
  id: GoalId;
  name: string;
  rule: string;
  /** Motifs des gaffes qui rendent une partie « pas propre » (objectifs 1 et 2). */
  motifs: Motif[];
  /** Objectif 3 : une sortie du répertoire par moi rend la partie « pas propre ». */
  repertoire?: boolean;
}

export const GOALS: GoalDef[] = [
  { id: 'rien-donner', name: 'Ne rien donner', motifs: ['menace-ignoree', 'piece-en-prise'],
    rule: 'Avant de lâcher la pièce : après mon coup, quels sont SES échecs, SES prises, SES attaques ?' },
  { id: 'rien-laisser', name: 'Ne rien laisser passer', motifs: ['gain-rate', 'mat-rate'],
    rule: 'Avant de jouer : quels sont MES échecs, MES prises, MES attaques ?' },
  { id: 'repertoire', name: 'Tenir mon répertoire', motifs: [], repertoire: true,
    rule: 'Dans l’ouverture, je joue mes coups appris, pas des coups au feeling.' },
];

export const GOAL_WINDOW = 10;
export const GOAL_MASTERED = 7;
export const GOAL_RELAPSE = 5;
export const GOAL_MIN_MY_MOVES = 10;

/** Sortie du répertoire d'une partie (calculée à part) : qui en est sorti, et à quel demi-coup. */
export type ExitInfo = { by: 'me' | 'opponent' | 'end'; ply: number } | null | undefined;

/** Partie mesurée : analysée, avec au moins 10 de mes coups. Les plus anciennes d'abord. */
export function measuredGames(games: Game[]): Game[] {
  return games.filter((g) => g.id !== undefined && (g.analysis?.length ?? 0) >= GOAL_MIN_MY_MOVES).sort((a, b) => a.date - b.date);
}

/** Mes gaffes (≥ 30 points) d'une partie, par motif principal. */
export function blundersByMotif(g: Game): Partial<Record<Motif, number>> {
  const out: Partial<Record<Motif, number>> = {};
  for (const a of g.analysis ?? []) {
    if (a.severity !== 'blunder') continue;
    const m = a.detail?.motif ?? 'autre';
    out[m] = (out[m] ?? 0) + 1;
  }
  return out;
}

/** Demi-coups des gaffes qui relèvent de l'objectif (pour la revue : « Règle de l'objectif »). */
export function goalBlunderPlies(goal: GoalDef, g: Game, exit?: ExitInfo): number[] {
  if (goal.repertoire) return exit?.by === 'me' ? [exit.ply] : [];
  return (g.analysis ?? []).filter((a) => a.severity === 'blunder' && a.detail && goal.motifs.includes(a.detail.motif)).map((a) => a.ply);
}

/** Partie « propre » pour cet objectif. */
export function isClean(goal: GoalDef, g: Game, exit?: ExitInfo): boolean {
  return goalBlunderPlies(goal, g, exit).length === 0;
}

export interface GoalState {
  /** Indice de l'objectif actif dans GOALS (null : tous maîtrisés). */
  active: number | null;
  /** Début de l'objectif actif (date en ms). */
  since: number;
  /** Objectifs maîtrisés : id → date de maîtrise. */
  mastered: Partial<Record<GoalId, number>>;
  /** Messages à afficher une fois (maîtrise, retour d'un objectif). */
  messages: string[];
}

export const initialGoalState = (now: number): GoalState => ({ active: 0, since: now, mastered: {}, messages: [] });

export interface GoalProgress {
  goal: GoalDef;
  since: number;
  /** Les 10 dernières parties mesurées depuis le début (les plus anciennes d'abord). */
  last: { id: number; date: number; clean: boolean }[];
  clean: number;
  /** Parties mesurées depuis le début. */
  total: number;
  /** Point de départ : les 10 parties d'avant le début de l'objectif. */
  baseline: { clean: number; n: number };
  mastered: boolean;
}

/** Progression d'un objectif depuis `since`. `exits` : sortie du répertoire par identifiant de partie. */
export function goalProgress(goal: GoalDef, games: Game[], since: number, exits: Record<number, ExitInfo> = {}): GoalProgress {
  const ms = measuredGames(games);
  const after = ms.filter((g) => g.date >= since);
  const before = ms.filter((g) => g.date < since).slice(-GOAL_WINDOW);
  const last = after.slice(-GOAL_WINDOW).map((g) => ({ id: g.id!, date: g.date, clean: isClean(goal, g, exits[g.id!]) }));
  const clean = last.filter((x) => x.clean).length;
  return {
    goal, since, last, clean, total: after.length,
    baseline: { clean: before.filter((g) => isClean(goal, g, exits[g.id!])).length, n: before.length },
    mastered: after.length >= GOAL_WINDOW && clean >= GOAL_MASTERED,
  };
}

/** Propres sur les 10 dernières parties mesurées (toutes dates), et leur nombre. */
export function recentClean(goal: GoalDef, games: Game[], exits: Record<number, ExitInfo> = {}): { clean: number; n: number } {
  const last = measuredGames(games).slice(-GOAL_WINDOW);
  return { clean: last.filter((g) => isClean(goal, g, exits[g.id!])).length, n: last.length };
}

/**
 * Met l'état à jour : objectif actif maîtrisé → message, l'objectif suivant non maîtrisé devient actif (début = now) ;
 * un objectif maîtrisé qui retombe à 5/10 ou moins (sur les 10 dernières parties) redevient actif, avec un message.
 */
export function updateGoals(state: GoalState, games: Game[], now: number, exits: Record<number, ExitInfo> = {}): GoalState {
  let s: GoalState = { ...state, mastered: { ...state.mastered }, messages: [...state.messages] };
  // 1. Retour d'un objectif maîtrisé (le premier dans l'ordre).
  for (let i = 0; i < GOALS.length; i++) {
    const g = GOALS[i];
    if (s.mastered[g.id] === undefined || s.active === i) continue;
    const r = recentClean(g, games, exits);
    if (r.n >= GOAL_WINDOW && r.clean <= GOAL_RELAPSE) {
      delete s.mastered[g.id];
      s.messages.push(`« ${g.name} » retombe à ${r.clean}/${GOAL_WINDOW} parties propres : cet objectif redevient actif.`);
      s = { ...s, active: i, since: now };
      break;
    }
  }
  // 2. Objectif actif maîtrisé → le suivant.
  for (let guard = 0; guard < GOALS.length && s.active !== null; guard++) {
    const g = GOALS[s.active];
    const p = goalProgress(g, games, s.since, exits);
    if (!p.mastered) break;
    s.mastered[g.id] = now;
    const next = GOALS.findIndex((x) => s.mastered[x.id] === undefined);
    s.messages.push(`Objectif maîtrisé : « ${g.name} » (${p.clean}/${GOAL_WINDOW} parties propres).${next >= 0 ? ` Nouvel objectif : « ${GOALS[next].name} ».` : ' Tous les objectifs sont maîtrisés.'}`);
    s = { ...s, active: next >= 0 ? next : null, since: now };
  }
  return s;
}

/** « À surveiller » : sur les 10 dernières parties mesurées, nombre de gaffes par autre motif (et sorties du répertoire). */
export function toWatch(goal: GoalDef | null, games: Game[], exits: Record<number, ExitInfo> = {}): { label: Motif | 'repertoire'; count: number }[] {
  const last = measuredGames(games).slice(-GOAL_WINDOW);
  const counts: Partial<Record<Motif, number>> = {};
  for (const g of last) for (const [m, n] of Object.entries(blundersByMotif(g)) as [Motif, number][]) counts[m] = (counts[m] ?? 0) + n;
  const out: { label: Motif | 'repertoire'; count: number }[] = MOTIF_ORDER
    .filter((m) => !goal?.motifs.includes(m) && (counts[m] ?? 0) > 0)
    .map((m) => ({ label: m, count: counts[m]! }))
    .sort((a, b) => b.count - a.count);
  if (!goal?.repertoire) {
    const n = last.filter((g) => exits[g.id!]?.by === 'me').length;
    if (n) out.push({ label: 'repertoire', count: n });
  }
  return out;
}
