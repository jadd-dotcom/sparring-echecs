// « Qu'est-ce qu'il menace ? » : on donne le trait à l'adversaire (coup nul, sauf si je suis en échec) et Stockfish
// cherche son meilleur coup. C'est une vraie menace s'il gagne au moins 20 points de chances de gain (win%) par rapport
// à la position actuelle, ou s'il obtient un mat. Fonctions pures + moteur injecté (navigateur ou Node pour les tests).
import { Chess, type Color } from 'chess.js';
import { winPercent, type Eval } from './winpct';
import { moveCaption, nullMove } from './words';

/** Gain minimal (points de win%) pour parler d'une vraie menace. */
export const THREAT_MIN_GAIN = 20;
/** « Lis la menace » : un autre coup est accepté s'il rapporte presque autant (10 points de moins au plus). */
export const THREAT_TOLERANCE = 10;
/** Demi-coups montrés par « Voir la suite ». */
export const THREAT_LINE_PLIES = 5;

export type ThreatSearch = (fen: string) => Promise<{ score: Eval; pv: string[] }>;

export type ThreatResult =
  | { status: 'check' }                       // je suis en échec : pas de coup nul possible
  | { status: 'over' }                        // partie terminée
  | { status: 'none'; gain: number }          // pas de menace sérieuse
  | {
    status: 'threat';
    fenHim: string;      // position avec le trait à l'adversaire (coup nul)
    uci: string;
    san: string;
    line: string[];      // suite en SAN depuis fenHim
    mate: boolean;
    gain: number;        // points de win% qu'il gagne
    wpOppNow: number;    // ses chances dans la position actuelle
    wpOppAfter: number;  // ses chances après sa menace
    bestUci?: string;    // mon meilleur coup dans la position actuelle (pour la parer)
    bestLine?: string[]; // ma meilleure suite (SAN)
  };

/** Chances de l'adversaire avant / après sa menace, et verdict. `evalMe` : position avec mon trait ; `evalHim` : avec le sien. */
export function threatGain(evalMe: Eval | null, evalHim: Eval) {
  const wpOppNow = evalMe ? 100 - winPercent(evalMe) : 50;
  const wpOppAfter = winPercent(evalHim);
  const alreadyMated = !!evalMe && 'mate' in evalMe && evalMe.mate < 0;
  const mate = 'mate' in evalHim && evalHim.mate > 0 && !alreadyMated;
  const gain = wpOppAfter - wpOppNow;
  return { wpOppNow, wpOppAfter, gain, mate, serious: mate || gain >= THREAT_MIN_GAIN };
}

/** Coups UCI → SAN depuis `fen` (on s'arrête au premier coup illégal). */
export function pvToSan(fen: string, pv: string[], max = THREAT_LINE_PLIES): string[] {
  const c = new Chess(fen);
  const out: string[] = [];
  for (const u of pv.slice(0, max)) {
    try { out.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san); } catch { break; }
  }
  return out;
}

/** Positions « mon trait » et « son trait » à comparer ; null si je suis en échec (pas de coup nul). */
export function threatPositions(fen: string, me: Color): { fenMe: string | null; fenHim: string } | null {
  const c = new Chess(fen);
  if (c.turn() === me) return c.inCheck() ? null : { fenMe: fen, fenHim: nullMove(fen) };
  return { fenMe: c.inCheck() ? null : nullMove(fen), fenHim: fen };
}

/** Cherche la menace de l'adversaire dans `fen` (de mon point de vue `me`). */
export async function findThreat(fen: string, me: Color, search: ThreatSearch): Promise<ThreatResult> {
  const c = new Chess(fen);
  if (c.isGameOver()) return { status: 'over' };
  const pos = threatPositions(fen, me);
  if (!pos) return { status: 'check' };
  const rMe = pos.fenMe ? await search(pos.fenMe) : null;
  const rHim = await search(pos.fenHim);
  const g = threatGain(rMe?.score ?? null, rHim.score);
  const uci = rHim.pv[0];
  if (!g.serious || !uci) return { status: 'none', gain: g.gain };
  const line = pvToSan(pos.fenHim, rHim.pv);
  if (!line.length) return { status: 'none', gain: g.gain };
  return {
    status: 'threat', fenHim: pos.fenHim, uci, san: line[0], line, mate: g.mate, gain: g.gain,
    wpOppNow: g.wpOppNow, wpOppAfter: g.wpOppAfter,
    bestUci: rMe?.pv[0], bestLine: rMe && pos.fenMe ? pvToSan(pos.fenMe, rMe.pv) : undefined,
  };
}

/** La phrase en mots : « Il menace ceci : son cavalier prend ta dame d4. » */
export function threatSentence(fenHim: string, uci: string, me: Color, mate: boolean): string {
  const cap = moveCaption(fenHim, uci, me);
  const low = cap.charAt(0).toLowerCase() + cap.slice(1);
  return mate && !/mat\.$/.test(cap) ? `Il menace de te mater : ${low}` : `Il menace ceci : ${low}`;
}

/**
 * « Lis la menace », question 1 : mon coup (joué à la place de l'adversaire) est-il accepté ?
 * Oui si c'est sa menace, un mat, ou s'il lui rapporte presque autant (tolérance de 10 points).
 * `wpOppAfterMine` : ses chances après mon coup ; `threatWp` : ses chances après sa menace.
 */
export function isThreatAnswerOk(uci: string, threatUci: string, opts: { mates: boolean; wpOppAfterMine: number; threatWp: number }): boolean {
  return uci === threatUci || opts.mates || opts.wpOppAfterMine >= opts.threatWp - THREAT_TOLERANCE;
}
