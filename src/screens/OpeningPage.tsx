// Page d'une ouverture : onglets Leçon / Lignes / Carrefours / Pièges, avec l'en-tête
// « Leçon x/y · Lignes x/y · Carrefours x/y ».
// - Leçon : sommaire (blocs de la ligne principale, le plan, la partie type, lignes supplémentaires) avec statut,
//   « Reprendre où je me suis arrêté », et pour chaque bloc : Regarder · Rejouer · ↻ en boucle.
// - Lignes : arbre groupé par carrefours (« son coup → mon coup »), filtres, sélection, départ au carrefour ou au
//   1er coup, option « En boucle ».
// - Carrefours : positions où son coup change ma réponse (exercice : mode Carrefours).
// - Pièges : les pièges qui arrivent dans cette ouverture.
import { useEffect, useMemo, useState } from 'react';
import { db, type Opening } from '../db';
import { go } from '../router';
import { treeOf } from '../openings';
import { OPENING_LESSONS } from '../data/openingLessons';
import { TRAPS } from '../data/traps';
import { emptyProgress, lineKey, orderedLines, type LineProgress } from '../lib/lineTrainer';
import { getLineProgress } from '../linesService';
import { crossroads, lineName, lineTree, linesUnder, moveLabel, signpostCards, type LineTreeNode } from '../lib/crossroads';
import { emptyLessonState, entryStatus, lessonCounts, lessonEntries, STATUS_LABEL, type LessonState } from '../lib/lessonPlan';
import { getLessonState } from '../lessonService';
import { getTrapProgress } from '../trapService';
import { trapStatus, type TrapProgress } from '../lib/traps';
import { fig } from '../lib/notation';
import { Check, Eye, Play, Repeat, Shield, Swords } from '../icons';
import { saveLineSession } from '../linesService';
import { crossroadCounts, CROSS_MASTERED_STEP, getCrossProgress } from '../crossroadService';
import { crossQueue, type CrossProgress } from '../lib/crossroadTrainer';
import { signpostSentence } from '../lib/signposts';
import { dayKey } from '../lib/srs';

type Tab = 'lecon' | 'lignes' | 'carrefours' | 'pieges';
const TAB_LABEL: Record<Tab, string> = { lecon: 'Leçon', lignes: 'Lignes', carrefours: 'Carrefours', pieges: 'Pièges' };
type Filter = 'all' | 'redo' | 'never' | 'ok';
const FILTER_LABEL: Record<Filter, string> = { all: 'Toutes', redo: 'À refaire', never: 'Jamais jouées', ok: 'Validées' };

export default function OpeningPage({ id, tab = 'lecon' }: { id: string; tab?: Tab }) {
  const [o, setO] = useState<Opening | null>(null);
  const [lp, setLp] = useState<LineProgress>(emptyProgress());
  const [ls, setLs] = useState<LessonState>(emptyLessonState());
  const [tp, setTp] = useState<Record<string, TrapProgress>>({});
  const [cx, setCx] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  useEffect(() => {
    (async () => {
      // Tout est chargé avant l'affichage (pas de statut périmé qui change sous les yeux).
      const [op, lpr, lst, tpr] = await Promise.all([db.openings.get(id), getLineProgress(id), getLessonState(id), getTrapProgress()]);
      const c = op ? await crossroadCounts(op) : { done: 0, total: 0 };
      setLp(lpr); setLs(lst); setTp(tpr); setCx(c);
      setO(op ?? null);
    })();
  }, [id]);
  const lesson = OPENING_LESSONS.find((l) => l.openingId === id);
  const root = useMemo(() => (o ? treeOf(o) : null), [o]);
  const ordered = useMemo(() => (root ? orderedLines(root, lesson) : []), [root, lesson]);
  const cs = useMemo(() => (root && o ? crossroads(root, o.color) : []), [root, o]);
  if (!o || !root) return null;
  const entries = lesson ? lessonEntries(lesson) : [];
  const lc = lessonCounts(entries, ls);
  const linesOk = ordered.filter((l) => lp.lines[lineKey(l)]?.status === 'ok').length;
  const cardsTotal = signpostCards(root, o.color).length;

  return (
    <div className="opening-page">
      <h2>{o.name} <span className="muted small">({o.color === 'w' ? 'Blancs' : 'Noirs'})</span></h2>
      <p className="opening-head" data-testid="opening-head">
        {lesson ? `Leçon ${lc.done}/${lc.total}` : 'Pas de leçon'} · Lignes {linesOk}/{ordered.length} · Carrefours {cx.done}/{cardsTotal}
      </p>
      <div className="segmented opening-tabs" role="tablist">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => go({ name: 'opening', id, tab: t })} data-testid={`otab-${t}`}>{TAB_LABEL[t]}</button>
        ))}
      </div>
      {tab === 'lecon' && <LessonTab o={o} entries={entries} st={ls} hasLesson={!!lesson} />}
      {tab === 'lignes' && <LinesTab o={o} ordered={ordered} lp={lp} cs={cs} />}
      {tab === 'carrefours' && <CrossroadsTab o={o} />}
      {tab === 'pieges' && <TrapsTab id={id} tp={tp} />}
    </div>
  );
}

// ---------------------------------------------------------------- Leçon

function LessonTab({ o, entries, st, hasLesson }: { o: Opening; entries: ReturnType<typeof lessonEntries>; st: LessonState; hasLesson: boolean }) {
  if (!hasLesson) return <p className="muted">Pas de leçon écrite pour cette ouverture : entraîne ses lignes dans l’onglet « Lignes ».</p>;
  const r = st.resume;
  const re = r ? entries.find((e) => e.key === r.key) : undefined;
  const STAGE: Record<string, string> = { watch: 'Regarder', replay: 'Rejouer', loop: 'En boucle', plan: 'Le plan', model: 'La partie type' };
  let group = '';
  return (
    <>
      {r && re && (
        <section className="card flat resume" data-testid="lesson-resume">
          <p className="muted small">Reprendre où je me suis arrêté</p>
          <p><b>{re.group ? `${re.group} · ` : ''}{re.title}</b> — {STAGE[r.stage]}{r.k ? `, coup ${r.k}` : ''}</p>
          <button className="primary main-action" onClick={() => go({ name: 'lesson', id: o.id, part: re.key, ...(r.stage === 'replay' || r.stage === 'loop' ? { stage: r.stage } : {}) })}>
            <Play aria-hidden className="ico" />Reprendre</button>
        </section>
      )}
      <ol className="lesson-toc">
        {entries.map((e) => {
          const s = entryStatus(e, st);
          const b = st.blocks[e.key];
          const head = e.group && e.group !== group ? (group = e.group) : null;
          return (
            <li key={e.key} className={`toc-item st-${s}`} data-testid={`toc-${e.key}`} data-status={s}>
              {head && <h4 className="toc-group">{fig(head)}</h4>}
              <div className="toc-row">
                <span className="toc-check" aria-hidden>{s === 'done' ? <Check /> : null}</span>
                <span className="toc-title"><b>{e.kind === 'extra' ? fig(e.title) : e.title}</b>
                  <span className="muted small">{STATUS_LABEL[s]}{b?.replays ? ` · rejoué ${b.replays} fois` : ''}{b?.errors ? ` · ${b.errors} erreur${b.errors > 1 ? 's' : ''}` : ''}{b?.loops ? ` · ${b.loops} tour${b.loops > 1 ? 's' : ''} en boucle` : ''}</span></span>
              </div>
              <div className="row toc-actions">
                {e.kind === 'plan' || e.kind === 'model'
                  ? <button className="flat-btn" onClick={() => go({ name: 'lesson', id: o.id, part: e.key })}><Eye aria-hidden className="ico" />Voir</button>
                  : <>
                    <button className="flat-btn" onClick={() => go({ name: 'lesson', id: o.id, part: e.key, stage: 'watch' })}><Eye aria-hidden className="ico" />Regarder</button>
                    <button className="flat-btn" onClick={() => go({ name: 'lesson', id: o.id, part: e.key, stage: 'replay' })}><Play aria-hidden className="ico" />Rejouer</button>
                    <button className="flat-btn loop-btn" aria-label="En boucle" title="En boucle" onClick={() => go({ name: 'lesson', id: o.id, part: e.key, stage: 'loop' })}><Repeat aria-hidden className="ico" /></button>
                  </>}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

// ---------------------------------------------------------------- Lignes

function LinesTab({ o, ordered, lp, cs }: { o: Opening; ordered: string[][]; lp: LineProgress; cs: ReturnType<typeof crossroads> }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<'carrefour' | 'first'>('carrefour');
  const [loop, setLoop] = useState(false);
  const [both, setBoth] = useState(false);
  const lesson = OPENING_LESSONS.find((l) => l.openingId === o.id);
  const statusOf = (l: string[]) => lp.lines[lineKey(l)]?.status;
  const keep = (l: string[]) => {
    const s = statusOf(l);
    return filter === 'all' || (filter === 'redo' && s === 'redo') || (filter === 'never' && !s) || (filter === 'ok' && s === 'ok');
  };
  const tree = useMemo(() => lineTree(ordered, cs), [ordered, cs]);
  const shown = ordered.filter(keep);
  const toggle = (k: string) => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  async function train(keys: string[], opts: { start: 'carrefour' | 'first'; loop: boolean }) {
    await saveLineSession({ openingId: o.id, keys, start: opts.start, loop: opts.loop, i: 0, both });
    go({ name: 'lines', id: o.id, sel: true });
  }
  const row = (l: string[]) => {
    if (!keep(l)) return null;
    const k = lineKey(l);
    const s = statusOf(l);
    return (
      <li key={k} className="line-row" data-testid="line-row" data-line={k}>
        <label className="line-check"><input type="checkbox" checked={sel.has(k)} onChange={() => toggle(k)} aria-label={`Choisir ${lineName(l, lesson, cs, ordered[0])}`} /></label>
        <span className="line-name"><b>{fig(lineName(l, lesson, cs, ordered[0]))}</b>
          <span className={`tag ${s === 'ok' ? 'st-good' : s === 'redo' ? 'st-bad' : 'st-new'}`}>{s === 'ok' ? 'validée' : s === 'redo' ? 'à refaire' : 'jamais jouée'}</span></span>
        <button className="flat-btn" onClick={() => train([k], { start, loop: false })} data-testid="line-play"><Play aria-hidden className="ico" />Jouer</button>
        <button className="flat-btn" aria-label="En boucle" onClick={() => train([k], { start, loop: true })}><Repeat aria-hidden className="ico" /></button>
      </li>
    );
  };
  const node = (n: LineTreeNode): React.ReactNode => {
    if (!linesUnder(n).some(keep)) return null;
    return (
      <li key={[...n.path, n.his].join(' ')} className="cross-node">
        <p className="cross-head"><b>{fig(moveLabel(n.ply, n.his))}</b>{n.mine && <> → {fig(moveLabel(n.ply + 1, n.mine))}</>}</p>
        <ul className="line-list">{n.lines.map(row)}</ul>
        {n.children.length > 0 && <ul className="cross-tree">{n.children.map(node)}</ul>}
      </li>
    );
  };
  return (
    <>
      <div className="segmented filters" role="radiogroup" aria-label="Filtre">
        {(Object.keys(FILTER_LABEL) as Filter[]).map((f) => (
          <button key={f} role="radio" aria-checked={filter === f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{FILTER_LABEL[f]}</button>
        ))}
      </div>
      <p className="muted small">{shown.length} ligne{shown.length > 1 ? 's' : ''} · groupées par carrefours (son coup → mon coup). <button className="ghost small" onClick={() => setSel(new Set(shown.map(lineKey)))}>Tout cocher</button>{sel.size > 0 && <button className="ghost small" onClick={() => setSel(new Set())}>Tout décocher</button>}</p>
      <ul className="line-list">{tree.root.map(row)}</ul>
      <ul className="cross-tree top">{tree.nodes.map(node)}</ul>
      <div className="train-bar" data-testid="train-bar">
        <div className="segmented" role="radiogroup" aria-label="Départ">
          <button role="radio" aria-checked={start === 'carrefour'} className={start === 'carrefour' ? 'on' : ''} onClick={() => setStart('carrefour')}>Départ au carrefour</button>
          <button role="radio" aria-checked={start === 'first'} className={start === 'first' ? 'on' : ''} onClick={() => setStart('first')}>Au 1er coup</button>
        </div>
        <label className="unrated-toggle"><input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> En boucle</label>
        <label className="unrated-toggle both-toggle"><input type="checkbox" checked={both} onChange={(e) => setBoth(e.target.checked)} data-testid="both-toggle" /> Les deux camps</label>
        <button className="primary main-action" disabled={!sel.size} onClick={() => train(ordered.map(lineKey).filter((k) => sel.has(k)), { start, loop })} data-testid="train-sel">
          Entraîner la sélection ({sel.size})</button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- Carrefours (liste ; exercice : mode Carrefours)

function CrossroadsTab({ o }: { o: Opening }) {
  const [p, setP] = useState<CrossProgress | null>(null);
  useEffect(() => { getCrossProgress(o.id).then(setP); }, [o.id]);
  const root = treeOf(o);
  const cards = signpostCards(root, o.color);
  const cs = crossroads(root, o.color);
  if (!p) return null;
  const today = dayKey();
  const q = crossQueue(cards, p, today);
  const due = q.filter((c) => p[c.id]).length;
  const state = (id: string) => (!p[id] ? 'nouvelle' : p[id].step >= CROSS_MASTERED_STEP ? 'maîtrisée' : p[id].due <= today ? 'à revoir' : 'en cours');
  return (
    <>
      <p className="muted">Un carrefour : une position où son coup change ta réponse. Une carte par coup-panneau ({cards.length}) :
        {' '}« Sur quelle ligne es-tu ? », puis ton coup.</p>
      <button className="primary main-action" disabled={!q.length} onClick={() => go({ name: 'crossroads', id: o.id })} data-testid="cross-train">
        Entraîner les carrefours ({due} à revoir · {q.length - due} nouvelle{q.length - due > 1 ? 's' : ''})</button>
      <ul className="cross-list">
        {cs.map((c) => (
          <li key={c.path.join(' ')} className="card flat">
            <p className="muted small">Après {c.path.length ? fig(c.path.map((m, i) => (i % 2 ? '' : `${i / 2 + 1}.`) + m).join(' ')) : 'la position de départ'} :</p>
            <ul className="cross-cards">{cards.filter((x) => x.crossroad.path.join(' ') === c.path.join(' ')).map((card) => (
              <li key={card.id} data-testid="cross-card" data-state={state(card.id)}>
                <b>{fig(moveLabel(card.ply, card.his))}</b>{card.mine && <> → {fig(moveLabel(card.ply + 1, card.mine))}</>}
                <span className={`tag ${state(card.id) === 'maîtrisée' ? 'st-good' : state(card.id) === 'à revoir' ? 'st-bad' : 'st-new'}`}>{state(card.id)}</span>
                <div className="muted small">{fig(signpostSentence(card, o.color, { lesson: OPENING_LESSONS.find((l) => l.openingId === o.id) }))}</div>
              </li>
            ))}</ul>
          </li>
        ))}
      </ul>
    </>
  );
}

// ---------------------------------------------------------------- Pièges

function TrapsTab({ id, tp }: { id: string; tp: Record<string, TrapProgress> }) {
  const list = TRAPS.filter((t) => t.openings?.includes(id));
  if (!list.length) return <p className="muted">Pas de piège répertorié pour cette ouverture. <button className="ghost small" onClick={() => go({ name: 'traps' })}>Tous les pièges</button></p>;
  return (
    <ul className="nav-list">
      {list.map((t) => (
        <li key={t.id} className="card flat" data-testid={`otrap-${t.id}`}>
          <p><b>{t.name}</b> <span className="muted small">· {trapStatus(tp[t.id])}</span></p>
          <div className="row">
            <button className="flat-btn" onClick={() => go({ name: 'traps', id: t.id })}>La leçon</button>
            <button className="flat-btn" onClick={() => go({ name: 'traps', id: t.id, mode: 'defend' })}><Shield aria-hidden className="ico" />Défends-toi</button>
            <button className="flat-btn" onClick={() => go({ name: 'traps', id: t.id, mode: 'punish' })}><Swords aria-hidden className="ico" />Punis-le</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
