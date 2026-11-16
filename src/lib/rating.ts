// Niveau adaptatif — échelle de l'appli (type Lichess), bornes 550–2600.
// Au plancher (550), Maia joue à 600 (R + 50).
export const RATING_MIN = 550;
export const RATING_MAX = 2600;
export const RATING_START = 900;
export const BOT_OFFSET = 50;
export const CALIBRATION_GAMES = 10;
export const K_CALIBRATION = 80;
export const K_NORMAL = 32;

export type Score = 1 | 0.5 | 0;

export const clampRating = (r: number) => Math.min(RATING_MAX, Math.max(RATING_MIN, r));

/** Niveau auquel Maia joue : R + 50, borné. */
export const botRating = (r: number) => clampRating(r + BOT_OFFSET);

/** Score attendu du joueur (R) contre le bot (Rbot). */
export const expectedScore = (r: number, rBot: number) => 1 / (1 + Math.pow(10, (rBot - r) / 400));

/** K selon le nombre de parties jouées depuis le début de la calibration (avant celle-ci). */
export const kFactor = (gamesSinceCalibration: number) =>
  gamesSinceCalibration < CALIBRATION_GAMES ? K_CALIBRATION : K_NORMAL;

/** Nouveau niveau après une partie. */
export function updateRating(r: number, rBot: number, score: Score, gamesSinceCalibration: number): number {
  const e = expectedScore(r, rBot);
  return clampRating(r + kFactor(gamesSinceCalibration) * (score - e));
}
