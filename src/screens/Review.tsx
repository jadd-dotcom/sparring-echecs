import { useEffect, useRef, useState } from 'react';
import Board, { type BoardArrow } from '../Board';
import { db, type Game } from '../db';
import { analyseGame, replay } from '../analysis';
import { SEVERITY_LABEL, type Severity } from '../lib/winpct';
import { recordBookExit } from '../openings';
import { MOTIF_LABEL } from '../lib/report/motifs';
import { Chess } from 'chess.js';

const SEV_CLASS: Record<Severity, string> = { ok: '', inaccuracy: 'sev-inacc', mistake: 'sev-mist', blunder: 'sev-blund' };
const SEV_ICON: Record<Severity, string> = { ok: '', inaccuracy: '?!', mistake: '?', blunder: '??' };

/** « Ce que je pensais » : 1-2 phrases, enregistrées automatiquement. */
function ThoughtBox({ game, ply, onSaved }: { game: Game; ply: number; onSaved: (t: Record<number, string>) => void }) {
  const [text, setText] = useState(game.thoughts?.[ply] ?? '');
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = async (v: string) => {
    const fresh = (await db.games.get(game.id!))?.thoughts ?? {};
    const thoughts = { ...fresh };
    if (v.trim()) thoughts[ply] = v.trim(); else delete thoughts[ply];
    await db.games.update(game.id!, { thoughts });
    onSaved(thoughts);
    setSaved(true);
  };
  return (
    <label className="thought">Ce que je pensais <span className="muted small">(facultatif, 1-2 phrases)</span>
      <textarea rows={2} maxLength={400} value={text} placeholder="ex. Je voulais attaquer le roi, je n’ai pas vu son fou."
        onChange={(e) => {
          setText(e.target.value); setSaved(false);
          if (timer.current) clearTimeout(timer.current);
          const v = e.target.value;
          timer.current = setTimeout(() => save(v), 600);
        }}
        onBlur={() => { if (timer.current) clearTimeout(timer.current); if (!saved) save(text); }} />
      <span className="muted small">{saved ? (text.trim() ? '✓ enregistré' : '') : '…'}</span>
    </label>
  );
}

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
      if (g.openingId && g.bookExit === undefined) {
        const withExit = await recordBookExit(id);
        if (!cancelled && withExit) setGame((cur) => ({ ...(cur ?? withExit), bookExit: withExit.bookExit }));
      }
      if (!g.analysis) {
        try {
          const a = await analyseGame(id, (d, t) => !cancelled && setProgress([d, t]));
          if (!cancelled) { setGame((cur) => ({ ...a, bookExit: a.bookExit ?? cur?.bookExit })); setProgress(null); }
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
        <p className="muted">{d < t - 1 ? `${Math.floor(d)} / ${t - 1} positions` : 'Détail des erreurs (suites, motifs)…'} · {Math.round((100 * d) / t)} %</p>
      </div>
    );
  }

  const { fens, san } = replay(game.startFen, game.uci);
  const byPly = new Map(game.analysis.map((a) => [a.ply, a]));
  const a = ply >= 0 ? byPly.get(ply) : undefined;
  const isMistake = a && a.severity !== 'ok';
  const exit = game.bookExit ?? null;
  const isMyExit = exit?.by === 'me' && ply === exit.ply;
  // Sur une erreur ou une sortie du répertoire : position AVANT le coup, flèche rouge = mon coup,
  // verte = meilleur coup Stockfish, bleue = coup prévu par le répertoire.
  const fen = isMistake || isMyExit ? fens[ply] : fens[ply + 1];
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (isMyExit) {
    for (const sanExp of exit!.expectedSan) {
      const m = new Chess(fens[ply]).move(sanExp);
      arrows.push({ from: m.from, to: m.to, color: 'rgba(40,110,230,.85)' });
    }
    if (!isMistake) arrows.push({ from: game.uci[ply].slice(0, 2), to: game.uci[ply].slice(2, 4), color: 'rgba(220,40,40,.85)' });
  }
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
        {game.openingId && (
          <div className="card book">
            {exit === null && <span>📖 Partie entièrement dans ton répertoire.</span>}
            {exit?.by === 'end' && <span>📖 Tu as suivi ton répertoire jusqu’au bout de la ligne (coup {Math.floor(exit.ply / 2) + 1}).</span>}
            {exit?.by === 'me' && (
              <span>📖 <b>Sortie du répertoire</b> au coup {Math.floor(exit.ply / 2) + 1}{exit.ply % 2 ? '…' : '.'} : tu as joué <b>{exit.playedSan}</b>,
                {' '}ton répertoire prévoit <b>{exit.expectedSan.join(' ou ')}</b> (flèche bleue).{' '}
                <button className="small" onClick={() => setPly(exit.ply)}>Voir</button></span>
            )}
            {exit?.by === 'opponent' && (
              <span>📖 L’adversaire a quitté ton répertoire avec <b>{exit.playedSan}</b> (coup {Math.floor(exit.ply / 2) + 1}).
                {' '}Position ajoutée aux <b>trous du répertoire</b> avec le meilleur coup Stockfish.</span>
            )}
          </div>
        )}
        <div className="card explain">
          {ply < 0 && <span className="muted">Touche un coup ou utilise les flèches.</span>}
          {ply >= 0 && !a && <span>Coup de Maia : <b>{san[ply]}</b></span>}
          {isMyExit && <><span>📖 Répertoire : <b>{exit!.expectedSan.join(' ou ')}</b> (flèche bleue) au lieu de {exit!.playedSan}.</span><br /></>}
          {a && a.severity === 'ok' && (
            <span>Tu as joué <b>{a.san}</b> — bon coup{a.bestSan && a.bestSan !== a.san ? ` (Stockfish préférait ${a.bestSan})` : ''}.
              {' '}Gain estimé : {Math.round(a.wpAfter)} %</span>
          )}
          {isMistake && (
            <span>
              <b className={SEV_CLASS[a.severity]}>{SEVERITY_LABEL[a.severity]}</b> : tu as joué <b>{a.san}</b> (flèche rouge).<br />
              Meilleur coup : <b>{a.bestSan}</b> (flèche verte).<br />
              Tes chances de gain : {Math.round(a.wpBefore)} % → {Math.round(a.wpAfter)} % (−{Math.round(a.drop)} pts)
              {a.detail && <>
                <br />Motif : <b>{MOTIF_LABEL[a.detail.motif]}</b>
                <br /><span className="muted small">Réfutation : {a.detail.refutation || '—'}</span>
              </>}
            </span>
          )}
          {isMistake && (a.severity === 'mistake' || a.severity === 'blunder') && (
            <ThoughtBox key={ply} game={game} ply={ply} onSaved={(thoughts) => setGame((g) => (g ? { ...g, thoughts } : g))} />
          )}
        </div>
        <div className="moves card grid">
          {san.map((s, i) => {
            const an = byPly.get(i);
            return (
              <button key={i} className={`mv ${i === ply ? 'active' : ''} ${an ? SEV_CLASS[an.severity] : 'theirs'} ${exit && exit.by !== 'end' && exit.ply === i ? 'book-exit' : ''}`} onClick={() => setPly(i)}>
                {i % 2 === 0 ? `${i / 2 + 1}.` : ''}{s}{an ? SEV_ICON[an.severity] : ''}{exit && exit.by !== 'end' && exit.ply === i ? ' 📖' : ''}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
