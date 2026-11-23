// Mode « Maîtrise de l'échiquier », chapitre 7 : rejouer de tête des parties courtes (7a) et partie à l'aveugle
// contre Maia (7b) — pièces cachées, cases visibles, coup adverse annoncé en texte, « Voir les pièces » compté.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { SHORT_GAMES } from '../data/boardGames';
import { fig } from '../lib/notation';
import { levelById, replayPassed, testPassed } from '../lib/board/levels';
import { saveReview, saveTest } from '../boardService';
import { answerFeedback, loadSoundSetting, soundForMove } from '../sound';
import { maia } from '../engines/maia';
import { waitOfflineReady } from '../offline';
import { getProfile } from '../db';
import { botRating } from '../lib/rating';
import { go } from '../router';
import { CircleCheck, CircleX, Eye, Flag } from '../icons';

const PEEK_MS = 3000;
const MIN_THINK_MS = 450;

const moveText = (sans: string[], start = 0) =>
  fig(sans.map((m, i) => ((start + i) % 2 === 0 ? `${(start + i) / 2 + 1}.${m}` : i === 0 ? `${Math.floor((start + i) / 2) + 1}…${m}` : m)).join(' '));

/** Bouton « Voir les pièces » : montre la position 3 s, chaque appui compte un coup d'œil. */
function usePeek() {
  const [peeks, setPeeks] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const peek = () => {
    setPeeks((n) => n + 1);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), PEEK_MS);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return { peeks, visible, peek };
}

// ---------------------------------------------------------------- 7a : rejouer de tête

export function BoardReplay({ review, onDone }: { review?: boolean; onDone?: (r: { passed: boolean; text: string }) => void }) {
  const [gi, setGi] = useState<number | null>(review ? Math.floor(Math.random() * SHORT_GAMES.length) : null);
  const [ply, setPly] = useState(0);
  const [errors, setErrors] = useState(0);
  const [miss, setMiss] = useState(0);            // erreurs sur le coup en cours
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState<{ passed: boolean; text: string } | null>(null);
  const { peeks, visible, peek } = usePeek();
  useEffect(() => { loadSoundSetting(); }, []);

  if (gi === null) {
    return (
      <div className="board-mastery">
        <h2>7a. Rejouer de tête</h2>
        <p className="muted">Les pièces sont cachées. Chaque coup s’affiche en notation : joue-le en touchant la case de départ puis la case d’arrivée (pour les deux camps).</p>
        {SHORT_GAMES.map((g, i) => (
          <button key={g.name} className="huge" onClick={() => setGi(i)}>{g.name} <span className="muted small">&nbsp;· {Math.ceil(g.moves.length / 2)} coups</span></button>
        ))}
      </div>
    );
  }
  const game = SHORT_GAMES[gi];
  const c = new Chess();
  for (const m of game.moves.slice(0, ply)) c.move(m);
  const fen = c.fen();
  const expected = ply < game.moves.length ? new Chess(fen).move(game.moves[ply]) : null;
  const arrows: BoardArrow[] = expected && miss >= 2 ? [{ from: expected.from, to: expected.to, color: 'rgba(30,160,60,.9)' }] : [];
  const last = ply > 0 ? (() => { const d = new Chess(); game.moves.slice(0, ply).forEach((m) => d.move(m)); return d.history({ verbose: true }).slice(-1)[0]; })() : null;

  async function finish(errs: number) {
    const r = { errors: errs, peeks };
    const passed = replayPassed(r);
    const text = `${game.name} rejouée : ${errs} erreur${errs > 1 ? 's' : ''}, ${peeks} coup${peeks > 1 ? 's' : ''} d’œil`;
    if (review) await saveReview(7, '7a', passed);
    else await saveTest('7a', passed, text, 100 - 10 * errs - 5 * peeks);
    const d = { passed, text };
    setDone(d);
    onDone?.(d);
  }

  function onMove(uci: string) {
    if (!expected || done) return;
    const ok = uci.slice(0, 4) === expected.from + expected.to && (!expected.promotion || uci[4] === expected.promotion);
    answerFeedback(ok);
    if (!ok) {
      setErrors((e) => e + 1); setMiss((m) => m + 1);
      setMsg(miss >= 1 ? `Pas tout à fait : la flèche verte montre ${fig(expected.san)}.` : 'Ce n’est pas ce coup. Réessaie.');
      return;
    }
    soundForMove(expected.san);
    setMsg(null); setMiss(0);
    const nextPly = ply + 1;
    setPly(nextPly);
    if (nextPly >= game.moves.length) finish(errors);
  }

  return (
    <div className="play" data-fen={fen} data-expected={expected ? expected.from + expected.to : ''}>
      <div className="board-col">
        <p className="announce" data-testid="announce">
          {expected ? <>Coup {Math.floor(ply / 2) + 1} des {ply % 2 === 0 ? 'Blancs' : 'Noirs'} : <b>{fig(expected.san)}</b></> : <b>{fig(game.moves[game.moves.length - 1])} — fin de la partie.</b>}
        </p>
        <Board fen={fen} orientation="w" movable={expected && !done ? c.turn() : null} onMove={onMove} hidePieces={!visible && !done}
          arrows={arrows} lastMove={last ? { from: last.from, to: last.to } : null}
          onIllegal={() => { answerFeedback(false); setErrors((e) => e + 1); setMiss((m) => m + 1); setMsg('Coup impossible depuis cette case. Réessaie.'); }} />
      </div>
      <aside className="side-col">
        <div className="card">
          <h3>{game.name}</h3>
          <p className="muted small">{game.note}</p>
          <p>Erreurs : <b>{errors}</b> · coups d’œil : <b data-testid="peeks">{peeks}</b></p>
          {msg && <p className="bad-text">{msg}</p>}
          {!done && <button onClick={peek} disabled={visible}><Eye aria-hidden className="ico" />Voir les pièces ({peeks})</button>}
        </div>
        <div className="card moves"><span className="muted small">Coups joués : </span>{ply ? moveText(game.moves.slice(0, ply)) : '—'}</div>
        {done && (
          <div className={`card ${done.passed ? 'good' : ''}`} data-testid="board-result">
            <h3>{done.passed ? <CircleCheck aria-hidden className="ico good-text" /> : <CircleX aria-hidden className="ico bad-text" />} {done.text}</h3>
            {!review && <div className="row">
              <button className="primary" onClick={() => go({ name: 'board', view: 'lesson', chapter: 7 })}>Retour au chapitre</button>
              <button onClick={() => location.reload()}>Autre partie</button>
            </div>}
          </div>
        )}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------- 7b : partie à l'aveugle contre Maia

const ELOS = [600, 800, 1000, 1200, 1400, 1600, 1800, 2000];

export function BoardBlindGame() {
  const [setup, setSetup] = useState<{ elo: number; color: 'w' | 'b' } | null>(null);
  const [elo, setElo] = useState(1000);
  const [color, setColor] = useState<'w' | 'b'>('w');
  useEffect(() => {
    getProfile().then((p) => { const b = botRating(p.rating); setElo(ELOS.reduce((a, x) => (Math.abs(x - b) < Math.abs(a - b) ? x : a), 1000)); });
  }, []);
  if (setup) return <BlindGame elo={setup.elo} myColor={setup.color} />;
  return (
    <div className="board-mastery">
      <h2>7b. Partie à l’aveugle</h2>
      <section className="card col">
        <p>Les pièces sont cachées, les cases restent visibles. Joue en touchant la case de départ puis la case d’arrivée ; le coup de Maia est annoncé en texte. « Voir les pièces » montre la position 3 secondes : pour valider le chapitre, finis la partie avec au plus 3 coups d’œil.</p>
        <label>Niveau de Maia
          <select value={elo} onChange={(e) => setElo(Number(e.target.value))} aria-label="Niveau de Maia">
            {ELOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <div className="row" role="radiogroup" aria-label="Ma couleur">
          {([['w', 'Blancs'], ['b', 'Noirs']] as const).map(([v, l]) => (
            <label key={v} className={`radio ${color === v ? 'on' : ''}`}><input type="radio" name="bcolor" checked={color === v} onChange={() => setColor(v)} /> {l}</label>
          ))}
        </div>
        <button className="primary huge" onClick={() => setSetup({ elo, color })}>Commencer la partie</button>
      </section>
    </div>
  );
}

function BlindGame({ elo, myColor }: { elo: number; myColor: 'w' | 'b' }) {
  const [uci, setUci] = useState<string[]>([]);
  const [loadPct, setLoadPct] = useState<number | null>(0);
  const [thinking, setThinking] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [illegal, setIllegal] = useState(0);
  const [ended, setEnded] = useState<{ reason: 'mate' | 'draw' | 'resign'; text: string; passed: boolean } | null>(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const { peeks, visible, peek } = usePeek();
  const busy = useRef(false);
  const level = levelById('7b')!;

  useEffect(() => {
    loadSoundSetting();
    (async () => {
      await waitOfflineReady((b, t) => setLoadPct(Math.min(99, Math.round((100 * b) / t))));
      maia.onProgress((l, t) => setLoadPct(t ? Math.round((100 * l) / t) : 0));
      try { await maia.load(); } catch (e) { setMsg('Impossible de charger Maia : ' + (e as Error).message); }
      maia.onProgress(null);
      setLoadPct(null);
    })();
  }, []);

  const c = new Chess();
  for (const u of uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  const sans = c.history();
  const myMoves = Math.ceil(sans.filter((_, i) => (i % 2 === 0) === (myColor === 'w')).length);
  const last = c.history({ verbose: true }).slice(-1)[0];

  const end = useCallback(async (reason: 'mate' | 'draw' | 'resign', text: string, nMy: number) => {
    const passed = testPassed(level.test, { finished: true, reason, myMoves: nMy, peeks });
    const full = `${text} — ${nMy} coup${nMy > 1 ? 's' : ''} joué${nMy > 1 ? 's' : ''}, ${peeks} coup${peeks > 1 ? 's' : ''} d’œil`;
    await saveTest('7b', passed, full, passed ? 100 - peeks : -1);
    setEnded({ reason, text: full, passed });
  }, [level, peeks]);

  const checkEnd = useCallback((g: Chess, list: string[]) => {
    const nMy = list.filter((_, i) => (i % 2 === 0) === (myColor === 'w')).length;
    if (g.isCheckmate()) { end('mate', g.turn() === myColor ? 'Mat : Maia a gagné' : 'Mat : tu as gagné', nMy); return true; }
    if (g.isDraw() || g.isStalemate()) { end('draw', 'Partie nulle', nMy); return true; }
    return false;
  }, [end, myColor]);

  // Tour de Maia
  useEffect(() => {
    if (loadPct !== null || ended || busy.current) return;
    const g = new Chess();
    for (const u of uci) g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    if (g.isGameOver() || g.turn() === myColor) return;
    busy.current = true;
    setThinking(true);
    (async () => {
      try {
        const t0 = performance.now();
        const r = await maia.chooseMove(g.fen(), uci, elo, Math.max(550, elo - 50));
        const wait = MIN_THINK_MS - (performance.now() - t0);
        if (wait > 0) await new Promise((res) => setTimeout(res, wait));
        const mv = g.move({ from: r.uci.slice(0, 2), to: r.uci.slice(2, 4), promotion: r.uci[4] });
        const next = [...uci, r.uci];
        soundForMove(mv.san, g.isGameOver());
        setUci(next);
        checkEnd(g, g.history());
      } catch (e) { setMsg('Erreur de Maia : ' + (e as Error).message); }
      finally { busy.current = false; setThinking(false); }
    })();
  }, [uci, loadPct, ended, elo, myColor, checkEnd]);

  function onMove(u: string) {
    if (ended) return;
    const g = new Chess(c.fen());
    const mv = g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    soundForMove(mv.san, g.isGameOver());
    setMsg(null);
    const next = [...uci, u];
    setUci(next);
    const all = new Chess(); next.forEach((x) => all.move({ from: x.slice(0, 2), to: x.slice(2, 4), promotion: x[4] }));
    checkEnd(all, all.history());
  }

  // Dernier coup joué par Maia (les Blancs ont joué en dernier si le nombre de demi-coups est impair).
  const lastMaia = last && (sans.length % 2 === 1) === (myColor === 'b') ? last : null;
  const myTurn = c.turn() === myColor && !ended && loadPct === null && !thinking;
  return (
    <div className="play" data-fen={c.fen()} data-turn={myTurn ? 'me' : 'maia'}>
      <div className="board-col">
        <p className="announce" data-testid="announce">
          {loadPct !== null ? <>Chargement de Maia… {loadPct} %</>
            : thinking ? <span className="pulse">Maia réfléchit…</span>
              : lastMaia ? <>Maia a joué : <b>{fig(lastMaia.san)}</b>{lastMaia.san.includes('+') ? ' — échec !' : ''}</>
                : myTurn ? 'À toi de jouer.' : ''}
        </p>
        <Board fen={c.fen()} orientation={myColor} movable={myTurn ? myColor : null} onMove={onMove} hidePieces={!visible && !ended}
          lastMove={last ? { from: last.from, to: last.to } : null}
          onIllegal={(f, t) => { answerFeedback(false); setIllegal((n) => n + 1); setMsg(`Coup impossible : ${f} → ${t}.`); }} />
        <div className="row">
          <button onClick={peek} disabled={visible || !!ended}><Eye aria-hidden className="ico" />Voir les pièces ({peeks})</button>
          <button className="danger" disabled={!!ended} onClick={() => setConfirmResign(true)}><Flag aria-hidden className="ico" />Abandonner</button>
        </div>
      </div>
      <aside className="side-col">
        <div className="card">
          <h3>À l’aveugle contre Maia {elo}</h3>
          <p>Tu as les {myColor === 'w' ? 'Blancs' : 'Noirs'} · coups d’œil : <b data-testid="peeks">{peeks}</b> / 3 · coups impossibles : {illegal}</p>
          {msg && <p className="bad-text" data-testid="blind-msg">{msg}</p>}
        </div>
        <div className="card moves" data-testid="blind-moves"><span className="muted small">Coups : </span>{sans.length ? moveText(sans) : '—'}</div>
        {ended && (
          <div className={`card ${ended.passed ? 'good' : 'bad'}`} data-testid="board-result">
            <h3>{ended.passed ? <><CircleCheck aria-hidden className="ico good-text" /> Chapitre 7 validé</> : <><CircleX aria-hidden className="ico bad-text" /> Pas encore validé</>}</h3>
            <p>{ended.text}.</p>
            <button className="primary" onClick={() => go({ name: 'board', view: 'lesson', chapter: 7 })}>Retour au chapitre</button>
          </div>
        )}
      </aside>
      {confirmResign && (
        <div className="modal" role="dialog">
          <div className="modal-box">
            <p>Abandonner ? La partie ne compte pour la validation qu’après {level.test.type === 'blind' ? level.test.minMovesIfResign : 20} coups joués.</p>
            <div className="row">
              <button onClick={() => setConfirmResign(false)}>Continuer</button>
              <button className="danger" onClick={() => { setConfirmResign(false); end('resign', 'Abandon', myMoves); }}>Abandonner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
