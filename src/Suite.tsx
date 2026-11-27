// « Voir la suite » : une suite de coups se joue sur l'échiquier de l'écran, coup par coup (▶ / ◀), avec une flèche
// pour le coup montré (verte pour mon camp, rouge pour l'adversaire) et une légende en mots. Remplace les suites
// écrites en notation (révision, revue, commentaires).
import { useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import type { BoardArrow } from './Board';
import { moveCaption, nullMove, sanList, toUci, tryMove } from './lib/words';
import type { ErrorDetail } from './lib/report/motifs';
import { unfig } from './lib/notation';
import { ChevronLeft, ChevronRight, X, Play } from './icons';

const GREEN = 'rgba(30,160,60,.9)';
const RED = 'rgba(220,40,40,.85)';

interface SuiteState { startFen: string; moves: string[]; k: number; me: 'w' | 'b'; title: string }

export interface SuiteView { fen: string; arrows: BoardArrow[]; lastMove: { from: string; to: string } | null }

export function useSuite() {
  const [s, setS] = useState<SuiteState | null>(null);
  /** Ouvre une suite : coups SAN (liste) ou suite numérotée en texte, depuis `startFen`. */
  const open = (startFen: string, line: string | string[], me: 'w' | 'b', title: string) => {
    const sans = (typeof line === 'string' ? sanList(line) : line).map(unfig);
    const moves = toUci(startFen, sans);
    if (moves.length) setS({ startFen, moves, k: 1, me, title });
  };
  const close = () => setS(null);
  const view = useMemo<SuiteView | null>(() => {
    if (!s) return null;
    const c = new Chess(s.startFen);
    let mover: 'w' | 'b' = c.turn();
    let last: string | null = null;
    for (let i = 0; i < s.k; i++) {
      mover = c.turn();
      const u = s.moves[i];
      c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
      last = u;
    }
    return {
      fen: c.fen(),
      arrows: last ? [{ from: last.slice(0, 2), to: last.slice(2, 4), color: mover === s.me ? GREEN : RED }] : [],
      lastMove: last ? { from: last.slice(0, 2), to: last.slice(2, 4) } : null,
    };
  }, [s]);
  const caption = useMemo(() => {
    if (!s) return '';
    const c = new Chess(s.startFen);
    for (let i = 0; i < s.k - 1; i++) { const u = s.moves[i]; c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); }
    return moveCaption(c.fen(), s.moves[s.k - 1], s.me);
  }, [s]);
  const panel = s ? (
    <div className="card suite" data-testid="suite">
      <p className="muted small">{s.title} · coup {s.k}/{s.moves.length}</p>
      <p className="suite-caption" data-testid="suite-caption">{caption}</p>
      <div className="row">
        <button aria-label="Coup précédent de la suite" disabled={s.k <= 1} onClick={() => setS({ ...s, k: s.k - 1 })}><ChevronLeft aria-hidden /></button>
        <button aria-label="Coup suivant de la suite" disabled={s.k >= s.moves.length} onClick={() => setS({ ...s, k: s.k + 1 })}><ChevronRight aria-hidden /></button>
        <button onClick={close}><X aria-hidden className="ico" />Fermer</button>
      </div>
    </div>
  ) : null;
  return { active: !!s, open, close, view, panel };
}

/** Bouton « Voir la suite ». */
export function SuiteButton({ label = 'Voir la suite', onClick, testId }: { label?: string; onClick: () => void; testId?: string }) {
  return <button className="small" onClick={onClick} data-testid={testId}><Play aria-hidden className="ico sm" />{label}</button>;
}

/** Notation repliée (« Afficher la notation »). */
export function Notation({ children }: { children: React.ReactNode }) {
  return (
    <details className="notation">
      <summary>Afficher la notation</summary>
      <div className="muted small">{children}</div>
    </details>
  );
}

type OpenSuite = (startFen: string, line: string | string[], me: 'w' | 'b', title: string) => void;

/** Boutons « Voir la suite » d'une erreur : la bonne suite, la suite après mon coup, sa menace (s'il y en avait une). */
export function ErrorSuites({ d, fenBefore, myUci, me, open }: { d: ErrorDetail; fenBefore: string; myUci: string; me: 'w' | 'b'; open: OpenSuite }) {
  const after = tryMove(fenBefore, myUci)?.after.fen();
  return (
    <div className="row suite-btns">
      {d.bestLine && <SuiteButton label="Voir la bonne suite" testId="suite-best" onClick={() => open(fenBefore, d.bestLine, me, 'La bonne suite')} />}
      {d.refutation && after && <SuiteButton label="Voir la suite après ton coup" testId="suite-mine" onClick={() => open(after, d.refutation, me, 'Après ton coup de la partie')} />}
      {d.motif === 'menace-ignoree' && d.threatLine && <SuiteButton label="Voir sa menace" testId="suite-threat" onClick={() => open(nullMove(fenBefore), d.threatLine!, me, 'Sa menace')} />}
    </div>
  );
}
