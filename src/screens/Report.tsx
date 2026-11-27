import { useEffect, useRef, useState } from 'react';
import { db, type Game } from '../db';
import { addErrorDetails, analyseGame, isError, needsDetail } from '../analysis';
import { getAllLineProgress } from '../linesService';
import { emptyProgress, orderedLines, validatedCount } from '../lib/lineTrainer';
import { OPENING_LESSONS } from '../data/openingLessons';
import { buildReport, inaccuraciesToDetail, selectGames, type PeriodKind, type RepInfo } from '../lib/report/buildReport';
import { repertoireInfoWith, treeOf } from '../openings';
import { getBoardProgress, getBoardStats } from '../boardService';
import { dayKey } from '../lib/srs';
import { loadGoals } from '../goalService';
import { GOALS, goalProgress, toWatch } from '../lib/goals';
import { MOTIF_LABEL } from '../lib/report/motifs';
import { TRAP_CHAPTERS, TRAPS } from '../data/traps';
import { fallsInGames, trapStatus } from '../lib/traps';
import { getTrapProgress } from '../trapService';

const LAST_KEY = 'lastReportAt';

export default function Report() {
  const [kind, setKind] = useState<PeriodKind>('since-last');
  const [lastAt, setLastAt] = useState<number | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [md, setMd] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<PeriodKind, number>>({ 'since-last': 0, '7-days': 0, '20-games': 0 });
  const [toAnalyse, setToAnalyse] = useState<Record<PeriodKind, number>>({ 'since-last': 0, '7-days': 0, '20-games': 0 });
  const stop = useRef(false);

  useEffect(() => {
    (async () => {
      const last = ((await db.meta.get(LAST_KEY))?.value as number | undefined) ?? null;
      setLastAt(last);
      const all = await db.games.toArray();
      const now = Date.now();
      const sel = (k: PeriodKind) => selectGames(all, k, last, now).games;
      setCounts({ 'since-last': sel('since-last').length, '7-days': sel('7-days').length, '20-games': sel('20-games').length });
      const na = (k: PeriodKind) => sel(k).filter((g) => !g.analysis).length;
      setToAnalyse({ 'since-last': na('since-last'), '7-days': na('7-days'), '20-games': na('20-games') });
    })();
  }, []);

  async function generate() {
    setMd(null); setMsg(null);
    stop.current = false;
    const now = Date.now();
    const all = await db.games.toArray();
    const { games, period } = selectGames(all, kind, lastAt, now);
    // Analyse des parties qui ne l'ont pas été (interrompable), puis détail des erreurs anciennes.
    let skipped = 0;
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      if (!g.analysis) {
        if (stop.current) { skipped++; continue; }
        await analyseGame(g.id!, (d, t) => setProgress(`Analyse de la partie ${i + 1}/${games.length}… ${Math.round((100 * d) / t)} %`));
      } else if (g.analysis.some((a) => isError(a) && needsDetail(a))) {
        const analysis = g.analysis.map((a) => ({ ...a }));
        await addErrorDetails(g, analysis, (d, t) => setProgress(`Détail des erreurs, partie ${i + 1}/${games.length}… ${d}/${t}`));
        await db.games.update(g.id!, { analysis });
      }
    }
    // Imprécisions retenues dans « Mes coups les plus coûteux » (s'il y a moins de 5 erreurs et gaffes) : leur détail aussi.
    let fresh = (await db.games.bulkGet(games.map((g) => g.id!))).filter((g): g is Game => !!g);
    const extra = inaccuraciesToDetail(fresh, 5);
    for (const gid of new Set(extra.map((x) => x.gameId))) {
      const g = fresh.find((x) => x.id === gid)!;
      const analysis = g.analysis!.map((a) => ({ ...a }));
      await addErrorDetails(g, analysis, (d, t) => setProgress(`Détail des imprécisions… ${d}/${t}`), extra.filter((x) => x.gameId === gid).map((x) => x.ply));
      await db.games.update(gid, { analysis });
    }
    setProgress(null);
    fresh = (await db.games.bulkGet(games.map((g) => g.id!))).filter((g): g is Game => !!g);
    // Suivi de mon répertoire : partie à thème → son ouverture ; sinon mes ouvertures actives de la couleur.
    const openings = await db.openings.toArray();
    const nameOf = (id?: string) => openings.find((o) => o.id === id)?.name;
    const rep: Record<number, RepInfo> = {};
    for (const g of fresh) {
      if (g.openingId) rep[g.id!] = { exit: g.bookExit, name: nameOf(g.openingId) };
      else {
        const info = g.source === 'chesscom' && g.bookExit !== undefined ? { bookExit: g.bookExit, repOpeningId: g.repOpeningId } : repertoireInfoWith(openings, g);
        rep[g.id!] = { exit: info.bookExit, name: nameOf(info.repOpeningId) };
      }
    }
    const repertoire = openings.filter((o) => !o.archived).map((o) => ({ name: o.name, color: o.color }));
    const board = { progress: await getBoardProgress(), stats: await getBoardStats(), today: dayKey() };
    // « Jouer les lignes » : par ouverture active, lignes validées et erreurs.
    const lp = await getAllLineProgress();
    const linesRep = openings.filter((o) => !o.archived).map((o) => {
      const ordered = orderedLines(treeOf(o), OPENING_LESSONS.find((l) => l.openingId === o.id));
      const prog = lp[o.id] ?? emptyProgress();
      return {
        name: o.name, color: o.color, done: validatedCount(ordered, prog), total: ordered.length, round: prog.round,
        errors: prog.errors.map((e) => ({ line: e.line.split(' '), ply: e.ply, expected: e.expected, played: e.played, date: e.date })),
      };
    });
    // « Mon objectif » : objectif actif, progression, point de départ, À surveiller.
    const gd = await loadGoals(now);
    const gp = gd.goal ? goalProgress(gd.goal, gd.games, gd.state.since, gd.exits) : null;
    const goal = {
      active: gd.goal && gp ? { name: gd.goal.name, rule: gd.goal.rule, since: gd.state.since, last: gp.last, clean: gp.clean, total: gp.total, baseline: gp.baseline } : null,
      mastered: GOALS.filter((x) => gd.state.mastered[x.id] !== undefined).map((x) => ({ name: x.name, at: gd.state.mastered[x.id]! })),
      watch: toWatch(gd.goal, gd.games, gd.exits).map((w) => ({ label: w.label === 'repertoire' ? 'sorties du répertoire par moi' : MOTIF_LABEL[w.label], count: w.count })),
    };
    // Pièges d'ouverture : état par piège, et pièges où je suis tombé dans mes parties (toutes).
    const tp = await getTrapProgress();
    const order = [...all].sort((a, b) => a.date - b.date);
    const count = (id: string, mode: 'defend' | 'punish') => {
      const at = (tp[id]?.attempts ?? []).filter((a) => a.mode === mode);
      return { clean: at.filter((a) => a.clean).length, n: at.length };
    };
    const traps = {
      rows: TRAPS.map((t) => ({ name: t.name, chapter: TRAP_CHAPTERS.find((c) => c.id === t.chapter)!.name, status: trapStatus(tp[t.id]),
        defend: count(t.id, 'defend'), punish: count(t.id, 'punish') })),
      falls: fallsInGames(all).map((f) => {
        const g = all.find((x) => x.id === f.gameId)!;
        return { name: TRAPS.find((t) => t.id === f.trapId)!.name, gameNo: order.findIndex((x) => x.id === g.id) + 1, date: g.date,
          move: `${Math.floor(f.ply / 2) + 1}${f.ply % 2 ? '…' : '.'} ${g.san[f.ply]}`, source: g.source === 'chesscom' ? 'Chess.com' : 'Maia' };
      }),
    };
    const report = buildReport({ now, period, games: fresh, allGames: all, cards: await db.cards.toArray(), rep, repertoire, board, lines: linesRep, goal, traps });
    setGeneratedAt(now);
    setMd(report);
    if (skipped) setMsg(`${skipped} partie${skipped > 1 ? 's' : ''} non analysée${skipped > 1 ? 's' : ''} : elle${skipped > 1 ? 's' : ''} ne compte${skipped > 1 ? 'nt' : ''} que pour les résultats.`);
  }

  const fileName = () => `rapport-echecs-${new Date(generatedAt).toISOString().slice(0, 10)}.md`;
  async function markSent() {
    await db.meta.put({ key: LAST_KEY, value: generatedAt });
    setLastAt(generatedAt);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(md!);
      await markSent();
      setMsg('Copié ! Colle-le dans l’appli Claude.');
    } catch { setMsg('Copie impossible : utilise « Partager » ou « Télécharger ».'); }
  }
  async function share() {
    const file = new File([md!], fileName(), { type: 'text/markdown' });
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'Rapport d’échecs pour Claude' });
      else if (navigator.share) await navigator.share({ title: 'Rapport d’échecs pour Claude', text: md! });
      else { download(); return; }
      await markSent();
      setMsg('Partagé.');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setMsg('Partage impossible : ' + (e as Error).message);
    }
  }
  function download() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([md!], { type: 'text/markdown' }));
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    markSent();
    setMsg('Fichier .md téléchargé.');
  }

  const options: [PeriodKind, string][] = [
    ['since-last', lastAt ? `Depuis le dernier rapport (${new Date(lastAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })})` : 'Depuis le début (aucun rapport encore)'],
    ['7-days', '7 derniers jours'],
    ['20-games', '20 dernières parties'],
  ];

  return (
    <div className="report">
      <section className="card">
        <h2>Rapport pour Claude</h2>
        <p className="muted">Un rapport texte (Markdown) de tes parties (contre Maia et importées de Chess.com) et de tes erreurs, à envoyer à Claude pour qu’il diagnostique tes lacunes.</p>
        <div className="col">
          {options.map(([k, label]) => (
            <label key={k} className={`radio ${kind === k ? 'on' : ''}`}>
              <input type="radio" name="period" checked={kind === k} onChange={() => setKind(k)} />
              {label} <span className="muted">· {counts[k]} partie{counts[k] > 1 ? 's' : ''}{toAnalyse[k] ? ` (dont ${toAnalyse[k]} à analyser)` : ''}</span>
            </label>
          ))}
          <button className="primary" disabled={!!progress} onClick={generate}>Générer le rapport</button>
        </div>
        {progress && <><p className="pulse">{progress}</p>
          <button onClick={() => { stop.current = true; }}>Arrêter l’analyse et générer avec les parties déjà analysées</button></>}
      </section>
      {md && (
        <section className="card">
          <div className="row">
            <button className="primary" onClick={copy}>Copier</button>
            <button onClick={share}>Partager</button>
            <button onClick={download}>Télécharger .md</button>
          </div>
          {msg && <p className="notice">{msg}</p>}
          <pre className="md-preview">{md}</pre>
        </section>
      )}
    </div>
  );
}
