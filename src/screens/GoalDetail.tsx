// « Objectif en détail » : les 3 objectifs (actif, maîtrisés, à venir), la carte complète (10 dernières parties,
// point de départ, À surveiller) et la liste des parties mesurées depuis le début, chacune vers sa revue.
import { useEffect, useState } from 'react';
import { loadGoals, type GoalData } from '../goalService';
import { GOALS, goalBlunderPlies, goalProgress, isClean, measuredGames } from '../lib/goals';
import GoalCard from '../GoalCard';
import { go } from '../router';
import { Check, CircleCheck, X } from '../icons';

const fmt = (t: number) => new Date(t).toLocaleDateString('fr-FR');

export default function GoalDetail() {
  const [d, setD] = useState<GoalData | null>(null);
  useEffect(() => { loadGoals().then(setD); }, []);
  if (!d) return null;
  const { state, goal, games, exits } = d;
  const since = goal ? measuredGames(games).filter((g) => g.date >= state.since).reverse() : [];
  const p = goal ? goalProgress(goal, games, state.since, exits) : null;
  return (
    <div className="goal-detail">
      <h2>Mon objectif en détail</h2>
      <GoalCard />
      <section className="card flat">
        <h3>Les 3 objectifs</h3>
        <ol className="goal-list">
          {GOALS.map((g, i) => (
            <li key={g.id} className={state.active === i ? 'active' : ''} data-testid={`goal-${g.id}`}>
              <b>{g.name}</b> — {state.active === i ? 'actif' : state.mastered[g.id] ? <><CircleCheck aria-hidden className="ico sm good-text" /> maîtrisé le {fmt(state.mastered[g.id]!)}</> : 'à venir'}
              <div className="muted small">« {g.rule} »</div>
            </li>
          ))}
        </ol>
      </section>
      {goal && p && (
        <section className="card flat">
          <h3>Parties depuis le {fmt(state.since)} ({since.length})</h3>
          {since.length === 0 && <p className="muted">Aucune partie mesurée pour l’instant (parties analysées, 10 coups au moins).</p>}
          <ul className="nav-list">
            {since.map((g) => {
              const ok = isClean(goal, g, exits[g.id!]);
              const n = goalBlunderPlies(goal, g, exits[g.id!]).length;
              return (
                <li key={g.id} className="nav-row">
                  <button className="flat-btn wide" onClick={() => go({ name: 'review', id: g.id! })}>
                    <span className={`goal-dot ${ok ? 'ok' : 'ko'}`}>{ok ? <Check aria-hidden /> : <X aria-hidden />}</span>
                    {fmt(g.date)} · {g.source === 'chesscom' ? `Chess.com contre ${g.ext?.opp.name ?? '?'}` : 'contre Maia'}
                    <span className="muted small">{ok ? ' · propre' : ` · ${n} gaffe${n > 1 ? 's' : ''} de l’objectif`}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
