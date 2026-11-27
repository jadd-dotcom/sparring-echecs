// Navigation : onglet de chaque écran (barre du bas) et écran parent (bouton Retour), jamais l'accueil d'office.
import type { Route } from './router';
import { TRAPS } from './data/traps';
import { MATE_LEVELS } from './lib/mates';
import { BUILTIN_OPENINGS } from './data/openings';

const openingName = (id: string) => BUILTIN_OPENINGS.find((o) => o.id === id)?.name ?? 'L’ouverture';

export type TabId = 'today' | 'jouer' | 'openings' | 'training' | 'progress';

export const TABS: { id: TabId; label: string; route: Route; hash: string }[] = [
  { id: 'today', label: 'Aujourd’hui', route: { name: 'home' }, hash: '#/' },
  { id: 'jouer', label: 'Jouer', route: { name: 'jouer' }, hash: '#/jouer' },
  { id: 'openings', label: 'Ouvertures', route: { name: 'openings' }, hash: '#/openings' },
  { id: 'training', label: 'Entraînement', route: { name: 'training' }, hash: '#/training' },
  { id: 'progress', label: 'Progrès', route: { name: 'progress' }, hash: '#/progress' },
];

export function tabOf(r: Route): TabId {
  switch (r.name) {
    case 'home': case 'settings': return 'today';
    case 'jouer': case 'play': return 'jouer';
    case 'openings': case 'lesson': case 'lines': case 'repertoire': case 'opening': case 'crossroads': return 'openings';
    case 'revise': return r.opening ? 'openings' : 'training';
    case 'progress': case 'stats': case 'report': case 'goal': case 'review': return 'progress';
    case 'comment': return r.id !== undefined ? 'jouer' : 'training';
    default: return 'training';
  }
}

/** Écran parent et son nom (pour « ‹ Parent ») ; null pour les racines des onglets. */
export function parentOf(r: Route): { route: Route; label: string } | null {
  const T = (id: TabId) => { const t = TABS.find((x) => x.id === id)!; return { route: t.route, label: t.label }; };
  switch (r.name) {
    case 'home': case 'jouer': case 'openings': case 'training': case 'progress': return null;
    case 'settings': return T('today');
    case 'play': return T('jouer');
    case 'comment': return r.id !== undefined ? T('jouer') : T('training');
    case 'review': return { route: { name: 'stats' }, label: 'Statistiques et parties' };
    case 'stats': case 'report': case 'goal': return T('progress');
    case 'revise': return r.opening ? { route: { name: 'opening', id: r.opening }, label: openingName(r.opening) } : T('training');
    case 'opening': return T('openings');
    case 'crossroads': return { route: { name: 'opening', id: r.id, tab: 'carrefours' }, label: openingName(r.id) };
    case 'lesson': return { route: { name: 'opening', id: r.id, tab: 'lecon' }, label: openingName(r.id) };
    case 'lines': return { route: { name: 'opening', id: r.id, tab: 'lignes' }, label: openingName(r.id) };
    case 'cards': return T('training');
    case 'repertoire': return { route: { name: 'opening', id: r.id }, label: openingName(r.id) };
    case 'mates': return r.level ? { route: { name: 'mates' }, label: 'Mats élémentaires' } : T('training');
    case 'traps': {
      if (!r.id) return T('training');
      if (!r.mode) return { route: { name: 'traps' }, label: 'Pièges d’ouverture' };
      return { route: { name: 'traps', id: r.id }, label: TRAPS.find((t) => t.id === r.id)?.name ?? 'Le piège' };
    }
    case 'board': return r.view && r.view !== 'warmup' ? { route: { name: 'board' }, label: 'Maîtrise de l’échiquier' } : T('training');
    default: return T('today');
  }
}

/** Nom d'un niveau de mats (fil d'Ariane). */
export const mateLevelName = (id?: string) => MATE_LEVELS.find((l) => l.id === id)?.name;
