// « Jouer les lignes » : une partie = une ligne du répertoire, dans la couleur de l'ouverture. L'adversaire joue
// exactement les coups de la ligne ; je dois jouer le coup du répertoire (un autre coup du répertoire à cet endroit
// fait basculer sur sa ligne) ; un coup hors répertoire est refusé : 1er refus « réessaie », 2e refus : flèche sur le
// bon coup et commentaire de la leçon. Fin : « Ligne terminée » (✓ sans erreur), le plan, puis « Continuer la partie »
// (Maia, partie non comptée) ou « Ligne suivante ».
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, getCurrent, type Opening } from '../db';
import { treeOf } from '../openings';
import { OPENING_LESSONS, plainText } from '../data/openingLessons';
import {
  checkMove, lessonWhy, lineKey, linePlan, myMoveCount, orderedLines, pickLine, refusalStep, startRound,
  validatedCount, withError, withLineDone, type Line, type LineProgress,
} from '../lib/lineTrainer';
import { continueAsGame, getLineProgress, saveLineProgress } from '../linesService';
import { fig } from '../lib/notation';
import { answerFeedback, loadSoundSetting, soundForMove } from '../sound';
import { go } from '../router';
import { Check, CircleX, Play as PlayIcon } from '../icons';

const OPP_DELAY = 550;

interface Run {
  line: Line;
  ply: number;                 // demi-coups joués dans la ligne en cours
  played: string[];            // coups réellement joués (UCI), depuis le début
  refusals: number;            // refus sur le coup en cours
  errors: number;              // erreurs pendant cette partie
  solution: { from: string; to: string; san: string; why: string | null } | null;
  msg: string | null;
  done: boolean;
}

const positionOf = (uci: string[]) => {
  const c = new Chess();
  for (const u of uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  return c;
};

export default function PlayLines({ id }: { id: string }) {
  const [opening, setOpening] = useState<Opening | null>(null);
  const [progress, setProgress] = useState<LineProgress | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id);
  const ordered = useMemo(() => (opening ? orderedLines(treeOf(opening), lesson) : []), [opening, lesson]);

  /** Choisit la ligne suivante (nouveau tour si toutes ont le ✓) et la démarre. */
  async function startNext(o: Opening, p: LineProgress, ls: Line[]) {
    let prog = p;
    const pick = pickLine(ls, prog);
    if (pick.newRound) { prog = startRound(prog); await saveLineProgress(o.id, prog); }
    setProgress(prog);
    setRun({ line: ls[pick.index], ply: 0, played: [], refusals: 0, errors: 0, solution: null, msg: null, done: false });
    setInfo(pick.newRound ? `Toutes les lignes sont validées : nouveau tour (tour ${prog.round}).` : null);
  }

  useEffect(() => {
    loadSoundSetting();
    (async () => {
      const o = await db.openings.get(id);
      if (!o) return;
      setOpening(o);
      const ls = orderedLines(treeOf(o), OPENING_LESSONS.find((l) => l.openingId === id));
      await startNext(o, await getLineProgress(id), ls);
    })();
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const me = opening?.color ?? 'w';
  const chess = useMemo(() => positionOf(run?.played ?? []), [run?.played]);

  // Coups de l'adversaire : exactement ceux de la ligne ; fin de ligne quand elle est jouée en entier.
  useEffect(() => {
    if (!run || run.done || !opening || !progress) return;
    if (run.ply >= run.line.length) {
      const prog = withLineDone(progress, run.line, run.errors === 0);
      setProgress(prog);
      saveLineProgress(opening.id, prog).catch(console.error);
      setRun({ ...run, done: true });
      return;
    }
    if (chess.turn() === me) return;
    timer.current = setTimeout(() => {
      const m = new Chess(chess.fen()).move(run.line[run.ply]);
      soundForMove(m.san);
      setRun({ ...run, ply: run.ply + 1, played: [...run.played, m.from + m.to + (m.promotion ?? '')] });
    }, OPP_DELAY);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [run, chess, me, opening, progress]);

  if (!opening || !run || !progress) return null;
  const lineIdx = ordered.findIndex((l) => lineKey(l) === lineKey(run.line));
  const count = myMoveCount(run.line, run.ply, me);
  const status = progress.lines[lineKey(run.line)]?.status;
  const myTurn = !run.done && chess.turn() === me && run.ply < run.line.length;

  async function onMove(uci: string) {
    if (!run || !myTurn || !opening || !progress) return;
    const san = new Chess(chess.fen()).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san;
    const r = checkMove(ordered, progress, run.line, run.ply, chess.fen(), san);
    if (r.kind === 'refused') {
      answerFeedback(false);
      const prog = withError(progress, run.line, run.ply, san);
      setProgress(prog);
      await saveLineProgress(opening.id, prog);
      const refusals = run.refusals + 1;
      if (refusalStep(refusals) === 'retry') {
        setRun({ ...run, refusals, errors: run.errors + 1, msg: 'Pas le coup de ton répertoire, réessaie.' });
      } else {
        const m = new Chess(chess.fen()).move(r.expected);
        setRun({
          ...run, refusals, errors: run.errors + 1, msg: null,
          solution: { from: m.from, to: m.to, san: m.san, why: lessonWhy(lesson, chess.fen(), m.san) },
        });
      }
      return;
    }
    soundForMove(san);
    const played = [...run.played, uci];
    if (r.kind === 'switch') {
      const n = ordered.findIndex((l) => lineKey(l) === lineKey(r.line)) + 1;
      setRun({ ...run, line: r.line, ply: r.ply, played, refusals: 0, solution: null, msg: `Autre coup de ton répertoire : on passe à la ligne ${n}/${ordered.length}.` });
    } else {
      setRun({ ...run, ply: run.ply + 1, played, refusals: 0, solution: null, msg: null });
    }
  }

  async function next() {
    if (!opening || !progress) return;
    await startNext(opening, progress, ordered);
  }

  async function continueGame() {
    if (!opening || !run) return;
    if (await getCurrent()) { setInfo('Une partie est déjà en cours : termine-la d’abord (Accueil → Reprendre la partie).'); return; }
    await continueAsGame(opening.id, opening.color, run.played);
    go({ name: 'play', opening: opening.id });
  }

  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (run.solution && myTurn) {
    arrows.push({ from: run.solution.from, to: run.solution.to, color: 'rgba(30,160,60,.9)' });
    highlight[run.solution.from] = 'rgba(255, 170, 0, .65)';
  }
  const last = run.played[run.played.length - 1];
  const plan = run.done ? linePlan(lesson, run.line) : null;
  const done = validatedCount(ordered, progress);

  return (
    <div className="play play-lines" data-line={lineIdx + 1} data-ply={run.ply} data-expected={myTurn ? run.line[run.ply] : ''}>
      <div className="board-col">
        <div className="lines-banner" data-testid="lines-banner">
          <b>{opening.name}</b>
          <span>· Ligne {lineIdx + 1}/{ordered.length}</span>
          <span>· Coup {count.current}/{count.total}</span>
          {status === 'redo' && <span className="tag st-bad">à refaire</span>}
          {status === 'ok' && <span className="tag st-good"><Check aria-hidden className="ico sm" /> validée</span>}
        </div>
        <Board fen={chess.fen()} orientation={me}
          movable={myTurn ? me : null} onMove={onMove} arrows={arrows} highlight={highlight}
          lastMove={last ? { from: last.slice(0, 2), to: last.slice(2, 4) } : null} />
      </div>
      <aside className="side-col">
        <div className="card">
          <p className="muted small">Jouer les lignes · {done}/{ordered.length} validée{done > 1 ? 's' : ''} · tour {progress.round}</p>
          <p className="line-text muted">{fig(run.line.slice(0, run.ply).map((s, i) => (i % 2 ? '' : `${i / 2 + 1}.`) + s).join(' ')) || 'Position de départ'}</p>
          {info && <p className="notice">{info}</p>}
          {!run.done && (myTurn
            ? <p data-testid="lines-prompt">Joue le coup de ton répertoire ({me === 'w' ? 'Blancs' : 'Noirs'}).</p>
            : <p className="muted pulse">L’adversaire joue le coup de la ligne…</p>)}
          {run.msg && <p className={run.msg.startsWith('Pas le coup') ? 'bad-text' : 'notice'} data-testid="lines-msg">{run.msg}</p>}
        </div>
        {run.solution && myTurn && (
          <div className="card bad" data-testid="lines-solution">
            <p><CircleX aria-hidden className="ico bad-text" /> Le coup de ton répertoire : <b>{fig(run.solution.san)}</b> (flèche verte). Joue-le.</p>
            {run.solution.why && <p className="why">{fig(plainText(run.solution.why))}</p>}
            <p className="muted small">Cette ligne est marquée « à refaire ».</p>
          </div>
        )}
        {run.done && (
          <div className={`card ${run.errors === 0 ? 'good' : ''}`} data-testid="lines-done">
            <h3>Ligne terminée{run.errors === 0 && <> <span className="tag st-good" data-testid="line-ok"><Check aria-hidden className="ico sm" /> sans erreur</span></>}</h3>
            {run.errors > 0 && <p className="muted">{run.errors} erreur{run.errors > 1 ? 's' : ''} : cette ligne est à refaire, elle reviendra en premier.</p>}
            {plan?.block && <><p><b>{plan.block.title}</b></p><p className="muted small">{fig(plainText(plan.block.intro))}</p></>}
            {plan && <><p><b>Le plan</b></p><ul className="plan">{plan.plan.map((t, i) => <li key={i}>{fig(plainText(t))}</li>)}</ul></>}
            <div className="row">
              <button onClick={continueGame}><PlayIcon aria-hidden className="ico" />Continuer la partie</button>
              <button className="primary" onClick={next}>Ligne suivante</button>
            </div>
            <p className="muted small">« Continuer la partie » : Maia à ton niveau reprend depuis cette position (partie non comptée, analysée comme les autres).</p>
          </div>
        )}
      </aside>
    </div>
  );
}
