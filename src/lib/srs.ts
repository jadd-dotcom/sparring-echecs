// Répétition espacée : J+1, J+3, J+7, J+14, J+30. Raté → J+1.
export const INTERVALS = [1, 3, 7, 14, 30] as const;

export interface SrsState {
  /** Nombre de réussites consécutives. */
  step: number;
  /** Jour d'échéance, format AAAA-MM-JJ (heure locale). */
  due: string;
}

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${j}`;
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

/** Nouvelle carte : première révision le lendemain. */
export const newCard = (today: string): SrsState => ({ step: 0, due: addDays(today, INTERVALS[0]) });

/** Planifie la prochaine révision après une tentative. */
export function schedule(state: SrsState, success: boolean, today: string): SrsState {
  if (!success) return { step: 0, due: addDays(today, INTERVALS[0]) };
  const step = state.step + 1;
  const interval = INTERVALS[Math.min(step, INTERVALS.length - 1)];
  return { step, due: addDays(today, interval) };
}

export const isDue = (s: SrsState, today: string) => s.due <= today;
