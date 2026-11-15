import { useEffect, useState } from 'react';
import Board, { type BoardArrow } from '../Board';
import { db, type Card } from '../db';
import { dayKey, schedule } from '../lib/srs';
import { evaluate, uciToSan } from '../analysis';
import { isReviewMoveOk, winPercent } from '../lib/winpct';
import { Chess } from 'chess.js';
import { go } from '../router';

type Outcome = { ok: boolean; uci: string; san: string; drop: number };

export default function Revise() {
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [stats, setStats] = useState({ ok: 0, ko: 0 });

  useEffect(() => { db.cards.where('due').belowOrEqual(dayKey()).sortBy('due').then(setQueue); }, []);

  if (!queue) return null;
  const card = queue[0];
  if (!card) {
    return (
      <div className="card center">
        <h2>Révision terminée</h2>
        <p>{stats.ok} juste{stats.ok > 1 ? 's' : ''} · {stats.ko} à retravailler</p>
        <button className="primary" onClick={() => go({ name: 'home' })}>Retour à l’accueil</button>
      </div>
    );
  }

  async function onMove(uci: string) {
    if (checking || outcome) return;
    setChecking(true);
    try {
      const san = uciToSan(card.fen, uci) ?? uci;
      let drop = 0;
      let isBest = uci === card.bestUci;
      if (!isBest) {
        // Même budget de recherche pour la position avant et après le coup.
        const c = new Chess(card.fen);
        c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
        const before = await evaluate(card.fen, 700);
        const after = await evaluate(c.fen(), 700);
        isBest = before.bestMove === uci;
        drop = isBest ? 0 : Math.max(0, winPercent(before.eval) - (100 - winPercent(after.eval)));
      }
      const ok = isReviewMoveOk(isBest, drop);
      const today = dayKey();
      const next = schedule(card, ok, today);
      await db.cards.update(card.id!, { ...next, attempts: [...card.attempts, { date: Date.now(), uci, ok }] });
      setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), ko: s.ko + (ok ? 0 : 1) }));
      setOutcome({ ok, uci, san, drop });
    } finally { setChecking(false); }
  }

  const arrows: BoardArrow[] = [];
  if (outcome) {
    if (!outcome.ok || outcome.uci !== card.bestUci)
      arrows.push({ from: outcome.uci.slice(0, 2), to: outcome.uci.slice(2, 4), color: outcome.ok ? 'rgba(30,120,220,.8)' : 'rgba(220,40,40,.85)' });
    arrows.push({ from: card.bestUci.slice(0, 2), to: card.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  }

  return (
    <div className="play">
      <div className="board-col">
        <Board key={card.id} fen={card.fen} orientation={card.myColor} movable={outcome || checking ? null : card.myColor}
          onMove={onMove} arrows={arrows} />
      </div>
      <aside className="side-col">
        <div className="card">
          <div className="muted">{queue.length} position{queue.length > 1 ? 's' : ''} restante{queue.length > 1 ? 's' : ''}</div>
          <h2>Trouve le bon coup</h2>
          <p>Tu joues les {card.myColor === 'w' ? 'Blancs' : 'Noirs'}. Dans cette partie, tu avais joué <b>{card.playedSan}</b>
            {' '}({card.severity === 'blunder' ? 'gaffe' : 'erreur'}).</p>
          {checking && <p className="pulse">Vérification par Stockfish…</p>}
        </div>
        {outcome && (
          <div className={`card ${outcome.ok ? 'good' : 'bad'}`}>
            {outcome.ok
              ? <p>✅ Juste ! <b>{outcome.san}</b>{outcome.uci === card.bestUci ? ' est le meilleur coup.' : ` est presque aussi bon que ${card.bestSan} (−${outcome.drop.toFixed(1)} pts).`}</p>
              : <p>❌ <b>{outcome.san}</b> perd {Math.round(outcome.drop)} pts. Le bon coup était <b>{card.bestSan}</b> (flèche verte). Tu la reverras demain.</p>}
            <button className="primary" onClick={() => { setOutcome(null); setQueue(queue.slice(1)); }}>Suivante</button>
          </div>
        )}
      </aside>
    </div>
  );
}
