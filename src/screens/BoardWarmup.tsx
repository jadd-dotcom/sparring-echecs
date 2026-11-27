// Échauffement échiquier (3 min) : enchaîne les révisions du jour (chapitres validés dus ou « à revoir ») ;
// s'il n'y en a pas, 3 minutes sur mes cases les plus faibles.
import { useEffect, useRef, useState } from 'react';
import { dueChapters, levelById, reviewLevel, CHAPTERS, chapterValidated, testRule, type BoardProgress } from '../lib/board/levels';
import { getBoardProgress } from '../boardService';
import { dayKey } from '../lib/srs';
import { ExerciseRunner, type RunResult } from './BoardExercise';
import { BoardReplay } from './BoardBlind';
import { go } from '../router';
import { endStep, markWarmupDone } from '../sessionService';
import { CircleCheck, CircleX } from '../icons';

const BUDGET_MS = 3 * 60 * 1000;

export default function BoardWarmup() {
  const [p, setP] = useState<BoardProgress | null>(null);
  const [queue, setQueue] = useState<{ chapter: number; level: string }[]>([]);
  const [i, setI] = useState(-1);                 // -1 : écran d'accueil de l'échauffement
  const [results, setResults] = useState<(RunResult & { chapter: number })[]>([]);
  const [over, setOver] = useState(false);
  const t0 = useRef(0);

  // Échauffement terminé : l'étape 1 de la séance du jour est cochée.
  useEffect(() => { if (over) markWarmupDone(); }, [over]);
  useEffect(() => {
    getBoardProgress().then((prog) => {
      setP(prog);
      setQueue(dueChapters(prog, dayKey()).map((c) => ({ chapter: c, level: reviewLevel(prog, c) })));
    });
  }, []);
  if (!p) return null;

  const drillLevel = levelById(chapterValidated(p, 2) ? '2d' : '1d')!;
  const start = () => { t0.current = performance.now(); setI(0); };
  const onDone = (r: RunResult, chapter: number) => {
    setResults((rs) => [...rs, { ...r, chapter }]);
  };
  const nextOrStop = () => {
    if (i + 1 < queue.length && performance.now() - t0.current < BUDGET_MS) setI(i + 1);
    else setOver(true);
  };

  if (i < 0) {
    return (
      <div className="board-mastery">
        <h2>Échauffement échiquier (3 min)</h2>
        <section className="card">
          {queue.length ? (
            <>
              <p>Révisions du jour :</p>
              <ul>{queue.map((q) => (
                <li key={q.chapter}>Chapitre {q.chapter}. {CHAPTERS.find((c) => c.n === q.chapter)?.title}
                  {p.chapters[q.chapter]?.toReview ? ' — à revoir' : ''} <span className="muted small">({q.level === '7a' ? 'rejouer une partie courte : au plus 2 erreurs et 1 coup d’œil' : testRule(levelById(q.level)!)})</span></li>
              ))}</ul>
            </>
          ) : <p>Aucune révision aujourd’hui : 3 minutes pour trouver tes cases les plus faibles ({drillLevel.side === 'w' ? 'vu des Blancs' : 'vu des Noirs'}).</p>}
          <button className="primary huge" onClick={start}>Commencer</button>
        </section>
      </div>
    );
  }

  if (!queue.length) {
    return (
      <div className="board-mastery">
        <h2>Échauffement : mes cases faibles</h2>
        <ExerciseRunner level={drillLevel} mode="drill" seconds={180} onDone={() => setOver(true)} />
        {over && <button className="primary" data-testid="session-back" onClick={() => { endStep(); go({ name: 'home' }); }}>Retour à Aujourd’hui</button>}
      </div>
    );
  }

  if (over) {
    return (
      <div className="board-mastery">
        <h2>Échauffement terminé</h2>
        <section className="card" data-testid="warmup-summary">
          <ul>{results.map((r) => (
            <li key={r.chapter}>{r.passed ? <CircleCheck aria-hidden className="ico sm good-text" /> : <CircleX aria-hidden className="ico sm bad-text" />}
              Chapitre {r.chapter} : {r.text}</li>
          ))}</ul>
          {results.length < queue.length && <p className="muted">{queue.length - results.length} révision{queue.length - results.length > 1 ? 's' : ''} restante{queue.length - results.length > 1 ? 's' : ''} : elle{queue.length - results.length > 1 ? 's' : ''} reste{queue.length - results.length > 1 ? 'nt' : ''} due{queue.length - results.length > 1 ? 's' : ''}.</p>}
          <div className="row">
            <button className="primary" data-testid="session-back" onClick={() => { endStep(); go({ name: 'home' }); }}>Retour à Aujourd’hui</button>
            <button onClick={() => go({ name: 'board' })}>Maîtrise de l’échiquier</button>
          </div>
        </section>
      </div>
    );
  }

  const cur = queue[i];
  const done = results.length > i;
  const elapsed = Math.round((performance.now() - t0.current) / 1000);
  return (
    <div className="board-mastery">
      <h2>Révision {i + 1}/{queue.length} : chapitre {cur.chapter} <span className="muted small">· {Math.floor(elapsed / 60)} min {String(elapsed % 60).padStart(2, '0')} s</span></h2>
      {cur.level === '7a'
        ? <BoardReplay key={i} review onDone={(r) => onDone({ levelId: '7a', ...r }, 7)} />
        : <ExerciseRunner key={i} level={levelById(cur.level)!} mode="review" chapter={cur.chapter} onDone={(r) => onDone(r, cur.chapter)} />}
      {done && <button className="primary huge" onClick={nextOrStop}>{i + 1 < queue.length && performance.now() - t0.current < BUDGET_MS ? 'Révision suivante' : 'Terminer'}</button>}
    </div>
  );
}
