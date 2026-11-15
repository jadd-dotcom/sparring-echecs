// Mats élémentaires côté appli : préparation d'un exercice (Stockfish), défense, progression, cartes.
import { Chess } from 'chess.js';
import { stockfish } from './engines/stockfish';
import { db, type Card, type MateRun } from './db';
import {
  generatePosition, levelProgress, MATE_LEVELS, mulberry32, unlockedLevels, type MateLevel, type MateLevelId,
} from './lib/mates';
import { dayKey, newCard } from './lib/srs';

export const DEFENSE_MS = 500;

/** Mat en N (pour moi) depuis la position : plus court mat trouvé par deux recherches Stockfish. */
export async function mateDistance(fen: string): Promise<number | null> {
  const found: number[] = [];
  const a = await stockfish.go(fen, 'mate 30');
  if ('mate' in a.eval && a.eval.mate > 0) found.push(a.eval.mate);
  const b = await stockfish.go(fen, 'movetime 2500');
  if ('mate' in b.eval && b.eval.mate > 0) found.push(b.eval.mate);
  return found.length ? Math.min(...found) : null;
}

/** Nouvelle position d'exercice (roi adverse plutôt au centre, pas de mat en ≤ 2). */
export async function prepareExercise(level: MateLevel, seed = Math.floor(Math.random() * 2 ** 31)) {
  const rand = mulberry32(seed);
  for (let i = 0; i < 6; i++) {
    const fen = generatePosition(level, rand);
    const min = await mateDistance(fen);
    if (min !== null && min > 2) return { fen, minMoves: min };
  }
  throw new Error('impossible de préparer un exercice');
}

/** Coup du roi seul : Stockfish en défense maximale (il retarde le mat le plus possible). */
export async function defenderMove(fen: string): Promise<string> {
  const r = await stockfish.analyse(fen, DEFENSE_MS);
  if (r.bestMove) return r.bestMove;
  return new Chess(fen).moves({ verbose: true }).map((m) => m.from + m.to)[0];
}

export interface LevelState { level: MateLevel; unlocked: boolean; validated: boolean; streak: number; runs: number; wins: number }

export async function levelStates(): Promise<LevelState[]> {
  const runs = await db.mateRuns.orderBy('date').toArray();
  const byLevel = new Map<MateLevelId, MateRun[]>();
  for (const r of runs) if (!r.review) byLevel.set(r.level, [...(byLevel.get(r.level) ?? []), r]);
  const progress = new Map(MATE_LEVELS.map((l) => [l.id, levelProgress(byLevel.get(l.id) ?? [])]));
  const validated = new Set(MATE_LEVELS.filter((l) => progress.get(l.id)!.validated).map((l) => l.id));
  const unlocked = unlockedLevels(validated);
  return MATE_LEVELS.map((level) => {
    const rs = byLevel.get(level.id) ?? [];
    return {
      level, unlocked: unlocked.has(level.id), validated: validated.has(level.id),
      streak: progress.get(level.id)!.streak, runs: rs.length, wins: rs.filter((r) => r.outcome === 'mate').length,
    };
  });
}

/** Position ratée → carte du paquet de révision (une seule carte par position). */
export async function addFailedCard(run: MateRun) {
  const existing = await db.cards.filter((c) => c.kind === 'mate' && c.fen === run.fen).first();
  if (existing) return;
  const card: Card = {
    kind: 'mate', gameId: 0, source: 'app', fen: run.fen, myColor: 'w', playedUci: '', playedSan: '',
    bestUci: '', bestSan: 'mat', wpBefore: 0, drop: 0, severity: 'ok', ...newCard(dayKey()), createdAt: Date.now(),
    attempts: [], mateLevel: run.level, minMoves: run.minMoves,
  };
  await db.cards.add(card);
}
