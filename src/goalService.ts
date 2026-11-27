// « Mon objectif » : état (IndexedDB, clé `goals`), sorties du répertoire de mes parties (comme le rapport), mise à
// jour à l'ouverture de l'accueil et du rapport.
import { db, type Game, type Opening } from './db';
import { buildIndex, findBookExit } from './lib/repertoire';
import { treeOf } from './openings';
import { GOALS, initialGoalState, updateGoals, type ExitInfo, type GoalDef, type GoalState } from './lib/goals';

const KEY = 'goals';

/** Sortie du répertoire de chaque partie : partie à thème → son ouverture ; importée → enregistrée ; sinon mes ouvertures actives. */
export function exitsOf(games: Game[], openings: Opening[]): Record<number, ExitInfo> {
  const idx = new Map(openings.filter((o) => !o.archived).map((o) => [o.id, { o, index: buildIndex(treeOf(o)) }]));
  const out: Record<number, ExitInfo> = {};
  for (const g of games) {
    if (g.id === undefined) continue;
    let exit = g.bookExit;
    if (exit === undefined && !g.openingId) {
      // Mes ouvertures actives de la couleur : celle suivie le plus longtemps.
      let bestLen = -1;
      for (const { o, index } of idx.values()) {
        if (o.color !== g.myColor) continue;
        const e = findBookExit(index, g.startFen, g.uci, o.color);
        const len = e === null ? Infinity : e.ply;
        if (len > bestLen) { bestLen = len; exit = e; }
      }
    }
    out[g.id] = exit ? { by: exit.by, ply: exit.ply } : exit;
  }
  return out;
}

export interface GoalData { state: GoalState; games: Game[]; exits: Record<number, ExitInfo>; goal: GoalDef | null }

/** Charge, met à jour et enregistre l'état des objectifs. */
export async function loadGoals(now = Date.now()): Promise<GoalData> {
  const [m, games, openings] = await Promise.all([db.meta.get(KEY), db.games.toArray(), db.openings.toArray()]);
  const prev = (m?.value as GoalState | undefined) ?? initialGoalState(now);
  const exits = exitsOf(games, openings);
  const state = updateGoals(prev, games, now, exits);
  if (!m || JSON.stringify(state) !== JSON.stringify(prev)) await db.meta.put({ key: KEY, value: state });
  return { state, games, exits, goal: state.active === null ? null : GOALS[state.active] };
}

/** Les messages (maîtrise, retour) ont été lus. */
export async function clearGoalMessages() {
  const m = await db.meta.get(KEY);
  if (m) await db.meta.put({ key: KEY, value: { ...(m.value as GoalState), messages: [] } });
}

/** L'objectif actif, sans mise à jour (revue de partie). */
export async function activeGoal(): Promise<GoalDef | null> {
  const s = (await db.meta.get(KEY))?.value as GoalState | undefined;
  return s ? (s.active === null ? null : GOALS[s.active]) : GOALS[0];
}
