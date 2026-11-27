// « Ce que je pensais » au bon moment : chacune de mes erreurs et gaffes, position AVANT mon coup avec mon coup en
// flèche rouge, les 5 réponses en un toucher, PUIS le meilleur coup (flèche verte) et l'explication.
// - Après une partie contre Maia (#/comment/<id>) : analyse de la partie, puis ses erreurs, avant tout autre écran.
// - Depuis l'accueil (#/comment) : toutes les erreurs pas encore commentées (parties importées comprises).
// « Plus tard » : on arrête ; les erreurs restantes restent à commenter (badge de l'accueil).
import { useEffect, useState } from 'react';
import Board, { type BoardArrow } from '../Board';
import { db, type Game } from '../db';
import { analyseGame, replay } from '../analysis';
import { errorsToComment, gameErrorsToComment, type ToComment } from '../lib/commentQueue';
import { errorReason } from '../lib/reason';
import { MOTIF_LABEL } from '../lib/report/motifs';
import { moveSentence } from '../lib/moveClass';
import { fig } from '../lib/notation';
import { ThoughtBox, ThoughtButtons } from '../ThoughtUi';
import { go } from '../router';
import { ClassBadge } from '../icons';

const moveNo = (ply: number) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}`;
const sourceOf = (g: Game) => (g.source === 'chesscom' ? (g.ext?.site === 'pgn' ? 'PGN importé' : 'Chess.com') : 'Maia');
const oppOf = (g: Game) => (g.source === 'chesscom' ? g.ext?.opp.name ?? 'adversaire' : `Maia-3 (${Math.round(g.botElo ?? 0)})`);

function GameResult({ g }: { g: Game }) {
  return (
    <div className="card" data-testid="game-result">
      <h2>{g.score === 1 ? 'Victoire !' : g.score === 0 ? 'Défaite' : 'Partie nulle'}</h2>
      <p>{g.termination} · {g.result}</p>
      {g.source === 'chesscom' ? null : g.unrated
        ? <p className="muted">Partie non comptée : ton niveau reste à <b>{Math.round(g.ratingBefore!)}</b>.</p>
        : <p>Niveau : {Math.round(g.ratingBefore!)} → <b>{Math.round(g.ratingAfter!)}</b>{' '}
          ({g.ratingAfter! - g.ratingBefore! >= 0 ? '+' : ''}{Math.round(g.ratingAfter! - g.ratingBefore!)})</p>}
    </div>
  );
}

export default function Comment({ id }: { id?: number }) {
  const [games, setGames] = useState<Record<number, Game>>({});
  const [queue, setQueue] = useState<ToComment[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (id !== undefined) {
        let g = await db.games.get(id);
        if (!g) { setErr('Partie introuvable'); return; }
        setGames({ [id]: g });
        if (!g.analysis) {
          setProgress(0);
          g = await analyseGame(id, (d, t) => alive && setProgress(Math.round((100 * d) / t)));
          if (!alive) return;
          setProgress(null);
        }
        setGames({ [id]: g });
        setQueue(gameErrorsToComment(g));
      } else {
        const all = await db.games.toArray();
        setGames(Object.fromEntries(all.map((g) => [g.id!, g])));
        setQueue(errorsToComment(all));
      }
    })().catch((e) => setErr((e as Error).message));
    return () => { alive = false; };
  }, [id]);

  const game = id !== undefined ? games[id] : undefined;
  const after = (
    <div className="col">
      {game && <button className="primary" onClick={() => go({ name: 'review', id: game.id! })}>Revoir la partie</button>}
      {game && game.source !== 'chesscom' && (
        <button onClick={() => go({ name: 'play', ...(game.openingId ? { opening: game.openingId } : {}), ...(game.unrated ? { unrated: true } : {}) })}>
          Nouvelle partie
        </button>
      )}
      <button onClick={() => go({ name: 'home' })}>Accueil</button>
    </div>
  );

  if (err) return <div className="card error">{err}</div>;
  if (progress !== null || !queue) {
    return (
      <div className="comment-done">
        {game && <GameResult g={game} />}
        <div className="card center" data-testid="comment-analysing">
          <h3>Analyse de tes coups…</h3>
          <p className="muted">Stockfish cherche tes erreurs et tes gaffes : pour chacune, tu diras ce que tu pensais.</p>
          <div className="progress big"><div style={{ width: `${progress ?? 0}%` }} /></div>
          <p className="muted">{progress ?? 0} %</p>
          {after}
        </div>
      </div>
    );
  }

  const item = !finished ? queue[idx] : undefined;
  if (!item) {
    const n = queue.length;
    const left = queue.filter((q) => !games[q.gameId]?.thoughtTags?.[q.ply]).length;
    return (
      <div className="comment-done">
        {game && <GameResult g={game} />}
        <div className="card" data-testid="comment-done">
          {n === 0
            ? <p>{game ? 'Aucune erreur ni gaffe dans cette partie : bravo !' : 'Rien à commenter : toutes tes erreurs ont une réponse.'}</p>
            : left > 0
              ? <p>D’accord, la suite plus tard : {left} erreur{left > 1 ? 's' : ''} reste{left > 1 ? 'nt' : ''} à commenter (bouton sur l’accueil).</p>
              : <p>Merci : {n} erreur{n > 1 ? 's' : ''} commentée{n > 1 ? 's' : ''}. Le rapport pour Claude les compte par motif.</p>}
          {after}
        </div>
      </div>
    );
  }

  const g = games[item.gameId];
  const a = g.analysis!.find((x) => x.ply === item.ply)!;
  const { fens } = replay(g.startFen, g.uci);
  const fenBefore = fens[a.ply];
  const answered = !!g.thoughtTags?.[a.ply];
  const arrows: BoardArrow[] = [{ from: a.uci.slice(0, 2), to: a.uci.slice(2, 4), color: 'rgba(220,40,40,.85)' }];
  if (answered && a.bestUci) arrows.push({ from: a.bestUci.slice(0, 2), to: a.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  const reason = a.detail ? errorReason(a.detail, fenBefore, a.uci) : null;
  const sev = a.severity === 'blunder' ? 'blunder' : 'mistake';
  const update = (patch: Partial<Game>) => setGames((gs) => ({ ...gs, [g.id!]: { ...gs[g.id!], ...patch } }));
  const last = idx + 1 >= queue.length;

  return (
    <div className="play comment" data-ply={a.ply} data-game={g.id}>
      <div className="board-col">
        <Board key={`${g.id}-${a.ply}`} fen={fenBefore} orientation={g.myColor} movable={null} arrows={arrows} />
      </div>
      <aside className="side-col">
        <div className="card">
          <p className="muted small" data-testid="comment-origin">
            Erreur {idx + 1}/{queue.length} · {g.source === 'chesscom' ? `${sourceOf(g)} contre ${oppOf(g)}` : `Contre ${oppOf(g)}`} · {new Date(g.date).toLocaleDateString('fr-FR')}
          </p>
          <h2 data-testid="comment-move"><ClassBadge cls={sev} size={22} className="class-badge inline" /> {moveNo(a.ply)} {fig(a.san)} : {sev === 'blunder' ? 'une gaffe' : 'une erreur'}</h2>
          <p className="muted small">Ton coup en flèche rouge · chances de gain {Math.round(a.wpBefore)} % → {Math.round(a.wpAfter)} %</p>
          <ThoughtButtons game={g} ply={a.ply} onSaved={(thoughtTags) => update({ thoughtTags })} />
          {answered && (
            <div data-testid="comment-best">
              <p className="move-sentence">{moveSentence(fig(a.san), sev, a.bestSan ? fig(a.bestSan) : null, reason, reason && a.detail ? MOTIF_LABEL[a.detail.motif] : null)} <span className="muted small">(flèche verte)</span></p>
              {a.detail?.refutation && <p className="muted small">Réfutation : {fig(a.detail.refutation)}</p>}
              <ThoughtBox key={`${g.id}-${a.ply}`} game={g} ply={a.ply} onSaved={(thoughts) => update({ thoughts })} />
            </div>
          )}
          <div className="row comment-actions">
            {answered && <button className="primary" onClick={() => setIdx(idx + 1)}>{last ? 'Terminer' : 'Erreur suivante'}</button>}
            <button onClick={() => setFinished(true)}>Plus tard</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
