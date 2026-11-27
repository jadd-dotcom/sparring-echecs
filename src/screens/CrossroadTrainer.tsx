// Mode Carrefours : une carte par coup-panneau. La position juste après son coup (dernier coup surligné) ; Q1 « Sur
// quelle ligne es-tu ? » (choix parmi les lignes de ce carrefour) ; Q2 : je joue mon coup. Indices : 1) la pièce qui a
// bougé surlignée + « Que vise-t-elle ? » ; 2) la phrase-panneau. Répétition espacée par carte.
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Opening } from '../db';
import { treeOf } from '../openings';
import { OPENING_LESSONS } from '../data/openingLessons';
import { moveLabel, signpostCards, type SignpostCard } from '../lib/crossroads';
import { acceptedReplies, afterAnswer, crossQueue, lineChoices, type CrossProgress } from '../lib/crossroadTrainer';
import { signpostSentence } from '../lib/signposts';
import { getCrossProgress, saveCrossProgress } from '../crossroadService';
import { dayKey } from '../lib/srs';
import { fig } from '../lib/notation';
import { moveCaption } from '../lib/words';
import { answerFeedback, soundForMove } from '../sound';
import { go } from '../router';
import { CircleCheck, CircleX, Lightbulb, RotateCcw } from '../icons';

const ORANGE = 'rgba(240,138,64,.9)';
const GREEN = 'rgba(30,160,60,.9)';
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export default function CrossroadTrainer({ id }: { id: string }) {
  const [o, setO] = useState<Opening | null>(null);
  const [prog, setProg] = useState<CrossProgress | null>(null);
  const [queue, setQueue] = useState<SignpostCard[] | null>(null);
  const [i, setI] = useState(0);
  const [q1, setQ1] = useState<{ picked: string; ok: boolean } | null>(null);
  const [tries, setTries] = useState(0);
  const [hints, setHints] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [end, setEnd] = useState<{ ok: boolean; played?: string } | null>(null);
  const [stats, setStats] = useState({ ok: 0, ko: 0 });
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id);

  useEffect(() => {
    (async () => {
      const op = await db.openings.get(id);
      if (!op) return;
      const p = await getCrossProgress(id);
      setO(op); setProg(p);
      setQueue(crossQueue(signpostCards(treeOf(op), op.color), p, dayKey()));
    })();
  }, [id]);
  const root = useMemo(() => (o ? treeOf(o) : null), [o]);
  if (!o || !prog || !queue || !root) return null;
  const card = queue[i];
  if (!card) {
    return (
      <div className="card center" data-testid="cross-done">
        <h2>Carrefours du jour terminés</h2>
        <p>{stats.ok} réussi{stats.ok > 1 ? 's' : ''} · {stats.ko} à revoir demain</p>
        <div className="row center-row">
          <button className="primary" onClick={() => go({ name: 'opening', id, tab: 'carrefours' })}>Retour aux carrefours</button>
        </div>
      </div>
    );
  }
  const me = o.color;
  const pos = new Chess(card.crossroad.fen);
  const before = pos.fen();
  const his = pos.move(card.his);
  const fen = pos.fen();
  const choices = lineChoices(card, lesson);
  const accepted = acceptedReplies(root, card);
  const sentence = signpostSentence(card, me);

  function next() {
    setI(i + 1); setQ1(null); setTries(0); setHints(0); setMsg(null); setEnd(null);
  }
  function redo() {
    setQ1(null); setTries(0); setHints(0); setMsg(null); setEnd(null);
  }
  async function finish(ok: boolean, played?: string) {
    const st = afterAnswer(prog![card.id], ok, dayKey());
    const p = { ...prog!, [card.id]: st };
    setProg(p);
    await saveCrossProgress(id, p);
    setStats((s) => ({ ok: s.ok + (ok ? 1 : 0), ko: s.ko + (ok ? 0 : 1) }));
    setEnd({ ok, played });
  }
  function onMove(uci: string) {
    if (!q1 || end) return;
    const m = new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    soundForMove(m.san);
    if (accepted.includes(m.san)) {
      answerFeedback(true);
      finish(q1.ok && tries === 0 && hints === 0, m.san);
    } else {
      answerFeedback(false);
      setTries(tries + 1);
      setMsg(`${fig(m.san)} n’est pas le coup de ton répertoire ici. Essaie encore.`);
    }
  }

  const arrows: BoardArrow[] = [{ from: his.from, to: his.to, color: ORANGE }];
  const highlight: Record<string, string> = {};
  if (hints >= 1 && !end) highlight[his.to] = 'rgba(255, 170, 0, .7)';
  if (end || tries >= 2) {
    const m = new Chess(fen).move(card.mine!);
    arrows.push({ from: m.from, to: m.to, color: GREEN });
  }
  const shown = end?.played ? (() => { const c = new Chess(fen); c.move(end.played!); return c.fen(); })() : fen;

  return (
    <div className="play cross-ex" data-testid="cross-ex" data-card={card.id} data-fen={fen} data-mine={card.mine ?? ''} data-q={!q1 ? 1 : !end ? 2 : 'end'}>
      <div className="board-col">
        <Board key={card.id} fen={shown} orientation={me} movable={q1 && !end ? me : null} onMove={onMove} arrows={arrows} highlight={highlight}
          lastMove={{ from: his.from, to: his.to }} />
      </div>
      <aside className="side-col">
        <div className="card">
          <p className="muted small">Carrefours · {o.name} · carte {i + 1}/{queue.length}{prog[card.id] ? '' : ' · nouvelle'}</p>
          <p data-testid="cross-last">Il vient de jouer : {lower(moveCaption(before, card.his, me))} <span className="muted small">({fig(moveLabel(card.ply, card.his))}, flèche orange)</span></p>
          {!q1 ? (
            <>
              <h2>Sur quelle ligne es-tu ?</h2>
              <div className="col cross-choices">
                {choices.map((c) => (
                  <button key={c.his} className="flat-btn wide" onClick={() => setQ1({ picked: c.his, ok: c.his === card.his })} data-testid="cross-choice" data-his={c.his}>{fig(c.name)}</button>
                ))}
              </div>
            </>
          ) : (
            <p data-testid="cross-q1" className={q1.ok ? 'good-text' : 'bad-text'}>
              {q1.ok ? <CircleCheck aria-hidden className="ico sm" /> : <CircleX aria-hidden className="ico sm" />} Ligne : <b>{fig(choices.find((c) => c.his === card.his)!.name)}</b>{q1.ok ? '' : ' (pas celle que tu as choisie)'}
            </p>
          )}
          {q1 && !end && <h2>À toi : joue ton coup</h2>}
        </div>
        {q1 && !end && (
          <div className="card">
            {msg && <p className="bad-text" data-testid="cross-msg">{msg}</p>}
            {hints >= 1 && <p className="term" data-testid="cross-hint">La pièce qui vient de bouger est surlignée : que vise-t-elle ?</p>}
            {hints >= 2 && <p className="term" data-testid="cross-hint2">{fig(sentence)}</p>}
            {tries >= 2 && <p className="muted small">Le coup de ton répertoire est en flèche verte.</p>}
            <div className="row">
              <button disabled={hints >= 2} onClick={() => setHints(hints + 1)}><Lightbulb aria-hidden className="ico" />Indice{hints === 1 ? ' (phrase-panneau)' : ''}</button>
            </div>
          </div>
        )}
        {end && (
          <div className={`card ${end.ok ? 'good' : 'bad'}`} data-testid="cross-result">
            <p>{end.ok ? <><CircleCheck aria-hidden className="ico good-text" /> <b>Réussi</b> : la carte reviendra plus tard.</> : <><CircleX aria-hidden className="ico bad-text" /> La carte revient demain.</>}</p>
            <p className="trap-rule" data-testid="cross-sentence"><b>Panneau :</b> {fig(sentence)}</p>
            <div className="row">
              <button onClick={redo} data-testid="cross-redo"><RotateCcw aria-hidden className="ico" />Refaire</button>
              <button className="primary" onClick={next} data-testid="cross-next">Suivant</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
