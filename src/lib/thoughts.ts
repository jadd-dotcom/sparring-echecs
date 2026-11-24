// « Ce que je pensais » en un toucher : réponse rapide sur chaque erreur ou gaffe, avant de voir le meilleur coup.
export type ThoughtTag = 'menace' | 'calcul' | 'autre-cible' | 'trop-vite' | 'sais-pas';

export const THOUGHT_ORDER: ThoughtTag[] = ['menace', 'calcul', 'autre-cible', 'trop-vite', 'sais-pas'];

export const THOUGHT_LABEL: Record<ThoughtTag, string> = {
  menace: 'Je n’ai pas vu la menace',
  calcul: 'J’ai vu, mais mal calculé',
  'autre-cible': 'Je voulais attaquer autre chose',
  'trop-vite': 'J’ai joué trop vite',
  'sais-pas': 'Je ne sais pas',
};

/** Libellé court (colonnes du rapport). */
export const THOUGHT_SHORT: Record<ThoughtTag, string> = {
  menace: 'Menace pas vue',
  calcul: 'Mal calculé',
  'autre-cible': 'Autre cible',
  'trop-vite': 'Trop vite',
  'sais-pas': 'Ne sait pas',
};

export const isThoughtTag = (x: unknown): x is ThoughtTag => typeof x === 'string' && (THOUGHT_ORDER as string[]).includes(x);
