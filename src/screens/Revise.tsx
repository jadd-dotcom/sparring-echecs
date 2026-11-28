import { useEffect, useRef, useState } from 'react';
import { fig } from '../lib/notation';
import Board, { type BoardArrow } from '../Board';
import { db, DUE_NEW, type Card } from '../db';
import { addDays, dayKey, INTERVALS, schedule } from '../lib/srs';
import { markIntroduced, reviewCounts, reviewQueue, reviseAllowanceLeft } from '../openings';
import { formatLine } from '../lib/repertoire';
import { uciToSan } from '../analysis';
import { go } from '../router';
import { endStep } from '../sessionService';
import ReviseMistake from './ReviseMistake';
import ReviseThreat from './ReviseThreat';
import TrapExercise from '../TrapExercise';
import { TRAPS } from '../data/traps';
import { recordTrapAttempt } from '../trapService';
import { fillThreatCards } from '../threatService';
import MateExercise from '../MateExercise';
import { MATE_LEVELS } from '../lib/mates';
import { BookOpen, CircleCheck, CircleX, Crown, Layers } from '../icons';

type Outcome = { ok: boolean; uci: string; san: string };

const allCards = <p className="center-text"><button className="ghost" onClick={() => go({ name: 'cards' })}><Layers aria-hidden className="ico" />Toutes mes cartes</button></p>;

export default function Revise({ opening, only }: { opening?: string; only?: 'threat' }) {
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [stats, setStats] = useState({ ok: 0, ko: 0 });

  const [openingName, setOpeningName] = useState<Record<string, string>>({});
  useEffect(() => { reviewQueue(opening, { only }).then(setQueue); }, [opening, only]);
  // Nouvelles cartes « Lis la menace » (au plus 5 par jour) : cherchées quand la file est vide, pour ne pas faire
  // attendre Stockfish pendant les autres cartes ; elles s'ajoutent alors à la révision.
  const [scan, setScan] = useState<'todo' | 'running' | 'done'>('todo');
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const empty = queue !== null && queue.length === 0;
  useEffect(() => {
    if (!empty || scan !== 'todo' || opening) return;
    setScan('running');
    // Révision vide mais des « Lis la menace » attendent dans leur étape : pas de nouvelles positions ici.
    // Les nouvelles cartes respectent le plafond du jour : on n'en crée pas plus que la place restante (maxNew), et ce
    // sont elles qui s'affichent.
    Promise.all([only ? Promise.resolve(0) : reviewCounts().then((rc) => rc.threat), reviseAllowanceLeft()])
      .then(([pending, left]) => (pending || left <= 0 ? [] : fillThreatCards({ maxNew: left })))
      .then((made) => { if (mounted.current && made.length) setQueue(made); })
      .catch(() => {})
      .finally(() => { if (mounted.current) setScan('done'); });
  }, [empty, scan, opening, only]);
  const scanning = scan === 'running';
  useEffect(() => {
    db.openings.toArray().then((os) => setOpeningName(Object.fromEntries(os.map((o) => [o.id, o.name]))));
  }, []);

  if (!queue) return null;
  const card = queue[0];
  if (!card && scanning) {
    return (
      <div className="card center" data-testid="threat-scan">
        <p className="pulse">Je cherche dans tes parties des positions « Lis la menace »…</p>
        <p className="muted small">Stockfish vérifie les coups adverses qui ont créé une menace (au plus 5 nouvelles positions par jour).</p>
      </div>
    );
  }
  if (!card) {
    return (
      <div className="card center">
        <h2>{only === 'threat' ? 'Lis la menace : terminé' : 'Révision du jour terminée'}</h2>
        <p>{stats.ok} juste{stats.ok > 1 ? 's' : ''} · {stats.ko} à retravailler</p>
        <div className="row center-row">
          <button className="primary" data-testid="session-back" onClick={() => { endStep(); go({ name: 'home' }); }}>Retour à Aujourd’hui</button>
          <button onClick={() => go({ name: 'cards' })}><Layers aria-hidden className="ico" />Toutes mes cartes</button>
        </div>
      </div>
    );
  }

  if (card.kind === 'mate') {
    const level = MATE_LEVELS.find((l) => l.id === card.mateLevel)!;
    return (
      <>
        <p className="muted center-text"><Crown aria-hidden className="ico sm" /> Révision : position de mat ratée ({queue.length} restante{queue.length > 1 ? 's' : ''}) — mate le roi noir.</p>
        <MateExercise key={card.id} level={level} fen={card.fen} minMoves={card.minMoves} review
          onDone={async (run) => {
            const ok = run.outcome === 'mate';
            await db.cards.update(card.id!, { ...schedule(card, ok, dayKey()), attempts: [...card.attempts, { date: Date.now(), uci: run.moves.join(' '), ok }] });
            setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }));
            setOutcome({ ok, uci: '', san: '' });
          }} />
        {outcome && <div className="row mate-next"><button className="primary" onClick={() => { setOutcome(null); setQueue(queue.slice(1)); }}>Suivante</button></div>}
        {allCards}
      </>
    );
  }

  const nextCard = () => { setOutcome(null); setQueue(queue.slice(1)); };
  if (card.kind === 'trap') {
    const trap = TRAPS.find((t) => t.id === card.trapId);
    if (!trap) return <div className="card">Piège introuvable. <button onClick={nextCard}>Suivante</button></div>;
    return (
      <>
        <TrapReview key={card.id} card={card} trap={trap} remaining={queue.length} onNext={nextCard}
          onResult={(ok) => setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }))} />
        {allCards}
      </>
    );
  }
  if (card.kind === 'threat') {
    return (
      <>
        <ReviseThreat key={card.id} card={card} remaining={queue.length} onNext={nextCard}
          onResult={(ok) => setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }))} />
        {allCards}
      </>
    );
  }
  if (card.kind !== 'drill') {
    return (
      <>
        <ReviseMistake key={card.id} card={card} remaining={queue.length} onNext={nextCard}
          onResult={(ok) => setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }))} />
        {allCards}
      </>
    );
  }

  // Drill de répertoire : correction immédiate, juste si le coup est dans le répertoire.
  async function onMove(uci: string) {
    if (checking || outcome) return;
    setChecking(true);
    try {
      const san = uciToSan(card.fen, uci) ?? uci;
      const today = dayKey();
      const ok = (card.accept ?? [card.bestUci]).includes(uci);
      const isNew = card.due === DUE_NEW;
      const next = isNew ? { step: 0, due: addDays(today, INTERVALS[0]) } : schedule(card, ok, today);
      if (isNew) await markIntroduced();
      await db.cards.update(card.id!, { ...next, attempts: [...card.attempts, { date: Date.now(), uci, ok }] });
      setStats((st) => ({ ok: st.ok + (ok ? 1 : 0), ko: st.ko + (ok ? 0 : 1) }));
      setOutcome({ ok, uci, san });
    } finally { setChecking(false); }
  }

  const goodMoves = card.accept ?? [card.bestUci];
  const arrows: BoardArrow[] = [];
  if (outcome) {
    if (!goodMoves.includes(outcome.uci))
      arrows.push({ from: outcome.uci.slice(0, 2), to: outcome.uci.slice(2, 4), color: 'rgba(220,40,40,.85)' });
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
          <h2><BookOpen aria-hidden className="ico book-ico" /> {openingName[card.openingId!] ?? 'Répertoire'}</h2>
          <p>Joue le coup de ton répertoire ({card.myColor === 'w' ? 'Blancs' : 'Noirs'}).{card.due === DUE_NEW && <> <span className="tag">nouvelle</span></>}</p>
          <p className="muted line-text">{fig(formatLine(card.path ?? [])) || 'Position de départ'}</p>
          {checking && <p className="pulse">Vérification…</p>}
        </div>
        {outcome && (
          <div className={`card ${outcome.ok ? 'good' : 'bad'}`}>
            {outcome.ok
              ? <p><CircleCheck aria-hidden className="ico good-text" /> Juste ! <b>{fig(outcome.san)}</b> est bien dans ton répertoire.</p>
              : <p><CircleX aria-hidden className="ico bad-text" /> <b>{fig(outcome.san)}</b> n’est pas ton coup de répertoire. Prévu : <b>{fig(card.acceptSan?.join(' ou ') ?? '')}</b> (flèche verte). Tu la reverras demain.</p>}
            <button className="primary" onClick={nextCard}>Suivante</button>
          </div>
        )}
      </aside>
    </div>
  );
}

/** Révision d'un piège maîtrisé : « Défends-toi » puis « Punis-le » ; réussie si les deux le sont sans indice. */
function TrapReview({ card, trap, remaining, onNext, onResult }: {
  card: Card; trap: (typeof TRAPS)[number]; remaining: number; onNext: () => void; onResult: (ok: boolean) => void;
}) {
  const [step, setStep] = useState<'defend' | 'punish'>('defend');
  const [first, setFirst] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const head = `Révision : piège d’ouverture (${remaining} position${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''})`;
  return (
    <TrapExercise key={`${card.id}-${step}`} trap={trap} mode={step} head={head}
      onDone={async (r) => {
        await recordTrapAttempt(trap.id, step, r.ok, r.clean);
        if (step === 'defend') { setFirst(r.clean); return; }
        const ok = !!first && r.clean;
        await db.cards.update(card.id!, { ...schedule(card, ok, dayKey()), attempts: [...card.attempts, { date: Date.now(), uci: trap.id, ok }] });
        onResult(ok);
        setDone(true);
      }}
      actions={step === 'defend'
        ? <button className="primary" disabled={first === null} onClick={() => setStep('punish')}>Maintenant : Punis-le</button>
        : <button className="primary" disabled={!done} onClick={onNext}>Suivante</button>} />
  );
}
