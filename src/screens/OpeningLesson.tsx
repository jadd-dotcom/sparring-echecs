import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Opening } from '../db';
import {
  firstAppearances, GLOSSARY, lessonBlocks, OPENING_LESSONS, type OpeningLesson,
} from '../data/openingLessons';
import { introduceDrillCards, saveLessonProgress } from '../openings';
import { fig } from '../lib/notation';
import { go } from '../router';
import { ChevronLeft, ChevronRight, CircleCheck } from '../icons';

type Stage =
  | { kind: 'watch'; block: number; k: number }      // k = demi-coups montrés dans le bloc
  | { kind: 'replay'; block: number; k: number; tries: number; hint: 'none' | 'square' | 'solution'; done: boolean }
  | { kind: 'plan' }
  | { kind: 'model'; k: number }
  | { kind: 'done'; introduced: number };

const OPP_DELAY = 550;

/** Texte avec mots techniques en gras + leur définition s'ils apparaissent ici pour la 1re fois. */
function Explained({ text, fresh }: { text: string; fresh?: string[] }) {
  const parts = fig(text).split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      <p className="why">{parts.map((p, i) => {
        const m = p.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
        return m ? <b key={i}>{m[2] ?? m[1]}</b> : <span key={i}>{p}</span>;
      })}</p>
      {fresh?.map((k) => (
        <p key={k} className="term"><b>Mot nouveau — {k}</b> : {GLOSSARY[k]}</p>
      ))}
    </>
  );
}

function positionAfter(moves: string[], n: number) {
  const c = new Chess();
  for (const s of moves.slice(0, n)) c.move(s);
  return c;
}

export default function OpeningLessonScreen({ id }: { id: string }) {
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id) as OpeningLesson | undefined;
  const [opening, setOpening] = useState<Opening | null>(null);
  const [stage, setStage] = useState<Stage>({ kind: 'watch', block: 0, k: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { db.openings.get(id).then((o) => setOpening(o ?? null)); }, [id]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const sans = useMemo(() => lesson?.moves.map((m) => m.san) ?? [], [lesson]);
  const blocks = useMemo(() => lessonBlocks(sans.length), [sans]);
  const fresh = useMemo(() => (lesson ? firstAppearances(lesson) : {}), [lesson]);

  // Rejouer : les coups adverses se jouent seuls.
  useEffect(() => {
    if (stage.kind !== 'replay' || stage.done || !opening) return;
    const [s, e] = blocks[stage.block];
    const ply = s + stage.k;
    if (ply >= e) { setStage({ ...stage, done: true }); return; }
    const c = positionAfter(sans, ply);
    if (c.turn() !== opening.color) {
      timer.current = setTimeout(() => setStage({ ...stage, k: stage.k + 1, tries: 0, hint: 'none' }), OPP_DELAY);
    }
  }, [stage, opening, blocks, sans]);

  // Bloc rejoué : ses coups entrent dans le drill.
  useEffect(() => {
    if (stage.kind !== 'replay' || !stage.done || !opening) return;
    const [s, e] = blocks[stage.block];
    const fens: string[] = [];
    for (let i = s; i < e; i++) { const c = positionAfter(sans, i); if (c.turn() === opening.color) fens.push(c.fen()); }
    introduceDrillCards(opening.id, fens).catch(() => {});
    saveLessonProgress(opening.id, { blocksDone: stage.block + 1, done: false, at: Date.now() }).catch(() => {});
  }, [stage, opening, blocks, sans]);

  if (!lesson) return <div className="card">Pas de leçon pour cette ouverture.</div>;
  if (!opening) return null;
  const me = opening.color;
  const steps = ['Regarder', 'Rejouer', 'Le plan', 'Partie type'];

  // ----- plateau selon l'étape
  let fen = new Chess().fen();
  let movable: 'w' | 'b' | null = null;
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  let lastMove: { from: string; to: string } | null = null;
  if (stage.kind === 'watch' || stage.kind === 'replay') {
    const [s, e] = blocks[stage.block];
    const c = positionAfter(sans, s + stage.k);
    fen = c.fen();
    const h = c.history({ verbose: true });
    lastMove = h.length ? h[h.length - 1] : null;
    // (s + k < e : la ligne peut finir par un coup adverse ; le bloc est alors terminé.)
    if (stage.kind === 'replay' && !stage.done && s + stage.k < e && c.turn() === me) {
      movable = me;
      const expected = new Chess(fen).move(sans[s + stage.k]);
      if (stage.hint === 'square' || stage.hint === 'solution') highlight[expected.from] = 'rgba(255, 170, 0, .65)';
      if (stage.hint === 'solution') arrows.push({ from: expected.from, to: expected.to, color: 'rgba(30,160,60,.9)' });
    }
  } else if (stage.kind === 'model') {
    const c = positionAfter([...sans, ...lesson.model.moves], sans.length + stage.k);
    fen = c.fen();
    const h = c.history({ verbose: true });
    lastMove = h.length ? h[h.length - 1] : null;
  } else {
    fen = positionAfter(sans, sans.length).fen();
  }
  if (lastMove && !highlight[lastMove.from]) { highlight[lastMove.from] = 'rgba(255,255,0,.35)'; highlight[lastMove.to] = 'rgba(255,255,0,.45)'; }

  function onMove(uci: string) {
    if (stage.kind !== 'replay' || stage.done) return;
    const [s] = blocks[stage.block];
    const expected = new Chess(fen).move(sans[s + stage.k]);
    if (uci === expected.from + expected.to + (expected.promotion ?? '')) {
      setStage({ ...stage, k: stage.k + 1, tries: 0, hint: 'none' });
    } else {
      const tries = stage.tries + 1;
      setStage({ ...stage, tries, hint: tries >= 2 ? 'solution' : 'square' });
    }
  }

  const label = (ply: number, san: string) => fig(`${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'} ${san}`);
  const stepIndex = stage.kind === 'watch' ? 0 : stage.kind === 'replay' ? 1 : stage.kind === 'plan' ? 2 : 3;

  return (
    <div className="play">
      <div className="board-col">
        <Board fen={fen} orientation={me} movable={movable} onMove={onMove} arrows={arrows} highlight={highlight} />
        {(stage.kind === 'watch' || stage.kind === 'model') && (
          <div className="nav row">
            <button aria-label="Coup précédent" onClick={() => setStage({ ...stage, k: Math.max(0, stage.k - 1) })}><ChevronLeft aria-hidden /></button>
            <button className="primary" disabled={stage.kind === 'watch' ? stage.k >= blocks[stage.block][1] - blocks[stage.block][0] : stage.k >= lesson.model.moves.length}
              onClick={() => setStage({ ...stage, k: stage.k + 1 })}><ChevronRight aria-hidden className="ico" />Coup suivant</button>
          </div>
        )}
      </div>
      <aside className="side-col">
        <div className="card">
          <h2>Leçon : {opening.name}</h2>
          <div className="lesson-steps">
            {steps.map((t, i) => <span key={t} className={i === stepIndex ? 'on' : i < stepIndex ? 'past' : ''}>{i + 1}. {t}</span>)}
          </div>
          {(stage.kind === 'watch' || stage.kind === 'replay') && (
            <p className="muted small">Bloc {stage.block + 1}/{blocks.length} · coups {Math.floor(blocks[stage.block][0] / 2) + 1} à {Math.ceil(blocks[stage.block][1] / 2)}</p>
          )}
        </div>

        {stage.kind === 'watch' && (() => {
          const [s, e] = blocks[stage.block];
          const ply = s + stage.k - 1;
          return (
            <div className="card">
              {stage.block === 0 && stage.k === 0 && <p>{lesson.intro}</p>}
              {stage.k === 0 ? <p className="muted">Avance coup par coup avec « Coup suivant » : chaque coup a un but.</p> : (
                <>
                  <h3>{label(ply, sans[ply])} {ply % 2 === (me === 'w' ? 0 : 1) ? <span className="tag">ton coup</span> : null}</h3>
                  <Explained text={lesson.moves[ply].why} fresh={fresh[`move:${ply}`]} />
                </>
              )}
              {stage.k === e - s && (
                <button className="primary" onClick={() => setStage({ kind: 'replay', block: stage.block, k: 0, tries: 0, hint: 'none', done: false })}>
                  À toi : rejoue ce bloc
                </button>
              )}
            </div>
          );
        })()}

        {stage.kind === 'replay' && (() => {
          const [s, e] = blocks[stage.block];
          const ply = Math.min(s + stage.k, e - 1);
          return (
            <div className="card">
              {!stage.done ? (
                <>
                  <h3>Rejoue tes coups</h3>
                  {positionAfter(sans, ply).turn() === me
                    ? <p>{stage.hint === 'none' ? 'Joue le coup de la leçon.' : stage.hint === 'square'
                        ? 'Pas tout à fait : la pièce à jouer est surlignée.'
                        : <>Solution : <b>{label(ply, sans[ply])}</b> (flèche verte). Joue-le.</>}</p>
                    : <p className="muted pulse">L’adversaire joue…</p>}
                </>
              ) : (
                <>
                  <h3><CircleCheck aria-hidden className="ico good-text" /> Bloc réussi</h3>
                  <p className="muted small">Ces coups entrent dans ton drill (première révision demain).</p>
                  {stage.block + 1 < blocks.length
                    ? <button className="primary" onClick={() => setStage({ kind: 'watch', block: stage.block + 1, k: 0 })}>Bloc suivant</button>
                    : <button className="primary" onClick={() => setStage({ kind: 'plan' })}>Le plan</button>}
                </>
              )}
            </div>
          );
        })()}

        {stage.kind === 'plan' && (
          <div className="card">
            <h3>Le plan</h3>
            {lesson.plan.map((p, i) => <Explained key={i} text={p} fresh={fresh[`plan:${i}`]} />)}
            <button className="primary" onClick={() => setStage({ kind: 'model', k: 0 })}>Voir une partie type</button>
          </div>
        )}

        {stage.kind === 'model' && (() => {
          const i = stage.k - 1;
          const note = i >= 0 ? lesson.model.notes[i] : undefined;
          const ply = sans.length + i;
          return (
            <div className="card">
              <h3>Partie type</h3>
              <p className="muted small">Suite de la ligne principale jouée par Stockfish (ordinateur contre lui-même).</p>
              {i < 0 ? <p>Position à la fin de la ligne principale. Avance avec « Coup suivant ».</p> : (
                <>
                  <p><b>{label(ply, lesson.model.moves[i])}</b></p>
                  {note ? <><span className="tag">moment clé</span><Explained text={note} fresh={fresh[`model:${i}`]} /></> : <p className="muted">—</p>}
                </>
              )}
              {stage.k >= lesson.model.moves.length && (
                <>
                  <p>{lesson.model.end}</p>
                  <button className="primary" onClick={async () => {
                    const fens: string[] = [];
                    for (let k = 0; k < sans.length; k++) { const c = positionAfter(sans, k); if (c.turn() === me) fens.push(c.fen()); }
                    const introduced = await introduceDrillCards(opening.id, fens);
                    await saveLessonProgress(opening.id, { blocksDone: blocks.length, done: true, at: Date.now() });
                    setStage({ kind: 'done', introduced });
                  }}>Terminer la leçon</button>
                </>
              )}
            </div>
          );
        })()}

        {stage.kind === 'done' && (
          <div className="card good">
            <h3><CircleCheck aria-hidden className="ico good-text" /> Leçon terminée</h3>
            <p>Les coups de la ligne principale sont dans ton drill. Étapes suivantes conseillées :</p>
            <div className="col">
              <button className="primary" onClick={() => go({ name: 'revise', opening: opening.id })}>2. Drill</button>
              <button onClick={() => go({ name: 'play', opening: opening.id })}>3. Partie à thème</button>
              <button onClick={() => go({ name: 'openings' })}>Retour aux ouvertures</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
