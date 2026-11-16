import { useEffect, useRef, useState } from 'react';
import { fig } from './lib/notation';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from './Board';
import { MoveList, NavBanner, NavBar } from './MoveNav';
import { useMoveNav } from './useMoveNav';
import { loadSoundSetting, soundForMove } from './sound';
import { db, type MateRun } from './db';
import {
  countsForStreak, exerciseOutcome, flagsAfterMyMove, moveLimit, OUTCOME_LABEL,
  type MateLevel, type MateOutcome, type MoveFlag,
} from './lib/mates';
import { bestExactMove } from './lib/dtmLookup';
import { loadDtmForLevel } from './dtmTables';
import { stockfish } from './engines/stockfish';
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

/** Explication d'un pat : position avant mon coup, mon coup, un coup correct. */
interface PatInfo { fenBefore: string; mySan: string; myUci: string; goodSan: string | null; goodUci: string | null; mateIn: number | null; exact: boolean }

async function explainStalemate(level: MateLevel, fenBefore: string, myUci: string, mySan: string): Promise<PatInfo> {
  const { table, sub } = await loadDtmForLevel(level.id);
  if (table) {
    const best = bestExactMove(table, fenBefore, sub);
    return { fenBefore, mySan, myUci, goodSan: best?.san ?? null, goodUci: best?.uci ?? null, mateIn: best?.mateIn ?? null, exact: true };
  }
  // Secours sans table : Stockfish (distance non garantie).
  const r = await stockfish.analyse(fenBefore, 1000);
  const c = new Chess(fenBefore);
  const san = r.bestMove ? c.move({ from: r.bestMove.slice(0, 2), to: r.bestMove.slice(2, 4) }).san : null;
  const mateIn = 'mate' in r.eval && r.eval.mate > 0 ? r.eval.mate : null;
  return { fenBefore, mySan, myUci, goodSan: san, goodUci: r.bestMove, mateIn, exact: false };
}

/** Exercice : je mate le roi seul, joué par Stockfish en défense maximale. Pas de retour en arrière. */
export default function MateExercise({ level, fen: givenFen, minMoves: givenMin, review, onDone }: Props) {
  const [start, setStart] = useState<{ fen: string; minMoves: number; exact?: boolean } | null>(
    givenFen && givenMin ? { fen: givenFen, minMoves: givenMin } : null,
  );
  const [moves, setMoves] = useState<string[]>([]);
  const [flags, setFlags] = useState<MoveFlag[]>([]);
  const [outcome, setOutcome] = useState<MateOutcome | null>(null);
  const [pat, setPat] = useState<PatInfo | null>(null);
  const [showBefore, setShowBefore] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const busy = useRef(false);
  const nav = useMoveNav(moves.length, (i) => soundForMove(moves[i] ?? ''));
  useEffect(() => { loadSoundSetting(); }, []);

  useEffect(() => {
    if (start) return;
    let cancelled = false;
    (givenFen ? Promise.resolve({ fen: givenFen, minMoves: givenMin ?? 0 }) : prepareExercise(level))
      .then((s) => { if (!cancelled) setStart(s); })
      .catch((e) => !cancelled && setErr((e as Error).message));
    return () => { cancelled = true; };
  }, [start, level, givenFen, givenMin]);

  if (err) return <div className="card error">{err}</div>;
  if (!start) return <div className="card center"><p className="pulse">Préparation de l’exercice…</p></div>;

  const chess = new Chess(start.fen);
  for (const m of moves) chess.move(m);
  const myMoves = Math.ceil(moves.length / 2);
  const last = chess.history({ verbose: true }).slice(-1)[0];

  async function finish(result: MateOutcome, allMoves: string[], allFlags: MoveFlag[], before?: { fen: string; uci: string; san: string }) {
    setOutcome(result);
    if (result === 'stalemate' && before) {
      setShowBefore(true);
      explainStalemate(level, before.fen, before.uci, before.san).then(setPat).catch(() => {});
    }
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
      const fenBefore = c.fen();
      const mv = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      const next = [...moves, mv.san];
      const nextFlags = [...flags, ...flagsAfterMyMove(c.fen(), ply, mv.san)];
      setMoves(next); setFlags(nextFlags);
      const o = exerciseOutcome(c, level.pieces.length);
      soundForMove(mv.san, !!o);
      if (o) { await finish(o, next, nextFlags, { fen: fenBefore, uci: mv.from + mv.to + (mv.promotion ?? ''), san: mv.san }); return; }
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
      soundForMove(rm.san, !!o2);
      if (o2) await finish(o2, next2, nextFlags);
    } finally {
      busy.current = false;
      setThinking(false);
    }
  }

  const limit = moveLimit(start.minMoves);
  const unprotected = flags.filter((f) => f.kind === 'unprotected');
  const label = (f: MoveFlag) => fig(`${Math.floor(f.ply / 2) + 1}. ${f.san}`);
  const run = { outcome: outcome ?? 'mate', myMoves, minMoves: start.minMoves };

  // Navigation (lecture seule) dans les coups de l'exercice.
  const navChess = new Chess(start.fen);
  moves.slice(0, nav.at).forEach((m) => navChess.move(m));
  const shownLast = nav.live ? last : navChess.history({ verbose: true }).slice(-1)[0];
  // Après un pat : position avant mon coup, flèche rouge = mon coup, verte = coup correct.
  const patView = outcome === 'stalemate' && pat && showBefore;
  const lastMove = !patView && shownLast ? { from: shownLast.from, to: shownLast.to } : null;
  const boardFen = patView ? pat.fenBefore : nav.live ? chess.fen() : navChess.fen();
  const arrows: BoardArrow[] = [];
  if (patView) {
    arrows.push({ from: pat.myUci.slice(0, 2), to: pat.myUci.slice(2, 4), color: 'rgba(220,40,40,.85)' });
    if (pat.goodUci) arrows.push({ from: pat.goodUci.slice(0, 2), to: pat.goodUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  }

  return (
    <div className="play" data-start-fen={start.fen}>
      <div className="board-col">
        <NavBanner nav={nav} />
        <Board fen={boardFen} orientation="w" movable={nav.live && !outcome && !thinking && chess.turn() === 'w' ? 'w' : null}
          onMove={onMove} lastMove={lastMove} arrows={arrows} onTap={nav.live ? undefined : nav.toLive} />
        {!patView && <NavBar nav={nav} label="Le roi noir a joué" />}
        {outcome === 'stalemate' && pat && (
          <div className="row nav">
            <button className={showBefore ? 'primary' : ''} onClick={() => setShowBefore(true)}>Avant mon coup</button>
            <button className={!showBefore ? 'primary' : ''} onClick={() => setShowBefore(false)}>Position de pat</button>
          </div>
        )}
      </div>
      <aside className="side-col">
        <div className="card">
          <h3>{level.name}</h3>
          <p className="big-count">Coups : <b>{myMoves}</b> / minimum <b>{start.minMoves}</b></p>
          <p className="muted small">Minimum : mat en {start.minMoves} ({start.exact === false ? 'selon Stockfish' : 'distance exacte'}) · objectif : mat en {limit} coups au plus · pas de retour en arrière</p>
          {!outcome && <p className={thinking ? 'pulse muted' : 'muted'}>{thinking ? 'Le roi noir réfléchit…' : 'À toi : mate le roi noir.'}</p>}
          {!outcome && chess.inCheck() && <p className="notice">Échec !</p>}
        </div>
        {outcome && (
          <div className={`card ${outcome === 'mate' ? 'good' : 'bad'}`}>
            <h3>{outcome === 'mate' ? '✅ ' : '❌ '}{OUTCOME_LABEL[outcome]}</h3>
            {outcome === 'mate'
              ? <p>Mat en <b>{myMoves}</b> coups (minimum {start.minMoves}). {countsForStreak(run)
                  ? `Dans la limite (${limit}) : la réussite compte pour la validation.`
                  : `Au-delà de la limite (${limit}) : réussite qui ne compte pas pour la validation.`}</p>
              : <p>Échec de l’exercice{review ? '.' : ' : la position va dans ton paquet de révision.'}</p>}
            {outcome === 'stalemate' && (pat ? (
              <p className="pat-explain">Ton coup <b>{fig(pat.mySan)}</b> (flèche rouge) a fait pat : le roi noir n’avait plus aucune case et
                {' '}n’était pas en échec.{pat.goodSan && <> Coup correct : <b>{fig(pat.goodSan)}</b> (flèche verte)
                {pat.mateIn ? ` — mat en ${pat.mateIn} ${pat.exact ? '(distance exacte)' : '(selon Stockfish)'}` : ''}.</>}</p>
            ) : <p className="pulse muted">Recherche d’un coup correct…</p>)}
            {unprotected.length > 0 && <p>⚠ Pièce sans protection à portée du roi noir après {unprotected.map(label).join(', ')}.</p>}
          </div>
        )}
        <MoveList san={moves} at={nav.at} onPick={nav.goTo} />
      </aside>
    </div>
  );
}
