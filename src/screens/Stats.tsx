import { fig } from '../lib/notation';
import { bookLabel, inBook, stayedUntil } from '../lib/bookLabel';
import { useEffect, useState } from 'react';
import { db, getProfile, type Game, type Opening } from '../db';
import { openingStats } from '../lib/openingStats';
import { accuracyOfGame } from '../lib/accuracy';
import { RATING_START } from '../lib/rating';
import { go } from '../router';
import { BookOpen } from '../icons';

const W = 640, H = 220, PAD = { l: 44, r: 12, t: 14, b: 26 };

function RatingChart({ games }: { games: Game[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = [RATING_START, ...games.map((g) => g.ratingAfter ?? RATING_START)];
  if (games.length && games[0].ratingBefore) pts[0] = games[0].ratingBefore;
  const min = Math.floor((Math.min(...pts) - 30) / 50) * 50;
  const max = Math.ceil((Math.max(...pts) + 30) / 50) * 50;
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, pts.length - 1);
  const y = (v: number) => PAD.t + ((max - v) * (H - PAD.t - PAD.b)) / (max - min);
  const ticks = [min, Math.round((min + max) / 2 / 50) * 50, max];
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Évolution de ton niveau">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" className="axis">{t}</text>
        </g>
      ))}
      <path d={d} className="line" />
      {pts.map((v, i) => (
        <g key={i} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
          <rect x={x(i) - 12} y={PAD.t} width={24} height={H - PAD.t - PAD.b} fill="transparent" />
          {(i === pts.length - 1 || i === hover) && <circle cx={x(i)} cy={y(v)} r={5} className="dot" />}
        </g>
      ))}
      {hover !== null && (
        <text x={Math.min(Math.max(x(hover), PAD.l + 40), W - 60)} y={PAD.t + 10} textAnchor="middle" className="tip">
          {hover === 0 ? 'Départ' : `Partie ${hover}`} : {Math.round(pts[hover])}
        </text>
      )}
      <text x={x(pts.length - 1)} y={y(pts[pts.length - 1]) - 10} textAnchor="end" className="label">{Math.round(pts[pts.length - 1])}</text>
    </svg>
  );
}

function BlunderChart({ games }: { games: Game[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const data = games.filter((g) => g.counts).slice(-30);
  if (!data.length) return <p className="muted">Analyse une partie pour voir tes gaffes.</p>;
  const max = Math.max(3, ...data.map((g) => g.counts!.blunder));
  const bw = (W - PAD.l - PAD.r) / data.length;
  const y = (v: number) => PAD.t + ((max - v) * (H - PAD.t - PAD.b)) / max;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Gaffes par partie">
      {[0, Math.round(max / 2), max].map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" className="axis">{t}</text>
        </g>
      ))}
      {data.map((g, i) => {
        const v = g.counts!.blunder;
        const h = Math.max(0, y(0) - y(v));
        return (
          <g key={g.id} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
            <rect x={PAD.l + i * bw} y={PAD.t} width={bw} height={H - PAD.t - PAD.b} fill="transparent" />
            <rect x={PAD.l + i * bw + 1} y={v > 0 ? y(v) : y(0) - 2} width={Math.max(2, bw - 2)} height={v > 0 ? h : 2} rx={v > 0 ? Math.min(4, bw / 4) : 1} className={(i === hover ? 'bar hover' : 'bar') + (v === 0 ? ' zero' : '')} />
          </g>
        );
      })}
      {hover !== null && (
        <text x={Math.min(Math.max(PAD.l + hover * bw + bw / 2, PAD.l + 50), W - 70)} y={PAD.t + 10} textAnchor="middle" className="tip">
          {new Date(data[hover].date).toLocaleDateString('fr-FR')} : {data[hover].counts!.blunder} gaffe(s)
        </text>
      )}
    </svg>
  );
}

/** Ma précision (formule Lichess), partie après partie (parties analysées). */
function AccuracyChart({ games }: { games: Game[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = games.map((g) => ({ g, v: accuracyOfGame(g)?.me })).filter((p): p is { g: Game; v: number } => typeof p.v === 'number');
  if (!pts.length) return <p className="muted">Analyse une partie pour voir ta précision.</p>;
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, pts.length - 1);
  const y = (v: number) => PAD.t + ((100 - v) * (H - PAD.t - PAD.b)) / 100;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join('');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Ma précision partie après partie">
      {[0, 50, 100].map((t) => (
        <g key={t}><line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" /><text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" className="axis">{t} %</text></g>
      ))}
      <path d={d} className="line" />
      {pts.map((p, i) => (
        <g key={p.g.id} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)}>
          <rect x={x(i) - 12} y={PAD.t} width={24} height={H - PAD.t - PAD.b} fill="transparent" />
          {(i === pts.length - 1 || i === hover || pts.length < 25) && <circle cx={x(i)} cy={y(p.v)} r={i === hover ? 6 : 4} className="dot" />}
        </g>
      ))}
      {hover !== null && (
        <text x={Math.min(Math.max(x(hover), PAD.l + 60), W - 70)} y={PAD.t + 10} textAnchor="middle" className="tip">
          {new Date(pts[hover].g.date).toLocaleDateString('fr-FR')} : {pts[hover].v.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %
        </text>
      )}
      <text x={x(pts.length - 1)} y={y(last.v) - 10} textAnchor="end" className="label">{Math.round(last.v)} %</text>
    </svg>
  );
}

export default function Stats() {
  const [games, setGames] = useState<Game[] | null>(null);
  const [imported, setImported] = useState<Game[]>([]);
  const [rating, setRating] = useState(RATING_START);
  const [openings, setOpenings] = useState<Opening[]>([]);
  useEffect(() => {
    db.openings.toArray().then(setOpenings);
    db.games.orderBy('date').toArray().then((g) => {
      setGames(g.filter((x) => x.source === 'app'));
      setImported(g.filter((x) => x.source === 'chesscom'));
    });
    getProfile().then((p) => setRating(p.rating));
  }, []);
  if (!games) return null;
  const w = games.filter((g) => g.score === 1).length;
  const dr = games.filter((g) => g.score === 0.5).length;
  const l = games.filter((g) => g.score === 0).length;
  const analysed = games.filter((g) => g.counts);
  const avgBl = analysed.length ? analysed.reduce((s, g) => s + g.counts!.blunder, 0) / analysed.length : null;
  const perOpening = openingStats(games);
  const fmt = (x: number, d = 1) => x.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  return (
    <div className="stats">
      <div className="tiles">
        <div className="card tile"><div className="big">{Math.round(rating)}</div><div className="muted">niveau</div></div>
        <div className="card tile"><div className="big">{w} / {dr} / {l}</div><div className="muted">victoires / nulles / défaites</div></div>
        <div className="card tile"><div className="big">{avgBl === null ? '–' : avgBl.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div><div className="muted">gaffes par partie (moy.)</div></div>
      </div>
      <section className="card"><h3>Mon niveau</h3><RatingChart games={games.filter((g) => !g.unrated)} /></section>
      <section className="card"><h3>Ma précision <span className="muted">(formule Lichess, parties analysées)</span></h3><AccuracyChart games={games} /></section>
      <section className="card"><h3>Gaffes par partie <span className="muted">(30 dernières analysées)</span></h3><BlunderChart games={games} /></section>
      <section className="card">
        <h3>Par ouverture <span className="muted">(parties à thème)</span></h3>
        <table className="games">
          <thead><tr><th>Ouverture</th><th>Parties</th><th>Victoires</th><th>Sorties de répertoire</th><th>Gaffes / partie</th></tr></thead>
          <tbody>
            {openings.filter((o) => !o.archived || perOpening[o.id]).map((o) => {
              const st = perOpening[o.id];
              return (
                <tr key={o.id}>
                  <td>{o.name} <span className="muted">({o.color === 'w' ? 'B' : 'N'}){o.archived ? ' · archivée' : ''}</span></td>
                  <td>{st?.games ?? 0}</td>
                  <td>{st ? fmt(st.winPct, 0) + ' %' : '–'}</td>
                  <td>{st ? <>{st.myExits} <span className="muted">par moi</span> · {st.oppExits} <span className="muted">par l’adversaire</span></> : '–'}</td>
                  <td>{st?.blundersPerGame != null ? fmt(st.blundersPerGame) : '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h3>Mes parties</h3>
        {imported.length > 0 && <p className="muted small">Parties contre Maia. Tes parties Chess.com sont plus bas.</p>}
        {games.length === 0 && <p className="muted">Pas encore de partie.</p>}
        <table className="games">
          <thead><tr><th>Date</th><th>Couleur</th><th>Résultat</th><th>Niveau</th><th>Gaffes</th><th></th></tr></thead>
          <tbody>
            {[...games].reverse().map((g) => (
              <tr key={g.id}>
                <td>{new Date(g.date).toLocaleDateString('fr-FR')}</td>
                <td>{g.myColor === 'w' ? 'Blancs' : 'Noirs'}{g.openingId && <div className="muted small"><BookOpen aria-hidden className="ico sm" /> {openings.find((o) => o.id === g.openingId)?.name}</div>}</td>
                <td>{g.score === 1 ? 'Victoire' : g.score === 0 ? 'Défaite' : 'Nulle'} <span className="muted">({g.termination}{g.unrated ? ', non comptée' : ''})</span></td>
                <td>{Math.round(g.ratingAfter ?? 0)}</td>
                <td>{g.counts ? g.counts.blunder : '–'}</td>
                <td><button className="small" onClick={() => go({ name: 'review', id: g.id! })}>{g.analysis ? 'Revoir' : 'Analyser'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {imported.length > 0 && <ImportedList games={imported} openings={openings} />}
    </div>
  );
}

/** Parties Chess.com importées : sans effet sur le niveau Maia ; suivi du répertoire. */
function ImportedList({ games, openings }: { games: Game[]; openings: Opening[] }) {
  const w = games.filter((g) => g.score === 1).length;
  const dr = games.filter((g) => g.score === 0.5).length;
  const l = games.filter((g) => g.score === 0).length;
  const withRep = games.filter((g) => g.bookExit !== undefined);
  const stayed = withRep.filter((g) => stayedUntil(g.bookExit, 8) === 'yes').length;
  const last = games[games.length - 1]?.ext?.me.rating;
  return (
    <section className="card" data-testid="chesscom-games">
      <h3>Mes parties Chess.com <span className="muted">({games.length}, sans effet sur ton niveau Maia)</span></h3>
      <p>{w} victoire{w > 1 ? 's' : ''} · {dr} nulle{dr > 1 ? 's' : ''} · {l} défaite{l > 1 ? 's' : ''}{last ? ` · dernier classement Chess.com : ${last}` : ''}
        {withRep.length > 0 && <> · resté dans mon répertoire jusqu’au coup 8 : <b>{Math.round((100 * stayed) / withRep.length)} %</b></>}</p>
      <table className="games">
        <thead><tr><th>Date</th><th>Couleur</th><th>Résultat</th><th>Adversaire</th><th>Répertoire</th><th>Gaffes</th><th></th></tr></thead>
        <tbody>
          {[...games].reverse().map((g) => (
            <tr key={g.id}>
              <td>{new Date(g.date).toLocaleDateString('fr-FR')}</td>
              <td>{g.myColor === 'w' ? 'Blancs' : 'Noirs'}</td>
              <td>{g.score === 1 ? 'Victoire' : g.score === 0 ? 'Défaite' : 'Nulle'} <span className="muted">({g.termination})</span></td>
              <td>{g.ext?.opp.name ?? '–'}{g.ext?.opp.rating ? <span className="muted"> ({g.ext.opp.rating})</span> : null}</td>
              <td className="small">{inBook(g.bookExit) && <BookOpen aria-hidden className="ico sm book-ico" />} {fig(bookLabel(g.bookExit) ?? '–')}{g.repOpeningId && <div className="muted">{openings.find((o) => o.id === g.repOpeningId)?.name}</div>}</td>
              <td>{g.counts ? g.counts.blunder : '–'}</td>
              <td><button className="small" onClick={() => go({ name: 'review', id: g.id! })}>{g.analysis ? 'Revoir' : 'Analyser'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
