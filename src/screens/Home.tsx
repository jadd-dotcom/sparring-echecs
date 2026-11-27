// « Aujourd'hui » : niveau, objectif (carte compacte), « Ta séance du jour » en 5 étapes avec durée et coche, un seul
// gros bouton « Continuer : <étape suivante> » ; liens vers les erreurs à commenter et une partie libre. Réglages :
// roue dentée en haut. Quand rien n'est à revoir, on cherche discrètement de nouvelles cartes « Lis la menace ».
import { useEffect, useState } from 'react';
import { go } from '../router';
import { isOfflineReady, waitOfflineReady } from '../offline';
import { Check, CircleCheck, Clock, MessageCircleQuestion, Play, Settings } from '../icons';
import GoalCard from '../GoalCard';
import { loadToday, startStep, type TodayData } from '../sessionService';
import { fillThreatCards } from '../threatService';
import type { StepState } from '../lib/dailyPlan';

/** Où mène chaque étape de la séance. */
function openStep(s: StepState, d: TodayData) {
  startStep(s.id);
  switch (s.id) {
    case 'warmup': go({ name: 'board', view: 'warmup' }); break;
    case 'trap': if (d.trapId) go({ name: 'traps', id: d.trapId, mode: 'defend' }); break;
    case 'threat': go({ name: 'revise', only: 'threat' }); break;
    case 'revise': go({ name: 'revise' }); break;
    case 'game': go({ name: 'play' }); break;
  }
}

export default function Home() {
  const [d, setD] = useState<TodayData | null>(null);
  const [offline, setOffline] = useState<string>(isOfflineReady() ? 'ready' : '');
  useEffect(() => {
    let alive = true;
    (async () => {
      const t = await loadToday();
      if (!alive) return;
      setD(t);
      // Rien à revoir et pas de partie en cours : nouvelles cartes « Lis la menace » (au plus 5 par jour).
      if (t.reviseLeft === 0 && !t.inProgress) {
        fillThreatCards({ maxChecks: 8 }).then(async (made) => { if (made.length && alive) setD(await loadToday()); }).catch(() => {});
      }
      if (!isOfflineReady()) {
        const ok = await waitOfflineReady((b, tt) => alive && setOffline(`${Math.round((100 * b) / tt)} %`));
        if (alive) setOffline(ok ? 'ready' : '');
      }
    })();
    return () => { alive = false; };
  }, []);
  if (!d) return null;
  const doneN = d.steps.filter((s) => s.done).length;
  const totalMin = d.steps.filter((s) => !s.done).reduce((t, s) => t + s.minutes, 0);
  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="home today">
      <div className="today-top">
        <h1>Sparring Échecs</h1>
        <span className="level-chip" data-testid="level-chip" title="Ton niveau estimé · Maia jouera à ce niveau">{Math.round(d.rating)} · Maia {Math.round(d.bot)}</span>
        <button className="icon-btn" aria-label="Réglages" onClick={() => go({ name: 'settings' })}><Settings aria-hidden /></button>
      </div>
      <p className="muted today-date">Aujourd’hui · {date}</p>
      <GoalCard compact />

      <section className="card flat session" data-testid="session">
        <h2>Ta séance du jour <span className="muted small">({doneN}/5{totalMin ? ` · encore ≈ ${totalMin} min` : ''})</span></h2>
        {d.next
          ? <button className="primary main-action" data-testid="continue" onClick={() => openStep(d.next!, d)}><Play aria-hidden className="ico" />Continuer : {d.next.label}</button>
          : <p className="good-text" data-testid="session-done"><CircleCheck aria-hidden className="ico" /> Séance terminée : bravo ! Une partie libre, si tu veux.</p>}
        <ol className="session-steps">
          {d.steps.map((s, i) => (
            <li key={s.id} className={`session-step ${s.done ? 'done' : ''} ${d.next?.id === s.id ? 'next' : ''}`} data-testid={`step-${s.id}`} data-done={s.done}>
              <button className="step-btn" onClick={() => openStep(s, d)} disabled={s.done && (s.id === 'threat' || s.id === 'revise')}>
                <span className="step-check" aria-hidden>{s.done ? <Check /> : i + 1}</span>
                <span className="step-text"><b>{s.label}</b><span className="muted small">{s.detail}</span></span>
                <span className="step-min muted small"><Clock aria-hidden className="ico sm" />{s.minutes} min</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <div className="today-links">
        {d.toComment > 0 && (
          <button className="link-row" data-testid="to-comment" onClick={() => go({ name: 'comment' })}>
            <MessageCircleQuestion aria-hidden className="ico" />{d.toComment} erreur{d.toComment > 1 ? 's' : ''} à commenter
          </button>
        )}
        <button className="link-row" data-testid="free-game" onClick={() => go({ name: 'jouer' })}><Play aria-hidden className="ico" />Partie libre</button>
      </div>
      <p className="muted small center-text">
        {offline === 'ready' ? <><CircleCheck aria-hidden className="ico sm" /> Disponible hors ligne</> : offline ? `Préparation du mode hors ligne… ${offline}` : ''}
      </p>
    </div>
  );
}
