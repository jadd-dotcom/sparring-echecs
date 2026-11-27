// Bouton « Qu'est-ce qu'il menace ? » (revue, Explorer, partie avec assistance) : on donne le trait à l'adversaire
// (coup nul, sauf si je suis en échec) et Stockfish cherche son meilleur coup. Vraie menace (≥ 20 points de win% ou
// un mat) : flèche rouge, phrase en mots et « Voir la suite » ; sinon « Pas de menace sérieuse ».
import { useEffect, useState, type ReactNode } from 'react';
import type { Color } from 'chess.js';
import type { BoardArrow } from './Board';
import { findThreat, threatSentence, type ThreatResult } from './lib/threat';
import { browserThreatSearch } from './threatService';
import { SuiteButton } from './Suite';
import { TriangleAlert } from './icons';

const RED = 'rgba(220,40,40,.85)';

export function useThreatCheck(fen: string, me: Color, opts: {
  /** « Voir la suite » : la suite de sa menace depuis la position coup nul. */
  onSuite?: (startFen: string, line: string[], title: string) => void;
  disabled?: boolean;
} = {}): { arrows: BoardArrow[]; button: ReactNode; result: ReactNode } {
  const [st, setSt] = useState<{ fen: string; r: ThreatResult | 'busy' } | null>(null);
  // Le résultat ne vaut que pour la position où il a été demandé.
  const cur = st && st.fen === fen ? st.r : null;

  async function ask() {
    const f = fen;
    setSt({ fen: f, r: 'busy' });
    try {
      const r = await findThreat(f, me, browserThreatSearch(700));
      setSt((s) => (s && s.fen === f ? { fen: f, r } : s));
    } catch { setSt(null); }
  }

  const arrows: BoardArrow[] = cur && cur !== 'busy' && cur.status === 'threat'
    ? [{ from: cur.uci.slice(0, 2), to: cur.uci.slice(2, 4), color: RED }] : [];
  const button = (
    <button onClick={ask} disabled={opts.disabled || cur === 'busy'} data-testid="threat-btn">
      <TriangleAlert aria-hidden className="ico" />Qu’est-ce qu’il menace ?
    </button>
  );
  let result: ReactNode = null;
  if (cur === 'busy') result = <p className="pulse muted small" data-testid="threat-busy">Stockfish cherche sa menace…</p>;
  else if (cur) {
    let text: ReactNode;
    if (cur.status === 'threat') {
      text = (
        <>
          <span className="bad-text"><b>{threatSentence(cur.fenHim, cur.uci, me, cur.mate)}</b></span> <span className="muted small">(flèche rouge)</span>
          {opts.onSuite && <span className="threat-suite"><SuiteButton testId="threat-suite" onClick={() => opts.onSuite!(cur.fenHim, cur.line, 'Sa menace')} /></span>}
        </>
      );
    } else if (cur.status === 'check') text = 'Tu es en échec : sa menace, c’est l’échec. Pare-le d’abord.';
    else if (cur.status === 'over') text = 'Partie terminée dans cette position.';
    else text = 'Pas de menace sérieuse.';
    result = <div className="threat-result" data-testid="threat-text" data-status={cur.status}>{text}</div>;
  }
  return { arrows, button, result };
}

/** Le même bouton en composant : ses flèches remontent par `onArrows` (écrans avec des retours anticipés). */
export function ThreatCheck({ fen, me, onArrows, onSuite, disabled }: {
  fen: string; me: Color; onArrows: (fen: string, a: BoardArrow[]) => void;
  onSuite?: (startFen: string, line: string[], title: string) => void; disabled?: boolean;
}) {
  const t = useThreatCheck(fen, me, { onSuite, disabled });
  const sig = JSON.stringify(t.arrows);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onArrows(fen, t.arrows); }, [fen, sig]);
  return <>{t.button}{t.result}</>;
}
