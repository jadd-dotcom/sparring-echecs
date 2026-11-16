// Navigation dans les coups (lecture seule) : ⏮ ◀ ▶ ⏭, bandeau, ⏭ qui clignote quand l'adversaire a joué.
import { fig } from './lib/notation';
import type { MoveNavState } from './useMoveNav';

export function NavBar({ nav, label = 'Maia a joué' }: { nav: MoveNavState; label?: string }) {
  return (
    <div className="nav row movenav">
      <button aria-label="Début" onClick={() => nav.goTo(0)}>⏮</button>
      <button aria-label="Coup précédent" onClick={() => nav.goTo(nav.at - 1)}>◀</button>
      <button aria-label="Coup suivant" onClick={() => nav.goTo(nav.at + 1)}>▶</button>
      <button aria-label="Position actuelle" className={nav.pending ? 'blink primary' : ''} onClick={nav.toLive}>
        ⏭{nav.pending ? ` ${label}` : ''}
      </button>
    </div>
  );
}

/** Bandeau au-dessus de l'échiquier pendant la navigation. */
export function NavBanner({ nav }: { nav: MoveNavState }) {
  if (nav.live) return null;
  const n = nav.at;
  return (
    <div className="nav-banner" role="status">
      {n === 0 ? 'Tu revois la position de départ' : `Tu revois le coup ${Math.ceil(n / 2)}${n % 2 ? '' : '…'}`} — ⏭ pour revenir
    </div>
  );
}

/** Liste des coups cliquable (un bouton par demi-coup). */
export function MoveList({ san, at, onPick, firstPly = 0 }: { san: string[]; at: number; onPick: (n: number) => void; firstPly?: number }) {
  if (!san.length) return <div className="moves card"><span className="muted">Aucun coup joué</span></div>;
  return (
    <div className="moves card grid">
      {san.map((s, i) => {
        const ply = firstPly + i;
        return (
          <button key={i} className={`mv ${i + 1 === at ? 'active' : ''}`} onClick={() => onPick(i + 1)}>
            {ply % 2 === 0 ? `${ply / 2 + 1}.` : i === 0 ? `${Math.floor(ply / 2) + 1}…` : ''}{fig(s)}
          </button>
        );
      })}
    </div>
  );
}
