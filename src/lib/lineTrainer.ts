// « Jouer les lignes » : une partie = une ligne du répertoire (une feuille de l'arbre), dans la couleur de l'ouverture.
// L'adversaire joue exactement les coups de la ligne ; je dois jouer le coup du répertoire (un autre coup du répertoire
// à cet endroit est accepté : on bascule sur la ligne correspondante) ; un coup hors répertoire est refusé.
// Fonctions pures : ordre et choix des lignes, vérification d'un coup, bascule, refus, progression.
import { Chess } from 'chess.js';
import { fenKey, lines, type Color, type RepNode } from './repertoire';
import type { OpeningLesson } from '../data/openingLessons';

export type Line = string[];   // coups SAN depuis la position initiale

/** `attempts` : chaque ligne jouée jusqu'au bout (sans erreur ? solutions montrées), pour mesurer la réussite sans aide. */
export interface LineStat { status: 'ok' | 'redo'; plays: number; lastAt: number; attempts?: { date: number; ok: boolean; hints: number }[] }
export interface LineError { line: string; ply: number; expected: string; played: string; date: number }
/** Progression d'une ouverture : tour en cours (statut de chaque ligne) et erreurs. */
export interface LineProgress { round: number; lines: Record<string, LineStat>; errors: LineError[] }

export const emptyProgress = (): LineProgress => ({ round: 1, lines: {}, errors: [] });
export const lineKey = (l: Line) => l.join(' ');

/** Position (FEN) après les `n` premiers coups d'une ligne. */
export function fenAfter(l: Line, n: number): string {
  const c = new Chess();
  for (const s of l.slice(0, n)) c.move(s);
  return c.fen();
}

const isPrefix = (a: Line, b: Line) => a.length <= b.length && a.every((s, i) => b[i] === s);

/**
 * Les lignes dans l'ordre de la leçon : la ligne principale, puis celles des blocs supplémentaires (dans leur ordre),
 * puis les autres dans l'ordre de l'arbre.
 */
export function orderedLines(root: RepNode, lesson?: OpeningLesson): Line[] {
  const all = lines(root);
  const out: Line[] = [];
  const add = (l: Line) => { if (!out.includes(l)) out.push(l); };
  if (all.length) add(all[0]);
  for (const x of lesson?.extras ?? []) {
    for (const ln of x.lines) {
      const path = [...ln.start, ...ln.moves.map((m) => m.san)];
      for (const l of all) if (isPrefix(path, l) || isPrefix(l, path)) add(l);
    }
  }
  for (const l of all) add(l);
  return out;
}

/** Nombre de lignes validées (✓) dans le tour en cours. */
export function validatedCount(ordered: Line[], p: LineProgress): number {
  return ordered.filter((l) => p.lines[lineKey(l)]?.status === 'ok').length;
}

/**
 * Ligne à jouer : d'abord les lignes « à refaire », puis les lignes jamais jouées (dans le tour), dans l'ordre de la
 * leçon. Quand toutes ont le ✓, un nouveau tour commence (`newRound`) par la première.
 */
export function pickLine(ordered: Line[], p: LineProgress): { index: number; newRound: boolean } {
  const st = (l: Line) => p.lines[lineKey(l)]?.status;
  const redo = ordered.findIndex((l) => st(l) === 'redo');
  if (redo >= 0) return { index: redo, newRound: false };
  const fresh = ordered.findIndex((l) => !st(l));
  if (fresh >= 0) return { index: fresh, newRound: false };
  return { index: 0, newRound: ordered.length > 0 };
}

/** Nouveau tour : tous les statuts sont remis à zéro (les erreurs restent dans l'historique). */
export const startRound = (p: LineProgress): LineProgress => ({ ...p, round: p.round + 1, lines: {} });

/** Mes coups dans une ligne : (numéro de mon coup en cours, nombre total). */
export function myMoveCount(l: Line, ply: number, me: Color): { current: number; total: number } {
  const mine = (i: number) => (i % 2 === 0) === (me === 'w');
  let current = 0, total = 0;
  l.forEach((_, i) => { if (mine(i)) { total++; if (i <= ply) current++; } });
  return { current: Math.min(Math.max(current, 1), total), total };
}

export type MoveCheck =
  | { kind: 'ok' }
  | { kind: 'switch'; line: Line; ply: number }
  | { kind: 'refused'; expected: string };

/**
 * Mon coup `san` dans la position atteinte (`fen`), alors que la ligne en cours attend `line[ply]`.
 * Un autre coup du répertoire est accepté : on bascule sur une ligne qui le contient depuis la même position
 * (même début de partie d'abord, puis par transposition ; en priorité les lignes « à refaire », puis jamais jouées).
 */
export function checkMove(ordered: Line[], p: LineProgress, line: Line, ply: number, fen: string, san: string): MoveCheck {
  if (line[ply] === san) return { kind: 'ok' };
  const key = fenKey(fen);
  const rank = (l: Line) => {
    const s = p.lines[lineKey(l)]?.status;
    return s === 'redo' ? 0 : !s ? 1 : 2;
  };
  const candidates: { line: Line; ply: number; score: number }[] = [];
  ordered.forEach((l, order) => {
    if (l === line) return;
    if (isPrefix(line.slice(0, ply), l) && l[ply] === san) { candidates.push({ line: l, ply: ply + 1, score: rank(l) * 1000 + order }); return; }
    const c = new Chess();
    for (let j = 0; j < l.length; j++) {
      if (j % 2 === ply % 2 && fenKey(c.fen()) === key && l[j] === san) { candidates.push({ line: l, ply: j + 1, score: 100000 + rank(l) * 1000 + order }); return; }
      c.move(l[j]);
    }
  });
  if (!candidates.length) return { kind: 'refused', expected: line[ply] };
  candidates.sort((a, b) => a.score - b.score);
  return { kind: 'switch', line: candidates[0].line, ply: candidates[0].ply };
}

/** Après un refus : 1er refus → réessaie ; 2e refus (et suivants) → on montre le bon coup. */
export const refusalStep = (refusals: number): 'retry' | 'solution' => (refusals >= 2 ? 'solution' : 'retry');

/** Enregistre une erreur : la ligne est « à refaire ». */
export function withError(p: LineProgress, l: Line, ply: number, played: string, date = Date.now()): LineProgress {
  const k = lineKey(l);
  const prev = p.lines[k];
  return {
    ...p,
    lines: { ...p.lines, [k]: { ...prev, status: 'redo', plays: prev?.plays ?? 0, lastAt: date } },
    errors: [...p.errors, { line: k, ply, expected: l[ply], played, date }],
  };
}

/** Fin de ligne : ✓ si aucune erreur pendant cette ligne, sinon « à refaire ». */
export function withLineDone(p: LineProgress, l: Line, clean: boolean, date = Date.now(), hints = 0): LineProgress {
  const k = lineKey(l);
  const prev = p.lines[k];
  const attempts = [...(prev?.attempts ?? []), { date, ok: clean, hints }];
  return { ...p, lines: { ...p.lines, [k]: { status: clean ? 'ok' : 'redo', plays: (prev?.plays ?? 0) + 1, lastAt: date, attempts } } };
}

/** Index position + coup → « pourquoi » d'une leçon, calculé une seule fois par leçon (les séquences ne changent pas). */
const whyIndex = new WeakMap<OpeningLesson, Map<string, string>>();
function indexOf(lesson: OpeningLesson): Map<string, string> {
  let idx = whyIndex.get(lesson);
  if (idx) return idx;
  idx = new Map();
  const seqs: { sans: string[]; whys: (string | null)[] }[] = [
    { sans: lesson.moves.map((m) => m.san), whys: lesson.moves.map((m) => m.why) },
    ...(lesson.extras ?? []).flatMap((x) => x.lines.map((ln) => ({
      sans: [...ln.start, ...ln.moves.map((m) => m.san)],
      whys: [...ln.start.map(() => null), ...ln.moves.map((m) => m.why)],
    }))),
  ];
  // Même règle qu'avant : la première séquence qui explique ce coup dans cette position l'emporte.
  for (const s of seqs) {
    const c = new Chess();
    for (let i = 0; i < s.sans.length; i++) {
      const k = fenKey(c.fen()) + ' ' + s.sans[i];
      if (s.whys[i] && !idx.has(k)) idx.set(k, s.whys[i]!);
      c.move(s.sans[i]);
    }
  }
  whyIndex.set(lesson, idx);
  return idx;
}

/** Phrase de la leçon pour un coup (ligne principale ou blocs supplémentaires), sinon null. */
export function lessonWhy(lesson: OpeningLesson | undefined, fenBefore: string, san: string): string | null {
  if (!lesson) return null;
  return indexOf(lesson).get(fenKey(fenBefore) + ' ' + san) ?? null;
}

/** Le plan à montrer en fin de ligne : la phrase de plan de cette ligne (blocs par carrefour) puis celui de la leçon,
 * et le bloc supplémentaire qui couvre cette ligne s'il y en a un. */
export function linePlan(lesson: OpeningLesson | undefined, l: Line): { block?: { title: string; intro: string }; plan: string[] } | null {
  if (!lesson) return null;
  // La ligne la plus proche : celle qui suit le plus loin les mêmes coups.
  let best: { x: NonNullable<OpeningLesson['extras']>[number]; ln: NonNullable<OpeningLesson['extras']>[number]['lines'][number]; n: number } | null = null;
  for (const x of lesson.extras ?? []) {
    for (const ln of x.lines) {
      const path = [...ln.start, ...ln.moves.map((m) => m.san)];
      if ((isPrefix(path, l) || isPrefix(l, path)) && (!best || Math.min(path.length, l.length) > best.n)) best = { x, ln, n: Math.min(path.length, l.length) };
    }
  }
  if (best) return { block: { title: best.x.title, intro: best.x.intro }, plan: best.ln.plan ? [best.ln.plan, ...lesson.plan] : [...lesson.plan] };
  return { plan: [...lesson.plan] };
}
