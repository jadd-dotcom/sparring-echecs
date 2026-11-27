// Pièges d'ouverture : positions (moment critique, après la faute), verdicts des exercices « Défends-toi » et
// « Punis-le », maîtrise (les deux réussis sans indice, deux jours différents), pièges où je suis tombé dans mes
// parties. Fonctions pures.
import { Chess, type Color } from 'chess.js';
import type { Game } from '../db';
import { TRAPS, type TrapDef } from '../data/traps';

/** Tolérance (points de win%) : une défense (ou une punition) presque aussi bonne que la meilleure est acceptée. */
export const TRAP_TOLERANCE = 10;
/** Au-delà de cette perte (points de win%), la victime est tombée dans le piège. */
export const TRAP_FALL = 20;

const uciOf = (m: { from: string; to: string; promotion?: string }) => m.from + m.to + (m.promotion ?? '');
export const fenKey = (fen: string) => fen.split(' ').slice(0, 4).join(' ');

export interface TrapPositions {
  /** Position de départ de la suite. */
  start: string;
  /** Moment critique : la victime a le trait. */
  critical: string;
  victim: Color;
  punisher: Color;
  /** Dernier coup joué avant le moment critique (celui qui tend le piège), en UCI. */
  lastUci: string;
  blunderUci: string;
  goodUci: string[];
  /** Après la faute : le punisseur a le trait. */
  afterBlunder: string;
  keyUci: string;
}

export function trapPositions(t: TrapDef): TrapPositions {
  const c = new Chess();
  const start = c.fen();
  let last = '';
  for (const s of t.line) last = uciOf(c.move(s));
  const critical = c.fen();
  const victim = c.turn();
  const goodUci = t.good.map((g) => uciOf(new Chess(critical).move(g)));
  const blunderUci = uciOf(c.move(t.blunder));
  const afterBlunder = c.fen();
  const keyUci = uciOf(new Chess(afterBlunder).move(t.punish[0]));
  return { start, critical, victim, punisher: victim === 'w' ? 'b' : 'w', lastUci: last, blunderUci, goodUci, afterBlunder, keyUci };
}

export type DefendVerdict = 'ok' | 'fell' | 'retry';

/** « Défends-toi » : bonne défense (liste vérifiée, ou presque aussi bonne que la meilleure), piège, ou à refaire. */
export function defendVerdict(uci: string, p: Pick<TrapPositions, 'goodUci' | 'blunderUci'>, drop: number | null): DefendVerdict {
  if (p.goodUci.includes(uci)) return 'ok';
  if (uci === p.blunderUci) return 'fell';
  if (drop === null) return 'retry';
  if (drop <= TRAP_TOLERANCE) return 'ok';
  return drop >= TRAP_FALL ? 'fell' : 'retry';
}

/** « Punis-le » : le coup clé, un mat, ou un coup qui gagne presque autant (win% du punisseur). */
export function punishOk(uci: string, keyUci: string, o: { mates: boolean; wpMine?: number; wpKey?: number }): boolean {
  if (uci === keyUci || o.mates) return true;
  return o.wpMine !== undefined && o.wpKey !== undefined && o.wpMine >= o.wpKey - TRAP_TOLERANCE;
}

// ---------------------------------------------------------------- maîtrise

export type TrapMode = 'defend' | 'punish';
export interface TrapAttempt { date: number; mode: TrapMode; ok: boolean; clean: boolean }
export interface TrapProgress { attempts: TrapAttempt[]; masteredAt?: number }

const day = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };

/** Jours où les deux exercices ont été réussis sans indice ni essai raté. */
export function cleanDays(attempts: TrapAttempt[]): string[] {
  const by = new Map<string, Set<TrapMode>>();
  for (const a of attempts) if (a.clean) {
    const k = day(a.date);
    if (!by.has(k)) by.set(k, new Set());
    by.get(k)!.add(a.mode);
  }
  return [...by.entries()].filter(([, m]) => m.has('defend') && m.has('punish')).map(([k]) => k);
}

/** Maîtrisé : les deux exercices réussis sans indice, deux jours différents. */
export const isMastered = (attempts: TrapAttempt[]) => cleanDays(attempts).length >= 2;

export type TrapStatus = 'nouveau' | 'en cours' | 'maîtrisé';
export function trapStatus(p?: TrapProgress): TrapStatus {
  if (!p || !p.attempts.length) return 'nouveau';
  return p.masteredAt || isMastered(p.attempts) ? 'maîtrisé' : 'en cours';
}

// ---------------------------------------------------------------- dans mes vraies parties

export interface TrapFall { trapId: string; gameId: number; ply: number; date: number }

/** Parties où j'avais le trait au moment critique d'un piège (même position) et où j'ai joué le coup fautif. */
export function fallsInGames(games: Game[], traps: TrapDef[] = TRAPS): TrapFall[] {
  const crit = new Map<string, { t: TrapDef; p: TrapPositions }>();
  for (const t of traps) { const p = trapPositions(t); crit.set(fenKey(p.critical), { t, p }); }
  const out: TrapFall[] = [];
  for (const g of games) {
    if (g.id === undefined) continue;
    let c: Chess;
    try { c = new Chess(g.startFen); } catch { continue; }
    for (let i = 0; i < g.uci.length && i < 40; i++) {
      const hit = c.turn() === g.myColor ? crit.get(fenKey(c.fen())) : undefined;
      if (hit && hit.p.victim === g.myColor && g.uci[i] === hit.p.blunderUci) out.push({ trapId: hit.t.id, gameId: g.id, ply: i, date: g.date });
      const u = g.uci[i];
      try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch { break; }
    }
  }
  return out;
}
