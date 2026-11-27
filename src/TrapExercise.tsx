// Exercice d'un piège d'ouverture. « Défends-toi » : le bot a tendu le piège, je trouve le bon coup au moment critique
// (si je tombe dedans, la suite se joue et s'explique). « Punis-le » : le bot a fait la faute, je trouve le coup
// gagnant. Indices progressifs (en mots, puis la pièce à jouer), solution après 2 essais ratés ou 2 indices.
import { useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from './Board';
import { evaluate } from './analysis';
import { stockfish } from './engines/stockfish';
import { winPercent } from './lib/winpct';
import { moveCaption } from './lib/words';
import { pvToSan } from './lib/threat';
import { defendVerdict, punishOk, trapPositions, type TrapMode } from './lib/traps';
import type { TrapDef } from './data/traps';
import { answerFeedback, soundForMove } from './sound';
import { Notation, SuiteButton, useSuite } from './Suite';
import { CircleCheck, CircleX, Lightbulb, RotateCcw } from './icons';
import { fig } from './lib/notation';

const ORANGE = 'rgba(240,138,64,.9)';
const GREEN = 'rgba(30,160,60,.9)';
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export interface TrapResult { ok: boolean; clean: boolean }
type Phase = 'play' | 'won' | 'fell' | 'solved';

export default function TrapExercise({ trap, mode, onDone, actions, notice, head }: {
  trap: TrapDef; mode: TrapMode; onDone: (r: TrapResult) => void;
  /** Boutons affichés à la fin (suite du parcours). */
  actions?: React.ReactNode;
  /** Message en tête de colonne (ex. « Piège maîtrisé ! »). */
  notice?: React.ReactNode;
  /** Ligne d'en-tête (ex. révision : positions restantes). */
  head?: string;
}) {
  const p = useMemo(() => trapPositions(trap), [trap]);
  const me = mode === 'defend' ? p.victim : p.punisher;
  const startFen = mode === 'defend' ? p.critical : p.afterBlunder;
  const lastUci = mode === 'defend' ? p.lastUci : p.blunderUci;
  const lastFrom = mode === 'defend' ? (() => { const c = new Chess(); trap.line.slice(0, -1).forEach((s) => c.move(s)); return c.fen(); })() : p.critical;
  const solutionUci = mode === 'defend' ? p.goodUci[0] : p.keyUci;
  const [phase, setPhase] = useState<Phase>('play');
  const [tries, setTries] = useState(0);
  const [hints, setHints] = useState(0);
  const [checking, setChecking] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [played, setPlayed] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const suite = useSuite();
  const ref = useRef<{ best?: number; key?: number }>({});

  function finish(ph: Phase, ok: boolean) {
    setPhase(ph);
    onDone({ ok, clean: ok && tries === 0 && hints === 0 });
  }

  /** Suite après mon coup : la ligne du piège si c'est le coup prévu, sinon la suite de Stockfish. */
  async function lineAfter(fen: string, uci: string, planned: string[] | null): Promise<string[]> {
    const mine = pvToSan(fen, [uci], 1);
    if (planned) return [...mine, ...planned];
    const c = new Chess(fen);
    c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    if (c.isGameOver()) return mine;
    const r = await stockfish.analyse(c.fen(), 700);
    return [...mine, ...pvToSan(c.fen(), r.pv, 4)];
  }

  async function onMove(uci: string) {
    if (checking || phase !== 'play') return;
    setChecking(true);
    setMsg(null);
    try {
      const c = new Chess(startFen);
      const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      soundForMove(m.san);
      setPlayed(uci);
      if (mode === 'defend') {
        let drop: number | null = null;
        if (!p.goodUci.includes(uci) && uci !== p.blunderUci) {
          ref.current.best ??= winPercent((await evaluate(startFen, 700)).eval);
          const after = c.isGameOver() ? 50 : 100 - winPercent((await evaluate(c.fen(), 700)).eval);
          drop = Math.max(0, ref.current.best - after);
        }
        const v = defendVerdict(uci, p, drop);
        answerFeedback(v === 'ok');
        if (v === 'ok') finish('won', true);
        else if (v === 'fell') {
          const line = await lineAfter(startFen, uci, uci === p.blunderUci ? trap.punish : null);
          suite.open(startFen, line, me, 'Le piège se referme');
          finish('fell', false);
        } else {
          setTries((t) => t + 1);
          setPlayed(null);
          setMsg(`${capital(moveCaption(startFen, uci, me))} Ce coup n’est pas assez solide (−${Math.round(drop ?? 0)} pts). Essaie encore.`);
        }
      } else {
        let ok = punishOk(uci, p.keyUci, { mates: c.isCheckmate() });
        if (!ok) {
          if (ref.current.key === undefined) {
            const k = new Chess(startFen);
            k.move({ from: p.keyUci.slice(0, 2), to: p.keyUci.slice(2, 4), promotion: p.keyUci[4] });
            ref.current.key = k.isCheckmate() ? 100 : 100 - winPercent((await evaluate(k.fen(), 700)).eval);
          }
          const wpMine = c.isGameOver() ? 50 : 100 - winPercent((await evaluate(c.fen(), 700)).eval);
          ok = punishOk(uci, p.keyUci, { mates: false, wpMine, wpKey: ref.current.key });
        }
        answerFeedback(ok);
        if (ok) {
          const line = await lineAfter(startFen, uci, uci === p.keyUci ? trap.punish.slice(1) : null);
          suite.open(startFen, line, me, 'La punition');
          finish('won', true);
        } else {
          setTries((t) => t + 1);
          setPlayed(null);
          setMsg(`${capital(moveCaption(startFen, uci, me))} Ce coup ne punit pas sa faute. Essaie encore.`);
        }
      }
    } finally { setChecking(false); }
  }

  function showSolution() {
    setPlayed(null);
    if (mode === 'defend') suite.open(startFen, [trap.blunder, ...trap.punish], me, 'Si tu tombes dans le piège');
    else suite.open(startFen, trap.punish, me, 'La punition');
    finish('solved', false);
  }

  function restart() {
    suite.close();
    setPhase('play'); setTries(0); setHints(0); setMsg(null); setPlayed(null); ref.current = {}; setRun((r) => r + 1);
  }

  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (phase === 'play') {
    arrows.push({ from: lastUci.slice(0, 2), to: lastUci.slice(2, 4), color: ORANGE });
    if (hints >= 2) highlight[solutionUci.slice(0, 2)] = 'rgba(255, 170, 0, .7)';
  } else if (phase === 'solved' || (phase === 'won' && mode === 'defend')) {
    arrows.push({ from: solutionUci.slice(0, 2), to: solutionUci.slice(2, 4), color: GREEN });
  }
  const shownFen = suite.view?.fen ?? (played && phase !== 'play' ? (() => { const c = new Chess(startFen); c.move({ from: played.slice(0, 2), to: played.slice(2, 4), promotion: played[4] }); return c.fen(); })() : startFen);
  const lastCap = moveCaption(lastFrom, lastUci, me);
  const prompt = mode === 'defend'
    ? 'Il tend un piège. Trouve le bon coup : ne tombe pas dedans.'
    : `Il vient de faire la faute. Trouve le coup gagnant (${trap.gain}).`;

  return (
    <div className="play trap-ex" data-testid="trap-ex" data-mode={mode} data-phase={phase} data-solution={solutionUci} data-blunder={p.blunderUci}>
      <div className="board-col">
        <Board key={`${trap.id}-${mode}-${run}`} fen={shownFen} orientation={me} movable={phase === 'play' && !checking && !suite.active ? me : null}
          onMove={onMove} arrows={suite.view?.arrows ?? arrows} highlight={suite.view ? {} : highlight}
          lastMove={suite.view?.lastMove ?? (phase === 'play' ? { from: lastUci.slice(0, 2), to: lastUci.slice(2, 4) } : null)} />
      </div>
      <aside className="side-col">
        {suite.panel}
        {notice}
        <div className="card">
          <p className="muted small">{head ? `${head} · ` : ''}{mode === 'defend' ? 'Défends-toi' : 'Punis-le'} · {trap.name} · tu as les {me === 'w' ? 'Blancs' : 'Noirs'}</p>
          <h2 data-testid="trap-prompt">{prompt}</h2>
          <p data-testid="trap-last">Il vient de jouer : {lower(lastCap)} <span className="muted small">(flèche orange)</span></p>
          <SuiteButton label="Voir la partie jusqu’ici" testId="trap-history"
            onClick={() => suite.open(p.start, mode === 'defend' ? trap.line : [...trap.line, trap.blunder], me, 'La partie jusqu’ici')} />
        </div>
        {phase === 'play' && (
          <div className="card">
            {checking && <p className="pulse">Vérification par Stockfish…</p>}
            {msg && !checking && <p className="bad-text" data-testid="trap-msg"><CircleX aria-hidden className="ico sm" /> {msg}</p>}
            {hints >= 1 && <p className="term" data-testid="trap-hint">{mode === 'defend' ? trap.hintDefend : trap.hintPunish}</p>}
            {hints >= 2 && <p className="muted small" data-testid="trap-hint2">La pièce à jouer est surlignée.</p>}
            <div className="row">
              <button disabled={hints >= 2 || checking} onClick={() => setHints((h) => h + 1)}><Lightbulb aria-hidden className="ico" />Indice{hints === 1 ? ' (pièce à jouer)' : ''}</button>
              <button disabled={(tries < 2 && hints < 2) || checking} onClick={showSolution} title="Après 2 essais ratés ou 2 indices">Solution</button>
            </div>
            <p className="muted small">Solution : après 2 essais ratés ou 2 indices.</p>
          </div>
        )}
        {phase !== 'play' && (
          <div className={`card ${phase === 'won' ? 'good' : 'bad'}`} data-testid="trap-result">
            {phase === 'won' && <p><CircleCheck aria-hidden className="ico good-text" /> <b>{mode === 'defend' ? 'Bien défendu' : 'Bien puni'}{tries === 0 && hints === 0 ? ', sans indice' : ''} !</b></p>}
            {phase === 'fell' && <p><CircleX aria-hidden className="ico bad-text" /> <b>Tu es tombé dans le piège.</b> La suite se joue sur l’échiquier.</p>}
            {phase === 'solved' && <p><CircleX aria-hidden className="ico bad-text" /> Solution : {lower(moveCaption(startFen, solutionUci, me))}</p>}
            <p>{trap.lesson[0]}</p>
            <p>{trap.lesson[1]}</p>
            <p className="trap-rule"><b>Règle :</b> {trap.rule}</p>
            <div className="row suite-btns">
              {mode === 'defend' && <SuiteButton label="Voir le piège" testId="trap-suite-fall" onClick={() => suite.open(startFen, [trap.blunder, ...trap.punish], me, 'Si tu tombes dans le piège')} />}
              {mode === 'punish' && <SuiteButton label="Voir la punition" testId="trap-suite-punish" onClick={() => suite.open(startFen, trap.punish, me, 'La punition')} />}
            </div>
            <Notation><p>{fig([...trap.line, trap.blunder, ...trap.punish].map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${s}` : s)).join(' '))}</p></Notation>
            <div className="row">
              <button onClick={restart} data-testid="trap-restart"><RotateCcw aria-hidden className="ico" />Recommencer</button>
              {actions}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
