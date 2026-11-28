// Mode Carrefours (fonctions pures) : file des cartes (échues d'abord, puis nouvelles), choix de la Q1 « Sur quelle
// ligne es-tu ? », coups acceptés à la Q2 (mes coups du répertoire à cette position), répétition espacée.
import type { RepNode } from './repertoire';
import type { OpeningLesson } from '../data/openingLessons';
import { moveLabel, type SignpostCard } from './crossroads';
import { dayKey, schedule } from './srs';

/** `hints` : indices utilisés ; `retry` : « Refaire » le même jour (enregistré, sans effet sur la répétition espacée). */
export interface CrossCardState { step: number; due: string; attempts: { date: number; ok: boolean; hints?: number; retry?: boolean }[] }
export type CrossProgress = Record<string, CrossCardState>;

export const NEW_CROSS_PER_SESSION = 8;

/** Cartes du jour : échues (les plus anciennes d'abord), puis nouvelles dans l'ordre de l'arbre (au plus 8). */
export function crossQueue(cards: SignpostCard[], p: CrossProgress, today: string, newMax = NEW_CROSS_PER_SESSION): SignpostCard[] {
  const due = cards.filter((c) => p[c.id] && p[c.id].due <= today).sort((a, b) => p[a.id].due.localeCompare(p[b.id].due));
  const fresh = cards.filter((c) => !p[c.id]).slice(0, newMax);
  return [...due, ...fresh];
}

const isPrefix = (a: string[], b: string[]) => a.length <= b.length && a.every((m, i) => m === b[i]);

/** Nom d'une branche du carrefour : celui de la leçon (ligne principale ou ligne d'un bloc), sinon son coup-panneau. */
export function branchName(path: string[], his: string, lesson: OpeningLesson | undefined): string {
  const pre = [...path, his];
  const main = lesson?.moves.map((m) => m.san) ?? [];
  if (main.length && isPrefix(pre, main)) return 'Ligne principale';
  for (const x of lesson?.extras ?? []) {
    for (const ln of x.lines) {
      const full = [...ln.start, ...ln.moves.map((m) => m.san)];
      if (isPrefix(pre, full)) return ln.name;
    }
  }
  return moveLabel(path.length, his);
}

/** Choix de la Q1 : une entrée par branche du carrefour (noms distincts : à défaut, le coup-panneau). */
export function lineChoices(card: SignpostCard, lesson: OpeningLesson | undefined): { his: string; name: string }[] {
  const raw = card.crossroad.branches.map((b) => ({ his: b.his, name: branchName(card.crossroad.path, b.his, lesson) }));
  const dup = new Set(raw.map((r) => r.name).filter((n, i, a) => a.indexOf(n) !== i));
  return raw.map((r) => (dup.has(r.name) ? { ...r, name: moveLabel(card.ply, r.his) } : r));
}

/** Mes coups du répertoire après son coup-panneau (tous acceptés à la Q2). */
export function acceptedReplies(root: RepNode, card: SignpostCard): string[] {
  let n: RepNode | undefined = root;
  for (const m of [...card.crossroad.path, card.his]) n = n?.children.find((c) => c.san === m);
  return n ? n.children.map((c) => c.san) : [];
}

/** Réussie (Q1 juste, Q2 du premier coup, sans indice) : la carte avance ; sinon elle revient demain. */
export function afterAnswer(prev: CrossCardState | undefined, ok: boolean, today: string, now = Date.now(), hints = 0): CrossCardState {
  const attempts = prev?.attempts ?? [];
  // Seule la 1re réponse du jour compte : une réponse refaite le même jour est notée, la carte n'avance pas.
  if (prev && attempts.some((a) => dayKey(new Date(a.date)) === today)) {
    return { ...prev, attempts: [...attempts, { date: now, ok, hints, retry: true }] };
  }
  const s = schedule({ step: prev?.step ?? 0, due: prev?.due ?? today }, ok, today);
  return { ...s, attempts: [...attempts, { date: now, ok, hints }] };
}
