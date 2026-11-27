// Motifs d'erreur : règles simples et déterministes appliquées aux suites de Stockfish.
import { Chess } from 'chess.js';
import type { Color } from '../repertoire';
import type { Eval } from '../winpct';
import { balance, flipTurn, formatPv, opponentGain, playPv } from './facts';

export type Motif = 'mat-rate' | 'mat-ouvert' | 'menace-ignoree' | 'piece-en-prise' | 'gain-rate' | 'autre';

/** Ordre de priorité (le premier qui s'applique est le motif principal). */
export const MOTIF_ORDER: Motif[] = ['mat-rate', 'mat-ouvert', 'menace-ignoree', 'piece-en-prise', 'gain-rate', 'autre'];

export const MOTIF_LABEL: Record<Motif, string> = {
  'mat-rate': 'Mat raté',
  'mat-ouvert': 'Mat ouvert',
  'menace-ignoree': 'Menace ignorée',
  'piece-en-prise': 'Pièce laissée en prise',
  'gain-rate': 'Gain raté',
  autre: 'Erreur de position (pas de perte de matériel tout de suite)',
};

/** Plies de la suite (mon coup, sa réponse, mon coup suivant) sur lesquels on mesure un gain de matériel. */
export const GAIN_PLIES = 3;

/** Demi-coups (lui, moi, lui, moi) sur lesquels on mesure ce qu'il gagne : une fourchette avec échec (il donne
 *  échec, mon roi bouge, il prend, je reprends si je peux) compte ainsi comme une pièce laissée en prise. */
export const LOSS_PLIES = 4;

export const MATE_HORIZON = 3;
export const GAIN_THRESHOLD = 2;

export interface MotifFacts {
  /** Mat en N (≤ 3) pour moi avant mon coup, sinon null. */
  mateForMeBefore: number | null;
  /** Mon coup mate ou conserve un mat forcé. */
  playedKeepsMate: boolean;
  /** Après mon coup, mat contre moi en N (≤ 3), sinon null. */
  mateAgainstMeAfter: number | null;
  /** Gain de l'adversaire sur les 4 premiers demi-coups de la réfutation (lui, moi, lui, moi). */
  refutationGain: number;
  /** Menace avant mon coup (trait inversé), gain sur 4 demi-coups ; null si j'étais en échec. */
  threat: { mate: number | null; gain: number } | null;
  /** La menace marche encore après mon coup. */
  threatStillWorks: boolean;
  /** Gain de matériel pour moi sur les 3 premiers demi-coups de la meilleure suite (mon coup, sa réponse, mon coup). */
  bestGain3?: number;
  /** Même mesure après le coup que j'ai joué (mon coup puis la suite de Stockfish). */
  playedGain3?: number;
  /** J'avais un mat forcé (de n'importe quelle longueur) avant mon coup. */
  mateForMeAny?: boolean;
}

export function detectMotifs(f: MotifFacts): { motifs: Motif[]; motif: Motif } {
  const m: Motif[] = [];
  if (f.mateForMeBefore !== null && !f.playedKeepsMate) m.push('mat-rate');
  if (f.mateAgainstMeAfter !== null) m.push('mat-ouvert');
  const threatened = !!f.threat && (f.threat.mate !== null || f.threat.gain >= GAIN_THRESHOLD);
  if (threatened && f.threatStillWorks) m.push('menace-ignoree');
  if (f.refutationGain >= GAIN_THRESHOLD) m.push('piece-en-prise');
  // Gain raté : je pouvais mater, ou gagner au moins 2 points de matériel, et mon coup ne le fait pas
  // (il ne mate pas / il gagne au moins 2 points de moins que la meilleure suite).
  const best = f.bestGain3 ?? 0, played = f.playedGain3 ?? 0;
  const missed = f.mateForMeAny ? !f.playedKeepsMate : best >= GAIN_THRESHOLD && best - played >= GAIN_THRESHOLD;
  if (missed) m.push('gain-rate');
  const motifs = m.length ? m : (['autre'] as Motif[]);
  return { motifs, motif: MOTIF_ORDER.find((x) => motifs.includes(x))! };
}

// ---------------------------------------------------------------- calcul avec un moteur

export interface EngineResult { score: Eval; pv: string[] }
export interface Engine {
  search(fen: string, depth: number): Promise<EngineResult>;
}

/** Version du calcul (2 : motif « Gain raté » ; 3 : pièce en prise et menace mesurées sur 4 demi-coups) ;
 *  un détail plus ancien est recalculé (en arrière-plan, et quand on en a besoin). */
export const DETAIL_VERSION = 3;

export interface ErrorDetail {
  v?: number;
  depth: number;
  bestLine: string;        // suite Stockfish après le meilleur coup (SAN, numérotée)
  bestMaterial: number;    // bilan matériel (moi − adversaire) au bout de la suite
  refutation: string;      // suite Stockfish après mon coup
  refutationMaterial: number;
  threatLine?: string;     // menace (trait inversé) s'il y en a une
  motifs: Motif[];
  motif: Motif;
}

export const DETAIL_DEPTH = 12;
export const LINE_PLIES = 5;

const mateIn = (s: Eval) => ('mate' in s && s.mate > 0 && s.mate <= MATE_HORIZON ? s.mate : null);

/**
 * La variante principale du moteur est parfois écourtée (table de transposition) : on la prolonge par de nouvelles
 * recherches jusqu'à `n` demi-coups (ou la fin de partie), pour mesurer le gain sur tout l'horizon.
 */
async function extendPv(engine: Engine, fen: string, pv: string[], n: number, depth: number): Promise<string[]> {
  let out = pv;
  for (let guard = 0; guard < n; guard++) {
    const played = playPv(fen, out);
    if (played.san.length >= n || played.chess.isGameOver() || played.san.length < out.length) break;
    const r = await engine.search(played.fen, depth);
    if (!r.pv.length) break;
    out = [...out, ...r.pv];
  }
  return out;
}

/** Détail d'une erreur : suites, bilans matériels, motifs.
 *  `bestUci` (meilleur coup de l'analyse) : la suite affichée part de ce coup, pour rester cohérente. */
export async function computeErrorDetail(engine: Engine, fenBefore: string, myUci: string, me: Color, depth = DETAIL_DEPTH, bestUci?: string | null): Promise<ErrorDetail> {
  const before = new Chess(fenBefore);
  const inCheck = before.inCheck();
  const after = new Chess(fenBefore);
  after.move({ from: myUci.slice(0, 2), to: myUci.slice(2, 4), promotion: myUci[4] });
  const fenAfter = after.fen();

  const best = await engine.search(fenBefore, depth);
  let bestPv = best.pv;
  if (bestUci && bestUci !== best.pv[0]) {
    const c = new Chess(fenBefore);
    try {
      c.move({ from: bestUci.slice(0, 2), to: bestUci.slice(2, 4), promotion: bestUci[4] });
      bestPv = [bestUci, ...(c.isGameOver() ? [] : (await engine.search(c.fen(), depth)).pv)];
    } catch { /* coup inconnu : on garde la suite du moteur */ }
  }
  const bestPlay = playPv(fenBefore, bestPv, LINE_PLIES);

  let refutation: EngineResult = { score: { cp: 0 }, pv: [] };
  let playedKeepsMate = false;
  if (after.isCheckmate()) playedKeepsMate = true;
  else if (!after.isGameOver()) {
    refutation = await engine.search(fenAfter, depth);
    playedKeepsMate = 'mate' in refutation.score && refutation.score.mate < 0;
    refutation = { ...refutation, pv: await extendPv(engine, fenAfter, refutation.pv, LINE_PLIES, depth) };
  }
  const refPlay = playPv(fenAfter, refutation.pv, LINE_PLIES);

  let threat: MotifFacts['threat'] = null;
  let threatStillWorks = false;
  let threatLine: string | undefined;
  if (!inCheck) {
    const flipped = flipTurn(fenBefore);
    const t0 = await engine.search(flipped, depth);
    const t = { ...t0, pv: await extendPv(engine, flipped, t0.pv, LOSS_PLIES, depth) };
    const gain = opponentGain(flipped, t.pv, me, LOSS_PLIES);
    threat = { mate: mateIn(t.score), gain };
    if (threat.mate !== null || gain >= GAIN_THRESHOLD) {
      threatLine = formatPv(flipped, playPv(flipped, t.pv, LINE_PLIES).san);
      const tm = t.pv[0];
      const legalAfter = !after.isGameOver() && after.moves({ verbose: true }).some((x) => x.from + x.to + (x.promotion ?? '') === tm);
      if (legalAfter) {
        if (threat.mate !== null) threatStillWorks = mateIn(refutation.score) !== null;
        else if (refutation.pv[0] === tm) threatStillWorks = opponentGain(fenAfter, refutation.pv, me, LOSS_PLIES) >= GAIN_THRESHOLD;
        else {
          const afterThreat = new Chess(fenAfter);
          afterThreat.move({ from: tm.slice(0, 2), to: tm.slice(2, 4), promotion: tm[4] });
          const reply = afterThreat.isGameOver() ? { pv: [] as string[] } : await engine.search(afterThreat.fen(), depth);
          const replyPv = await extendPv(engine, afterThreat.fen(), reply.pv, LOSS_PLIES - 1, depth);
          threatStillWorks = opponentGain(fenAfter, [tm, ...replyPv], me, LOSS_PLIES) >= GAIN_THRESHOLD;
        }
      }
    }
  }

  const base = balance(fenBefore, me);
  const facts: MotifFacts = {
    bestGain3: balance(playPv(fenBefore, bestPv, GAIN_PLIES).fen, me) - base,
    playedGain3: balance(playPv(fenBefore, [myUci, ...refutation.pv], GAIN_PLIES).fen, me) - base,
    mateForMeAny: 'mate' in best.score && best.score.mate > 0,
    mateForMeBefore: mateIn(best.score),
    playedKeepsMate,
    mateAgainstMeAfter: after.isGameOver() ? null : mateIn(refutation.score),
    refutationGain: opponentGain(fenAfter, refutation.pv, me, LOSS_PLIES),
    threat,
    threatStillWorks,
  };
  return {
    v: DETAIL_VERSION,
    depth,
    bestLine: formatPv(fenBefore, bestPlay.san),
    bestMaterial: balance(bestPlay.fen, me),
    refutation: formatPv(fenAfter, refPlay.san),
    refutationMaterial: balance(refPlay.fen, me),
    ...(threatLine ? { threatLine } : {}),
    ...detectMotifs(facts),
  };
}
