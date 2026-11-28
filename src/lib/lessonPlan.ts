// Sommaire d'une leçon d'ouverture : blocs de la ligne principale, « Le plan », « La partie type », puis les lignes
// supplémentaires ; statut de chaque entrée (✓ / en cours / pas commencé), reprise (bloc + étape + coup), compteurs de
// la boucle (répétitions, erreurs). Fonctions pures.
import { lessonBlocks, type OpeningLesson } from '../data/openingLessons';

export type EntryKind = 'main' | 'plan' | 'model' | 'extra';
export interface LessonEntry {
  key: string;                 // main:0 · plan · model · extra:<id>:<j>
  kind: EntryKind;
  title: string;
  /** Groupe (titre du bloc supplémentaire). */
  group?: string;
  /** Blocs à rejouer : suite complète, demi-coups montrés [s, e). */
  seq?: string[];
  s?: number;
  e?: number;
}

/** `clean` : rejeux sans aucune erreur (compté depuis le brief de clôture) ; `errors` : erreurs cumulées de tous les rejeux. */
export interface BlockState { watched?: number; replays?: number; errors?: number; loops?: number; clean?: number }
export type Stage = 'watch' | 'replay' | 'loop' | 'plan' | 'model';
export interface LessonState { blocks: Record<string, BlockState>; resume?: { key: string; stage: Stage; k: number; at: number } }
export const emptyLessonState = (): LessonState => ({ blocks: {} });

const num = (ply: number) => Math.floor(ply / 2) + 1;

export function lessonEntries(l: OpeningLesson): LessonEntry[] {
  const sans = l.moves.map((m) => m.san);
  const out: LessonEntry[] = lessonBlocks(sans.length).map(([s, e], i) => ({
    key: `main:${i}`, kind: 'main', title: `Bloc ${i + 1} · coups ${num(s)} à ${num(e - 1)}`, seq: sans, s, e,
  }));
  out.push({ key: 'plan', kind: 'plan', title: 'Le plan' }, { key: 'model', kind: 'model', title: 'La partie type' });
  for (const x of l.extras ?? []) {
    x.lines.forEach((ln, j) => out.push({
      key: `extra:${x.id}:${j}`, kind: 'extra', group: x.title, title: ln.name,
      seq: [...ln.start, ...ln.moves.map((m) => m.san)], s: ln.start.length, e: ln.start.length + ln.moves.length,
    }));
  }
  return out;
}

export type EntryStatus = 'done' | 'review' | 'started' | 'new';

/**
 * Au moins un rejeu sans erreur ? `clean` si enregistré ; sinon recalcul depuis les compteurs : chaque rejeu raté compte au
 * moins une erreur, donc plus de rejeux que d'erreurs ⇒ au moins un rejeu propre. Sans compteur d'erreurs (ancienne
 * progression) : on garde l'état tel quel (fait).
 */
export function hasCleanReplay(b: BlockState): boolean | null {
  if ((b.clean ?? 0) > 0) return true;
  const replays = b.replays ?? 0;
  if (replays === 0) return false;
  if (b.errors === undefined) return null;
  return replays > b.errors;
}

/** ✓ : bloc rejoué sans erreur (plan / partie type : vus) ; à revoir : rejoué avec erreurs ; en cours : regardé ou commencé. */
export function entryStatus(e: LessonEntry, st: LessonState): EntryStatus {
  const b = st.blocks[e.key];
  if (!b) return st.resume?.key === e.key ? 'started' : 'new';
  if (e.kind === 'plan' || e.kind === 'model') return b.watched ? 'done' : 'started';
  if ((b.replays ?? 0) === 0) return 'started';
  return hasCleanReplay(b) === false ? 'review' : 'done';
}

export const STATUS_LABEL: Record<EntryStatus, string> = { done: 'fait', review: 'à revoir', started: 'en cours', new: 'pas commencé' };

export function lessonCounts(entries: LessonEntry[], st: LessonState): { done: number; total: number } {
  return { done: entries.filter((e) => entryStatus(e, st) === 'done').length, total: entries.length };
}

/** Met à jour un bloc (regardé, rejoué, erreur, tour de boucle). */
export function withBlock(st: LessonState, key: string, patch: (b: BlockState) => BlockState): LessonState {
  return { ...st, blocks: { ...st.blocks, [key]: patch(st.blocks[key] ?? {}) } };
}

/** Entrée suivante du sommaire (pour « Bloc suivant »). */
export function nextEntry(entries: LessonEntry[], key: string): LessonEntry | null {
  const i = entries.findIndex((e) => e.key === key);
  return i >= 0 && i + 1 < entries.length ? entries[i + 1] : null;
}
