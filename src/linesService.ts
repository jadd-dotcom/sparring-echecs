// « Jouer les lignes » : progression par ouverture (IndexedDB, clé meta « lineProgress ») et suite de la partie
// contre Maia (partie non comptée, à partir de la position de la ligne).
import { db, getCurrent, getProfile, setCurrent, type CurrentGame } from './db';
import { botRating } from './lib/rating';
import { emptyProgress, type LineProgress } from './lib/lineTrainer';
import { START_FEN } from './game';

const KEY = 'lineProgress';

export async function getAllLineProgress(): Promise<Record<string, LineProgress>> {
  return ((await db.meta.get(KEY))?.value as Record<string, LineProgress> | undefined) ?? {};
}

export async function getLineProgress(openingId: string): Promise<LineProgress> {
  return (await getAllLineProgress())[openingId] ?? emptyProgress();
}

export async function saveLineProgress(openingId: string, p: LineProgress) {
  const all = await getAllLineProgress();
  await db.meta.put({ key: KEY, value: { ...all, [openingId]: p } });
}

/**
 * « Continuer la partie » : Maia à mon niveau (R + 50, comme d'habitude) reprend depuis la position de la ligne.
 * Partie non comptée : sans effet sur le niveau, mais enregistrée et analysée comme les autres.
 * Refusé si une partie est déjà en cours (on ne l'écrase jamais).
 */
export async function continueAsGame(openingId: string, myColor: 'w' | 'b', uci: string[]): Promise<CurrentGame | null> {
  if (await getCurrent()) return null;
  const p = await getProfile();
  const g: CurrentGame = {
    myColor, startFen: START_FEN, uci: [...uci], rating: p.rating, botElo: botRating(p.rating), maiaMs: [],
    startedAt: Date.now(), openingId, unrated: true,
  };
  await setCurrent(g);
  return g;
}
