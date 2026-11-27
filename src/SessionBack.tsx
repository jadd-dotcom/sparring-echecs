// « Retour à Aujourd'hui » à la fin d'une étape lancée depuis « Ta séance du jour » (l'étape s'y affiche cochée).
import { go } from './router';
import { activeStep, endStep } from './sessionService';
import type { StepId } from './lib/dailyPlan';
import { CalendarCheck } from './icons';

export default function SessionBack({ step, primary = true }: { step?: StepId; primary?: boolean }) {
  const a = activeStep();
  if (!a || (step && a !== step)) return null;
  return (
    <button className={primary ? 'primary' : ''} data-testid="session-back" onClick={() => { endStep(); go({ name: 'home' }); }}>
      <CalendarCheck aria-hidden className="ico" />Retour à Aujourd’hui
    </button>
  );
}
