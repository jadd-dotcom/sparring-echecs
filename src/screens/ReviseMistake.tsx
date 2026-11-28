// Révision d'une erreur de partie (« Trouve le bon coup ») : origine de la position, consigne claire, mon coup en flèche
// rouge (désactivable), Indice (motif en mots, puis pièce à jouer), Solution (après 2 essais ratés ou 2 indices),
// Passer (la carte revient demain), puis l'explication : pourquoi le bon coup est bon et pourquoi le mien l'était moins.
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Card } from '../db';
import { addDays, dayKey, schedule } from '../lib/srs';
import { evaluate, uciToSan } from '../analysis';
import { isReviewMoveOk, winPercent } from '../lib/winpct';
import { fig } from '../lib/notation';
import { cardDetail, cardOrigin, type CardOrigin } from '../reviseService';
import { motifHint, moveNo, whyBest, whyPlayed } from '../lib/reviseText';
import type { ErrorDetail } from '../lib/report/motifs';
import { answerFeedback } from '../sound';
import { CircleCheck, CircleX, Compass, Lightbulb } from '../icons';
import Explorer from '../Explorer';
import { ErrorSuites, Notation, useSuite } from '../Suite';
import { whyWords } from '../lib/whyWords';

type Try = { uci: string; san: string; ok: boolean; drop: number };
type End = { solved: boolean; byUser?: Try; skipped?: boolean };

const fmtDate = (t?: number) => (t ? new Date(t).toLocaleDateString('fr-FR') : '');

export default function ReviseMistake({ card, remaining, onNext, onResult }: {
  card: Card; remaining: number; onNext: () => void; onResult: (ok: boolean) => void;
}) {
  const [origin, setOrigin] = useState<CardOrigin | null>(null);
  const [detail, setDetail] = useState<ErrorDetail | null | undefined>(undefined);
  const [showMine, setShowMine] = useState(true);
  const [hints, setHints] = useState(0);
  const [tries, setTries] = useState<Try[]>([]);
  const [checking, setChecking] = useState(false);
  const [end, setEnd] = useState<End | null>(null);
  const [exploring, setExploring] = useState(false);
  const suite = useSuite();
  const attempts = useRef(card.attempts);

  useEffect(() => {
    let cancel = false;
    db.meta.get('reviseShowMine').then((m) => !cancel && setShowMine(m?.value !== false));
    cardOrigin(card).then((o) => {
      if (cancel) return;
      setOrigin(o);
      cardDetail(card, o).then((d) => !cancel && setDetail(d));
    });
    return () => { cancel = true; };
  }, [card]);

  const failed = tries.filter((t) => !t.ok).length;
  const canSolution = !end && (failed >= 2 || hints >= 2);
  const playedLabel = `${origin?.ply !== undefined ? moveNo(origin.ply) + ' ' : ''}${fig(card.playedSan)}`;

  async function finish(e: End) {
    // Réussie du premier coup (au plus l'indice en mots) : la carte avance ; sinon elle revient demain.
    const ok = e.solved && !!e.byUser && failed === 0 && hints <= 1;
    const today = dayKey();
    if (e.byUser) attempts.current = [...attempts.current, { date: Date.now(), uci: e.byUser.uci, ok, hints }];
    await db.cards.update(card.id!, { ...schedule(card, ok, today), attempts: attempts.current });
    onResult(ok);
    setEnd(e);
  }

  async function onMove(uci: string) {
    if (checking || end) return;
    setChecking(true);
    try {
      const san = uciToSan(card.fen, uci) ?? uci;
      let drop = 0;
      let isBest = uci === card.bestUci;
      if (!isBest) {
        const c = new Chess(card.fen);
        c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
        const before = await evaluate(card.fen, 700);
        const after = await evaluate(c.fen(), 700);
        isBest = before.bestMove === uci;
        drop = isBest ? 0 : Math.max(0, winPercent(before.eval) - (100 - winPercent(after.eval)));
      }
      const t: Try = { uci, san, ok: isReviewMoveOk(isBest, drop), drop };
      answerFeedback(t.ok);
      if (t.ok) await finish({ solved: true, byUser: t });
      else {
        setTries((x) => [...x, t]);
        // Essai raté : la carte revient demain, même si l'on quitte l'écran sans finir.
        attempts.current = [...attempts.current, { date: Date.now(), uci, ok: false, hints }];
        await db.cards.update(card.id!, { ...schedule(card, false, dayKey()), attempts: attempts.current });
      }
    } finally { setChecking(false); }
  }

  async function skip() {
    await db.cards.update(card.id!, { due: addDays(dayKey(), 1) });
    onNext();
  }

  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  if (end) {
    if (end.byUser && end.byUser.uci !== card.bestUci) arrows.push({ from: end.byUser.uci.slice(0, 2), to: end.byUser.uci.slice(2, 4), color: 'rgba(30,120,220,.85)' });
    arrows.push({ from: card.bestUci.slice(0, 2), to: card.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  }
  if (showMine) arrows.push({ from: card.playedUci.slice(0, 2), to: card.playedUci.slice(2, 4), color: 'rgba(220,40,40,.85)' });
  if (hints >= 2 && !end) highlight[card.bestUci.slice(0, 2)] = 'rgba(255, 170, 0, .7)';
  const lastTry = tries[tries.length - 1];

  if (end && exploring) return <Explorer fen={card.fen} me={card.myColor} onQuit={() => setExploring(false)} />;

  return (
    <div className="play" data-best={card.bestUci} data-played={card.playedUci}>
      <div className="board-col">
        <Board key={card.id} fen={suite.view?.fen ?? card.fen} orientation={card.myColor} movable={end || checking || suite.active ? null : card.myColor}
          onMove={onMove} arrows={suite.view?.arrows ?? arrows} highlight={suite.view ? {} : highlight} lastMove={suite.view?.lastMove ?? null} />
      </div>
      <aside className="side-col">
        {suite.panel}
        <div className="card revise-head">
          <p className="muted small" data-testid="origin">
            {origin ? <>{origin.source}{origin.opponent ? <> · contre <b>{origin.opponent}</b></> : null}{origin.date ? <> · {fmtDate(origin.date)}</> : null}
              {origin.ply !== undefined ? <> · coup {moveNo(origin.ply)}</> : null}</> : '…'}
            {' '}· {remaining} position{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </p>
          <h2 data-testid="instruction">Joue sur l’échiquier un meilleur coup que {playedLabel}</h2>
          <p className="muted small">Tu as les {card.myColor === 'w' ? 'Blancs' : 'Noirs'}. Dans la partie, {fig(card.playedSan)} était {card.severity === 'blunder' ? 'une gaffe' : 'une erreur'}.</p>
          <label className="unrated-toggle">
            <input type="checkbox" checked={showMine} onChange={(e) => { setShowMine(e.target.checked); db.meta.put({ key: 'reviseShowMine', value: e.target.checked }); }} />
            Montrer mon coup de la partie (flèche rouge)
          </label>
        </div>
        {!end && (
          <div className="card">
            {checking && <p className="pulse">Vérification par Stockfish…</p>}
            {lastTry && !checking && (
              <p className="bad-text" data-testid="try-msg"><CircleX aria-hidden className="ico sm" /> {fig(lastTry.san)} n’est pas mieux (−{Math.round(lastTry.drop)} pts). Essaie encore.</p>
            )}
            {hints >= 1 && <p className="term" data-testid="hint">{detail === undefined ? 'Recherche de l’indice…' : detail ? motifHint(detail, card.fen, card.playedUci) : 'Pas d’indice disponible.'}</p>}
            {hints >= 2 && <p className="muted small" data-testid="hint2">La pièce à jouer est surlignée.</p>}
            <div className="row">
              <button disabled={hints >= 2 || checking} onClick={() => setHints((h) => h + 1)}><Lightbulb aria-hidden className="ico" />Indice{hints === 1 ? ' (pièce à jouer)' : ''}</button>
              <button disabled={!canSolution || checking} onClick={() => finish({ solved: false })}
                title="Après 2 essais ratés ou 2 indices">Solution</button>
              <button disabled={checking} onClick={skip}>Passer</button>
            </div>
            <p className="muted small">Solution : après 2 essais ratés ou 2 indices · Passer : la position revient demain.</p>
          </div>
        )}
        {end && (
          <div className={`card ${end.solved && failed === 0 && hints <= 1 ? 'good' : 'bad'}`} data-testid="revise-result">
            {end.solved
              ? <p><CircleCheck aria-hidden className="ico good-text" /> {end.byUser!.uci === card.bestUci ? <>Bien joué : <b>{fig(end.byUser!.san)}</b>, le meilleur coup.</>
                : <>Bien joué : <b>{fig(end.byUser!.san)}</b> est presque aussi bon que {fig(card.bestSan)} (−{end.byUser!.drop.toFixed(1)} pts).</>}</p>
              : <p><CircleX aria-hidden className="ico bad-text" /> Solution : <b>{fig(card.bestSan)}</b> (flèche verte).</p>}
            {detail ? (() => {
              const [a, b] = whyWords(detail, card.fen, card.playedUci, card.bestUci, card.myColor);
              return (
                <div data-testid="why">
                  <p><b>Pourquoi :</b> {a}</p>
                  <p>{b}</p>
                  <ErrorSuites d={detail} fenBefore={card.fen} myUci={card.playedUci} me={card.myColor} open={suite.open} />
                  <Notation>
                    <p>{whyBest(detail, card.fen, card.playedUci, card.bestSan)}</p>
                    <p>{whyPlayed(detail, card.fen, card.playedUci, card.playedSan, card.severity === 'blunder' ? 'blunder' : 'mistake')}</p>
                  </Notation>
                </div>
              );
            })() : <p className="pulse muted">Explication en cours de calcul…</p>}
            <p className="muted small">{end.solved && failed === 0 && hints <= 1 ? 'Réussie du premier coup : la position reviendra plus tard.' : 'La position reviendra demain.'}</p>
            <div className="row">
              <button className="primary" onClick={() => { suite.close(); onNext(); }}>Suivante</button>
              <button onClick={() => { suite.close(); setExploring(true); }} data-testid="explore-btn"><Compass aria-hidden className="ico" />Explorer</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
