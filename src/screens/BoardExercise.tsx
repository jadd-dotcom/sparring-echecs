// Mode « Maîtrise de l'échiquier » : exercices d'un niveau — entraînement (sans chrono, corrigé expliqué),
// épreuve (critères de maîtrise) ou révision d'un chapitre. Niveaux 1a à 6-8 ; 7a/7b ont leurs écrans.
import { useCallback, useEffect, useRef, useState } from 'react';
import { checkAnswer, expectedLabel, makeQuestion, type Question } from '../lib/board/questions';
import { levelById, levelUnlocked, median, passesNeeded, testPassed, testRule, type Level } from '../lib/board/levels';
import type { SquareStats } from '../lib/board/stats';
import { getBoardProgress, getBoardStats, saveReview, saveSquareAnswer, saveTest } from '../boardService';
import { Choices, SquareKeypad, TapBoard, type Flash } from '../boardUi';
import { answerFeedback, loadSoundSetting } from '../sound';
import { fig } from '../lib/notation';
import { go } from '../router';
import { CircleCheck, CircleX } from '../icons';

export type RunMode = 'practice' | 'test' | 'review' | 'drill';

export interface RunResult { levelId: string; passed: boolean; text: string }

interface Answer { ok: boolean; ms: number; units: number }

const fmtS = (ms: number) => `${(ms / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} s`;

/** Déroulé d'exercices (réutilisé par l'échauffement). */
export function ExerciseRunner({ level, mode, chapter, seconds, onDone }: {
  level: Level; mode: RunMode; chapter?: number; seconds?: number; onDone?: (r: RunResult) => void;
}) {
  const [stats, setStats] = useState<SquareStats | null>(null);
  const [q, setQ] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [flash, setFlash] = useState<Flash>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; q: Question } | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [done, setDone] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const t0 = useRef(0);
  const startedAt = useRef(0);
  const finished = useRef(false);
  const statsRef = useRef<SquareStats>({});
  const answersRef = useRef<Answer[]>([]);

  const timed = mode === 'drill' || (mode !== 'practice' && level.test.type === 'timed');
  const total = mode === 'drill' ? (seconds ?? 180) * 1000 : level.test.type === 'timed' ? level.test.seconds * 1000 : 0;
  const nQuestions = mode !== 'practice' && mode !== 'drill' && level.test.type === 'count' ? level.test.questions : Infinity;

  const next = useCallback((prev?: Question) => {
    const nq = makeQuestion(level, Math.random, statsRef.current, prev);
    setQ(nq);
    t0.current = performance.now();
  }, [level]);

  useEffect(() => {
    loadSoundSetting();
    getBoardStats().then((s) => { statsRef.current = s; setStats(s); startedAt.current = performance.now(); next(); });
  }, [next]);

  const finish = useCallback(async (all: Answer[]) => {
    if (finished.current) return;
    finished.current = true;
    const correct = all.filter((a) => a.ok).length;
    const errors = all.length - correct;
    let text: string;
    let passed = false;
    let score = 0;
    if (level.test.type === 'timed' || mode === 'drill') {
      text = `${correct} bonne${correct > 1 ? 's' : ''} réponse${correct > 1 ? 's' : ''}, ${errors} erreur${errors > 1 ? 's' : ''} en ${Math.round(total / 1000)} s`;
      passed = mode !== 'drill' && testPassed(level.test, { correct, errors });
      score = correct - 5 * errors;
    } else {
      const times = all.map((a) => a.ms / Math.max(1, a.units));
      const med = median(times);
      text = `${correct}/${all.length} justes, temps médian ${fmtS(med)}`;
      passed = testPassed(level.test, { correct, total: all.length, timesMs: times });
      score = correct * 1000 - Math.round(med / 10);
    }
    let extra = '';
    if (mode === 'test') {
      const p = await saveTest(level.id, passed, text, score);
      const lp = p.levels[level.id];
      const need = passesNeeded(level.test);
      extra = lp.validated ? ' Niveau validé !' : need > 1 ? ` Réussites : ${lp.passes}/${need}.` : '';
    } else if (mode === 'review' && chapter) {
      await saveReview(chapter, level.id, passed);
      extra = passed ? ' Révision réussie.' : ' Révision ratée : chapitre « à revoir ».';
    }
    const r = { levelId: level.id, passed, text: text + '.' + extra };
    setDone(r);
    onDone?.(r);
  }, [level, mode, chapter, total, onDone]);

  // Chronomètre (épreuves de 30 s et échauffement).
  useEffect(() => {
    if (!timed || !stats || done) return;
    const id = setInterval(() => {
      const rest = total - (performance.now() - startedAt.current);
      setLeft(Math.max(0, rest));
      if (rest <= 0) { clearInterval(id); finish(answersRef.current); }
    }, 100);
    return () => clearInterval(id);
  }, [timed, stats, done, total, finish]);

  async function answer(given: string | string[]) {
    if (!q || busy || done) return;
    const ms = performance.now() - t0.current;
    const ok = checkAnswer(q, given);
    answerFeedback(ok);
    if (q.square) {
      saveSquareAnswer(q.square, ok, ms / q.units);
      const s = statsRef.current[q.square] ?? { n: 0, err: 0, ms: 0 };
      statsRef.current = { ...statsRef.current, [q.square]: { n: s.n + 1, err: s.err + (ok ? 0 : 1), ms: s.ms + ms / q.units } };
    }
    const all = [...answersRef.current, { ok, ms, units: q.units }];
    answersRef.current = all;
    setAnswers(all);
    // Retour visuel sur l'échiquier : case touchée (vert/rouge) et, après une erreur, la bonne réponse.
    if (typeof given === 'string' && (q.input === 'board-square' || q.input === 'board-file' || q.input === 'board-rank')) {
      setFlash({ squares: [given], tone: ok ? 'good' : 'bad' });
    }
    if (mode === 'practice') { setFeedback({ ok, q }); if (!ok) showAnswer(q); return; }
    if (!ok) { showAnswer(q); setBusy(true); await new Promise((r) => setTimeout(r, 650)); setBusy(false); }
    setFlash(null);
    if (all.length >= nQuestions) { finish(all); return; }
    next(q);
  }

  function showAnswer(question: Question) {
    if (question.input === 'board-square' || question.input === 'keypad') setFlash({ squares: [question.expected as string], tone: 'show' });
    if (question.input === 'board-file') setFlash({ squares: [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${question.expected}${r}`), tone: 'show' });
    if (question.input === 'board-rank') setFlash({ squares: [...'abcdefgh'].map((f) => `${f}${question.expected}`), tone: 'show' });
  }

  if (!q || !stats) return null;
  const correct = answers.filter((a) => a.ok).length;
  const errors = answers.length - correct;
  const onBoard = q.input === 'board-file' || q.input === 'board-rank' || q.input === 'board-square' || q.input === 'keypad';

  if (done) {
    return (
      <div className={`card ${done.passed ? 'good' : mode === 'practice' || mode === 'drill' ? '' : 'bad'}`} data-testid="board-result">
        <h3>{mode === 'drill' ? 'Échauffement terminé' : done.passed ? <><CircleCheck aria-hidden className="ico good-text" /> Épreuve réussie</> : <><CircleX aria-hidden className="ico bad-text" /> Épreuve non réussie</>}</h3>
        <p className="big-count">{done.text}</p>
      </div>
    );
  }

  return (
    <div className="board-ex" data-level={level.id} data-expected={Array.isArray(q.expected) ? q.expected.join(' ') : q.expected} data-input={q.input}
      data-answered={answers.length} data-busy={busy || !!feedback ? '1' : '0'}>
      <div className="ex-head">
        {timed && left !== null && <span className="timer" data-testid="timer">{Math.ceil(left / 1000)} s</span>}
        {mode !== 'practice' && <span className="score"><b>{correct}</b> juste{correct > 1 ? 's' : ''} · <b>{errors}</b> erreur{errors > 1 ? 's' : ''}
          {Number.isFinite(nQuestions) ? ` · question ${Math.min(answers.length + 1, nQuestions)}/${nQuestions}` : ''}</span>}
      </div>
      <p className="prompt" data-testid="prompt">{fig(q.prompt)}</p>
      {onBoard && (
        <TapBoard side={level.side} coords={level.coords} highlight={q.highlight} flash={flash} compact={q.input === 'keypad'}
          onTap={q.input === 'keypad' ? undefined : (s) => answer(s)} disabled={busy || !!feedback || q.input === 'keypad'} />
      )}
      {q.input === 'keypad' && <SquareKeypad key={answers.length} onSubmit={answer} disabled={busy || !!feedback} />}
      {q.input === 'multi' && <SquareKeypad key={answers.length} multi onSubmit={answer} disabled={busy || !!feedback} />}
      {q.input === 'choice' && <Choices choices={q.choices!} onPick={answer} disabled={busy || !!feedback} />}
      {!onBoard && flash?.tone === 'show' && null}
      {mode !== 'practice' && busy && <p className="bad-text" data-testid="correction">Réponse : {fig(expectedLabel(q))}</p>}
      {feedback && (
        <div className={`card ${feedback.ok ? 'good' : 'bad'}`} data-testid="explain">
          <p>{feedback.ok ? <><CircleCheck aria-hidden className="ico good-text" /> Juste.</> : <><CircleX aria-hidden className="ico bad-text" /> Réponse : <b>{fig(expectedLabel(feedback.q))}</b>.</>}</p>
          <p className="muted">{fig(feedback.q.explain)}</p>
          <button className="primary" onClick={() => { setFeedback(null); setFlash(null); next(feedback.q); }}>Suivante</button>
        </div>
      )}
      {mode === 'practice' && <button className="ghost" onClick={() => go({ name: 'board', view: 'lesson', chapter: level.chapter })}>Terminer l’entraînement</button>}
    </div>
  );
}

/** Écran d'un niveau : intro de l'épreuve, puis le déroulé ; à la fin, recommencer ou revenir au chapitre. */
export default function BoardExercise({ id, mode }: { id: string; mode: RunMode }) {
  const level = levelById(id);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(mode === 'practice');
  const [result, setResult] = useState<RunResult | null>(null);
  const [passes, setPasses] = useState<string>('');
  const [locked, setLocked] = useState<boolean | null>(null);
  useEffect(() => {
    if (!level) return;
    getBoardProgress().then((p) => {
      setLocked(!levelUnlocked(p, level.id));
      const lp = p.levels[level.id];
      const need = passesNeeded(level.test);
      setPasses(lp?.validated ? 'Niveau validé.' : need > 1 ? `Réussites : ${lp?.passes ?? 0}/${need}.` : '');
    });
  }, [level, result]);
  if (!level) return <div className="card">Niveau introuvable.</div>;
  if (locked === null) return null;
  if (locked) return <div className="card">Niveau verrouillé : valide d’abord les niveaux précédents. <button onClick={() => go({ name: 'board' })}>Retour</button></div>;
  return (
    <div className="board-mastery">
      <h2>{level.chapter}. {level.title}</h2>
      {!started ? (
        <section className="card">
          <p>{testRule(level)}</p>
          {passes && <p className="muted">{passes}</p>}
          <button className="primary huge" onClick={() => setStarted(true)}>Commencer l’épreuve</button>
        </section>
      ) : (
        <ExerciseRunner key={run} level={level} mode={mode} onDone={setResult} />
      )}
      {result && (
        <div className="row">
          <button className="primary" onClick={() => { setResult(null); setRun((r) => r + 1); }}>Recommencer</button>
          <button onClick={() => go({ name: 'board', view: 'lesson', chapter: level.chapter })}>Retour au chapitre</button>
        </div>
      )}
      {passes && result && <p className="muted" data-testid="passes">{passes}</p>}
    </div>
  );
}
