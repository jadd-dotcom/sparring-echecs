// Mode « Maîtrise de l'échiquier » : chapitres, niveaux (exercices) et critères de maîtrise. Fonctions pures.

export type LevelKind = 'file' | 'rank' | 'find' | 'name' | 'color' | 'diag' | 'piece' | 'visu' | 'replay' | 'blind';
export type Side = 'w' | 'b';

/** Épreuve d'un niveau. */
export type TestSpec =
  | { type: 'timed'; seconds: number; minCorrect: number; maxErrors: number; passesNeeded: number }   // ch. 1-2
  | { type: 'count'; questions: number; minCorrect: number; maxMedianMs?: number }                     // ch. 3-6
  | { type: 'blind'; maxPeeks: number; minMovesIfResign: number }                                      // ch. 7
  | { type: 'none' };                                                                                   // entraînement seul

export interface Level {
  id: string;
  chapter: number;
  title: string;
  kind: LevelKind;
  side: Side;          // échiquier vu des Blancs ou des Noirs
  coords?: boolean;    // coordonnées affichées (1c)
  plies?: number;      // ch. 6 : longueur de la suite (demi-coups)
  test: TestSpec;
}

const T30: TestSpec = { type: 'timed', seconds: 30, minCorrect: 25, maxErrors: 1, passesNeeded: 3 };
const Q20: TestSpec = { type: 'count', questions: 20, minCorrect: 19, maxMedianMs: 3000 };
const Q10: TestSpec = { type: 'count', questions: 10, minCorrect: 9 };

export const LEVELS: Level[] = [
  { id: '1a', chapter: 1, title: 'Colonnes', kind: 'file', side: 'w', test: T30 },
  { id: '1b', chapter: 1, title: 'Rangées', kind: 'rank', side: 'w', test: T30 },
  { id: '1c', chapter: 1, title: 'Trouver une case (coordonnées affichées)', kind: 'find', side: 'w', coords: true, test: T30 },
  { id: '1d', chapter: 1, title: 'Trouver une case (coordonnées cachées)', kind: 'find', side: 'w', test: T30 },
  { id: '1e', chapter: 1, title: 'Nommer une case', kind: 'name', side: 'w', test: T30 },
  { id: '2c', chapter: 2, title: 'Trouver une case (coordonnées affichées)', kind: 'find', side: 'b', coords: true, test: T30 },
  { id: '2d', chapter: 2, title: 'Trouver une case (coordonnées cachées)', kind: 'find', side: 'b', test: T30 },
  { id: '2e', chapter: 2, title: 'Nommer une case', kind: 'name', side: 'b', test: T30 },
  { id: '3', chapter: 3, title: 'Couleur des cases', kind: 'color', side: 'w', test: Q20 },
  { id: '4', chapter: 4, title: 'Diagonales', kind: 'diag', side: 'w', test: Q20 },
  { id: '5', chapter: 5, title: 'Pièces', kind: 'piece', side: 'w', test: Q20 },
  { id: '6-2', chapter: 6, title: 'Visualisation : 2 demi-coups', kind: 'visu', side: 'w', plies: 2, test: Q10 },
  { id: '6-4', chapter: 6, title: 'Visualisation : 4 demi-coups', kind: 'visu', side: 'w', plies: 4, test: Q10 },
  { id: '6-6', chapter: 6, title: 'Visualisation : 6 demi-coups', kind: 'visu', side: 'w', plies: 6, test: Q10 },
  { id: '6-8', chapter: 6, title: 'Visualisation : 8 demi-coups', kind: 'visu', side: 'w', plies: 8, test: Q10 },
  { id: '7a', chapter: 7, title: 'Rejouer de tête des parties courtes', kind: 'replay', side: 'w', test: { type: 'none' } },
  { id: '7b', chapter: 7, title: 'Partie à l’aveugle contre Maia', kind: 'blind', side: 'w', test: { type: 'blind', maxPeeks: 3, minMovesIfResign: 20 } },
];

export const CHAPTERS: { n: number; title: string }[] = [
  { n: 1, title: 'Repères (vu des Blancs)' },
  { n: 2, title: 'Vu des Noirs' },
  { n: 3, title: 'Couleur des cases' },
  { n: 4, title: 'Diagonales' },
  { n: 5, title: 'Pièces' },
  { n: 6, title: 'Visualisation' },
  { n: 7, title: 'Aveugle' },
];

export const levelsOf = (chapter: number) => LEVELS.filter((l) => l.chapter === chapter);
export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
/** Niveaux qui comptent pour valider un chapitre (7a est un entraînement). */
export const gradedLevels = (chapter: number) => levelsOf(chapter).filter((l) => l.test.type !== 'none');

// ---------------------------------------------------------------- résultats d'épreuve

export interface TimedResult { correct: number; errors: number }
export interface CountResult { correct: number; total: number; timesMs: number[] }
export interface BlindResult { finished: boolean; reason: 'mate' | 'draw' | 'resign'; myMoves: number; peeks: number }
export interface ReplayResult { errors: number; peeks: number }

/** Révision du chapitre 7 : rejouer de tête une partie courte avec au plus 2 erreurs et 1 coup d'œil. */
export const REPLAY_REVIEW = { maxErrors: 2, maxPeeks: 1 };
export const replayPassed = (r: ReplayResult) => r.errors <= REPLAY_REVIEW.maxErrors && r.peeks <= REPLAY_REVIEW.maxPeeks;

export function median(xs: number[]): number {
  if (!xs.length) return Infinity;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Une épreuve est-elle réussie ? (ch. 1-2 : une réussite ; il en faut `passesNeeded` pour valider le niveau.) */
export function testPassed(spec: TestSpec, r: TimedResult | CountResult | BlindResult): boolean {
  switch (spec.type) {
    case 'timed': { const x = r as TimedResult; return x.correct >= spec.minCorrect && x.errors <= spec.maxErrors; }
    case 'count': {
      const x = r as CountResult;
      return x.total >= spec.questions && x.correct >= spec.minCorrect && (spec.maxMedianMs === undefined || median(x.timesMs) <= spec.maxMedianMs);
    }
    case 'blind': {
      const x = r as BlindResult;
      const ended = x.reason !== 'resign' || x.myMoves >= spec.minMovesIfResign;
      return x.finished && ended && x.peeks <= spec.maxPeeks;
    }
    default: return false;
  }
}

/** Réussites nécessaires pour valider un niveau. */
export const passesNeeded = (spec: TestSpec) => (spec.type === 'timed' ? spec.passesNeeded : spec.type === 'none' ? 0 : 1);

// ---------------------------------------------------------------- progression et révisions

export interface LevelProgress { passes: number; attempts: number; validated: boolean; best?: string; bestScore?: number; lastTest?: number }
export interface ChapterReview { validatedAt: number; step: number; due: string; toReview: boolean; lastLevel?: string }
export interface BoardProgress { levels: Record<string, LevelProgress>; chapters: Record<number, ChapterReview> }

export const emptyProgress = (): BoardProgress => ({ levels: {}, chapters: {} });

/** Intervalles de révision d'un chapitre validé : J+1, J+3, J+7, puis tous les 7 jours. */
export const REVIEW_DAYS = [1, 3, 7];
export const reviewInterval = (step: number) => REVIEW_DAYS[Math.min(step, REVIEW_DAYS.length - 1)];

export function addDaysKey(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const t = new Date(y, m - 1, d + n);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

export const chapterValidated = (p: BoardProgress, chapter: number) =>
  gradedLevels(chapter).every((l) => p.levels[l.id]?.validated);

/** Chapitre débloqué : le 1er, puis chacun après validation du précédent. */
export const chapterUnlocked = (p: BoardProgress, chapter: number) => chapter === 1 || chapterValidated(p, chapter - 1);

/** Niveau débloqué : chapitre débloqué et niveaux précédents du chapitre validés (7a reste ouvert avec le chapitre 7). */
export function levelUnlocked(p: BoardProgress, id: string): boolean {
  const l = levelById(id);
  if (!l || !chapterUnlocked(p, l.chapter)) return false;
  const before = levelsOf(l.chapter).filter((x) => LEVELS.indexOf(x) < LEVELS.indexOf(l) && x.test.type !== 'none');
  return before.every((x) => p.levels[x.id]?.validated);
}

/**
 * Enregistre une épreuve passée hors révision. Renvoie la nouvelle progression (copie).
 * Un niveau est validé après `passesNeeded` réussites ; un chapitre validé entre en révision (J+1).
 */
export function recordTest(p0: BoardProgress, levelId: string, passed: boolean, scoreText: string, score: number, today: string, now = Date.now()): BoardProgress {
  const p: BoardProgress = structuredClone(p0);
  const l = levelById(levelId)!;
  const lp = p.levels[levelId] ?? { passes: 0, attempts: 0, validated: false };
  lp.attempts++;
  lp.lastTest = now;
  if (passed) lp.passes++;
  if (lp.bestScore === undefined || score > lp.bestScore) { lp.bestScore = score; lp.best = scoreText; }
  // Un niveau verrouillé (ordre des chapitres) ne peut pas être validé.
  if (!lp.validated && lp.passes >= passesNeeded(l.test) && levelUnlocked(p0, levelId)) lp.validated = true;
  p.levels[levelId] = lp;
  if (chapterValidated(p, l.chapter) && !p.chapters[l.chapter]) {
    p.chapters[l.chapter] = { validatedAt: now, step: 0, due: addDaysKey(today, reviewInterval(0)), toReview: false };
  }
  return p;
}

/**
 * Résultat d'une révision de chapitre : réussie → intervalle suivant (J+1, J+3, J+7, puis +7) ;
 * ratée → chapitre « à revoir », de nouveau dû le lendemain jusqu'à réussite (puis on repart de J+1).
 */
export function recordReview(p0: BoardProgress, chapter: number, levelId: string, passed: boolean, today: string): BoardProgress {
  const p: BoardProgress = structuredClone(p0);
  const r = p.chapters[chapter];
  if (!r) return p;
  r.lastLevel = levelId;
  if (passed) {
    const step = r.toReview ? 0 : r.step + 1;
    r.step = step;
    r.toReview = false;
    r.due = addDaysKey(today, reviewInterval(step));
  } else {
    r.toReview = true;
    r.step = 0;
    r.due = addDaysKey(today, 1);
  }
  return p;
}

/** Chapitres à réviser aujourd'hui (« à revoir » d'abord, puis par date). */
export function dueChapters(p: BoardProgress, today: string): number[] {
  return Object.entries(p.chapters)
    .filter(([, r]) => r.toReview || r.due <= today)
    .sort(([, a], [, b]) => Number(b.toReview) - Number(a.toReview) || a.due.localeCompare(b.due))
    .map(([c]) => Number(c));
}

/** Niveau testé pour réviser un chapitre : à tour de rôle parmi ses niveaux notés (chapitre 7 : rejouer une partie courte). */
export function reviewLevel(p: BoardProgress, chapter: number): string {
  if (chapter === 7) return '7a';
  const ls = gradedLevels(chapter).map((l) => l.id);
  const last = p.chapters[chapter]?.lastLevel;
  const i = last ? ls.indexOf(last) : -1;
  return ls[(i + 1) % ls.length];
}

/** Consigne d'épreuve d'un niveau, en clair. */
export function testRule(l: Level): string {
  const t = l.test;
  if (t.type === 'timed') return `Épreuve : ${t.seconds} s, au moins ${t.minCorrect} bonnes réponses et au plus ${t.maxErrors} erreur ; à réussir ${t.passesNeeded} fois.`;
  if (t.type === 'count') return `Épreuve : ${t.questions} questions, au moins ${t.minCorrect} justes${t.maxMedianMs ? `, temps médian ≤ ${t.maxMedianMs / 1000} s par question (par case pour les réponses à plusieurs cases)` : ''}.`;
  if (t.type === 'blind') return `Épreuve : finir une partie à l’aveugle avec au plus ${t.maxPeeks} coups d’œil (un abandon ne compte qu’après ${t.minMovesIfResign} coups joués).`;
  return 'Entraînement libre.';
}

