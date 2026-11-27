// Onglet « Progrès » : objectif en détail, statistiques et parties, rapport pour Claude.
import { go } from '../router';
import { ChartLine, ChevronRight, FileText, Target } from '../icons';
import GoalCard from '../GoalCard';

export default function Progress() {
  return (
    <div className="progress-tab">
      <h2>Progrès</h2>
      <GoalCard compact />
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
