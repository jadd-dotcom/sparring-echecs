// Onglet « Pièges d'ouverture » : 3 chapitres. Pour chaque piège, une mini-leçon (2 phrases en mots, « Voir la
// suite », une règle), puis « Défends-toi » et « Punis-le ». Maîtrisé : les deux réussis sans indice, deux jours
// différents ; ensuite, il revient en révision espacée.
import { useEffect, useMemo, useState } from 'react';
import Board from '../Board';
import { TRAP_CHAPTERS, TRAPS } from '../data/traps';
import { cleanDays, trapPositions, trapStatus, type TrapProgress } from '../lib/traps';
import { getTrapProgress, recordTrapAttempt } from '../trapService';
import TrapExercise from '../TrapExercise';
import { useSuite, SuiteButton } from '../Suite';
import { go } from '../router';
import SessionBack from '../SessionBack';
import { activeStep } from '../sessionService';
import { CircleCheck, PartyPopper, Shield, Swords } from '../icons';

const STATUS_CLASS = { nouveau: '', 'en cours': 'partial', 'maîtrisé': 'done' } as const;

export default function Traps({ id, mode }: { id?: string; mode?: 'defend' | 'punish' }) {
  const [prog, setProg] = useState<Record<string, TrapProgress> | null>(null);
  const [masteredMsg, setMasteredMsg] = useState(false);
  useEffect(() => { getTrapProgress().then(setProg); }, [id, mode]);
  const trap = TRAPS.find((t) => t.id === id);
  if (!prog) return null;

  const nextTrap = trap ? TRAPS[(TRAPS.indexOf(trap) + 1) % TRAPS.length] : undefined;
  if (trap && mode) {
    return (
      <TrapExercise key={`${trap.id}-${mode}`} trap={trap} mode={mode}
        notice={masteredMsg && <div className="card good" data-testid="trap-mastered"><PartyPopper aria-hidden className="ico" /> Piège maîtrisé ! Il reviendra en révision espacée.</div>}
        onDone={async (r) => {
          const res = await recordTrapAttempt(trap.id, mode, r.ok, r.clean);
          setProg((p) => ({ ...p, [trap.id]: res.progress }));
          if (res.mastered) setMasteredMsg(true);
        }}
        actions={<>
          {mode === 'defend'
            ? <button className="primary" onClick={() => go({ name: 'traps', id: trap.id, mode: 'punish' })}><Swords aria-hidden className="ico" />Punis-le</button>
            : activeStep() === 'trap' ? <SessionBack step="trap" />
              : <button onClick={() => go({ name: 'traps', id: trap.id, mode: 'defend' })}><Shield aria-hidden className="ico" />Défends-toi</button>}
          {nextTrap && <button onClick={() => go({ name: 'traps', id: nextTrap.id, mode })} data-testid="trap-next">Suivant</button>}
          <button onClick={() => go({ name: 'traps', id: trap.id })}>La leçon</button>
        </>} />
    );
  }
  if (trap) return <TrapLesson key={trap.id} trapId={trap.id} progress={prog[trap.id]} />;

  return (
    <div className="traps">
      <h2><Swords aria-hidden className="ico" /> Pièges d’ouverture</h2>
      <p className="muted">Pour chaque piège : une mini-leçon, puis « Défends-toi » (le bot tend le piège) et « Punis-le » (le bot tombe dedans).
        Maîtrisé : les deux réussis sans indice, deux jours différents ; ensuite il revient en révision.</p>
      {TRAP_CHAPTERS.map((ch, ci) => {
        const list = TRAPS.filter((t) => t.chapter === ch.id);
        const done = list.filter((t) => trapStatus(prog[t.id]) === 'maîtrisé').length;
        return (
          <section key={ch.id} className="card trap-chapter" data-testid={`trap-chapter-${ch.id}`}>
            <h3>{ci + 1}. {ch.name} <span className="muted small">({done}/{list.length} maîtrisés)</span></h3>
            <p className="muted small">{ch.intro}</p>
            <ul className="trap-list">
              {list.map((t) => {
                const st = trapStatus(prog[t.id]);
                const days = cleanDays(prog[t.id]?.attempts ?? []).length;
                return (
                  <li key={t.id}>
                    <button className={`trap-item ${STATUS_CLASS[st]}`} onClick={() => go({ name: 'traps', id: t.id })} data-testid={`trap-${t.id}`}>
                      <span className="trap-name">{st === 'maîtrisé' && <CircleCheck aria-hidden className="ico sm good-text" />} {t.name}</span>
                      <span className="muted small">{t.opening ? `${t.opening} · ` : ''}{st}{st === 'en cours' ? ` · ${Math.min(days, 2)}/2 jours sans indice` : ''}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function TrapLesson({ trapId, progress }: { trapId: string; progress?: TrapProgress }) {
  const trap = TRAPS.find((t) => t.id === trapId)!;
  const p = useMemo(() => trapPositions(trap), [trap]);
  const suite = useSuite();
  const st = trapStatus(progress);
  const days = cleanDays(progress?.attempts ?? []).length;
  return (
    <div className="play trap-lesson" data-testid="trap-lesson">
      <div className="board-col">
        <Board fen={suite.view?.fen ?? p.critical} orientation={p.victim} movable={null} arrows={suite.view?.arrows ?? []}
          lastMove={suite.view?.lastMove ?? { from: p.lastUci.slice(0, 2), to: p.lastUci.slice(2, 4) }} />
      </div>
      <aside className="side-col">
        {suite.panel}
        <div className="card">
          <p className="muted small">Pièges d’ouverture{trap.opening ? ` · ${trap.opening}` : ''} · {st}{st === 'en cours' ? ` (${Math.min(days, 2)}/2 jours sans indice)` : ''}</p>
          <h2>{trap.name}</h2>
          <p>{trap.lesson[0]}</p>
          <p>{trap.lesson[1]}</p>
          <SuiteButton testId="trap-lesson-suite" onClick={() => suite.open(p.start, [...trap.line, trap.blunder, ...trap.punish], p.victim, trap.name)} />
          <p className="trap-rule" data-testid="trap-rule"><b>Règle :</b> {trap.rule}</p>
        </div>
        <div className="row">
          <button className="primary" onClick={() => go({ name: 'traps', id: trap.id, mode: 'defend' })} data-testid="trap-defend"><Shield aria-hidden className="ico" />Défends-toi</button>
          <button className="primary" onClick={() => go({ name: 'traps', id: trap.id, mode: 'punish' })} data-testid="trap-punish"><Swords aria-hidden className="ico" />Punis-le</button>
        </div>
        <button className="ghost" onClick={() => go({ name: 'traps' })}>Tous les pièges</button>
      </aside>
    </div>
  );
}
