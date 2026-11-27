// Recalcul en arrière-plan des détails d'erreur calculés par une version plus ancienne (DETAIL_VERSION) : toutes les
// parties analysées, des plus récentes aux plus anciennes, une erreur après l'autre. S'interrompt pendant une partie
// contre Maia (même règle que l'analyse en arrière-plan) et reprend ensuite. Les motifs (objectif, rapport, revue)
// se mettent ainsi à jour, point de départ de l'objectif compris.
import { db, type Game } from './db';
import { isError, needsDetail, replay } from './analysis';
import { computeErrorDetail } from './lib/report/motifs';
import { browserEngine } from './engines/stockfish';

export interface DetailRefresh { running: boolean; done: number; total: number; finishedAt?: number }

let st: DetailRefresh = { running: false, done: 0, total: 0 };
const subs = new Set<() => void>();
const set = (s: DetailRefresh) => { st = s; subs.forEach((f) => f()); };
let pauseWhen: () => boolean = () => false;

export const detailRefresh = {
  get: () => st,
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; },
};
export function setDetailRefreshPause(fn: () => boolean) { pauseWhen = fn; }

/** Coups dont le détail est à recalculer : erreurs et gaffes sans détail à jour, et détails anciens (imprécisions du rapport). */
export function stalePlies(g: Pick<Game, 'analysis'>): number[] {
  return (g.analysis ?? []).filter((a) => needsDetail(a) && (isError(a) || !!a.detail)).map((a) => a.ply);
}

/** Lance le recalcul (une seule fois à la fois). Renvoie le nombre de détails recalculés. */
export async function startDetailRefresh(): Promise<number> {
  if (st.running) return 0;
  const games = (await db.games.toArray()).filter((g) => g.analysis && stalePlies(g).length).sort((a, b) => b.date - a.date);
  const total = games.reduce((t, g) => t + stalePlies(g).length, 0);
  if (!total) return 0;
  set({ running: true, done: 0, total });
  let done = 0;
  try {
    for (const g0 of games) {
      if (pauseWhen()) break;
      const g = await db.games.get(g0.id!);
      if (!g?.analysis) continue;
      const analysis = g.analysis;
      const { fens } = replay(g.startFen, g.uci);
      // Une erreur à la fois : on enregistre après chacune, pour ne rien perdre si l'appli se ferme.
      const stale = stalePlies(g);
      for (let i = 0; i < analysis.length; i++) {
        const a = analysis[i];
        if (!stale.includes(a.ply)) continue;
        if (pauseWhen()) break;
        const detail = await computeErrorDetail(browserEngine, fens[a.ply], a.uci, g.myColor, undefined, a.bestUci);
        // Seul ce détail est écrit, sur la partie telle qu'elle est en base : rien d'autre n'est écrasé.
        await db.games.update(g.id!, (obj) => { const x = obj.analysis?.find((y) => y.ply === a.ply); if (x) x.detail = detail; });
        set({ running: true, done: ++done, total });
      }
    }
  } finally {
    set({ running: false, done, total, finishedAt: Date.now() });
  }
  return done;
}

/** Reprend après une pause (sans effet s'il ne reste rien). */
export function resumeDetailRefresh() {
  if (!st.running && !pauseWhen()) startDetailRefresh().catch(console.error);
}
