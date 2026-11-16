import { useEffect, useRef, useState } from 'react';
import { fig } from '../lib/notation';
import Board, { type BoardArrow } from '../Board';
import { db, type Game } from '../db';
import { analyseGame, analysePlies, replay } from '../analysis';
import { recordBookExit, treeOf } from '../openings';
import { MOTIF_LABEL } from '../lib/report/motifs';
import { buildIndex } from '../lib/repertoire';
import {
  bookLength, CLASS_COLOR, CLASS_ICON, CLASS_LABEL, CLASS_ORDER, classSummary, mergeIndexes, moveSentence, type MoveClass,
} from '../lib/moveClass';
import { Chess } from 'chess.js';

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
  const [progress, setProgress] = useState<{ d: number; t: number; label: string } | null>(null);
  const [ply, setPly] = useState(-1); // -1 = position de départ
  const [bookLen, setBookLen] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const g = await db.games.get(id);
      if (!g) { setErr('Partie introuvable'); return; }
      setGame(g);
      // Phase « livre » : coups de mon répertoire depuis le début (l'ouverture de la partie à thème,
      // sinon toutes mes ouvertures de cette couleur).
      const openings = (await db.openings.toArray()).filter((o) => (g.openingId ? o.id === g.openingId : o.color === g.myColor));
      if (!cancelled) setBookLen(bookLength(mergeIndexes(openings.map((o) => buildIndex(treeOf(o)))), g.startFen, g.uci));
      if (g.openingId && g.bookExit === undefined) {
        const withExit = await recordBookExit(id);
        if (!cancelled && withExit) setGame((cur) => ({ ...(cur ?? withExit), bookExit: withExit.bookExit }));
      }
      try {
        if (!g.analysis) {
          const a = await analyseGame(id, (d, t) => !cancelled && setProgress({ d, t, label: 'Analyse de la partie par Stockfish…' }));
          if (!cancelled) { setGame((cur) => ({ ...a, bookExit: a.bookExit ?? cur?.bookExit })); setProgress(null); }
        } else if (!g.plies) {
          // Partie analysée avant le classement de tous les coups : on le complète (cartes et erreurs inchangées).
          const a = await analysePlies(id, (d, t) => !cancelled && setProgress({ d, t, label: 'Classement de tous les coups…' }));
          if (!cancelled) { setGame((cur) => ({ ...a, bookExit: a.bookExit ?? cur?.bookExit })); setProgress(null); }
        }
      } catch (e) { setErr('Analyse impossible : ' + (e as Error).message); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (err) return <div className="card error">{err}</div>;
  if (!game) return null;
  if (progress || !game.analysis || !game.plies || !game.bars) {
    const { d, t, label } = progress ?? { d: 0, t: 1, label: 'Analyse…' };
    return (
      <div className="card center">
        <h2>{label}</h2>
        <div className="progress big"><div style={{ width: (100 * d) / t + '%' }} /></div>
        <p className="muted">{Math.round((100 * d) / t)} %</p>
      </div>
    );
  }

  const { fens, san } = replay(game.startFen, game.uci);
  const plies = game.plies;
  const bars = game.bars;
  const clsOf = (i: number): MoveClass => (i < bookLen ? 'book' : plies[i].cls);
  const byPly = new Map(game.analysis.map((a) => [a.ply, a]));
  const a = ply >= 0 ? byPly.get(ply) : undefined;          // analyse détaillée (mes coups)
  const pe = ply >= 0 ? plies[ply] : undefined;
  const cls = ply >= 0 ? clsOf(ply) : null;
  const exit = game.bookExit ?? null;
  const isMyExit = exit?.by === 'me' && ply === exit.ply;

  // Position APRÈS le coup ; pastille sur la case d'arrivée ; flèche verte = meilleur coup (s'il y en avait un meilleur).
  const fen = fens[ply + 1];
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  const badges: Record<string, { icon: string; color: string; label: string }> = {};
  if (pe && cls) {
    const u = game.uci[ply];
    highlight[u.slice(0, 2)] = 'rgba(255,255,0,.35)';
    highlight[u.slice(2, 4)] = 'rgba(255,255,0,.45)';
    badges[u.slice(2, 4)] = { icon: CLASS_ICON[cls], color: CLASS_COLOR[cls], label: CLASS_LABEL[cls] };
    if (cls !== 'best' && cls !== 'book' && pe.bestUci && pe.bestUci !== u)
      arrows.push({ from: pe.bestUci.slice(0, 2), to: pe.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
    if (isMyExit) for (const sanExp of exit!.expectedSan) {
      const m = new Chess(fens[ply]).move(sanExp);
      arrows.push({ from: m.from, to: m.to, color: 'rgba(40,110,230,.85)' });
    }
  }
  const bar = bars[ply + 1] ?? bars[0];
  const whiteBottom = game.myColor === 'w';
  const summary = classSummary(plies, game.myColor, bookLen, game.startFen.split(' ')[1] === 'w');
  const errorsPlies = game.analysis.filter((x) => x.severity !== 'ok').map((x) => x.ply);
  const mine = (i: number) => byPly.has(i);

  return (
    <div className="play">
      <div className="board-col">
        <div className="review-board">
          <div className="evalbar" style={{ flexDirection: whiteBottom ? 'column' : 'column-reverse' }} aria-label={`Évaluation ${bar.label}`}>
            <div className="white" style={{ height: `${bar.wpWhite}%`, marginTop: whiteBottom ? 'auto' : 0, marginBottom: whiteBottom ? 0 : 'auto' }} />
            <span className="lbl" style={{ [bar.wpWhite >= 50 === whiteBottom ? 'bottom' : 'top']: 2, color: bar.wpWhite >= 50 ? '#333' : '#eee' }}>{bar.label}</span>
          </div>
          <Board fen={fen} orientation={game.myColor} movable={null} arrows={arrows} highlight={highlight} badges={badges} />
        </div>
        <p className="move-sentence">
          {pe && cls ? <><span className="ic-inline" style={{ background: CLASS_COLOR[cls] }}>{CLASS_ICON[cls]}</span>{' '}
            {moveSentence(fig(pe.san), cls, pe.bestSan ? fig(pe.bestSan) : null)}{' '}
            <span className="muted small">({mine(ply) ? 'ton coup' : 'Maia'})</span></>
            : <span className="muted">Touche un coup ou utilise les flèches.</span>}
        </p>
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
          <b>{game.result}</b> · {game.termination} · tu avais les {game.myColor === 'w' ? 'Blancs' : 'Noirs'}{game.unrated ? ' · non comptée' : ''}
          <table className="classes">
            <thead><tr><th></th><th>Moi</th><th>Maia</th></tr></thead>
            <tbody>
              {CLASS_ORDER.map((c) => (
                <tr key={c}>
                  <td><span className="ic-inline" style={{ background: CLASS_COLOR[c] }}>{CLASS_ICON[c]}</span> {CLASS_LABEL[c]}</td>
                  <td>{summary.me[c]}</td><td>{summary.maia[c]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {game.openingId && (
          <div className="card book">
            {exit === null && <span>📖 Partie entièrement dans ton répertoire.</span>}
            {exit?.by === 'end' && <span>📖 Tu as suivi ton répertoire jusqu’au bout de la ligne (coup {Math.floor(exit.ply / 2) + 1}).</span>}
            {exit?.by === 'me' && (
              <span>📖 <b>Sortie du répertoire</b> au coup {Math.floor(exit.ply / 2) + 1}{exit.ply % 2 ? '…' : '.'} : tu as joué <b>{fig(exit.playedSan)}</b>,
                {' '}ton répertoire prévoit <b>{fig(exit.expectedSan.join(' ou '))}</b> (flèche bleue).{' '}
                <button className="small" onClick={() => setPly(exit.ply)}>Voir</button></span>
            )}
            {exit?.by === 'opponent' && (
              <span>📖 L’adversaire a quitté ton répertoire avec <b>{fig(exit.playedSan)}</b> (coup {Math.floor(exit.ply / 2) + 1}).
                {' '}Position ajoutée aux <b>trous du répertoire</b> avec le meilleur coup Stockfish.</span>
            )}
          </div>
        )}
        {(a || pe) && (
          <div className="card explain">
            {pe && <span className="muted small">Chances de gain {mine(ply) ? 'pour toi' : 'pour Maia'} : {Math.round(pe.wpBefore)} % → {Math.round(pe.wpAfter)} %{pe.drop >= 1 ? ` (−${Math.round(pe.drop)} pts)` : ''}</span>}
            {isMyExit && <><br /><span>📖 Répertoire : <b>{fig(exit!.expectedSan.join(' ou '))}</b> (flèche bleue) au lieu de {fig(exit!.playedSan)}.</span></>}
            {a?.detail && <>
              <br />Motif : <b>{MOTIF_LABEL[a.detail.motif]}</b>
              <br /><span className="muted small">Réfutation : {fig(a.detail.refutation) || '—'}</span>
            </>}
            {a && (a.severity === 'mistake' || a.severity === 'blunder') && (
              <ThoughtBox key={ply} game={game} ply={ply} onSaved={(thoughts) => setGame((g) => (g ? { ...g, thoughts } : g))} />
            )}
          </div>
        )}
        <div className="moves card grid">
          {san.map((s, i) => {
            const c = clsOf(i);
            return (
              <button key={i} className={`mv ${i === ply ? 'active' : ''} ${mine(i) ? '' : 'theirs'} ${exit && exit.by !== 'end' && exit.ply === i ? 'book-exit' : ''}`}
                onClick={() => setPly(i)} aria-label={`${s} : ${CLASS_LABEL[c]}`}>
                {i % 2 === 0 ? `${i / 2 + 1}.` : ''}{fig(s)}<span className="ic" style={{ background: CLASS_COLOR[c] }}>{CLASS_ICON[c]}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
