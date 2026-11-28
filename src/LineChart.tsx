// Courbe simple (SVG) : une valeur par point, axe à 3 graduations, valeur au survol ou au toucher.
import { useState } from 'react';

const W = 640, H = 200, PAD = { l: 44, r: 12, t: 14, b: 26 };

export interface ChartPoint { value: number; label: string }

export function LineChart({ points, ariaLabel, unit = '', min: minIn, max: maxIn, testId }: {
  points: ChartPoint[]; ariaLabel: string; unit?: string; min?: number; max?: number; testId?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  if (!points.length) return <p className="muted small" data-testid={testId}>Pas encore de données.</p>;
  const vals = points.map((p) => p.value);
  const lo = minIn ?? Math.floor(Math.min(...vals));
  const hi0 = maxIn ?? Math.ceil(Math.max(...vals));
  const hi = hi0 === lo ? lo + 1 : hi0;
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, points.length - 1);
  const y = (v: number) => PAD.t + ((hi - v) * (H - PAD.t - PAD.b)) / (hi - lo);
  const ticks = [lo, Math.round((lo + hi) / 2), hi];
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join('');
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={ariaLabel} data-testid={testId} data-points={points.length}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" className="axis">{t}{unit}</text>
        </g>
      ))}
      <path d={d} className="line" />
      {points.map((p, i) => (
        <g key={i} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
          <rect x={x(i) - 10} y={PAD.t} width={20} height={H - PAD.t - PAD.b} fill="transparent" />
          {(i === points.length - 1 || i === hover) && <circle cx={x(i)} cy={y(p.value)} r={5} className="dot" />}
        </g>
      ))}
      {hover !== null && (
        <text x={Math.min(Math.max(x(hover), PAD.l + 50), W - 70)} y={PAD.t + 10} textAnchor="middle" className="tip">
          {points[hover].label} : {points[hover].value}{unit}
        </text>
      )}
      <text x={x(points.length - 1)} y={y(last.value) - 10 < 14 ? y(last.value) + 22 : y(last.value) - 10} textAnchor="end" className="label">{last.value}{unit}</text>
    </svg>
  );
}
