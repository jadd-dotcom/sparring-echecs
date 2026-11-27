// Carrefours : progression des cartes « coup-panneau » d'une ouverture (IndexedDB, clé `crossroads:<id>`) ; une carte
// est maîtrisée quand sa répétition espacée a avancé (au moins 2 réussites d'affilée).
import { db, type Opening } from './db';
import { treeOf } from './openings';
import { signpostCards } from './lib/crossroads';

export interface CrossCardState { step: number; due: string; attempts: { date: number; ok: boolean }[] }
export type CrossProgress = Record<string, CrossCardState>;

const key = (id: string) => `crossroads:${id}`;
export async function getCrossProgress(id: string): Promise<CrossProgress> {
  return ((await db.meta.get(key(id)))?.value as CrossProgress | undefined) ?? {};
}
export const saveCrossProgress = (id: string, p: CrossProgress) => db.meta.put({ key: key(id), value: p });

export const CROSS_MASTERED_STEP = 2;

export async function crossroadCounts(o: Opening): Promise<{ done: number; total: number }> {
  const cards = signpostCards(treeOf(o), o.color);
  const p = await getCrossProgress(o.id);
  return { done: cards.filter((c) => (p[c.id]?.step ?? 0) >= CROSS_MASTERED_STEP).length, total: cards.length };
}
