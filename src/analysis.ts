import { Chess } from 'chess.js';
import { browserEngine, stockfish } from './engines/stockfish';
import { computeErrorDetail } from './lib/report/motifs';
import { classify, winPercent, type Eval } from './lib/winpct';
import { newCard, dayKey } from './lib/srs';
import { db, type Card, type Color, type EvalBarPoint, type Game, type MoveAnalysis, type PlyEval } from './db';
import { classifyMove, evalBar } from './lib/moveClass';

export const ANALYSIS_MS = 500;

/** Rejoue une partie et renvoie les FEN successives (fens[0] = départ). */
export function replay(startFen: string, uci: string[]) {
  const c = new Chess(startFen);
  const fens = [c.fen()];
  const san: string[] = [];
  for (const u of uci) {
    const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    san.push(m.san);
    fens.push(c.fen());
  }
  return { fens, san };
}

export function uciToSan(fen: string, u: string): string | null {
  try {
    return new Chess(fen).move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san;
  } catch { return null; }
}

/** Éval d'une position, du point de vue du camp au trait. */
export async function evaluate(fen: string, ms = ANALYSIS_MS): Promise<{ eval: Eval; bestMove: string | null }> {
  const c = new Chess(fen);
  if (c.isCheckmate()) return { eval: { mate: 0 }, bestMove: null };
  if (c.isDraw() || c.isStalemate()) return { eval: { cp: 0 }, bestMove: null };
  const r = await stockfish.analyse(fen, ms);
  return { eval: r.eval, bestMove: r.bestMove };
}

/** Évaluation de toutes les positions d'une partie (fens[0] = départ). */
async function evaluateAll(fens: string[], onProgress?: (done: number, total: number) => void) {
  const evals: { eval: Eval; bestMove: string | null }[] = [];
  stockfish.newGame();
  onProgress?.(0, fens.length);
  for (let i = 0; i < fens.length; i++) {
    evals.push(await evaluate(fens[i]));
    onProgress?.(i + 1, fens.length);
  }
  return evals;
}

/** Chaque coup (les deux camps) : % de gain du joueur avant/après, chute, classe ; et la barre d'évaluation. */
function pliesFrom(fens: string[], san: string[], uci: string[], evals: { eval: Eval; bestMove: string | null }[]) {
  const plies: PlyEval[] = uci.map((u, i) => {
    const before = evals[i];
    const after = evals[i + 1];
    const wpBefore = winPercent(before.eval);
    const wpAfter = 100 - winPercent(after.eval);
    const isBest = before.bestMove === u;
    const drop = isBest ? 0 : Math.max(0, wpBefore - wpAfter);
    return {
      ply: i, san: san[i], uci: u, bestUci: before.bestMove,
      bestSan: before.bestMove ? uciToSan(fens[i], before.bestMove) : null,
      wpBefore, wpAfter: isBest ? wpBefore : wpAfter, drop, cls: classifyMove({ isBest, drop }),
    };
  });
  const bars = fens.map((f, i) => evalBar(evals[i].eval, f.split(' ')[1] as Color));
  return { plies, bars };
}

/** Analyse complète : mes coups (erreurs, cartes, rapport) + classement de tous les coups + barre d'évaluation. */
export async function analyseMoves(
  startFen: string, uci: string[], myColor: Color,
  onProgress?: (done: number, total: number) => void,
): Promise<{ analysis: MoveAnalysis[]; plies: PlyEval[]; bars: EvalBarPoint[] }> {
  const { fens, san } = replay(startFen, uci);
  const evals = await evaluateAll(fens, onProgress);
  const { plies, bars } = pliesFrom(fens, san, uci, evals);
  const turnOf = (i: number) => fens[i].split(' ')[1] as Color;
  const analysis: MoveAnalysis[] = plies.filter((p) => turnOf(p.ply) === myColor).map((p) => ({
    ply: p.ply, san: p.san, uci: p.uci, bestUci: p.bestUci, bestSan: p.bestSan,
    wpBefore: p.wpBefore, wpAfter: p.wpAfter, drop: p.drop, severity: classify(p.drop),
  }));
  return { analysis, plies, bars };
}

/** Classement de tous les coups pour une partie déjà analysée avant cette version (cartes et erreurs inchangées). */
export async function analysePlies(gameId: number, onProgress?: (d: number, t: number) => void): Promise<Game> {
  const g = await db.games.get(gameId);
  if (!g) throw new Error('partie introuvable');
  const { fens, san } = replay(g.startFen, g.uci);
  const { plies, bars } = pliesFrom(fens, san, g.uci, await evaluateAll(fens, onProgress));
  await db.games.update(gameId, { plies, bars });
  return (await db.games.get(gameId))!;
}

export const isError = (a: MoveAnalysis) => a.severity === 'mistake' || a.severity === 'blunder';

/** Complète les erreurs/gaffes sans détail (suites Stockfish, motifs). */
export async function addErrorDetails(g: Pick<Game, 'startFen' | 'uci' | 'myColor'>, analysis: MoveAnalysis[], onProgress?: (d: number, t: number) => void) {
  const { fens } = replay(g.startFen, g.uci);
  const todo = analysis.filter((a) => isError(a) && !a.detail);
  let done = 0;
  for (const a of todo) {
    a.detail = await computeErrorDetail(browserEngine, fens[a.ply], a.uci, g.myColor, undefined, a.bestUci);
    onProgress?.(++done, todo.length);
  }
  return todo.length;
}

/** Analyse une partie enregistrée, met à jour la base et crée les cartes. */
export async function analyseGame(gameId: number, onProgress?: (d: number, t: number) => void): Promise<Game> {
  const g = await db.games.get(gameId);
  if (!g) throw new Error('partie introuvable');
  // Progression : positions analysées puis détails des erreurs (≈ 3 recherches chacune).
  let movesTotal = 1;
  const { analysis, plies, bars } = await analyseMoves(g.startFen, g.uci, g.myColor, (d, t) => { movesTotal = t; onProgress?.(d, t + 1); });
  await addErrorDetails(g, analysis, (d, t) => onProgress?.(movesTotal + d / t, movesTotal + 1));
  const counts = { inaccuracy: 0, mistake: 0, blunder: 0 };
  for (const a of analysis) if (a.severity !== 'ok') counts[a.severity]++;
  const { fens } = replay(g.startFen, g.uci);
  const today = dayKey();
  const cards: Card[] = analysis
    .filter((a) => (a.severity === 'mistake' || a.severity === 'blunder') && a.bestUci)
    .map((a) => ({
      gameId, source: g.source, fen: fens[a.ply], myColor: g.myColor,
      playedUci: a.uci, playedSan: a.san, bestUci: a.bestUci!, bestSan: a.bestSan ?? a.bestUci!,
      wpBefore: a.wpBefore, drop: a.drop, severity: a.severity,
      ...newCard(today), createdAt: Date.now(), attempts: [],
    }));
  await db.transaction('rw', db.games, db.cards, async () => {
    await db.games.update(gameId, { analysis, counts, plies, bars });
    await db.cards.where('gameId').equals(gameId).delete();
    if (cards.length) await db.cards.bulkAdd(cards);
  });
  return (await db.games.get(gameId))!;
}
