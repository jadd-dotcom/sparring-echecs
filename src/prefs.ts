// Préférences d'apparence : thème (Sombre par défaut / Clair / Auto) et jeu de pièces.
// Stockées dans la base (sauvegarde JSON) et recopiées dans localStorage pour appliquer le thème
// dès le chargement de la page (script dans index.html), sans flash.
import { useSyncExternalStore } from 'react';
import { db } from './db';

export type ThemePref = 'dark' | 'light' | 'auto';
export type PieceSet = 'relief' | 'merida' | 'maestro';

/** Jeux de pièces (crédits dans le README) : Relief, tiré de cburnett (scripts/make-relief.py) ; Merida et Maestro,
 *  repris du dépôt de Lichess (lila). Le jeu cburnett reste dans public/pieces/ comme source de Relief. */
export const PIECE_SETS: { id: PieceSet; name: string; author: string; license: string }[] = [
  { id: 'relief', name: 'Relief', author: 'd’après Colin M.L. Burnett', license: 'GPLv2+' },
  { id: 'merida', name: 'Merida', author: 'Armando Hernandez Marroquin', license: 'GPLv2+' },
  { id: 'maestro', name: 'Maestro', author: 'sadsnake1', license: 'CC BY-NC-SA 4.0' },
];

interface Prefs { theme: ThemePref; pieces: PieceSet }
let prefs: Prefs = { theme: 'dark', pieces: 'relief' };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());

const media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: light)') : null;

/** Thème effectivement affiché. */
export const resolvedTheme = (t: ThemePref): 'dark' | 'light' => (t === 'auto' ? (media?.matches ? 'light' : 'dark') : t);

function apply() {
  const t = resolvedTheme(prefs.theme);
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#1f2023' : '#eceae6');
  try { localStorage.setItem('theme', prefs.theme); } catch { /* navigation privée */ }
}
media?.addEventListener?.('change', () => { if (prefs.theme === 'auto') { apply(); emit(); } });

export async function loadPrefs() {
  const [t, p] = await Promise.all([db.meta.get('theme'), db.meta.get('pieces')]);
  let saved: string | null = null;
  try { saved = localStorage.getItem('theme'); } catch { /* navigation privée */ }
  const themes = ['dark', 'light', 'auto'] as const;
  const theme = themes.find((x) => x === t?.value) ?? themes.find((x) => x === saved) ?? 'dark';
  // Ancien réglage (Celtic, Cburnett) ou absent → Relief, le jeu par défaut.
  const pieces = PIECE_SETS.find((x) => x.id === p?.value)?.id ?? 'relief';
  prefs = { theme, pieces };
  apply();
  emit();
}

export async function setThemePref(theme: ThemePref) {
  prefs = { ...prefs, theme };
  apply();
  emit();
  await db.meta.put({ key: 'theme', value: theme });
}

export async function setPieceSet(pieces: PieceSet) {
  prefs = { ...prefs, pieces };
  emit();
  await db.meta.put({ key: 'pieces', value: pieces });
}

export function usePrefs(): Prefs {
  return useSyncExternalStore((f) => { listeners.add(f); return () => listeners.delete(f); }, () => prefs);
}

/** URL d'une pièce (ex. « wK ») du jeu choisi, servie avec l'appli (précachée pour le hors ligne). */
export const pieceUrl = (set: PieceSet, code: string) => `${import.meta.env.BASE_URL}pieces/${set}/${code}.svg`;
