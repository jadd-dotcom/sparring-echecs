import { useEffect, useState } from 'react';
import { db } from '../db';
import { addErrorDetails, analyseGame, isError } from '../analysis';
import { buildReport, selectGames, type PeriodKind } from '../lib/report/buildReport';

const LAST_KEY = 'lastReportAt';

export default function Report() {
  const [kind, setKind] = useState<PeriodKind>('since-last');
  const [lastAt, setLastAt] = useState<number | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [md, setMd] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<PeriodKind, number>>({ 'since-last': 0, '7-days': 0, '20-games': 0 });

  useEffect(() => {
    (async () => {
      const last = ((await db.meta.get(LAST_KEY))?.value as number | undefined) ?? null;
      setLastAt(last);
      const all = await db.games.toArray();
      const now = Date.now();
      setCounts({
        'since-last': selectGames(all, 'since-last', last, now).games.length,
        '7-days': selectGames(all, '7-days', last, now).games.length,
        '20-games': selectGames(all, '20-games', last, now).games.length,
      });
    })();
  }, []);

  async function generate() {
    setMd(null); setMsg(null);
    const now = Date.now();
    const all = await db.games.toArray();
    const { games, period } = selectGames(all, kind, lastAt, now);
    // Analyse des parties qui ne l'ont pas été, puis détail des erreurs anciennes.
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      if (!g.analysis) {
        await analyseGame(g.id!, (d, t) => setProgress(`Analyse de la partie ${i + 1}/${games.length}… ${Math.round((100 * d) / t)} %`));
      } else if (g.analysis.some((a) => isError(a) && !a.detail)) {
        const analysis = g.analysis.map((a) => ({ ...a }));
        await addErrorDetails(g, analysis, (d, t) => setProgress(`Détail des erreurs, partie ${i + 1}/${games.length}… ${d}/${t}`));
        await db.games.update(g.id!, { analysis });
      }
    }
    setProgress(null);
    const fresh = await db.games.bulkGet(games.map((g) => g.id!));
    const report = buildReport({ now, period, games: fresh.filter((g) => !!g), allGames: all, cards: await db.cards.toArray() });
    setGeneratedAt(now);
    setMd(report);
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
        <p className="muted">Un rapport texte (Markdown) de tes parties et de tes erreurs, à envoyer à Claude pour qu’il diagnostique tes lacunes.</p>
        <div className="col">
          {options.map(([k, label]) => (
            <label key={k} className={`radio ${kind === k ? 'on' : ''}`}>
              <input type="radio" name="period" checked={kind === k} onChange={() => setKind(k)} />
              {label} <span className="muted">· {counts[k]} partie{counts[k] > 1 ? 's' : ''}</span>
            </label>
          ))}
          <button className="primary" disabled={!!progress} onClick={generate}>Générer le rapport</button>
        </div>
        {progress && <><p className="pulse">{progress}</p></>}
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
