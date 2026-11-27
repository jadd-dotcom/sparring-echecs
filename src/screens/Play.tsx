import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { fig } from '../lib/notation';
import Board, { type BoardArrow } from '../Board';
import { MoveList, NavBanner, NavBar } from '../MoveNav';
import { useMoveNav } from '../useMoveNav';
import { loadSoundSetting, soundForMove } from '../sound';
import { stockfish } from '../engines/stockfish';
import { maia } from '../engines/maia';
import { getCurrent, setCurrent, db, type CurrentGame, type Game, type Opening } from '../db';
import { autoResult, cancelCurrentGame, chessFrom, finishGame, newCurrentGame } from '../game';
import { canCancel, CANCEL_MAX_MY_MOVES, myMovesPlayed } from '../lib/gameRules';
import { go } from '../router';
import { replay } from '../analysis';
import { waitOfflineReady } from '../offline';
import { forcedMove } from '../lib/repertoire';
import { recordBookExit } from '../openings';
import { ThreatCheck } from '../ThreatUi';
import { useSuite } from '../Suite';
import { BookOpen, Bot, CircleDashed, Flag, Lightbulb, Undo2, User, X } from '../icons';

const MIN_THINK_MS = 450; // pour que la réponse ne soit pas instantanée
/** Maia accepte la nulle si sa probabilité de gain est ≤ 55 %. */
const DRAW_ACCEPT = 0.55;

export default function Play({ opening, unrated }: { opening?: string; unrated?: boolean }) {
  const [cur, setCur] = useState<CurrentGame | null>(null);
  const [loadPct, setLoadPct] = useState<number | null>(0);
  const [prep, setPrep] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState<Game | null>(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const busy = useRef(false);
  const [op, setOp] = useState<Opening | null>(null);
  // Assistance (partie non comptée uniquement)
  const [hint, setHint] = useState<{ fen: string; uci: string; level: 1 | 2 } | null>(null);
  const [hintBusy, setHintBusy] = useState(false);
  // « Qu'est-ce qu'il menace ? » : flèche rouge de sa menace (pour la position où elle a été demandée), « Voir la suite ».
  const [threatArrows, setThreatArrows] = useState<{ fen: string; a: BoardArrow[] }>({ fen: '', a: [] });
  const suite = useSuite();
  useEffect(() => { loadSoundSetting(); }, []);

  useEffect(() => {
    (async () => {
      const existing = await getCurrent();
      if (existing && opening && existing.openingId !== opening) {
        setMsg('Une partie est déjà en cours : termine-la avant d’en commencer une autre.');
      }
      const g = existing ?? (await newCurrentGame(opening, { unrated }));
      if (g.openingId) setOp((await db.openings.get(g.openingId)) ?? null);
      setCur(g);
      // 1er lancement : on laisse le service worker tout mettre en cache (une seule fois).
      await waitOfflineReady((b, t) => {
        setPrep(`${(b / 1e6).toFixed(0)} / ${(t / 1e6).toFixed(0)} Mo`);
        setLoadPct(Math.min(99, Math.round((100 * b) / t)));
      });
      setPrep(null);
      maia.onProgress((l, t) => setLoadPct(t ? Math.round((100 * l) / t) : 0));
      try { await maia.load(); } catch (e) { setError('Impossible de charger Maia : ' + (e as Error).message); }
      setLoadPct(null);
      maia.onProgress(null);
    })();
  }, [opening, unrated]);

  const end = useCallback(async (g: CurrentGame, result: Game['result'], termination: string) => {
    const id = await finishGame(g, result, termination);
    setEnded((await db.games.get(id))!);
    // Partie à thème : sortie du répertoire + trou éventuel (Stockfish), en arrière-plan.
    if (g.openingId) recordBookExit(id).catch(console.error);
    // Avant tout autre écran : résultat, puis mes erreurs et gaffes à commenter (« ce que je pensais »).
    go({ name: 'comment', id });
  }, []);

  const apply = useCallback(async (g: CurrentGame, uci: string, ms?: number) => {
    // Partie annulée ou terminée entre-temps (ex. annulation pendant que Maia réfléchit) : on n'écrit rien.
    const live = await getCurrent();
    if (!live || live.startedAt !== g.startedAt) return g;
    const next: CurrentGame = { ...g, uci: [...g.uci, uci], maiaMs: ms !== undefined ? [...g.maiaMs, ms] : g.maiaMs };
    await setCurrent(next);
    setCur(next);
    const c = chessFrom(next);
    const r = autoResult(c);
    soundForMove(c.history().slice(-1)[0] ?? '', !!r);
    if (r) await end(next, r.result, r.termination);
    return next;
  }, [end]);

  // Tour de Maia
  useEffect(() => {
    if (!cur || ended || busy.current || error) return;
    const c = chessFrom(cur);
    if (c.isGameOver() || c.turn() === cur.myColor) return;
    busy.current = true;
    setThinking(true);
    (async () => {
      try {
        const t0 = performance.now();
        // Partie à thème : coups adverses qui définissent l'ouverture (ex. 1.d4 et 2.c4), ensuite Maia libre.
        const forced = op ? forcedMove(c.fen(), cur.uci.length, cur.myColor, op.forced) : null;
        let uci: string;
        let ms: number | undefined;
        if (forced) uci = forced;
        else {
          const r = await maia.chooseMove(c.fen(), cur.uci, cur.botElo, cur.rating);
          uci = r.uci; ms = r.prediction.ms;
        }
        const wait = MIN_THINK_MS - (performance.now() - t0);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        await apply(cur, uci, ms);
      } catch (e) {
        setError('Erreur de Maia : ' + (e as Error).message);
      } finally {
        busy.current = false;
        setThinking(false);
      }
    })();
  }, [cur, ended, error, apply, op]);

  const navTotal = cur?.uci.length ?? 0;
  const sanAll = cur ? replay(cur.startFen, cur.uci).san : [];
  const nav = useMoveNav(navTotal, (i) => soundForMove(sanAll[i] ?? ''));

  if (error) return <div className="card error">{error} <button onClick={() => location.reload()}>Recharger</button></div>;
  if (!cur) return null;

  const chess = chessFrom(cur);
  const myTurn = chess.turn() === cur.myColor && !ended;
  const san = sanAll;
  const live = nav.live;
  // Position affichée : actuelle, ou celle revue (lecture seule, aucun effet sur la partie).
  const shown = live ? chess : (() => { const c = new Chess(cur.startFen); cur.uci.slice(0, nav.at).forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); return c; })();
  const lastUci = nav.at > 0 ? cur.uci[nav.at - 1] : null;
  const lastMove = lastUci ? { from: lastUci.slice(0, 2), to: lastUci.slice(2, 4) } : null;
  const canPlay = live && myTurn && loadPct === null;
  // Dernier coup de Maia (au-dessus de l'échiquier)
  const lastIsMaia = cur.uci.length > 0 && chess.turn() === cur.myColor;   // le dernier coup a été joué par l'autre camp
  const lastMaiaSan = lastIsMaia ? san[san.length - 1] : null;

  // Assistance (non comptée)
  const assist = !!cur.unrated && !ended;
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (assist && live) {
    if (hint && hint.fen === chess.fen()) {
      highlight[hint.uci.slice(0, 2)] = 'rgba(30,160,60,.55)';
      if (hint.level === 2) arrows.push({ from: hint.uci.slice(0, 2), to: hint.uci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
    }
    if (threatArrows.fen === chess.fen()) arrows.push(...threatArrows.a);
  }
  const myMovesCount = myMovesPlayed(cur);

  async function onMove(uci: string) {
    if (!cur || !canPlay || busy.current) return;
    setMsg(null);
    setHint(null);
    suite.close();
    await apply(cur, uci);
  }

  async function askHint() {
    if (!cur || !canPlay || hintBusy) return;
    const fen = chess.fen();
    if (hint && hint.fen === fen) { setHint({ ...hint, level: 2 }); return; }
    setHintBusy(true);
    try {
      const r = await stockfish.analyse(fen, 700);
      if (r.bestMove) setHint({ fen, uci: r.bestMove, level: 1 });
    } finally { setHintBusy(false); }
  }

  async function takeBack() {
    if (!cur || !assist || !live || !myTurn || busy.current || myMovesCount === 0) return;
    busy.current = true;
    try {
      // C'est à moi : on retire la réponse de Maia et mon dernier coup.
      const next: CurrentGame = { ...cur, uci: cur.uci.slice(0, -2), maiaMs: cur.maiaMs.slice(0, -1) };
      await setCurrent(next);
      setCur(next);
      setHint(null);
      setMsg('Coup repris (partie non comptée).');
    } finally { busy.current = false; }
  }

  async function offerDraw() {
    if (!cur || !myTurn || busy.current) return;
    busy.current = true;
    try {
      // Évaluation du point de vue du camp au trait (moi) → probabilité de gain de Maia.
      const p = await maia.predict(chess.fen(), cur.uci, cur.rating, cur.botElo);
      const botWin = 1 - p.winProbability;
      if (cur.uci.length >= 20 && botWin <= DRAW_ACCEPT) await end(cur, '1/2-1/2', 'Nulle acceptée');
      else setMsg(cur.uci.length < 20 ? 'Maia refuse : trop tôt dans la partie.' : 'Maia refuse la nulle et continue de jouer.');
    } finally { busy.current = false; }
  }

  async function cancelGame() {
    setConfirmCancel(false);
    try {
      await cancelCurrentGame();
      go({ name: 'home' });
    } catch (e) { setMsg((e as Error).message); }
  }

  async function resign() {
    if (!cur) return;
    setConfirmResign(false);
    await end(cur, cur.myColor === 'w' ? '0-1' : '1-0', 'Abandon');
  }

  return (
    <div className="play">
      <div className="board-col">
        {op && <div className="theme-line"><BookOpen aria-hidden className="ico sm" /> Partie à thème : <b>{op.name}</b></div>}
        {cur.unrated && <div className="theme-line"><CircleDashed aria-hidden className="ico sm" /> Partie non comptée : sans effet sur ton niveau</div>}
        <div className="player-line">
          <span className="who"><span className="avatar bot"><Bot aria-hidden /></span>Maia <b className="elo">{Math.round(cur.botElo)}</b></span>
          {thinking && loadPct === null && <span className="muted pulse">réfléchit…</span>}
        </div>
        {live
          ? <div className="last-move">{lastMaiaSan ? <>Maia a joué : <b>{fig(lastMaiaSan)}</b></> : ''}</div>
          : <NavBanner nav={nav} />}
        {suite.view
          ? <Board fen={suite.view.fen} orientation={cur.myColor} movable={null} arrows={suite.view.arrows} lastMove={suite.view.lastMove} />
          : <Board fen={shown.fen()} orientation={cur.myColor} movable={canPlay ? cur.myColor : null}
            onMove={onMove} lastMove={lastMove} arrows={arrows} highlight={highlight} onTap={live ? undefined : nav.toLive} />}
        <NavBar nav={nav} />
        <div className="player-line">
          <span className="who"><span className="avatar me"><User aria-hidden /></span>Toi <b className="elo">{Math.round(cur.rating)}</b> <span className="muted small">({cur.myColor === 'w' ? 'Blancs' : 'Noirs'})</span></span>
          {myTurn && live && loadPct === null && <span className="muted">à toi de jouer</span>}
        </div>
      </div>
      <aside className="side-col">
        {loadPct !== null && (
          <div className="card">{prep ? <>Premier lancement : téléchargement pour le hors ligne ({prep})…</> : <>Chargement de Maia… {loadPct}%</>}
            <div className="progress"><div style={{ width: loadPct + '%' }} /></div>
          </div>
        )}
        {suite.panel}
        {msg && <div className="card notice">{msg}</div>}
        <MoveList san={san} at={nav.at} onPick={nav.goTo} />
        {assist && (
          <div className="card assist">
            <p className="muted small">Assistance (partie non comptée)</p>
            <div className="row">
              <button disabled={!canPlay || hintBusy} onClick={askHint}><Lightbulb aria-hidden className="ico" />{hint && hint.fen === chess.fen() ? 'Montrer le coup' : 'Indice'}</button>
              <ThreatCheck fen={chess.fen()} me={cur.myColor} disabled={!canPlay}
                onArrows={(f, a) => setThreatArrows({ fen: f, a })}
                onSuite={(f, line, title) => suite.open(f, line, cur.myColor, title)} />
              <button disabled={!live || !myTurn || thinking || myMovesCount === 0} onClick={takeBack}><Undo2 aria-hidden className="ico" />Reprendre mon coup</button>
            </div>
          </div>
        )}
        {!ended && (
          <div className="row actions">
            {canCancel(cur) && (
              <button onClick={() => setConfirmCancel(true)} title={`Possible pendant tes ${CANCEL_MAX_MY_MOVES} premiers coups`}><X aria-hidden className="ico" />Annuler la partie</button>
            )}
            <button disabled={!myTurn} onClick={offerDraw}>½ Proposer nulle</button>
            <button className="danger" onClick={() => setConfirmResign(true)}><Flag aria-hidden className="ico" />Abandonner</button>
          </div>
        )}
        {!ended && canCancel(cur) && <p className="muted small">Annulation possible pendant tes {CANCEL_MAX_MY_MOVES} premiers coups ; ensuite, seulement nulle ou abandon.</p>}
      </aside>

      {confirmCancel && (
        <div className="modal"><div className="modal-box">
          <p>Annuler la partie ? Elle sera supprimée, sans aucun effet sur ton niveau.</p>
          <div className="row">
            <button onClick={() => setConfirmCancel(false)}>Continuer à jouer</button>
            <button className="primary" onClick={cancelGame}>Annuler la partie</button>
          </div>
        </div></div>
      )}

      {confirmResign && (
        <div className="modal"><div className="modal-box">
          <p>Abandonner la partie ? Elle comptera comme une défaite.</p>
          <div className="row">
            <button onClick={() => setConfirmResign(false)}>Continuer à jouer</button>
            <button className="danger" onClick={resign}>Abandonner</button>
          </div>
        </div></div>
      )}

    </div>
  );
}
