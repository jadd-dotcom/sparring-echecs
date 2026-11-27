// Barre d'onglets du bas (iPhone et iPad) : Aujourd'hui · Jouer · Ouvertures · Entraînement · Progrès, avec des
// pastilles de nombre (étapes du jour restantes, partie en cours, cartes du jour + erreurs à commenter, messages).
import { useEffect, useState } from 'react';
import { TABS, tabOf, type TabId } from './nav';
import type { Route } from './router';
import { db, getCurrent } from './db';
import { loadToday } from './sessionService';
import { reviewCounts } from './openings';
import { errorsToComment } from './lib/commentQueue';
import { BookOpen, CalendarCheck, ChartLine, Dumbbell, Play } from './icons';

const ICON: Record<TabId, typeof Play> = { today: CalendarCheck, jouer: Play, openings: BookOpen, training: Dumbbell, progress: ChartLine };

export default function TabBar({ route }: { route: Route }) {
  const active = tabOf(route);
  const [badges, setBadges] = useState<Partial<Record<TabId, number>>>({});
  useEffect(() => {
    let alive = true;
    (async () => {
      const [t, cur, rc, games, goals] = await Promise.all([loadToday(), getCurrent(), reviewCounts(), db.games.toArray(), db.meta.get('goals')]);
      if (!alive) return;
      setBadges({
        today: t.steps.filter((s) => !s.done).length,
        jouer: cur ? 1 : 0,
        training: rc.today + rc.threat + errorsToComment(games).length,
        progress: ((goals?.value as { messages?: string[] } | undefined)?.messages ?? []).length,
      });
    })().catch(() => {});
    return () => { alive = false; };
  }, [route]);
  return (
    <nav className="tabbar" aria-label="Onglets">
      {TABS.map((t) => {
        const Icon = ICON[t.id];
        const n = badges[t.id] ?? 0;
        return (
          <a key={t.id} href={t.hash} className={`tab ${active === t.id ? 'active' : ''}`} aria-current={active === t.id ? 'page' : undefined}
            data-testid={`tab-${t.id}`}>
            <span className="tab-ico"><Icon aria-hidden />{n > 0 && <span className="tab-badge" aria-label={`${n}`}>{n > 99 ? '99+' : n}</span>}</span>
            <span className="tab-label">{t.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
