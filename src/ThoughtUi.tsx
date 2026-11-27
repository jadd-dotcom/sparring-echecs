// « Ce que je pensais » : réponse en un toucher (5 boutons) et texte libre facultatif, enregistrés dans la partie.
import { useRef, useState } from 'react';
import { db, type Game } from './db';
import { THOUGHT_LABEL, THOUGHT_ORDER, type ThoughtTag } from './lib/thoughts';
import { Check } from './icons';

/** « Ce que je pensais » : texte libre facultatif (1-2 phrases), enregistré automatiquement. */
export function ThoughtBox({ game, ply, onSaved }: { game: Game; ply: number; onSaved: (t: Record<number, string>) => void }) {
  const [text, setText] = useState(game.thoughts?.[ply] ?? '');
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = async (v: string) => {
    const fresh = (await db.games.get(game.id!))?.thoughts ?? {};
    const thoughts = { ...fresh };
    if (v.trim()) thoughts[ply] = v.trim(); else delete thoughts[ply];
    await db.games.update(game.id!, { thoughts });
    onSaved(thoughts);
    setSaved(true);
  };
  return (
    <label className="thought">En quelques mots <span className="muted small">(facultatif, 1-2 phrases)</span>
      <textarea rows={2} maxLength={400} value={text} placeholder="ex. Je voulais attaquer le roi, je n’ai pas vu son fou."
        onChange={(e) => {
          setText(e.target.value); setSaved(false);
          if (timer.current) clearTimeout(timer.current);
          const v = e.target.value;
          timer.current = setTimeout(() => save(v), 600);
        }}
        onBlur={() => { if (timer.current) clearTimeout(timer.current); if (!saved) save(text); }} />
      <span className="muted small">{saved ? (text.trim() ? <><Check aria-hidden className="ico sm" /> enregistré</> : '') : '…'}</span>
    </label>
  );
}

/** « Ce que je pensais » en un toucher : sur mes erreurs et gaffes, avant de montrer le meilleur coup. */
export function ThoughtButtons({ game, ply, onSaved }: { game: Game; ply: number; onSaved: (t: Record<number, ThoughtTag>) => void }) {
  const cur = game.thoughtTags?.[ply];
  const pick = async (t: ThoughtTag) => {
    const fresh = (await db.games.get(game.id!))?.thoughtTags ?? {};
    const thoughtTags = { ...fresh, [ply]: t };
    await db.games.update(game.id!, { thoughtTags });
    onSaved(thoughtTags);
  };
  return (
    <div className={`thought-tags ${cur ? 'answered' : ''}`} role="group" aria-label="Ce que je pensais" data-testid="thought-tags">
      {cur ? <p className="muted small">Ce que je pensais (touche pour changer) :</p>
        : <p><b>Avant de voir le meilleur coup :</b> qu’est-ce qui s’est passé ?</p>}
      <div className="tag-buttons">
        {THOUGHT_ORDER.map((t) => (
          <button key={t} className={cur === t ? 'on' : ''} aria-pressed={cur === t} onClick={() => pick(t)}>{THOUGHT_LABEL[t]}</button>
        ))}
      </div>
    </div>
  );
}

