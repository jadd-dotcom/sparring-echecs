import { useCallback, useEffect, useRef, useState } from 'react';
import Board from '../Board';
import { maia } from '../engines/maia';
import { getCurrent, setCurrent, db, type CurrentGame, type Game } from '../db';
import { autoResult, chessFrom, finishGame, newCurrentGame } from '../game';
import { go } from '../router';
import { replay } from '../analysis';
import { waitOfflineReady } from '../offline';

const MIN_THINK_MS = 450; // pour que la réponse ne soit pas instantanée
/** Maia accepte la nulle si sa probabilité de gain est ≤ 55 %. */
const DRAW_ACCEPT = 0.55;

export default function Play() {
  const [cur, setCur] = useState<CurrentGame | null>(null);
  const [loadPct, setLoadPct] = useState<number | null>(0);
  const [prep, setPrep] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState<Game | null>(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    (async () => {
      setCur((await getCurrent()) ?? (await newCurrentGame()));
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
  }, []);

  const end = useCallback(async (g: CurrentGame, result: Game['result'], termination: string) => {
    const id = await finishGame(g, result, termination);
    setEnded((await db.games.get(id))!);
  }, []);

  const apply = useCallback(async (g: CurrentGame, uci: string, ms?: number) => {
    const next: CurrentGame = { ...g, uci: [...g.uci, uci], maiaMs: ms !== undefined ? [...g.maiaMs, ms] : g.maiaMs };
    await setCurrent(next);
    setCur(next);
    const r = autoResult(chessFrom(next));
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
        const { uci, prediction } = await maia.chooseMove(c.fen(), cur.uci, cur.botElo, cur.rating);
        const wait = MIN_THINK_MS - (performance.now() - t0);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        await apply(cur, uci, prediction.ms);
      } catch (e) {
        setError('Erreur de Maia : ' + (e as Error).message);
      } finally {
        busy.current = false;
        setThinking(false);
      }
    })();
  }, [cur, ended, error, apply]);

  if (error) return <div className="card error">{error} <button onClick={() => location.reload()}>Recharger</button></div>;
  if (!cur) return null;

  const chess = chessFrom(cur);
  const myTurn = chess.turn() === cur.myColor && !ended;
  const { san } = replay(cur.startFen, cur.uci);
  const last = cur.uci[cur.uci.length - 1];
  const highlight: Record<string, string> = last
    ? { [last.slice(0, 2)]: 'rgba(255,255,0,.35)', [last.slice(2, 4)]: 'rgba(255,255,0,.45)' } : {};

  async function onMove(uci: string) {
    if (!cur || !myTurn || busy.current) return;
    setMsg(null);
    await apply(cur, uci);
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

  async function resign() {
    if (!cur) return;
    setConfirmResign(false);
    await end(cur, cur.myColor === 'w' ? '0-1' : '1-0', 'Abandon');
  }

  const moveRows: string[] = [];
  for (let i = 0; i < san.length; i += 2) moveRows.push(`${i / 2 + 1}. ${san[i]} ${san[i + 1] ?? ''}`);

  return (
    <div className="play">
      <div className="board-col">
        <div className="player-line">
          <span>🤖 Maia · {Math.round(cur.botElo)}</span>
          {thinking && loadPct === null && <span className="muted pulse">réfléchit…</span>}
        </div>
        <Board fen={chess.fen()} orientation={cur.myColor} movable={myTurn && loadPct === null ? cur.myColor : null}
          onMove={onMove} highlight={highlight} />
        <div className="player-line">
          <span>🙂 Toi · {Math.round(cur.rating)} ({cur.myColor === 'w' ? 'Blancs' : 'Noirs'})</span>
          {myTurn && loadPct === null && <span className="muted">à toi de jouer</span>}
        </div>
      </div>
      <aside className="side-col">
        {loadPct !== null && (
          <div className="card">{prep ? <>Premier lancement : téléchargement pour le hors ligne ({prep})…</> : <>Chargement de Maia… {loadPct}%</>}
            <div className="progress"><div style={{ width: loadPct + '%' }} /></div>
          </div>
        )}
        {msg && <div className="card notice">{msg}</div>}
        <div className="moves card">{moveRows.length ? moveRows.map((r, i) => <div key={i}>{r}</div>) : <span className="muted">Aucun coup joué</span>}</div>
        {!ended && (
          <div className="row">
            <button disabled={!myTurn} onClick={offerDraw}>½ Proposer nulle</button>
            <button className="danger" onClick={() => setConfirmResign(true)}>🏳 Abandonner</button>
          </div>
        )}
      </aside>

      {confirmResign && (
        <div className="modal"><div className="modal-box">
          <p>Abandonner la partie ? Elle comptera comme une défaite.</p>
          <div className="row">
            <button onClick={() => setConfirmResign(false)}>Continuer à jouer</button>
            <button className="danger" onClick={resign}>Abandonner</button>
          </div>
        </div></div>
      )}

      {ended && (
        <div className="modal"><div className="modal-box">
          <h2>{ended.score === 1 ? 'Victoire !' : ended.score === 0 ? 'Défaite' : 'Partie nulle'}</h2>
          <p>{ended.termination} · {ended.result}</p>
          <p>Niveau : {Math.round(ended.ratingBefore!)} → <b>{Math.round(ended.ratingAfter!)}</b>{' '}
            ({ended.ratingAfter! - ended.ratingBefore! >= 0 ? '+' : ''}{Math.round(ended.ratingAfter! - ended.ratingBefore!)})</p>
          <div className="col">
            <button className="primary" onClick={() => go({ name: 'review', id: ended.id! })}>Analyser mes coups</button>
            <button onClick={async () => { busy.current = false; setEnded(null); setMsg(null); setCur(await newCurrentGame()); }}>Nouvelle partie</button>
          </div>
        </div></div>
      )}
    </div>
  );
}
