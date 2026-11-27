import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Opening } from '../db';
import {
  firstAppearances, GLOSSARY, lessonBlocks, OPENING_LESSONS, plainText, type OpeningLesson,
} from '../data/openingLessons';
import { introduceDrillCards, saveLessonProgress } from '../openings';
import { fig } from '../lib/notation';
import { go } from '../router';
import { ChevronLeft, ChevronRight, CircleCheck, Repeat, RotateCcw } from '../icons';
import { getLessonState, updateLessonState } from '../lessonService';
import { withBlock } from '../lib/lessonPlan';

type Stage =
  | { kind: 'watch'; block: number; k: number }      // k = demi-coups montrés dans le bloc
  | { kind: 'replay'; block: number; k: number; tries: number; hint: 'none' | 'square' | 'solution'; done: boolean;
      /** Erreurs pendant ce passage ; `loop` : répétition en boucle (tour n, erreurs cumulées). */
      errs?: number; loop?: { n: number; errors: number } }
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
interface Blk { seq: string[]; whys: string[]; where: string[]; s: number; e: number; extra?: { id: string; title: string; intro: string; line: number; lines: number; name: string; plan?: string } }

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
        extra: { id: x.id, title: x.title, intro: x.intro, line: j, lines: x.lines.length, name: ln.name, plan: ln.plan },
      });
    });
  }
  return { blocks, mainCount };
}

/** Clé d'un bloc dans le sommaire (main:i · extra:<id>:<j>). */
const keyOfBlock = (b: Blk, i: number) => (b.extra ? `extra:${b.extra.id}:${b.extra.line}` : `main:${i}`);

export default function OpeningLessonScreen({ id, part, stage: stageParam }: { id: string; part?: string; stage?: 'watch' | 'replay' | 'loop' }) {
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id) as OpeningLesson | undefined;
  const [opening, setOpening] = useState<Opening | null>(null);
  const { blocks, mainCount } = useMemo(() => (lesson ? lessonBlocksOf(lesson) : { blocks: [], mainCount: 0 }), [lesson]);
  // Départ : un bloc du sommaire (« Regarder », « Rejouer », « ↻ en boucle »), le plan, la partie type ; ou
  // l'ancien lien vers un bloc supplémentaire (son identifiant).
  const startStage = (): Stage => {
    if (part === 'plan') return { kind: 'plan' };
    if (part === 'model') return { kind: 'model', k: 0 };
    let b = part ? blocks.findIndex((x, i) => keyOfBlock(x, i) === part) : -1;
    if (b < 0 && part) b = blocks.findIndex((x) => x.extra?.id === part);
    if (b < 0) b = 0;
    if (stageParam === 'replay' || stageParam === 'loop') {
      return { kind: 'replay', block: b, k: 0, tries: 0, hint: 'none', done: false, errs: 0, ...(stageParam === 'loop' ? { loop: { n: 1, errors: 0 } } : {}) };
    }
    return { kind: 'watch', block: b, k: 0 };
  };
  const [stage, setStage] = useState<Stage>(startStage);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { db.openings.get(id).then((o) => setOpening(o ?? null)); }, [id]);
  // « Reprendre où je me suis arrêté » : même bloc et même étape → on repart du coup enregistré.
  useEffect(() => {
    getLessonState(id).then((st) => {
      const r = st.resume;
      if (!r || !part || r.key !== part || r.k <= 0) return;
      setStage((cur) => (cur.kind === 'watch' && r.stage === 'watch' ? { ...cur, k: r.k } : cur));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const curKey = stage.kind === 'watch' || stage.kind === 'replay' ? keyOfBlock(blocks[stage.block], stage.block) : stage.kind === 'plan' ? 'plan' : stage.kind === 'model' ? 'model' : null;
  // Point de reprise : enregistré à chaque étape (bloc, étape, coup).
  useEffect(() => {
    if (!curKey || stage.kind === 'done') return;
    const st = stage.kind === 'replay' ? (stage.loop ? 'loop' : 'replay') : stage.kind === 'watch' ? 'watch' : stage.kind;
    const k = 'k' in stage ? stage.k : 0;
    updateLessonState(id, (s) => ({ ...s, resume: { key: curKey, stage: st, k, at: Date.now() } })).catch(() => {});
  }, [id, curKey, stage]);
  // Bloc regardé jusqu'au bout ; plan et partie type vus.
  useEffect(() => {
    if (!curKey) return;
    const seen = (stage.kind === 'watch' && stage.k >= blocks[stage.block].e - blocks[stage.block].s) || stage.kind === 'plan'
      || (stage.kind === 'model' && !!lesson && stage.k >= lesson.model.moves.length);
    if (seen) updateLessonState(id, (s) => withBlock(s, curKey, (b) => ({ ...b, watched: (b.watched ?? 0) + 1 }))).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, curKey, stage.kind, 'k' in stage ? stage.k : 0]);
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

  // Bloc rejoué : compteurs (rejoué, erreurs, tours de boucle) ; en boucle, on recommence tout seul.
  useEffect(() => {
    if (stage.kind !== 'replay' || !stage.done) return;
    const key = keyOfBlock(blocks[stage.block], stage.block);
    updateLessonState(id, (st) => withBlock(st, key, (b) => ({
      ...b, replays: (b.replays ?? 0) + 1, errors: (b.errors ?? 0) + (stage.errs ?? 0), ...(stage.loop ? { loops: (b.loops ?? 0) + 1 } : {}),
    }))).catch(() => {});
    if (stage.loop) {
      const loop = stage.loop;
      timer.current = setTimeout(() => setStage({ kind: 'replay', block: stage.block, k: 0, tries: 0, hint: 'none', done: false, errs: 0, loop: { n: loop.n + 1, errors: loop.errors + (stage.errs ?? 0) } }), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.kind, stage.kind === 'replay' && stage.done]);

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
      setStage({ ...stage, tries, hint: tries >= 2 ? 'solution' : 'square', errs: (stage.errs ?? 0) + (stage.tries === 0 ? 1 : 0) });
    }
  }

  const label = (ply: number, san: string) => fig(`${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'} ${san}`);
  const stepIndex = stage.kind === 'watch' ? 0 : stage.kind === 'replay' ? 1 : stage.kind === 'plan' ? 2 : 3;

  return (
    <div className="play lesson-play" data-stage={stage.kind === 'replay' && stage.loop ? 'loop' : stage.kind} data-k={'k' in stage ? stage.k : 0} data-fen={fen}
      data-expected={movable && cur ? cur.seq[cur.s + (stage as { k: number }).k] : ''} data-key={curKey ?? ''}>
      <div className="board-col">
        <Board fen={fen} orientation={me} movable={movable} onMove={onMove} arrows={arrows} highlight={highlight} />
        {(stage.kind === 'watch' || stage.kind === 'model') && (
          <div className="nav row">
            <button aria-label="Coup précédent" onClick={() => setStage({ ...stage, k: Math.max(0, stage.k - 1) })}><ChevronLeft aria-hidden /></button>
            <button className="primary" disabled={stage.kind === 'watch' ? stage.k >= cur!.e - cur!.s : stage.k >= lesson.model.moves.length}
              onClick={() => setStage({ ...stage, k: stage.k + 1 })}><ChevronRight aria-hidden className="ico" />Coup suivant</button>
            {stage.kind === 'watch' && <button onClick={() => setStage({ ...stage, k: 0 })} data-testid="block-restart"><RotateCcw aria-hidden className="ico" />Recommencer ce bloc</button>}
          </div>
        )}
        {stage.kind === 'replay' && (
          <div className="nav row">
            <button onClick={() => { if (timer.current) clearTimeout(timer.current); setStage({ ...stage, k: 0, tries: 0, hint: 'none', done: false, errs: 0 }); }} data-testid="block-restart">
              <RotateCcw aria-hidden className="ico" />Recommencer ce bloc</button>
            {stage.loop
              ? <button onClick={() => { if (timer.current) clearTimeout(timer.current); setStage({ ...stage, loop: undefined }); }} data-testid="loop-stop">Arrêter la boucle</button>
              : <button onClick={() => setStage({ ...stage, k: 0, tries: 0, hint: 'none', done: false, errs: 0, loop: { n: 1, errors: 0 } })} data-testid="loop-start"><Repeat aria-hidden className="ico" />En boucle</button>}
          </div>
        )}
      </div>
      <aside className="side-col">
        <div className="card">
          <h2>Leçon : {opening.name}</h2>
          {cur?.extra && <h3 data-testid="extra-title">{fig(cur.extra.title)}</h3>}
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
              {stage.k === e - s && extra?.plan && (
                <div className="line-plan" data-testid="line-plan"><h3>Le plan</h3><Explained text={extra.plan} fresh={fresh[`extra:${extra.id}:${extra.line}:plan`]} /></div>
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
                  {stage.loop && <p className="tag" data-testid="loop-count"><Repeat aria-hidden className="ico sm" /> En boucle : tour {stage.loop.n} · {stage.loop.errors + (stage.errs ?? 0)} erreur{stage.loop.errors + (stage.errs ?? 0) > 1 ? 's' : ''}</p>}
                  <h3>Rejoue tes coups</h3>
                  {positionAfter(seq, ply).turn() === me
                    ? <p>{stage.hint === 'none' ? 'Joue le coup de la leçon.' : stage.hint === 'square'
                        ? 'Pas tout à fait : la pièce à jouer est surlignée.'
                        : <>Solution : <b>{label(ply, seq[ply])}</b> (flèche verte). Joue-le.</>}</p>
                    : <p className="muted pulse">L’adversaire joue…</p>}
                </>
              ) : (
                <>
                  <h3><CircleCheck aria-hidden className="ico good-text" /> {extra ? 'Ligne réussie' : 'Bloc réussi'}{stage.loop ? ` · tour ${stage.loop.n}` : ''}</h3>
                  {stage.loop && <p className="muted small" data-testid="loop-count">En boucle : tour {stage.loop.n} terminé, {stage.loop.errors + (stage.errs ?? 0)} erreur{stage.loop.errors + (stage.errs ?? 0) > 1 ? 's' : ''} au total. Le bloc recommence…</p>}
                  {extra?.plan && <p className="line-plan" data-testid="line-plan-done"><b>Le plan :</b> {fig(plainText(extra.plan))}</p>}
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
              {!stage.extra && lesson.extras?.filter((x) => !x.id.startsWith('cx-')).map((x) => (
                <button key={x.id} onClick={() => setStage({ kind: 'watch', block: extraStart(x.id), k: 0 })}>Bloc : {x.title}</button>
              ))}
              {!stage.extra && (() => {
                const cx = lesson.extras?.filter((x) => x.id.startsWith('cx-')) ?? [];
                return cx.length > 0 && (
                  <button onClick={() => setStage({ kind: 'watch', block: extraStart(cx[0].id), k: 0 })} data-testid="cx-start">
                    Les autres lignes, par carrefour ({cx.reduce((n, x) => n + x.lines.length, 0)} lignes)
                  </button>
                );
              })()}
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
