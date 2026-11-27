// Carte « Mon objectif » (en haut de l'accueil) : une règle à la fois, « X parties propres sur les 10 dernières »,
// une pastille par partie, le point de départ pour comparer, les messages (maîtrise, retour) et « À surveiller ».
import { useEffect, useState, useSyncExternalStore } from 'react';
import { detailRefresh } from './detailRefresh';
import { clearGoalMessages, loadGoals, type GoalData } from './goalService';
import { GOAL_MASTERED, GOAL_WINDOW, goalProgress, toWatch } from './lib/goals';
import { MOTIF_LABEL } from './lib/report/motifs';
import { Check, PartyPopper, Target, X } from './icons';
import { go } from './router';

const fmt = (t: number) => new Date(t).toLocaleDateString('fr-FR');

/** `compact` (Aujourd'hui) : nom, règle, 10 pastilles, point de départ ; « À surveiller » est dans Progrès. */
export default function GoalCard({ compact = false }: { compact?: boolean }) {
  const [d, setD] = useState<GoalData | null>(null);
  // Rechargée quand le recalcul des motifs se termine (les parties propres peuvent changer).
  const refreshed = useSyncExternalStore(detailRefresh.subscribe, () => detailRefresh.get().finishedAt);
  useEffect(() => { loadGoals().then(setD).catch(() => {}); }, [refreshed]);
  if (!d) return null;
  const { state, goal, games, exits } = d;
  const watch = toWatch(goal, games, exits);
  const p = goal ? goalProgress(goal, games, state.since, exits) : null;
  const dots = p ? [...p.last, ...Array.from({ length: Math.max(0, GOAL_WINDOW - p.last.length) }, () => null)] : [];

  return (
    <>
      <section className={`card goal-card${compact ? ' compact' : ''}`} data-testid="goal-card" data-goal={goal?.id ?? 'aucun'}>
        {state.messages.length > 0 && (
          <div className="goal-msg" data-testid="goal-msg">
            {state.messages.map((m, i) => <p key={i}><PartyPopper aria-hidden className="ico sm" /> {m}</p>)}
            <button className="small" onClick={() => { clearGoalMessages(); setD({ ...d, state: { ...state, messages: [] } }); }}>D’accord</button>
          </div>
        )}
        <p className="muted small goal-kicker"><Target aria-hidden className="ico sm" /> Mon objectif{compact && goal ? <> : <b className="goal-name-inline">{goal.name}</b></> : ''}</p>
        {goal && p ? <>
          {compact ? <span className="sr-only" data-testid="goal-name">{goal.name}</span> : <h2 className="goal-name" data-testid="goal-name">{goal.name}</h2>}
          <p className="goal-rule" data-testid="goal-rule">« {goal.rule} »</p>
          <p data-testid="goal-score">
            <b>{p.clean} partie{p.clean > 1 ? 's' : ''} propre{p.clean > 1 ? 's' : ''} sur les {GOAL_WINDOW} dernières</b>
            {p.total < GOAL_WINDOW && <span className="muted small"> ({p.total} jouée{p.total > 1 ? 's' : ''} depuis le {fmt(state.since)} ; il en faut {GOAL_WINDOW})</span>}
          </p>
          <div className="goal-dots" aria-label="Parties depuis le début de l’objectif">
            {dots.map((x, i) => x === null
              ? <span key={i} className="goal-dot empty" />
              : <button key={i} className={`goal-dot ${x.clean ? 'ok' : 'ko'}`} aria-label={`${fmt(x.date)} : ${x.clean ? 'propre' : 'pas propre'}`}
                onClick={() => go({ name: 'review', id: x.id })}>{x.clean ? <Check aria-hidden /> : <X aria-hidden />}</button>)}
          </div>
          <p className="muted small" data-testid="goal-baseline">
            Point de départ : {p.baseline.n ? <>{p.baseline.clean} propre{p.baseline.clean > 1 ? 's' : ''} sur les {p.baseline.n} parties d’avant le {fmt(state.since)}</> : <>aucune partie analysée avant le {fmt(state.since)}</>}.
            {!compact && <>{' '}Maîtrisé à {GOAL_MASTERED}/{GOAL_WINDOW}.</>}
          </p>
        </> : <h2 className="goal-name" data-testid="goal-name">Tous les objectifs sont maîtrisés</h2>}
      </section>
      {!compact && watch.length > 0 && (
        <p className="muted small goal-watch" data-testid="goal-watch">
          <b>À surveiller</b> (10 dernières parties) : {watch.map((w) => `${w.label === 'repertoire' ? 'sorties du répertoire' : MOTIF_LABEL[w.label]} ×${w.count}`).join(' · ')}
        </p>
      )}
    </>
  );
}
