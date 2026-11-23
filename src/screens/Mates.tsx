import { useEffect, useState } from 'react';
import { fig } from '../lib/notation';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import MateExercise from '../MateExercise';
import { MATE_LESSONS } from '../data/mateLessons';
import { MATE_LEVELS, STREAK_TO_VALIDATE, MAX_MOVE_LIMIT, EXTRA_MOVES_ALLOWED, stalemateTraps, type MateLevelId } from '../lib/mates';
import { levelStates, type LevelState } from '../matesService';
import { go } from '../router';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleCheck, Lock, TriangleAlert } from '../icons';

function LevelList() {
  const [states, setStates] = useState<LevelState[] | null>(null);
  useEffect(() => { levelStates().then(setStates); }, []);
  if (!states) return null;
  return (
    <div className="mates">
      <h2>Mats élémentaires</h2>
      <p className="muted">Apprends la méthode, puis automatise-la contre Stockfish qui défend au mieux. Un niveau est validé après
        {' '}{STREAK_TO_VALIDATE} mats d’affilée dans la limite de coups — le plus grand de « minimum + {EXTRA_MOVES_ALLOWED} » et
        {' '}« 2 × minimum », au plus {MAX_MOVE_LIMIT} — ; il débloque le suivant.</p>
      {states.map((s, i) => (
        <section key={s.level.id} className={`card mate-level ${s.unlocked ? '' : 'locked'}`}>
          <div className="opening-head">
            <h3>{i + 1}. {s.level.name}</h3>
            <span className="muted">
              {!s.level.available ? 'Plus tard' : s.validated ? <><CircleCheck aria-hidden className="ico sm good-text" /> Validé</> : s.unlocked ? `Série : ${s.streak}/${STREAK_TO_VALIDATE}` : <><Lock aria-hidden className="ico sm" /> Valide le niveau précédent</>}
              {s.runs > 0 && ` · ${s.wins}/${s.runs} mats`}
            </span>
          </div>
          {s.level.available && (
            <div className="row">
              <button disabled={!s.unlocked} onClick={() => go({ name: 'mates', level: s.level.id, mode: 'lesson' })}>Leçon</button>
              <button className="primary" disabled={!s.unlocked} onClick={() => go({ name: 'mates', level: s.level.id, mode: 'play' })}>Exercice</button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function Lesson({ level }: { level: MateLevelId }) {
  const lesson = MATE_LESSONS.find((l) => l.level === level)!;
  const def = MATE_LEVELS.find((l) => l.id === level)!;
  const [k, setK] = useState(0); // nombre de demi-coups joués
  const c = new Chess(lesson.fen);
  for (const m of lesson.moves.slice(0, k)) c.move(m.san);
  const last = c.history({ verbose: true }).slice(-1)[0];
  // Étape courante : celle du dernier coup blanc joué.
  let step = 0;
  for (let i = k - 1; i >= 0; i--) if (lesson.moves[i].s) { step = lesson.moves[i].s!; break; }
  const highlight: Record<string, string> = last ? { [last.from]: 'rgba(255,255,0,.35)', [last.to]: 'rgba(255,255,0,.45)' } : {};
  // Piège du pat : flèche rouge sur le coup qui ferait pat ; l'étape du coup suivant est surlignée.
  const trap = lesson.traps?.find((t) => t.at === k);
  if (trap) step = lesson.moves[k].s ?? step;
  const arrows: BoardArrow[] = [];
  if (trap) { const m = new Chess(c.fen()).move(trap.san); arrows.push({ from: m.from, to: m.to, color: 'rgba(220,40,40,.85)' }); }
  const trapCount = trap ? stalemateTraps(c.fen()).length : 0;
  return (
    <div className="play">
      <div className="board-col">
        <Board fen={c.fen()} orientation="w" movable={null} highlight={highlight} arrows={arrows} />
        <div className="nav row">
          <button aria-label="Début" onClick={() => setK(0)}><ChevronsLeft aria-hidden /></button>
          <button aria-label="Coup précédent" onClick={() => setK(Math.max(0, k - 1))}><ChevronLeft aria-hidden /></button>
          <button className="primary" onClick={() => setK(Math.min(lesson.moves.length, k + 1))}><ChevronRight aria-hidden className="ico" />Coup suivant</button>
          <button aria-label="Fin" onClick={() => setK(lesson.moves.length)}><ChevronsRight aria-hidden /></button>
        </div>
      </div>
      <aside className="side-col">
        <div className="card">
          <h3>Leçon : {def.name}</h3>
          <p>{lesson.intro}</p>
          <ol className="steps">
            {lesson.steps.map((t, i) => <li key={i} className={step === i + 1 ? 'on' : ''}>{fig(t)}</li>)}
          </ol>
          {trap && (
            <p className="trap"><TriangleAlert aria-hidden className="ico sm" /> Piège du pat : <b>{fig(trap.san)}</b> (flèche rouge) ferait pat — le roi noir n’aurait plus aucune case
              {' '}sans être en échec{trapCount > 1 ? ` (${trapCount} coups font pat ici)` : ''}. Le bon coup : <b>{fig(lesson.moves[k].san)}</b> (« Coup suivant »).</p>
          )}
          <p className="muted small">{k === 0 ? 'Avance coup par coup avec « Coup suivant ».' : `Coup ${Math.ceil(k / 2)} : ${fig(lesson.moves.slice(0, k).map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${m.san}` : m.san)).slice(-2).join(' '))}`}
            {c.isCheckmate() && ' — échec et mat !'}</p>
          {c.isCheckmate() && <button className="primary" onClick={() => go({ name: 'mates', level, mode: 'play' })}>À toi : exercice</button>}
        </div>
      </aside>
    </div>
  );
}

export default function Mates({ level, mode }: { level?: MateLevelId; mode?: 'lesson' | 'play' }) {
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  if (!level || !mode) return <LevelList />;
  if (mode === 'lesson') return <Lesson level={level} />;
  const def = MATE_LEVELS.find((l) => l.id === level)!;
  return (
    <>
      <MateExercise key={round} level={def} onDone={() => setDone(true)} />
      {done && (
        <div className="row mate-next">
          <button className="primary" onClick={() => { setDone(false); setRound(round + 1); }}>Exercice suivant</button>
          <button onClick={() => go({ name: 'mates', level, mode: 'lesson' })}>Revoir la leçon</button>
          <button onClick={() => go({ name: 'mates' })}>Niveaux</button>
        </div>
      )}
    </>
  );
}
