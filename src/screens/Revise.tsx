import { useEffect, useState } from 'react';
import { fig } from '../lib/notation';
import Board, { type BoardArrow } from '../Board';
import { db, DUE_NEW, type Card } from '../db';
import { addDays, dayKey, INTERVALS, schedule } from '../lib/srs';
import { markIntroduced, reviewQueue } from '../openings';
import { formatLine } from '../lib/repertoire';
import { evaluate, uciToSan } from '../analysis';
import { isReviewMoveOk, winPercent } from '../lib/winpct';
import { Chess } from 'chess.js';
import { go } from '../router';
import MateExercise from '../MateExercise';
import { MATE_LEVELS } from '../lib/mates';

type Outcome = { ok: boolean; uci: string; san: string; drop: number };

export default function Revise({ opening }: { opening?: string }) {
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [stats, setStats] = useState({ ok: 0, ko: 0 });

  const [openingName, setOpeningName] = useState<Record<string, string>>({});
  useEffect(() => {
    reviewQueue(opening).then(setQueue);
    db.openings.toArray().then((os) => setOpeningName(Object.fromEntries(os.map((o) => [o.id, o.name]))));
  }, [opening]);

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

  if (card.kind === 'mate') {
    const level = MATE_LEVELS.find((l) => l.id === card.mateLevel)!;
    return (
      <>
        <p className="muted center-text">♚ Révision : position de mat ratée ({queue.length} restante{queue.length > 1 ? 's' : ''}) — mate le roi noir.</p>
        <MateExercise key={card.id} level={level} fen={card.fen} minMoves={card.minMoves} review
          onDone={async (run) => {
            const ok = run.outcome === 'mate';
            await db.cards.update(card.id!, { ...schedule(card, ok, dayKey()), attempts: [...card.attempts, { date: Date.now(), uci: run.moves.join(' '), ok }] });
            setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }));
            setOutcome({ ok, uci: '', san: '', drop: 0 });
          }} />
        {outcome && <div className="row mate-next"><button className="primary" onClick={() => { setOutcome(null); setQueue(queue.slice(1)); }}>Suivante</button></div>}
      </>
    );
  }

  async function onMove(uci: string) {
    if (checking || outcome) return;
    setChecking(true);
    try {
      const san = uciToSan(card.fen, uci) ?? uci;
      const today = dayKey();
      if (card.kind === 'drill') {
        // Drill de répertoire : correction immédiate, juste si le coup est dans le répertoire.
        const ok = (card.accept ?? [card.bestUci]).includes(uci);
        const isNew = card.due === DUE_NEW;
        const next = isNew ? { step: 0, due: addDays(today, INTERVALS[0]) } : schedule(card, ok, today);
        if (isNew) await markIntroduced();
        await db.cards.update(card.id!, { ...next, attempts: [...card.attempts, { date: Date.now(), uci, ok }] });
        setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }));
        setOutcome({ ok, uci, san, drop: 0 });
        return;
      }
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
      const next = schedule(card, ok, today);
      await db.cards.update(card.id!, { ...next, attempts: [...card.attempts, { date: Date.now(), uci, ok }] });
      setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), ko: s.ko + (ok ? 0 : 1) }));
      setOutcome({ ok, uci, san, drop });
    } finally { setChecking(false); }
  }

  const isDrill = card.kind === 'drill';
  const goodMoves = isDrill ? card.accept ?? [card.bestUci] : [card.bestUci];
  const arrows: BoardArrow[] = [];
  if (outcome) {
    if (!goodMoves.includes(outcome.uci) || (!isDrill && outcome.uci !== card.bestUci))
      arrows.push({ from: outcome.uci.slice(0, 2), to: outcome.uci.slice(2, 4), color: outcome.ok ? 'rgba(30,120,220,.8)' : 'rgba(220,40,40,.85)' });
    for (const g of goodMoves) arrows.push({ from: g.slice(0, 2), to: g.slice(2, 4), color: 'rgba(30,160,60,.9)' });
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
          {isDrill ? (
            <>
              <h2>📖 {openingName[card.openingId!] ?? 'Répertoire'}</h2>
              <p>Joue le coup de ton répertoire ({card.myColor === 'w' ? 'Blancs' : 'Noirs'}).{card.due === DUE_NEW && <> <span className="tag">nouvelle</span></>}</p>
              <p className="muted line-text">{fig(formatLine(card.path ?? [])) || 'Position de départ'}</p>
            </>
          ) : (
            <>
              <h2>Trouve le bon coup</h2>
              <p>Tu joues les {card.myColor === 'w' ? 'Blancs' : 'Noirs'}. Dans cette partie, tu avais joué <b>{fig(card.playedSan)}</b>
                {' '}({card.severity === 'blunder' ? 'gaffe' : 'erreur'}).</p>
            </>
          )}
          {checking && <p className="pulse">Vérification par Stockfish…</p>}
        </div>
        {outcome && (
          <div className={`card ${outcome.ok ? 'good' : 'bad'}`}>
            {isDrill ? (outcome.ok
              ? <p>✅ Juste ! <b>{fig(outcome.san)}</b> est bien dans ton répertoire.</p>
              : <p>❌ <b>{fig(outcome.san)}</b> n’est pas ton coup de répertoire. Prévu : <b>{fig(card.acceptSan?.join(' ou ') ?? '')}</b> (flèche verte). Tu la reverras demain.</p>)
            : outcome.ok
              ? <p>✅ Juste ! <b>{fig(outcome.san)}</b>{outcome.uci === card.bestUci ? ' est le meilleur coup.' : ` est presque aussi bon que ${fig(card.bestSan)} (−${outcome.drop.toFixed(1)} pts).`}</p>
              : <p>❌ <b>{fig(outcome.san)}</b> perd {Math.round(outcome.drop)} pts. Le bon coup était <b>{fig(card.bestSan)}</b> (flèche verte). Tu la reverras demain.</p>}
            <button className="primary" onClick={() => { setOutcome(null); setQueue(queue.slice(1)); }}>Suivante</button>
          </div>
        )}
      </aside>
    </div>
  );
}
