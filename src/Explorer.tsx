// « Explorer » (comme le bilan de Chess.com) : depuis une position de la revue ou de la révision, je bouge librement les
// pièces des deux camps. Stockfish (~0,7 s) montre le meilleur coup du camp qui a le trait : flèche verte pour mon
// camp, rouge pour l'adversaire (sa meilleure réponse), avec une phrase en mots ; indicateur « Tu gagnes / Égal /
// Tu perds » et bilan matériel. ◀ annule un coup, « Revenir à la position », « Quitter ». Rien n'est enregistré.
// « Qu'est-ce qu'il menace ? » : sa menace dans la position explorée (flèche rouge, phrase, « Voir la suite »).
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from './Board';
import { stockfish } from './engines/stockfish';
import { winPercent } from './lib/winpct';
import { material, materialWords, moveCaption } from './lib/words';
import { soundForMove } from './sound';
import { ChevronLeft, RotateCcw, X } from './icons';
import { useThreatCheck } from './ThreatUi';
import { useSuite } from './Suite';

export const GREEN = 'rgba(30,160,60,.9)';
export const RED = 'rgba(220,40,40,.85)';

/** « Tu gagnes / Égal / Tu perds » d'après mes chances de gain (win%). */
export const verdict = (wpMe: number) => (wpMe >= 60 ? 'Tu gagnes' : wpMe <= 40 ? 'Tu perds' : 'Égal');

export default function Explorer({ fen, me, onQuit }: { fen: string; me: 'w' | 'b'; onQuit: () => void }) {
  const [moves, setMovesRaw] = useState<string[]>([]);
  const [eng, setEng] = useState<{ fen: string; best: string | null; wpMe: number } | null>(null);
  const suite = useSuite();
  const setMoves = (m: string[]) => { suite.close(); setMovesRaw(m); };
  const pos = useMemo(() => {
    const c = new Chess(fen);
    for (const u of moves) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    return c;
  }, [fen, moves]);
  const cur = pos.fen();

  useEffect(() => {
    let alive = true;
    if (pos.isGameOver()) { setEng(null); return; }
    stockfish.analyse(cur, 700).then((r) => {
      if (!alive) return;
      const side = winPercent(r.eval);
      setEng({ fen: cur, best: r.bestMove, wpMe: pos.turn() === me ? side : 100 - side });
    }).catch(() => {});
    return () => { alive = false; };
  }, [cur, pos, me]);

  const ready = eng && eng.fen === cur;
  const mine = pos.turn() === me;
  const threat = useThreatCheck(cur, me, { onSuite: (f, line, title) => suite.open(f, line, me, title) });
  const arrows: BoardArrow[] = [...threat.arrows];
  if (ready && eng.best) arrows.push({ from: eng.best.slice(0, 2), to: eng.best.slice(2, 4), color: mine ? GREEN : RED });
  const mat = material(cur, me);
  const last = moves[moves.length - 1];
  let state: string;
  if (pos.isCheckmate()) state = mine ? 'Tu es mat : tu perds.' : 'Il est mat : tu gagnes.';
  else if (pos.isDraw() || pos.isStalemate()) state = 'Partie nulle.';
  else state = ready ? `${verdict(eng.wpMe)} (${Math.round(eng.wpMe)} % de chances pour toi)` : 'Stockfish réfléchit…';

  return (
    <div className="play explorer" data-testid="explorer" data-fen={cur}>
      <div className="board-col">
        <div className="lines-banner"><b>Explorer</b><span>· {mine ? 'à toi de jouer' : 'à l’adversaire de jouer'} (tu bouges les deux camps)</span></div>
        {suite.view
          ? <Board fen={suite.view.fen} orientation={me} movable={null} arrows={suite.view.arrows} lastMove={suite.view.lastMove} />
          : <Board fen={cur} orientation={me} movable={pos.isGameOver() ? null : pos.turn()} arrows={arrows}
            onMove={(u) => { const m = new Chess(cur).move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); soundForMove(m.san); setMoves([...moves, u]); }}
            lastMove={last ? { from: last.slice(0, 2), to: last.slice(2, 4) } : null} />}
        <div className="nav row">
          <button aria-label="Annuler un coup" disabled={!moves.length} onClick={() => setMoves(moves.slice(0, -1))}><ChevronLeft aria-hidden /></button>
          <button disabled={!moves.length} onClick={() => setMoves([])}><RotateCcw aria-hidden className="ico" />Revenir à la position</button>
          <button onClick={onQuit}><X aria-hidden className="ico" />Quitter</button>
        </div>
      </div>
      <aside className="side-col">
        {suite.panel}
        <div className="card" data-testid="explorer-verdict">
          <h3>{state}</h3>
          <p className="muted">{materialWords(mat)}.</p>
        </div>
        <div className="card" data-testid="explorer-best">
          {ready && eng.best
            ? <p><span className={mine ? 'good-text' : 'bad-text'}><b>{mine ? 'Ton meilleur coup' : 'Sa meilleure réponse'}</b></span>
              {' '}({mine ? 'flèche verte' : 'flèche rouge'}) : {moveCaption(cur, eng.best, me)}</p>
            : <p className="muted">{pos.isGameOver() ? 'Partie terminée dans cette position.' : 'Stockfish cherche le meilleur coup…'}</p>}
          <p className="muted small">Rien n’est enregistré : explore librement.</p>
        </div>
        <div className="card threat-card">
          {threat.button}
          {threat.result}
        </div>
      </aside>
    </div>
  );
}
