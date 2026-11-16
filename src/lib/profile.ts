// Profil du joueur : couleur des parties libres, calibration, niveau réglé à la main.
import { CALIBRATION_GAMES, RATING_MAX, RATING_MIN } from './rating';

export type Color = 'w' | 'b';
export type ColorMode = Color | 'alternate';

export interface ProfileData {
  rating: number;
  gamesPlayed: number;
  /** Couleur de la prochaine partie libre en mode « Alterner ». */
  nextColor: Color;
  /** Réglage « Ma couleur » (défaut : alterner). */
  colorMode?: ColorMode;
  /** Nombre de parties jouées au début de la calibration en cours (défaut 0). */
  calibrationStart?: number;
}

export const colorModeOf = (p: ProfileData): ColorMode => p.colorMode ?? 'alternate';

/** Couleur d'une nouvelle partie libre. */
export const colorForNewGame = (p: ProfileData): Color => {
  const m = colorModeOf(p);
  return m === 'alternate' ? p.nextColor : m;
};

/** Couleur suivante après une partie (terminée, abandonnée ou nulle) : l'inverse de celle jouée. Partie à thème : inchangée. */
export const nextColorAfter = (p: ProfileData, played: Color, themed = false): Color =>
  themed ? p.nextColor : played === 'w' ? 'b' : 'w';

/** Parties jouées depuis le début de la calibration en cours. */
export const gamesSinceCalibration = (p: ProfileData) => p.gamesPlayed - (p.calibrationStart ?? 0);
export const inCalibration = (p: ProfileData) => gamesSinceCalibration(p) < CALIBRATION_GAMES;

export const clampManualRating = (r: number) => Math.min(RATING_MAX, Math.max(RATING_MIN, Math.round(r)));

/** Niveau saisi à la main : borné à 550–2600, et retour en calibration (K = 80 pour les 10 parties suivantes). */
export function withManualRating<P extends ProfileData>(p: P, rating: number): P {
  return { ...p, rating: clampManualRating(rating), calibrationStart: p.gamesPlayed };
}
