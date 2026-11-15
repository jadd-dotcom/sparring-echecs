// Motifs d'erreur : règles simples et déterministes appliquées aux suites de Stockfish.
import { Chess } from 'chess.js';
import type { Color } from '../repertoire';
import type { Eval } from '../winpct';
import { balance, flipTurn, formatPv, opponentGain, playPv } from './facts';

export type Motif = 'mat-rate' | 'mat-ouvert' | 'menace-ignoree' | 'piece-en-prise' | 'autre';

/** Ordre de priorité (le premier qui s'applique est le motif principal). */
export const MOTIF_ORDER: Motif[] = ['mat-rate', 'mat-ouvert', 'menace-ignoree', 'piece-en-prise', 'autre'];

export const MOTIF_LABEL: Record<Motif, string> = {
  'mat-rate': 'Mat raté',
  'mat-ouvert': 'Mat ouvert',
  'menace-ignoree': 'Menace ignorée',
  'piece-en-prise': 'Pièce laissée en prise',
  autre: 'Autre',
};

export const MATE_HORIZON = 3;
export const GAIN_THRESHOLD = 2;

export interface MotifFacts {
  /** Mat en N (≤ 3) pour moi avant mon coup, sinon null. */
  mateForMeBefore: number | null;
  /** Mon coup mate ou conserve un mat forcé. */
  playedKeepsMate: boolean;
  /** Après mon coup, mat contre moi en N (≤ 3), sinon null. */
  mateAgainstMeAfter: number | null;
  /** Gain de l'adversaire sur les 2 premiers demi-coups de la réfutation. */
  refutationGain2: number;
  /** Menace avant mon coup (trait inversé) ; null si j'étais en échec. */
  threat: { mate: number | null; gain2: number } | null;
  /** La menace marche encore après mon coup. */
  threatStillWorks: boolean;
}

export function detectMotifs(f: MotifFacts): { motifs: Motif[]; motif: Motif } {
  const m: Motif[] = [];
  if (f.mateForMeBefore !== null && !f.playedKeepsMate) m.push('mat-rate');
  if (f.mateAgainstMeAfter !== null) m.push('mat-ouvert');
  const threatened = !!f.threat && (f.threat.mate !== null || f.threat.gain2 >= GAIN_THRESHOLD);
  if (threatened && f.threatStillWorks) m.push('menace-ignoree');
  if (f.refutationGain2 >= GAIN_THRESHOLD) m.push('piece-en-prise');
  const motifs = m.length ? m : (['autre'] as Motif[]);
  return { motifs, motif: MOTIF_ORDER.find((x) => motifs.includes(x))! };
}

// ---------------------------------------------------------------- calcul avec un moteur

export interface EngineResult { score: Eval; pv: string[] }
export interface Engine {
  search(fen: string, depth: number): Promise<EngineResult>;
}

export interface ErrorDetail {
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

/** Détail d'une erreur : suites, bilans matériels, motifs. */
export async function computeErrorDetail(engine: Engine, fenBefore: string, myUci: string, me: Color, depth = DETAIL_DEPTH): Promise<ErrorDetail> {
  const before = new Chess(fenBefore);
  const inCheck = before.inCheck();
  const after = new Chess(fenBefore);
  after.move({ from: myUci.slice(0, 2), to: myUci.slice(2, 4), promotion: myUci[4] });
  const fenAfter = after.fen();

  const best = await engine.search(fenBefore, depth);
  const bestPlay = playPv(fenBefore, best.pv, LINE_PLIES);

  let refutation: EngineResult = { score: { cp: 0 }, pv: [] };
  let playedKeepsMate = false;
  if (after.isCheckmate()) playedKeepsMate = true;
  else if (!after.isGameOver()) {
    refutation = await engine.search(fenAfter, depth);
    playedKeepsMate = 'mate' in refutation.score && refutation.score.mate < 0;
  }
  const refPlay = playPv(fenAfter, refutation.pv, LINE_PLIES);

  let threat: MotifFacts['threat'] = null;
  let threatStillWorks = false;
  let threatLine: string | undefined;
  if (!inCheck) {
    const flipped = flipTurn(fenBefore);
    const t = await engine.search(flipped, depth);
    const gain2 = opponentGain(flipped, t.pv, me, 2);
    threat = { mate: mateIn(t.score), gain2 };
    if (threat.mate !== null || gain2 >= 2) {
      threatLine = formatPv(flipped, playPv(flipped, t.pv, LINE_PLIES).san);
      const tm = t.pv[0];
      const legalAfter = !after.isGameOver() && after.moves({ verbose: true }).some((x) => x.from + x.to + (x.promotion ?? '') === tm);
      if (legalAfter) {
        if (threat.mate !== null) threatStillWorks = mateIn(refutation.score) !== null;
        else if (refutation.pv[0] === tm) threatStillWorks = opponentGain(fenAfter, refutation.pv, me, 2) >= 2;
        else {
          const afterThreat = new Chess(fenAfter);
          afterThreat.move({ from: tm.slice(0, 2), to: tm.slice(2, 4), promotion: tm[4] });
          const reply = afterThreat.isGameOver() ? { pv: [] as string[] } : await engine.search(afterThreat.fen(), depth);
          threatStillWorks = opponentGain(fenAfter, [tm, ...reply.pv], me, 2) >= 2;
        }
      }
    }
  }

  const facts: MotifFacts = {
    mateForMeBefore: mateIn(best.score),
    playedKeepsMate,
    mateAgainstMeAfter: after.isGameOver() ? null : mateIn(refutation.score),
    refutationGain2: opponentGain(fenAfter, refutation.pv, me, 2),
    threat,
    threatStillWorks,
  };
  return {
    depth,
    bestLine: formatPv(fenBefore, bestPlay.san),
    bestMaterial: balance(bestPlay.fen, me),
    refutation: formatPv(fenAfter, refPlay.san),
    refutationMaterial: balance(refPlay.fen, me),
    ...(threatLine ? { threatLine } : {}),
    ...detectMotifs(facts),
  };
}
