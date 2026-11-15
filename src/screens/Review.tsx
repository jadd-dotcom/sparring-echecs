import { useEffect, useState } from 'react';
import Board, { type BoardArrow } from '../Board';
import { db, type Game } from '../db';
import { analyseGame, replay } from '../analysis';
import { SEVERITY_LABEL, type Severity } from '../lib/winpct';

const SEV_CLASS: Record<Severity, string> = { ok: '', inaccuracy: 'sev-inacc', mistake: 'sev-mist', blunder: 'sev-blund' };
const SEV_ICON: Record<Severity, string> = { ok: '', inaccuracy: '?!', mistake: '?', blunder: '??' };

export default function Review({ id }: { id: number }) {
  const [game, setGame] = useState<Game | null>(null);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [ply, setPly] = useState(-1); // -1 = position de départ
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const g = await db.games.get(id);
      if (!g) { setErr('Partie introuvable'); return; }
      setGame(g);
      if (!g.analysis) {
        try {
          const a = await analyseGame(id, (d, t) => !cancelled && setProgress([d, t]));
          if (!cancelled) { setGame(a); setProgress(null); }
        } catch (e) { setErr('Analyse impossible : ' + (e as Error).message); }
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (err) return <div className="card error">{err}</div>;
  if (!game) return null;
  if (progress || !game.analysis) {
    const [d, t] = progress ?? [0, 1];
    return (
      <div className="card center">
        <h2>Analyse de tes coups par Stockfish…</h2>
        <div className="progress big"><div style={{ width: (100 * d) / t + '%' }} /></div>
        <p className="muted">{d} / {t} positions (~{Math.ceil(((t - d) * 0.55))} s restantes)</p>
      </div>
    );
  }

  const { fens, san } = replay(game.startFen, game.uci);
  const byPly = new Map(game.analysis.map((a) => [a.ply, a]));
  const a = ply >= 0 ? byPly.get(ply) : undefined;
  const isMistake = a && a.severity !== 'ok';
  // Sur une erreur : position AVANT le coup, flèche rouge = mon coup, verte = meilleur coup.
  const fen = isMistake ? fens[ply] : fens[ply + 1];
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (isMistake) {
    arrows.push({ from: a.uci.slice(0, 2), to: a.uci.slice(2, 4), color: 'rgba(220,40,40,.85)' });
    if (a.bestUci) arrows.push({ from: a.bestUci.slice(0, 2), to: a.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  } else if (ply >= 0) {
    const u = game.uci[ply];
    highlight[u.slice(0, 2)] = 'rgba(255,255,0,.35)';
    highlight[u.slice(2, 4)] = 'rgba(255,255,0,.45)';
    if (a && a.bestUci && a.bestUci !== a.uci) {
      // Coup correct mais pas le meilleur : flèche verte sur la position d'avant non affichée → on l'indique en texte.
    }
  }
  const c = game.counts ?? { inaccuracy: 0, mistake: 0, blunder: 0 };
  const errorsPlies = game.analysis.filter((x) => x.severity !== 'ok').map((x) => x.ply);

  return (
    <div className="play">
      <div className="board-col">
        <Board fen={fen} orientation={game.myColor} movable={null} arrows={arrows} highlight={highlight} />
        <div className="nav row">
          <button onClick={() => setPly(-1)}>⏮</button>
          <button onClick={() => setPly(Math.max(-1, ply - 1))}>◀</button>
          <button onClick={() => setPly(Math.min(game.uci.length - 1, ply + 1))}>▶</button>
          <button onClick={() => setPly(game.uci.length - 1)}>⏭</button>
          <button onClick={() => { const n = errorsPlies.find((p) => p > ply); if (n !== undefined) setPly(n); }}>Erreur suivante</button>
        </div>
      </div>
      <aside className="side-col">
        <div className="card">
          <b>{game.result}</b> · {game.termination} · tu avais les {game.myColor === 'w' ? 'Blancs' : 'Noirs'}
          <div className="counts">
            <span className="sev-inacc">?! {c.inaccuracy} imprécision{c.inaccuracy > 1 ? 's' : ''}</span>
            <span className="sev-mist">? {c.mistake} erreur{c.mistake > 1 ? 's' : ''}</span>
            <span className="sev-blund">?? {c.blunder} gaffe{c.blunder > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="card explain">
          {ply < 0 && <span className="muted">Touche un coup ou utilise les flèches.</span>}
          {ply >= 0 && !a && <span>Coup de Maia : <b>{san[ply]}</b></span>}
          {a && a.severity === 'ok' && (
            <span>Tu as joué <b>{a.san}</b> — bon coup{a.bestSan && a.bestSan !== a.san ? ` (Stockfish préférait ${a.bestSan})` : ''}.
              {' '}Gain estimé : {Math.round(a.wpAfter)} %</span>
          )}
          {isMistake && (
            <span>
              <b className={SEV_CLASS[a.severity]}>{SEVERITY_LABEL[a.severity]}</b> : tu as joué <b>{a.san}</b> (flèche rouge).<br />
              Meilleur coup : <b>{a.bestSan}</b> (flèche verte).<br />
              Tes chances de gain : {Math.round(a.wpBefore)} % → {Math.round(a.wpAfter)} % (−{Math.round(a.drop)} pts)
            </span>
          )}
        </div>
        <div className="moves card grid">
          {san.map((s, i) => {
            const an = byPly.get(i);
            return (
              <button key={i} className={`mv ${i === ply ? 'active' : ''} ${an ? SEV_CLASS[an.severity] : 'theirs'}`} onClick={() => setPly(i)}>
                {i % 2 === 0 ? `${i / 2 + 1}.` : ''}{s}{an ? SEV_ICON[an.severity] : ''}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
