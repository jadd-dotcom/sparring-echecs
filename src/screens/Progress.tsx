// Onglet « Progrès » : objectif, trois courbes (pièces données par partie, réussite sans aide en révision, classement
// Chess.com Rapid), puis objectif en détail, statistiques et parties, rapport pour Claude.
import { useEffect, useState } from 'react';
import { go } from '../router';
import { db, type Card, type Game } from '../db';
import { ChartLine, ChevronRight, FileText, Target } from '../icons';
import GoalCard from '../GoalCard';
import { LineChart } from '../LineChart';
import { CURVE_GAMES, piecesGivenCurve, rapidRatingCurve, unaidedReviewCurve } from '../lib/progressCurves';

export default function Progress() {
  const [data, setData] = useState<{ games: Game[]; cards: Card[] } | null>(null);
  useEffect(() => { Promise.all([db.games.toArray(), db.cards.toArray()]).then(([games, cards]) => setData({ games, cards })); }, []);
  const given = data ? piecesGivenCurve(data.games) : [];
  const unaided = data ? unaidedReviewCurve(data.cards) : [];
  const rapid = data ? rapidRatingCurve(data.games) : [];
  const avg = (xs: { value: number }[]) => (xs.length ? Math.round((10 * xs.reduce((s, x) => s + x.value, 0)) / xs.length) / 10 : null);
  return (
    <div className="progress-tab">
      <h2>Progrès</h2>
      <GoalCard compact />
      {data && (
        <div className="progress-curves">
          <section className="card" data-testid="curve-given">
            <h3>Pièces données par partie</h3>
            <p className="muted small">Gaffes « pièce laissée en prise » et « menace ignorée », sur mes {Math.min(CURVE_GAMES, given.length)} dernières parties analysées (sans aide){avg(given) !== null ? ` · moyenne ${avg(given)}` : ''}.</p>
            <LineChart points={given} ariaLabel="Pièces données par partie" min={0} testId="chart-given" />
          </section>
          <section className="card" data-testid="curve-unaided">
            <h3>Réussite sans aide en révision</h3>
            <p className="muted small">Par jour : cartes réussies à la 1re tentative du jour, sans indice (indices comptés depuis le 28/11/2026).</p>
            <LineChart points={unaided} ariaLabel="Réussite sans aide en révision" unit=" %" min={0} max={100} testId="chart-unaided" />
          </section>
          <section className="card" data-testid="curve-rapid">
            <h3>Classement Chess.com Rapid</h3>
            <p className="muted small">Mon classement Rapid dans mes parties importées de Chess.com (séparé du niveau Maia de l’appli).</p>
            <LineChart points={rapid} ariaLabel="Classement Chess.com Rapid" testId="chart-rapid" />
          </section>
        </div>
      )}
      <div className="nav-cards">
        <button className="nav-card" onClick={() => go({ name: 'goal' })}><Target aria-hidden className="ico" />
          <span className="nav-card-text"><b>Objectif en détail</b><span className="muted small">les 3 objectifs, mes 10 dernières parties, À surveiller</span></span><ChevronRight aria-hidden className="ico sm muted" /></button>
        <button className="nav-card" onClick={() => go({ name: 'stats' })}><ChartLine aria-hidden className="ico" />
          <span className="nav-card-text"><b>Statistiques et parties</b><span className="muted small">niveau, précision, toutes mes parties</span></span><ChevronRight aria-hidden className="ico sm muted" /></button>
        <button className="nav-card" onClick={() => go({ name: 'report' })}><FileText aria-hidden className="ico" />
          <span className="nav-card-text"><b>Rapport pour Claude</b><span className="muted small">à coller dans l’appli Claude</span></span><ChevronRight aria-hidden className="ico sm muted" /></button>
      </div>
    </div>
  );
}
