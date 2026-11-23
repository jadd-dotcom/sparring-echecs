// Mode « Maîtrise de l'échiquier » : échiquier d'exercice (cases à toucher), clavier a-h / 1-8, choix, carte de chaleur.
import { useState } from 'react';
import { FILES, RANKS, screenPos, SQUARES } from './lib/board/geometry';
import { weakness, type SquareStats } from './lib/board/stats';
import { X } from './icons';

export type Flash = { squares: string[]; tone: 'good' | 'bad' | 'show' } | null;

/** Échiquier sans pièces : 64 cases à toucher, vu des Blancs ou des Noirs, coordonnées affichées ou non. */
export function TapBoard({ side, coords, highlight, flash, onTap, disabled, compact }: {
  side: 'w' | 'b'; coords?: boolean; highlight?: string; flash?: Flash; onTap?: (sq: string) => void; disabled?: boolean; compact?: boolean;
}) {
  const cells = SQUARES.map((s) => ({ s, ...screenPos(s, side) })).sort((a, b) => a.row - b.row || a.col - b.col);
  return (
    <div className={`tapboard ${compact ? 'compact' : ''}`} data-side={side} role="grid" aria-label="Échiquier">
      {cells.map(({ s, row, col }) => {
        const dark = (row + col) % 2 === 1;
        const f = flash?.squares.includes(s) ? flash.tone : null;
        return (
          <button key={s} data-square={s} disabled={disabled} onClick={() => onTap?.(s)}
            className={`tb-sq ${dark ? 'dark' : 'light'} ${highlight === s ? 'hl' : ''} ${f ? 'fl-' + f : ''}`}>
            {coords && col === 0 && <span className="tb-num">{s[1]}</span>}
            {coords && row === 7 && <span className="tb-let">{s[0]}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Clavier de cases : une colonne (a-h) puis une rangée (1-8). Mode simple (une case) ou multiple (liste puis Valider). */
export function SquareKeypad({ multi, onSubmit, disabled }: { multi?: boolean; onSubmit: (v: string | string[]) => void; disabled?: boolean }) {
  const [file, setFile] = useState<string | null>(null);
  const [list, setList] = useState<string[]>([]);
  const pickRank = (r: string) => {
    if (!file) return;
    const s = file + r;
    setFile(null);
    if (multi) setList((l) => (l.includes(s) ? l : [...l, s]));
    else onSubmit(s);
  };
  return (
    <div className="keypad">
      <div className="kp-entry" aria-live="polite">
        {multi ? (list.length ? list.map((s) => (
          <button key={s} className="chip" onClick={() => setList(list.filter((x) => x !== s))} aria-label={`Retirer ${s}`}>{s} <X aria-hidden className="ico sm" /></button>
        )) : <span className="muted">Tape une colonne puis une rangée pour chaque case.</span>)
          : <span className="kp-cur">{file ?? '·'}<span className="muted">{file ? '?' : '·'}</span></span>}
        {multi && file && <span className="kp-cur">{file}<span className="muted">?</span></span>}
      </div>
      <div className="kp-row" aria-label="Colonnes">
        {[...FILES].map((f) => <button key={f} disabled={disabled} className={file === f ? 'on' : ''} onClick={() => setFile(f)}>{f}</button>)}
      </div>
      <div className="kp-row" aria-label="Rangées">
        {[...RANKS].map((r) => <button key={r} disabled={disabled || !file} onClick={() => pickRank(r)}>{r}</button>)}
      </div>
      {multi && (
        <div className="row">
          <button disabled={disabled || (!list.length && !file)} onClick={() => { setList([]); setFile(null); }}>Effacer</button>
          <button className="primary" disabled={disabled} onClick={() => { const l = list; setList([]); setFile(null); onSubmit(l); }}>Valider</button>
        </div>
      )}
    </div>
  );
}

/** Gros boutons de réponse. */
export function Choices({ choices, onPick, disabled }: { choices: { value: string; label: string }[]; onPick: (v: string) => void; disabled?: boolean }) {
  return (
    <div className={`choices ${choices.length > 6 ? 'many' : ''}`}>
      {choices.map((c) => <button key={c.value} data-value={c.value} disabled={disabled} onClick={() => onPick(c.value)}>{c.label}</button>)}
    </div>
  );
}

/** Couleur d'une faiblesse : vert (sûre) → jaune → rouge (faible). */
function heatColor(w: number): string {
  const h = 120 - Math.min(1, w / 0.6) * 120;
  return `hsl(${h}, 62%, 42%)`;
}

/** Carte de chaleur des cases : erreurs et temps de réponse. Toucher une case affiche son détail. */
export function Heatmap({ stats }: { stats: SquareStats }) {
  const [sel, setSel] = useState<string | null>(null);
  const cells = SQUARES.map((s) => ({ s, ...screenPos(s, 'w') })).sort((a, b) => a.row - b.row || a.col - b.col);
  const st = sel ? stats[sel] : undefined;
  return (
    <div>
      <div className="heatmap" role="grid" aria-label="Carte de chaleur des cases">
        {cells.map(({ s }) => {
          const x = stats[s];
          return (
            <button key={s} data-square={s} className={`hm-sq ${sel === s ? 'sel' : ''}`} onClick={() => setSel(s)}
              style={{ background: x?.n ? heatColor(weakness(x)) : undefined }} aria-label={s}>{s}</button>
          );
        })}
      </div>
      <p className="muted small" data-testid="heat-detail">
        {sel ? (st?.n ? `${sel} : ${st.err} erreur${st.err > 1 ? 's' : ''} sur ${st.n} réponse${st.n > 1 ? 's' : ''}, ${(st.ms / st.n / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} s en moyenne.` : `${sel} : pas encore vue.`)
          : 'Vert : case sûre · rouge : erreurs ou réponses lentes · gris : pas encore vue. Touche une case pour son détail.'}
      </p>
    </div>
  );
}
