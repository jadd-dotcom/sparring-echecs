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
  | { kind: 'done'; introduced: number; extra?: boolean };

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

/**
 * Bloc à regarder puis rejouer : une suite de coups (`seq`) dont on montre les demi-coups [s, e).
 * Ligne principale : blocs de 3 coups ; blocs supplémentaires : une ligne de côté par bloc.
 */
interface Blk { seq: string[]; whys: string[]; where: string[]; s: number; e: number; extra?: { id: string; title: string; intro: string; line: number; lines: number; name: string } }

function lessonBlocksOf(lesson: OpeningLesson): { blocks: Blk[]; mainCount: number } {
  const sans = lesson.moves.map((m) => m.san);
  const whys = lesson.moves.map((m) => m.why);
  const where = lesson.moves.map((_, i) => `move:${i}`);
  const blocks: Blk[] = lessonBlocks(sans.length).map(([s, e]) => ({ seq: sans, whys, where, s, e }));
  const mainCount = blocks.length;
  for (const x of lesson.extras ?? []) {
    x.lines.forEach((ln, j) => {
      const pad = ln.start.map(() => '');
      blocks.push({
        seq: [...ln.start, ...ln.moves.map((m) => m.san)], whys: [...pad, ...ln.moves.map((m) => m.why)],
        where: [...pad, ...ln.moves.map((_, i) => `extra:${x.id}:${j}:${i}`)], s: ln.start.length, e: ln.start.length + ln.moves.length,
        extra: { id: x.id, title: x.title, intro: x.intro, line: j, lines: x.lines.length, name: ln.name },
      });
    });
  }
  return { blocks, mainCount };
}

export default function OpeningLessonScreen({ id, part }: { id: string; part?: string }) {
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id) as OpeningLesson | undefined;
  const [opening, setOpening] = useState<Opening | null>(null);
  const { blocks, mainCount } = useMemo(() => (lesson ? lessonBlocksOf(lesson) : { blocks: [], mainCount: 0 }), [lesson]);
  const firstExtra = part ? blocks.findIndex((b) => b.extra?.id === part) : -1;
  const [stage, setStage] = useState<Stage>({ kind: 'watch', block: firstExtra >= 0 ? firstExtra : 0, k: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { db.openings.get(id).then((o) => setOpening(o ?? null)); }, [id]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const sans = useMemo(() => lesson?.moves.map((m) => m.san) ?? [], [lesson]);
  const fresh = useMemo(() => (lesson ? firstAppearances(lesson) : {}), [lesson]);

  // Rejouer : les coups adverses se jouent seuls.
  useEffect(() => {
    if (stage.kind !== 'replay' || stage.done || !opening) return;
    const { seq, s, e } = blocks[stage.block];
    const ply = s + stage.k;
    if (ply >= e) { setStage({ ...stage, done: true }); return; }
    const c = positionAfter(seq, ply);
    if (c.turn() !== opening.color) {
      timer.current = setTimeout(() => setStage({ ...stage, k: stage.k + 1, tries: 0, hint: 'none' }), OPP_DELAY);
    }
  }, [stage, opening, blocks]);

  // Bloc rejoué : ses coups entrent dans le drill.
  useEffect(() => {
    if (stage.kind !== 'replay' || !stage.done || !opening) return;
    const { seq, s, e, extra } = blocks[stage.block];
    const fens: string[] = [];
    for (let i = s; i < e; i++) { const c = positionAfter(seq, i); if (c.turn() === opening.color) fens.push(c.fen()); }
    introduceDrillCards(opening.id, fens).catch(() => {});
    if (!extra) saveLessonProgress(opening.id, { blocksDone: stage.block + 1, done: false, at: Date.now() }).catch(() => {});
  }, [stage, opening, blocks]);

  if (!lesson) return <div className="card">Pas de leçon pour cette ouverture.</div>;
  if (!opening) return null;
  const me = opening.color;
  const cur = stage.kind === 'watch' || stage.kind === 'replay' ? blocks[stage.block] : null;
  const steps = cur?.extra ? ['Regarder', 'Rejouer'] : ['Regarder', 'Rejouer', 'Le plan', 'Partie type'];
  const extraStart = (xid: string) => blocks.findIndex((b) => b.extra?.id === xid);

  // ----- plateau selon l'étape
  let fen = new Chess().fen();
  let movable: 'w' | 'b' | null = null;
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  let lastMove: { from: string; to: string } | null = null;
  if ((stage.kind === 'watch' || stage.kind === 'replay') && cur) {
    const { seq, s, e } = cur;
    const c = positionAfter(seq, s + stage.k);
    fen = c.fen();
    const h = c.history({ verbose: true });
    lastMove = h.length ? h[h.length - 1] : null;
    // (s + k < e : la ligne peut finir par un coup adverse ; le bloc est alors terminé.)
    if (stage.kind === 'replay' && !stage.done && s + stage.k < e && c.turn() === me) {
      movable = me;
      const expected = new Chess(fen).move(seq[s + stage.k]);
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
    if (stage.kind !== 'replay' || stage.done || !cur) return;
    const expected = new Chess(fen).move(cur.seq[cur.s + stage.k]);
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
            <button className="primary" disabled={stage.kind === 'watch' ? stage.k >= cur!.e - cur!.s : stage.k >= lesson.model.moves.length}
              onClick={() => setStage({ ...stage, k: stage.k + 1 })}><ChevronRight aria-hidden className="ico" />Coup suivant</button>
          </div>
        )}
      </div>
      <aside className="side-col">
        <div className="card">
          <h2>Leçon : {opening.name}</h2>
          {cur?.extra && <h3 data-testid="extra-title">{cur.extra.title}</h3>}
          <div className="lesson-steps">
            {steps.map((t, i) => <span key={t} className={i === stepIndex ? 'on' : i < stepIndex ? 'past' : ''}>{i + 1}. {t}</span>)}
          </div>
          {cur && !cur.extra && (
            <p className="muted small">Bloc {blocks.indexOf(cur) + 1}/{mainCount} · coups {Math.floor(cur.s / 2) + 1} à {Math.ceil(cur.e / 2)}</p>
          )}
          {cur?.extra && <p className="muted small">Ligne {cur.extra.line + 1}/{cur.extra.lines} : {fig(cur.extra.name)}</p>}
        </div>

        {stage.kind === 'watch' && cur && (() => {
          const { seq, s, e, extra } = cur;
          const ply = s + stage.k - 1;
          return (
            <div className="card">
              {stage.block === 0 && stage.k === 0 && <p>{lesson.intro}</p>}
              {extra && extra.line === 0 && stage.k === 0 && <Explained text={extra.intro} fresh={fresh[`extra:${extra.id}:intro`]} />}
              {extra && stage.k === 0 && s > 0 && <p className="muted small">Début : {fig(seq.slice(0, s).map((m, i) => `${i % 2 ? '' : `${i / 2 + 1}.`}${m}`).join(' '))}</p>}
              {stage.k === 0 ? <p className="muted">Avance coup par coup avec « Coup suivant » : chaque coup a un but.</p> : (
                <>
                  <h3>{label(ply, seq[ply])} {ply % 2 === (me === 'w' ? 0 : 1) ? <span className="tag">ton coup</span> : null}</h3>
                  <Explained text={cur.whys[ply]} fresh={fresh[cur.where[ply]]} />
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

        {stage.kind === 'replay' && cur && (() => {
          const { seq, s, e, extra } = cur;
          const ply = Math.min(s + stage.k, e - 1);
          return (
            <div className="card">
              {!stage.done ? (
                <>
                  <h3>Rejoue tes coups</h3>
                  {positionAfter(seq, ply).turn() === me
                    ? <p>{stage.hint === 'none' ? 'Joue le coup de la leçon.' : stage.hint === 'square'
                        ? 'Pas tout à fait : la pièce à jouer est surlignée.'
                        : <>Solution : <b>{label(ply, seq[ply])}</b> (flèche verte). Joue-le.</>}</p>
                    : <p className="muted pulse">L’adversaire joue…</p>}
                </>
              ) : (
                <>
                  <h3><CircleCheck aria-hidden className="ico good-text" /> {extra ? 'Ligne réussie' : 'Bloc réussi'}</h3>
                  <p className="muted small">Ces coups entrent dans ton drill (première révision demain).</p>
                  {extra
                    ? (stage.block + 1 < blocks.length && blocks[stage.block + 1].extra?.id === extra.id
                      ? <button className="primary" onClick={() => setStage({ kind: 'watch', block: stage.block + 1, k: 0 })}>Ligne suivante</button>
                      : <button className="primary" onClick={() => setStage({ kind: 'done', introduced: 0, extra: true })}>Terminer</button>)
                    : stage.block + 1 < mainCount
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
                    await saveLessonProgress(opening.id, { blocksDone: mainCount, done: true, at: Date.now() });
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
            <p>Les coups {stage.extra ? 'de ces lignes' : 'de la ligne principale'} sont dans ton drill. Étapes suivantes conseillées :</p>
            <div className="col">
              {!stage.extra && lesson.extras?.map((x) => (
                <button key={x.id} onClick={() => setStage({ kind: 'watch', block: extraStart(x.id), k: 0 })}>Bloc : {x.title}</button>
              ))}
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
