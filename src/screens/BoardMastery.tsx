// Mode « Maîtrise de l'échiquier » (objectif : jouer à l'aveugle) : chapitres débloqués dans l'ordre, leçon de chaque
// chapitre, statuts (validé, à revoir, révision due), échauffement du jour, carte de chaleur des cases.
import { useEffect, useState } from 'react';
import { CHAPTERS, chapterUnlocked, chapterValidated, dueChapters, levelsOf, levelUnlocked, passesNeeded, testRule, type BoardProgress } from '../lib/board/levels';
import { lessonOf } from '../data/boardLessons';
import { getBoardProgress, getBoardStats } from '../boardService';
import type { SquareStats } from '../lib/board/stats';
import { Heatmap } from '../boardUi';
import { dayKey } from '../lib/srs';
import { go } from '../router';
import { fig } from '../lib/notation';
import { Check, ChevronRight, Flame, Lock, Play, RotateCcw } from '../icons';

function useBoardData() {
  const [p, setP] = useState<BoardProgress | null>(null);
  const [stats, setStats] = useState<SquareStats>({});
  useEffect(() => { Promise.all([getBoardProgress(), getBoardStats()]).then(([a, b]) => { setP(a); setStats(b); }); }, []);
  return { p, stats };
}

function chapterStatus(p: BoardProgress, n: number, today: string): { label: string; cls: string } {
  if (!chapterUnlocked(p, n)) return { label: 'Verrouillé', cls: 'locked' };
  const r = p.chapters[n];
  if (r?.toReview) return { label: 'À revoir', cls: 'bad' };
  if (chapterValidated(p, n)) return r && r.due <= today ? { label: 'Révision due', cls: 'due' } : { label: 'Validé', cls: 'good' };
  return { label: 'En cours', cls: 'cur' };
}

export default function BoardMastery() {
  const { p, stats } = useBoardData();
  if (!p) return null;
  const today = dayKey();
  const due = dueChapters(p, today);
  return (
    <div className="board-mastery">
      <h2>Maîtrise de l’échiquier</h2>
      <p className="muted">Objectif : jouer à l’aveugle. Chaque chapitre : une courte leçon, puis des exercices chronométrés ; le suivant se débloque quand il est validé.</p>
      <button className="primary huge" onClick={() => go({ name: 'board', view: 'warmup' })}>
        <Flame aria-hidden className="ico" />Échauffement échiquier (3 min){due.length ? ` · ${due.length} révision${due.length > 1 ? 's' : ''}` : ''}
      </button>
      {CHAPTERS.map((c) => {
        const st = chapterStatus(p, c.n, today);
        const locked = st.cls === 'locked';
        return (
          <section key={c.n} className={`card board-chapter ${locked ? 'locked' : ''}`} data-chapter={c.n}>
            <div className="opening-head">
              <h3>{locked && <Lock aria-hidden className="ico sm" />}Chapitre {c.n}. {c.title}</h3>
              <span className={`tag st-${st.cls}`} data-testid={`status-${c.n}`}>{st.label}</span>
            </div>
            <div className="level-pills">
              {levelsOf(c.n).map((l) => {
                const lp = p.levels[l.id];
                const need = passesNeeded(l.test);
                return (
                  <span key={l.id} className={`pill ${lp?.validated && need ? 'ok' : ''}`}>
                    {l.id} {lp?.validated && need ? <Check aria-hidden className="ico sm" /> : need > 1 && lp?.passes ? `${lp.passes}/${need}` : ''}
                  </span>
                );
              })}
            </div>
            <button disabled={locked} onClick={() => go({ name: 'board', view: 'lesson', chapter: c.n })}>
              {locked ? 'Valide le chapitre précédent' : <>Ouvrir le chapitre<ChevronRight aria-hidden className="ico" /></>}
            </button>
          </section>
        );
      })}
      <section className="card">
        <h3>Mes cases</h3>
        <Heatmap stats={stats} />
      </section>
    </div>
  );
}

/** Leçon d'un chapitre (méthode + astuce) et ses exercices. */
export function BoardLessonScreen({ chapter }: { chapter: number }) {
  const { p } = useBoardData();
  if (!p) return null;
  const lesson = lessonOf(chapter);
  const title = CHAPTERS.find((c) => c.n === chapter)?.title;
  if (!chapterUnlocked(p, chapter)) return <div className="card">Chapitre verrouillé : valide d’abord le chapitre {chapter - 1}.</div>;
  return (
    <div className="board-mastery">
      <h2>Chapitre {chapter}. {title}</h2>
      <section className="card lesson-card">
        <p><b>{lesson.goal}</b></p>
        <h3>Méthode</h3>
        <ol className="steps">{lesson.method.map((m, i) => <li key={i}>{fig(m)}</li>)}</ol>
        <h3>Astuce</h3>
        <p className="term">{fig(lesson.tip)}</p>
        <h3>Exemples</h3>
        <ul>{lesson.examples.map((e, i) => <li key={i}>{fig(e)}</li>)}</ul>
      </section>
      {levelsOf(chapter).map((l) => {
        const lp = p.levels[l.id];
        const open = levelUnlocked(p, l.id);
        const need = passesNeeded(l.test);
        return (
          <section key={l.id} className={`card ${open ? '' : 'locked'}`} data-level={l.id}>
            <div className="opening-head">
              <h3>{l.id}. {l.title}</h3>
              <span className="muted small">{lp?.validated && need ? 'Validé' : need > 1 ? `Réussites : ${lp?.passes ?? 0}/${need}` : ''}{lp?.best ? ` · meilleur : ${lp.best}` : ''}</span>
            </div>
            <p>{fig(lesson.exercises[l.id] ?? '')}</p>
            {l.test.type !== 'none' && <p className="muted small">{testRule(l)}</p>}
            <div className="row">
              {l.kind === 'replay' ? (
                <button className="primary" disabled={!open} onClick={() => go({ name: 'board', view: 'replay' })}><RotateCcw aria-hidden className="ico" />Rejouer une partie</button>
              ) : l.kind === 'blind' ? (
                <button className="primary" disabled={!open} onClick={() => go({ name: 'board', view: 'blind' })}><Play aria-hidden className="ico" />Jouer à l’aveugle</button>
              ) : (
                <>
                  <button disabled={!open} onClick={() => go({ name: 'board', view: 'ex', id: l.id, mode: 'practice' })}>S’entraîner</button>
                  <button className="primary" disabled={!open} onClick={() => go({ name: 'board', view: 'ex', id: l.id, mode: 'test' })}>Épreuve</button>
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
