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
import { continueAsGame, getLineProgress, getLineSession, saveLineProgress, saveLineSession, type LineSession } from '../linesService';
import { crossroads, lastCrossroadPly } from '../lib/crossroads';
import { fig } from '../lib/notation';
import { answerFeedback, loadSoundSetting, soundForMove } from '../sound';
import { go } from '../router';
import { Check, CircleX, Play as PlayIcon, Repeat, RotateCcw } from '../icons';

const OPP_DELAY = 550;

interface Run {
  line: Line;
  ply: number;                 // demi-coups joués dans la ligne en cours
  played: string[];            // coups réellement joués (UCI), depuis le début
  refusals: number;            // refus sur le coup en cours
  errors: number;              // erreurs pendant cette partie (de mon côté)
  errorsHim?: number;          // « Les deux camps » : erreurs sur les coups de l'adversaire
  hints?: number;              // solutions montrées (après 2 refus) pendant cette ligne
  solution: { from: string; to: string; san: string; why: string | null } | null;
  msg: string | null;
  done: boolean;
}

const positionOf = (uci: string[]) => {
  const c = new Chess();
  for (const u of uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  return c;
};

export default function PlayLines({ id, sel }: { id: string; sel?: boolean }) {
  const [opening, setOpening] = useState<Opening | null>(null);
  const [progress, setProgress] = useState<LineProgress | null>(null);
  const [run, setRun] = useState<Run | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  // Entraînement d'une sélection (onglet « Lignes ») : ordre, départ au carrefour ou au 1er coup, boucle.
  const [session, setSession] = useState<LineSession | null>(null);
  const [selDone, setSelDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id);
  const ordered = useMemo(() => (opening ? orderedLines(treeOf(opening), lesson) : []), [opening, lesson]);

  /** Démarre une ligne ; « départ au carrefour » : les coups d'avant son dernier carrefour se jouent tout de suite. */
  function launch(o: Opening, line: Line, start: 'carrefour' | 'first') {
    let ply = 0;
    const played: string[] = [];
    if (start === 'carrefour') {
      const pre = lastCrossroadPly(line, crossroads(treeOf(o), o.color));
      const c = new Chess();
      for (let i = 0; i < Math.max(0, pre); i++) { const m = c.move(line[i]); played.push(m.from + m.to + (m.promotion ?? '')); }
      ply = Math.max(0, pre);
    }
    setRun({ line, ply, played, refusals: 0, errors: 0, solution: null, msg: null, done: false });
  }

  /** Choisit la ligne suivante (nouveau tour si toutes ont le ✓) et la démarre. */
  async function startNext(o: Opening, p: LineProgress, ls: Line[]) {
    let prog = p;
    const pick = pickLine(ls, prog);
    if (pick.newRound) { prog = startRound(prog); await saveLineProgress(o.id, prog); }
    setProgress(prog);
    launch(o, ls[pick.index], 'first');
    setInfo(pick.newRound ? `Toutes les lignes sont validées : nouveau tour (tour ${prog.round}).` : null);
  }

  /** Sélection : la ligne n° `i` (en boucle, on repart du début). */
  function startSel(o: Opening, ses: LineSession, ls: Line[], i: number) {
    if (i >= ses.keys.length) {
      if (!ses.loop) { setSelDone(true); return; }
      i = 0;
      setInfo('Sélection recommencée (en boucle).');
    } else setInfo(null);
    const next = { ...ses, i };
    setSession(next);
    saveLineSession(next).catch(() => {});
    const line = ls.find((l) => lineKey(l) === ses.keys[i]) ?? ls[0];
    launch(o, line, ses.start);
  }

  useEffect(() => {
    loadSoundSetting();
    (async () => {
      const o = await db.openings.get(id);
      if (!o) return;
      setOpening(o);
      const ls = orderedLines(treeOf(o), OPENING_LESSONS.find((l) => l.openingId === id));
      const prog = await getLineProgress(id);
      const ses = sel ? await getLineSession(id) : null;
      if (ses) { setProgress(prog); startSel(o, ses, ls, ses.i); }
      else await startNext(o, prog, ls);
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
      const prog = withLineDone(progress, run.line, run.errors === 0 && !run.errorsHim, Date.now(), run.hints ?? 0);
      setProgress(prog);
      saveLineProgress(opening.id, prog).catch(console.error);
      setRun({ ...run, done: true });
      return;
    }
    if (chess.turn() === me || session?.both) return;
    timer.current = setTimeout(() => {
      const m = new Chess(chess.fen()).move(run.line[run.ply]);
      soundForMove(m.san);
      setRun({ ...run, ply: run.ply + 1, played: [...run.played, m.from + m.to + (m.promotion ?? '')] });
    }, OPP_DELAY);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [run, chess, me, opening, progress, session?.both]);

  if (selDone && opening) {
    return (
      <div className="card" data-testid="selection-done">
        <h3><Check aria-hidden className="ico good-text" /> Sélection terminée</h3>
        <div className="row">
          <button className="primary" onClick={() => { setSelDone(false); if (session) startSel(opening, session, ordered, 0); }}><RotateCcw aria-hidden className="ico" />Recommencer la sélection</button>
          <button onClick={() => go({ name: 'opening', id: opening.id, tab: 'lignes' })}>Retour aux lignes</button>
        </div>
      </div>
    );
  }
  if (!opening || !run || !progress) return null;
  const lineIdx = ordered.findIndex((l) => lineKey(l) === lineKey(run.line));
  const count = myMoveCount(run.line, run.ply, me);
  const status = progress.lines[lineKey(run.line)]?.status;
  const both = !!session?.both;
  const myTurn = !run.done && chess.turn() === me && run.ply < run.line.length;
  // « Les deux camps » : je joue aussi son coup.
  const hisTurn = both && !run.done && chess.turn() !== me && run.ply < run.line.length;

  /** « Les deux camps » : son coup, de mémoire (un autre coup de mon arbre à cet endroit fait changer de ligne). */
  async function onHisMove(san: string, uci: string) {
    if (!run || !opening || !progress) return;
    const playedSan = run.line.slice(0, run.ply);
    if (san === run.line[run.ply]) {
      soundForMove(san);
      setRun({ ...run, ply: run.ply + 1, played: [...run.played, uci], refusals: 0, solution: null, msg: null });
      return;
    }
    const other = ordered.find((l) => l.length > run.ply && l[run.ply] === san && playedSan.every((m, i) => l[i] === m));
    if (other) {
      soundForMove(san);
      const n = ordered.indexOf(other) + 1;
      setRun({ ...run, line: other, ply: run.ply + 1, played: [...run.played, uci], refusals: 0, solution: null, msg: `Autre coup de l’adversaire dans ton répertoire : on passe à la ligne ${n}/${ordered.length}.` });
      return;
    }
    answerFeedback(false);
    const prog = withError(progress, run.line, run.ply, san);
    setProgress(prog);
    await saveLineProgress(opening.id, prog);
    const refusals = run.refusals + 1;
    const m = new Chess(chess.fen()).move(run.line[run.ply]);
    setRun({
      ...run, refusals, errorsHim: (run.errorsHim ?? 0) + 1, hints: (run.hints ?? 0) + (refusals === 2 ? 1 : 0),
      msg: refusals >= 2 ? null : 'Pas le coup de la ligne pour son camp, réessaie.',
      solution: refusals >= 2 ? { from: m.from, to: m.to, san: m.san, why: lessonWhy(lesson, chess.fen(), m.san) } : null,
    });
  }

  async function onMove(uci: string) {
    if (!run || !opening || !progress) return;
    if (hisTurn) {
      const sanH = new Chess(chess.fen()).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san;
      await onHisMove(sanH, uci);
      return;
    }
    if (!myTurn) return;
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
          ...run, refusals, errors: run.errors + 1, msg: null, hints: (run.hints ?? 0) + (refusals === 2 ? 1 : 0),
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
    if (session) startSel(opening, session, ordered, session.i + 1);
    else await startNext(opening, progress, ordered);
  }
  /** Rejouer la ligne qu'on vient de finir (validée ou non), avec le même départ. */
  function replay() {
    if (!opening || !run) return;
    launch(opening, run.line, session?.start ?? 'first');
  }

  async function continueGame() {
    if (!opening || !run) return;
    if (await getCurrent()) { setInfo('Une partie est déjà en cours : termine-la d’abord (Accueil → Reprendre la partie).'); return; }
    await continueAsGame(opening.id, opening.color, run.played);
    go({ name: 'play', opening: opening.id });
  }

  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (run.solution && (myTurn || hisTurn)) {
    arrows.push({ from: run.solution.from, to: run.solution.to, color: 'rgba(30,160,60,.9)' });
    highlight[run.solution.from] = 'rgba(255, 170, 0, .65)';
  }
  const last = run.played[run.played.length - 1];
  const plan = run.done ? linePlan(lesson, run.line) : null;
  const done = validatedCount(ordered, progress);

  return (
    <div className="play play-lines" data-line={lineIdx + 1} data-ply={run.ply} data-expected={myTurn || hisTurn ? run.line[run.ply] : ''} data-fen={chess.fen()} data-key={lineKey(run.line)}>
      <div className="board-col">
        <div className="lines-banner" data-testid="lines-banner">
          <b>{opening.name}</b>
          <span>· Ligne {lineIdx + 1}/{ordered.length}</span>
          <span>· Coup {count.current}/{count.total}</span>
          {both && <span className="tag">Les deux camps</span>}
          {session && <span>· Sélection {session.i + 1}/{session.keys.length}{session.loop ? ' ' : ''}{session.loop && <Repeat aria-label="en boucle" className="ico sm" />}</span>}
          {status === 'redo' && <span className="tag st-bad">à refaire</span>}
          {status === 'ok' && <span className="tag st-good"><Check aria-hidden className="ico sm" /> validée</span>}
        </div>
        <Board fen={chess.fen()} orientation={me}
          movable={myTurn ? me : hisTurn ? chess.turn() : null} onMove={onMove} arrows={arrows} highlight={highlight}
          lastMove={last ? { from: last.slice(0, 2), to: last.slice(2, 4) } : null} />
      </div>
      <aside className="side-col">
        <div className="card">
          <p className="muted small">Jouer les lignes · {done}/{ordered.length} validée{done > 1 ? 's' : ''} · tour {progress.round}</p>
          <p className="line-text muted">{fig(run.line.slice(0, run.ply).map((s, i) => (i % 2 ? '' : `${i / 2 + 1}.`) + s).join(' ')) || 'Position de départ'}</p>
          {info && <p className="notice">{info}</p>}
          {!run.done && (myTurn
            ? <p data-testid="lines-prompt">Joue le coup de ton répertoire ({me === 'w' ? 'Blancs' : 'Noirs'}).</p>
            : hisTurn ? <p data-testid="lines-prompt">Les deux camps : joue aussi <b>son</b> coup de la ligne ({me === 'w' ? 'Noirs' : 'Blancs'}), de mémoire.</p>
              : <p className="muted pulse">L’adversaire joue le coup de la ligne…</p>)}
          {run.msg && <p className={run.msg.startsWith('Pas le coup') ? 'bad-text' : 'notice'} data-testid="lines-msg">{run.msg}</p>}
        </div>
        {run.solution && (myTurn || hisTurn) && (
          <div className="card bad" data-testid="lines-solution">
            <p><CircleX aria-hidden className="ico bad-text" /> {hisTurn ? 'Son coup dans la ligne' : 'Le coup de ton répertoire'} : <b>{fig(run.solution.san)}</b> (flèche verte). Joue-le.</p>
            {run.solution.why && <p className="why">{fig(plainText(run.solution.why))}</p>}
            <p className="muted small">Cette ligne est marquée « à refaire ».</p>
          </div>
        )}
        {run.done && (
          <div className={`card ${run.errors === 0 ? 'good' : ''}`} data-testid="lines-done">
            <h3>Ligne terminée{run.errors === 0 && !run.errorsHim && <> <span className="tag st-good" data-testid="line-ok"><Check aria-hidden className="ico sm" /> sans erreur</span></>}</h3>
            {(run.errors > 0 || (run.errorsHim ?? 0) > 0) && <p className="muted" data-testid="lines-errors">{both
              ? `Erreurs : ${run.errors} de ton côté, ${run.errorsHim ?? 0} du sien`
              : `${run.errors} erreur${run.errors > 1 ? 's' : ''}`} : cette ligne est à refaire, elle reviendra en premier.</p>}
            {plan?.block && <><p><b>{fig(plan.block.title)}</b></p><p className="muted small">{fig(plainText(plan.block.intro))}</p></>}
            {plan && <><p><b>Le plan</b></p><ul className="plan" data-testid="lines-plan">{plan.plan.map((t, i) => <li key={i}>{fig(plainText(t))}</li>)}</ul></>}
            <div className="row">
              <button onClick={replay} data-testid="line-replay"><RotateCcw aria-hidden className="ico" />Rejouer cette ligne</button>
              <button className="primary" onClick={next} data-testid="line-next">{session ? (session.keys.length > 1 || session.loop ? 'Ligne suivante de la sélection' : 'Fin de la sélection') : 'Ligne suivante'}</button>
              <button onClick={continueGame}><PlayIcon aria-hidden className="ico" />Continuer la partie</button>
            </div>
            <p className="muted small">« Continuer la partie » : Maia à ton niveau reprend depuis cette position (partie non comptée, analysée comme les autres).</p>
          </div>
        )}
      </aside>
    </div>
  );
}
