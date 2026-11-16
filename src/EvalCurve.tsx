// Courbe d'évaluation d'une partie (% de gain des Blancs, position par position) ; un tap amène au coup.
import { useState } from 'react';

const W = 640, H = 150, PAD = { l: 8, r: 8, t: 10, b: 10 };

export default function EvalCurve({ wpWhite, current, onPick }: { wpWhite: number[]; current: number; onPick: (positionIndex: number) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = wpWhite.length;
  if (n < 2) return null;
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1);
  const y = (v: number) => PAD.t + ((100 - v) * (H - PAD.t - PAD.b)) / 100;
  const line = wpWhite.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  const area = `${line}L${x(n - 1).toFixed(1)},${y(0)}L${x(0).toFixed(1)},${y(0)}Z`;
  const pick = (clientX: number, rect: DOMRect) => {
    const rel = ((clientX - rect.left) / rect.width) * W;
    return Math.max(0, Math.min(n - 1, Math.round(((rel - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1))));
  };
  const shown = hover ?? current;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="evalcurve" role="img" aria-label="Courbe d’évaluation de la partie (avantage des Blancs)"
      onPointerMove={(e) => setHover(pick(e.clientX, e.currentTarget.getBoundingClientRect()))}
      onPointerLeave={() => setHover(null)}
      onClick={(e) => onPick(pick(e.clientX, e.currentTarget.getBoundingClientRect()))}>
      <rect x={0} y={0} width={W} height={H} className="bg" />
      <path d={area} className="white" />
      <line x1={PAD.l} x2={W - PAD.r} y1={y(50)} y2={y(50)} className="mid" />
      <path d={line} className="line" />
      <line x1={x(current)} x2={x(current)} y1={PAD.t} y2={H - PAD.b} className="cursor" />
      <circle cx={x(shown)} cy={y(wpWhite[shown])} r={5} className="dot" />
      <text x={Math.min(Math.max(x(shown), 60), W - 60)} y={PAD.t + 12} textAnchor="middle" className="tip">
        {shown === 0 ? 'Départ' : `Coup ${Math.ceil(shown / 2)}${shown % 2 ? '' : '…'}`} · Blancs {Math.round(wpWhite[shown])} %
      </text>
    </svg>
  );
}
