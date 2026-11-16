// Navigation dans les coups (lecture seule) : état partagé par la partie et les exercices de mat.
import { useEffect, useRef, useState } from 'react';

/** `total` = nombre de demi-coups joués ; `at` = demi-coups affichés (total = position actuelle). */
export function useMoveNav(total: number, onStep?: (index: number) => void) {
  const [shown, setShown] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const prev = useRef(total);
  const live = shown === null || shown >= total;
  useEffect(() => {
    if (total > prev.current && !live) setPending(true);   // coup adverse pendant la navigation : on reste où l'on est
    if (total < prev.current) { setShown(null); setPending(false); }
    prev.current = total;
  }, [total, live]);
  const at = live ? total : shown!;
  const goTo = (n: number) => {
    const v = Math.max(0, Math.min(total, n));
    if (v > at && v === at + 1) onStep?.(at);              // son du coup quand on avance d'un coup
    if (v >= total) { setShown(null); setPending(false); } else setShown(v);
  };
  return { at, live, pending, goTo, toLive: () => goTo(total) };
}

export type MoveNavState = ReturnType<typeof useMoveNav>;
