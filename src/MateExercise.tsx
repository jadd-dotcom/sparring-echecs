import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board from './Board';
import { db, type MateRun } from './db';
import {
  countsForStreak, EXTRA_MOVES_ALLOWED, exerciseOutcome, flagsAfterMyMove, OUTCOME_LABEL,
  type MateLevel, type MateOutcome, type MoveFlag,
} from './lib/mates';
import { addFailedCard, defenderMove, prepareExercise } from './matesService';

const MIN_REPLY_MS = 350;

interface Props {
  level: MateLevel;
  /** Position imposée (révision) ; sinon position aléatoire. */
  fen?: string;
  minMoves?: number;
  review?: boolean;
  onDone?: (run: MateRun) => void;
}

/** Exercice : je mate le roi seul, joué par Stockfish en défense maximale. Pas de retour en arrière. */
export default function MateExercise({ level, fen: givenFen, minMoves: givenMin, review, onDone }: Props) {
  const [start, setStart] = useState<{ fen: string; minMoves: number } | null>(
    givenFen && givenMin ? { fen: givenFen, minMoves: givenMin } : null,
  );
  const [moves, setMoves] = useState<string[]>([]);
  const [flags, setFlags] = useState<MoveFlag[]>([]);
  const [outcome, setOutcome] = useState<MateOutcome | null>(null);
  const [thinking, setThinking] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (start) return;
    let cancelled = false;
    (givenFen ? Promise.resolve({ fen: givenFen, minMoves: givenMin ?? 0 }) : prepareExercise(level))
      .then((s) => { if (!cancelled) setStart(s); })
      .catch((e) => !cancelled && setErr((e as Error).message));
    return () => { cancelled = true; };
  }, [start, level, givenFen, givenMin]);

  if (err) return <div className="card error">{err}</div>;
  if (!start) return <div className="card center"><p className="pulse">Préparation de l’exercice (Stockfish calcule le mat le plus court)…</p></div>;

  const chess = new Chess(start.fen);
  for (const m of moves) chess.move(m);
  const myMoves = Math.ceil(moves.length / 2);
  const last = chess.history({ verbose: true }).slice(-1)[0];

  async function finish(result: MateOutcome, allMoves: string[], allFlags: MoveFlag[]) {
    setOutcome(result);
    const run: MateRun = {
      level: level.id, fen: start!.fen, minMoves: start!.minMoves, myMoves: Math.ceil(allMoves.length / 2),
      outcome: result, flags: allFlags, moves: allMoves, date: Date.now(), ...(review ? { review: true } : {}),
    };
    run.id = await db.mateRuns.add(run);
    if (result !== 'mate' && !review) await addFailedCard(run);
    onDone?.(run);
  }

  async function onMove(uci: string) {
    if (busy.current || outcome) return;
    busy.current = true;
    try {
      const c = new Chess(start!.fen);
      for (const m of moves) c.move(m);
      const ply = moves.length;
      const mv = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      const next = [...moves, mv.san];
      const nextFlags = [...flags, ...flagsAfterMyMove(c.fen(), ply, mv.san)];
      setMoves(next); setFlags(nextFlags);
      const o = exerciseOutcome(c, level.pieces.length);
      if (o) { await finish(o, next, nextFlags); return; }
      setThinking(true);
      const t0 = performance.now();
      const reply = await defenderMove(c.fen());
      const wait = MIN_REPLY_MS - (performance.now() - t0);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const rm = c.move({ from: reply.slice(0, 2), to: reply.slice(2, 4), promotion: reply[4] });
      const next2 = [...next, rm.san];
      setMoves(next2);
      setThinking(false);
      const o2 = exerciseOutcome(c, level.pieces.length);
      if (o2) await finish(o2, next2, nextFlags);
    } finally {
      busy.current = false;
      setThinking(false);
    }
  }

  const limit = start.minMoves + EXTRA_MOVES_ALLOWED;
  const highlight: Record<string, string> = last ? { [last.from]: 'rgba(255,255,0,.35)', [last.to]: 'rgba(255,255,0,.45)' } : {};
  const nearStalemate = flags.filter((f) => f.kind === 'near-stalemate');
  const unprotected = flags.filter((f) => f.kind === 'unprotected');
  const label = (f: MoveFlag) => `${Math.floor(f.ply / 2) + 1}. ${f.san}`;
  const run = { outcome: outcome ?? 'mate', myMoves, minMoves: start.minMoves };

  return (
    <div className="play">
      <div className="board-col">
        <Board fen={chess.fen()} orientation="w" movable={!outcome && !thinking && chess.turn() === 'w' ? 'w' : null}
          onMove={onMove} highlight={highlight} />
      </div>
      <aside className="side-col">
        <div className="card">
          <h3>{level.name}</h3>
          <p className="big-count">Coups : <b>{myMoves}</b> / minimum <b>{start.minMoves}</b></p>
          <p className="muted small">Mat en {start.minMoves} selon Stockfish · objectif : mat en {limit} coups au plus · pas de retour en arrière</p>
          {!outcome && <p className={thinking ? 'pulse muted' : 'muted'}>{thinking ? 'Le roi noir réfléchit…' : 'À toi : mate le roi noir.'}</p>}
          {!outcome && chess.inCheck() && <p className="notice">Échec !</p>}
        </div>
        {outcome && (
          <div className={`card ${outcome === 'mate' ? 'good' : 'bad'}`}>
            <h3>{outcome === 'mate' ? '✅ ' : '❌ '}{OUTCOME_LABEL[outcome]}</h3>
            {outcome === 'mate'
              ? <p>Mat en <b>{myMoves}</b> coups (minimum {start.minMoves}). {countsForStreak(run)
                  ? 'Dans la limite : la réussite compte pour la validation.'
                  : `Au-delà de la limite (${limit}) : réussite qui ne compte pas pour la validation.`}</p>
              : <p>Échec de l’exercice{review ? '.' : ' : la position va dans ton paquet de révision.'}</p>}
            {nearStalemate.length > 0 && <p>⚠ Pat frôlé : le roi noir n’avait plus qu’une seule case après {nearStalemate.map(label).join(', ')}.</p>}
            {unprotected.length > 0 && <p>⚠ Pièce sans protection à portée du roi noir après {unprotected.map(label).join(', ')}.</p>}
            {nearStalemate.length === 0 && unprotected.length === 0 && <p className="muted">Ni pat frôlé, ni pièce laissée sans protection. 👍</p>}
          </div>
        )}
        <div className="card moves">
          {moves.length === 0 ? <span className="muted">Aucun coup joué</span>
            : moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${m}` : m)).join(' ')}
        </div>
      </aside>
    </div>
  );
}
