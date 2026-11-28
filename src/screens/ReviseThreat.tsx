// Révision « Lis la menace » : position d'une de mes parties juste après un coup adverse qui a créé une vraie menace.
// Q1 : « Il vient de jouer … Joue son prochain coup à sa place. » (je bouge une pièce ADVERSE ; sa menace, ou un coup
// qui rapporte presque autant, est accepté). Indices : 1) la pièce qui vient de bouger, 2) la case visée.
// Q2 : « Maintenant pare-la » (mon camp), validé comme les autres cartes. Puis l'explication avec « Voir la suite ».
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Card } from '../db';
import { addDays, dayKey, schedule } from '../lib/srs';
import { evaluate, uciToSan } from '../analysis';
import { isReviewMoveOk, winPercent } from '../lib/winpct';
import { fig } from '../lib/notation';
import { cardOrigin, type CardOrigin } from '../reviseService';
import { moveNo } from '../lib/reviseText';
import { capFirst, moveCaption, nullMove, tryMove } from '../lib/words';
import { isThreatAnswerOk, threatSentence } from '../lib/threat';
import { answerFeedback } from '../sound';
import { CircleCheck, CircleX, Compass, Lightbulb, TriangleAlert } from '../icons';
import Explorer from '../Explorer';
import { Notation, SuiteButton, useSuite } from '../Suite';

const RED = 'rgba(220,40,40,.85)';
const GREEN = 'rgba(30,160,60,.9)';
const ORANGE = 'rgba(240,138,64,.9)';
const HL = 'rgba(255, 170, 0, .7)';

type Phase = 'read' | 'parry' | 'end';
type Try = { uci: string; san: string; ok: boolean };

const fmtDate = (t?: number) => (t ? new Date(t).toLocaleDateString('fr-FR') : '');
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export default function ReviseThreat({ card, remaining, onNext, onResult }: {
  card: Card; remaining: number; onNext: () => void; onResult: (ok: boolean) => void;
}) {
  const [origin, setOrigin] = useState<CardOrigin | null>(null);
  const [phase, setPhase] = useState<Phase>('read');
  const [hints, setHints] = useState(0);
  const [tries1, setTries1] = useState<Try[]>([]);
  const [read, setRead] = useState<{ ok: boolean; byUser?: Try } | null>(null);
  const [tries2, setTries2] = useState<Try[]>([]);
  const [parry, setParry] = useState<{ ok: boolean; byUser?: Try } | null>(null);
  const [checking, setChecking] = useState(false);
  const [exploring, setExploring] = useState(false);
  const suite = useSuite();
  const attempts = useRef(card.attempts);

  useEffect(() => { cardOrigin(card).then(setOrigin); }, [card]);

  const me = card.myColor;
  const him = me === 'w' ? 'b' : 'w';
  const fenHim = nullMove(card.fen);
  const threatUci = card.threatUci!;
  const last = card.lastMoveUci!;
  const lastCaption = card.prevFen ? moveCaption(card.prevFen, last, me) : '';
  const failed1 = tries1.filter((t) => !t.ok).length;
  const failed2 = tries2.filter((t) => !t.ok).length;

  async function record(q: 1 | 2, uci: string, ok: boolean) {
    attempts.current = [...attempts.current, { date: Date.now(), uci, ok, q, hints: q === 1 ? hints : 0 }];
    await db.cards.update(card.id!, { attempts: attempts.current });
  }

  async function finish(parryOk: boolean, byUser?: Try) {
    setParry({ ok: parryOk, byUser });
    // Réussie : sa menace lue du premier coup (au plus 1 indice) et parée du premier coup.
    const ok = !!read?.ok && !!read.byUser && failed1 === 0 && hints <= 1 && parryOk && !!byUser && failed2 === 0;
    await db.cards.update(card.id!, { ...schedule(card, ok, dayKey()), attempts: attempts.current });
    onResult(ok);
    setPhase('end');
  }

  async function onReadMove(uci: string) {
    if (checking || phase !== 'read') return;
    setChecking(true);
    try {
      const san = uciToSan(fenHim, uci) ?? uci;
      let ok = uci === threatUci;
      if (!ok) {
        const r = tryMove(fenHim, uci);
        if (r) {
          const mates = r.after.isCheckmate();
          let wpOppAfterMine = 0;
          if (!mates && !r.after.isGameOver()) wpOppAfterMine = 100 - winPercent((await evaluate(r.after.fen(), 700)).eval);
          ok = isThreatAnswerOk(uci, threatUci, { mates, wpOppAfterMine, threatWp: card.threatWp ?? 100 });
        }
      }
      const t: Try = { uci, san, ok };
      answerFeedback(ok);
      await record(1, uci, ok);
      if (ok) { setRead({ ok: true, byUser: t }); setPhase('parry'); }
      else setTries1((x) => [...x, t]);
    } finally { setChecking(false); }
  }

  async function onParryMove(uci: string) {
    if (checking || phase !== 'parry') return;
    setChecking(true);
    try {
      const san = uciToSan(card.fen, uci) ?? uci;
      let isBest = uci === card.bestUci;
      let drop = 0;
      if (!isBest) {
        const c = new Chess(card.fen);
        c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
        const before = await evaluate(card.fen, 700);
        const after = c.isCheckmate() ? null : await evaluate(c.fen(), 700);
        isBest = before.bestMove === uci || c.isCheckmate();
        drop = isBest || !after ? 0 : Math.max(0, winPercent(before.eval) - (100 - winPercent(after.eval)));
      }
      const t: Try = { uci, san, ok: isReviewMoveOk(isBest, drop) };
      answerFeedback(t.ok);
      await record(2, uci, t.ok);
      if (t.ok) await finish(true, t);
      else setTries2((x) => [...x, t]);
    } finally { setChecking(false); }
  }

  async function skip() {
    await db.cards.update(card.id!, { due: addDays(dayKey(), 1) });
    onNext();
  }

  if (phase === 'end' && exploring) return <Explorer fen={card.fen} me={me} onQuit={() => setExploring(false)} />;

  // Échiquier : Q1 = position avec son trait (coup nul) ; Q2 et fin = position réelle, à moi de jouer.
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  let fen = card.fen;
  let movable: 'w' | 'b' | null = null;
  if (phase === 'read') {
    fen = fenHim;
    movable = checking ? null : him;
    arrows.push({ from: last.slice(0, 2), to: last.slice(2, 4), color: ORANGE });
    if (hints >= 1) highlight[last.slice(2, 4)] = HL;
    if (hints >= 2) highlight[threatUci.slice(2, 4)] = 'rgba(220, 40, 40, .55)';
  } else {
    arrows.push({ from: threatUci.slice(0, 2), to: threatUci.slice(2, 4), color: RED });
    if (phase === 'parry') movable = checking ? null : me;
    if (phase === 'end') {
      const mine = parry?.byUser?.uci;
      if (mine && mine !== card.bestUci) arrows.push({ from: mine.slice(0, 2), to: mine.slice(2, 4), color: 'rgba(30,120,220,.85)' });
      if (card.bestUci) arrows.push({ from: card.bestUci.slice(0, 2), to: card.bestUci.slice(2, 4), color: GREEN });
    }
  }
  const threatText = threatSentence(fenHim, threatUci, me, !!card.threatMate);
  const lastTry1 = tries1[tries1.length - 1];
  const lastTry2 = tries2[tries2.length - 1];
  const success = phase === 'end' && !!read?.byUser && failed1 === 0 && hints <= 1 && !!parry?.byUser && failed2 === 0;
  const bestCaption = card.bestUci ? moveCaption(card.fen, card.bestUci, me) : '';

  return (
    <div className="play" data-phase={phase} data-threat={threatUci} data-best={card.bestUci}>
      <div className="board-col">
        <Board key={`${card.id}-${phase === 'read' ? 'r' : 'p'}`} fen={suite.view?.fen ?? fen} orientation={me} movable={suite.active ? null : movable}
          onMove={phase === 'read' ? onReadMove : onParryMove} arrows={suite.view?.arrows ?? arrows} highlight={suite.view ? {} : highlight}
          lastMove={suite.view?.lastMove ?? (phase === 'read' ? { from: last.slice(0, 2), to: last.slice(2, 4) } : null)} />
      </div>
      <aside className="side-col">
        {suite.panel}
        <div className="card revise-head">
          <p className="muted small" data-testid="origin">
            <TriangleAlert aria-hidden className="ico sm" /> Lis la menace ·{' '}
            {origin ? <>{origin.source}{origin.opponent ? <> · contre <b>{origin.opponent}</b></> : null}{origin.date ? <> · {fmtDate(origin.date)}</> : null}
              {origin.ply !== undefined ? <> · coup {moveNo(origin.ply)}</> : null}</> : '…'}
            {' '}· {remaining} position{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </p>
          {phase === 'read' && <>
            <h2 data-testid="instruction">Il vient de jouer : {lastCaption ? lower(lastCaption) : fig(last)} <span className="muted small">(flèche orange)</span></h2>
            <p><b>Joue son prochain coup à sa place</b> : bouge une de ses pièces ({him === 'w' ? 'Blancs' : 'Noirs'}), celle qui menace le plus.</p>
          </>}
          {phase !== 'read' && <h2 data-testid="instruction">{phase === 'parry' ? 'Maintenant pare-la' : 'Lis la menace'}</h2>}
          {phase !== 'read' && <p data-testid="threat-read"><span className="bad-text">{threatText}</span> <span className="muted small">(flèche rouge)</span></p>}
          {phase === 'parry' && <p>Tu as les {me === 'w' ? 'Blancs' : 'Noirs'} : joue le coup qui pare sa menace.</p>}
        </div>

        {phase === 'read' && (
          <div className="card">
            {checking && <p className="pulse">Vérification par Stockfish…</p>}
            {lastTry1 && !checking && <p className="bad-text" data-testid="try-msg"><CircleX aria-hidden className="ico sm" /> {capFirst(moveCaption(fenHim, lastTry1.uci, me).replace(/\.$/, ''))} : ce n’est pas sa menace. Essaie encore.</p>}
            {hints >= 1 && <p className="term" data-testid="hint">Regarde la pièce qui vient de bouger (surlignée) : qu’attaque-t-elle maintenant ?</p>}
            {hints >= 2 && <p className="muted small" data-testid="hint2">La case visée est surlignée en rouge.</p>}
            <div className="row">
              <button disabled={hints >= 2 || checking} onClick={() => setHints((h) => h + 1)}><Lightbulb aria-hidden className="ico" />Indice{hints === 1 ? ' (case visée)' : ''}</button>
              <button disabled={(failed1 < 2 && hints < 2) || checking} onClick={async () => { await record(1, '', false); setRead({ ok: false }); setPhase('parry'); }}
                title="Après 2 essais ratés ou 2 indices">Voir sa menace</button>
              <button disabled={checking} onClick={skip}>Passer</button>
            </div>
            <p className="muted small">Voir sa menace : après 2 essais ratés ou 2 indices · Passer : la position revient demain.</p>
          </div>
        )}

        {phase === 'parry' && (
          <div className="card">
            {read?.ok
              ? <p className="good-text" data-testid="read-ok"><CircleCheck aria-hidden className="ico sm" /> Bien lu{read.byUser && read.byUser.uci !== threatUci ? ' (ton coup menace presque autant)' : ''}.</p>
              : <p className="bad-text" data-testid="read-ko"><CircleX aria-hidden className="ico sm" /> Voici sa menace (flèche rouge).</p>}
            {checking && <p className="pulse">Vérification par Stockfish…</p>}
            {lastTry2 && !checking && <p className="bad-text" data-testid="try2-msg"><CircleX aria-hidden className="ico sm" /> {fig(lastTry2.san)} ne pare pas assez bien. Essaie encore.</p>}
            <div className="row">
              <button disabled={failed2 < 2 || checking} onClick={() => finish(false)} title="Après 2 essais ratés">Solution</button>
            </div>
          </div>
        )}

        {phase === 'end' && (
          <div className={`card ${success ? 'good' : 'bad'}`} data-testid="revise-result">
            {parry?.ok
              ? <p><CircleCheck aria-hidden className="ico good-text" /> Parée : <b>{fig(parry.byUser!.san)}</b>.</p>
              : <p><CircleX aria-hidden className="ico bad-text" /> Pour la parer : <b>{fig(card.bestSan)}</b> (flèche verte).</p>}
            <div data-testid="why">
              <p><b>Sa menace :</b> {lower(threatText.replace(/^Il menace (ceci|de te mater) : /, ''))}</p>
              {bestCaption && <p><b>Pour la parer :</b> {lower(bestCaption)}</p>}
              {card.ignored
                ? <p>Dans la partie, tu ne l’as pas vue : tu as joué {fig(card.playedSan)}.</p>
                : <p>Dans la partie, tu l’as parée ({fig(card.playedSan)}).</p>}
              <div className="row suite-btns">
                {card.threatLine?.length ? <SuiteButton label="Voir sa menace" testId="suite-threat" onClick={() => suite.open(fenHim, card.threatLine!, me, 'Sa menace')} /> : null}
                {card.parryLine?.length ? <SuiteButton label="Voir la bonne suite" testId="suite-best" onClick={() => suite.open(card.fen, card.parryLine!, me, 'La bonne suite')} /> : null}
              </div>
              <Notation>
                {card.threatLine?.length ? <p>Sa menace : {fig(card.threatLine.join(' '))}</p> : null}
                {card.parryLine?.length ? <p>Bonne suite : {fig(card.parryLine.join(' '))}</p> : null}
              </Notation>
            </div>
            <p className="muted small">{success ? 'Réussie du premier coup : la position reviendra plus tard.' : 'La position reviendra demain.'}</p>
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
