// Réglages → Chess.com : pseudo, import de mes parties (API publique), plan B par PGN collé,
// analyse des parties importées : les plus récentes d'abord, seulement depuis le 16/11/2026 par défaut
// (bouton pour les anciennes), une à une, interrompable, avec progression et temps restant estimé.
import { useEffect, useRef, useState } from 'react';
import {
  analysePending, describeReport, getChesscomUser, importChesscom, importPgnText, pendingImports, setChesscomUser,
  type AnalysisProgress,
} from './chesscomImport';
import { ANALYSIS_SINCE, formatEta, type AnalysisScope } from './lib/analysisQueue';

const SINCE_LABEL = new Date(ANALYSIS_SINCE).toLocaleDateString('fr-FR');

export default function ChesscomImport() {
  const [user, setUser] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [pending, setPending] = useState({ recent: 0, old: 0 });
  const [analysing, setAnalysing] = useState<{ scope: AnalysisScope; p: AnalysisProgress } | null>(null);
  const [pgn, setPgn] = useState('');
  const [pgnColor, setPgnColor] = useState<'w' | 'b' | ''>('');
  const stopRef = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    (async () => {
      const u = await getChesscomUser();
      setUser(u); setSaved(u);
      await refreshPending();
    })();
    return () => { alive.current = false; stopRef.current = true; };
  }, []);

  async function refreshPending() {
    const p = await pendingImports();
    if (alive.current) setPending({ recent: p.recent.length, old: p.old.length });
  }

  async function saveUser() {
    await setChesscomUser(user);
    setSaved(user.trim());
    setMsg({ text: user.trim() ? `Pseudo enregistré : ${user.trim()}.` : 'Pseudo effacé.' });
  }

  async function analyse(scope: AnalysisScope = 'recent') {
    stopRef.current = false;
    if (scope === 'old') setMsg(null);   // après un import, on garde le bilan de l'import affiché
    setAnalysing({ scope, p: { done: 0, total: 0, pct: 0, etaSec: null } });
    const n = await analysePending(scope, (p) => alive.current && setAnalysing({ scope, p }), () => stopRef.current);
    if (!alive.current) return;
    setAnalysing(null);
    const left = await pendingImports();
    setPending({ recent: left.recent.length, old: left.old.length });
    const rest = left[scope].length;
    setMsg({ text: `${n} partie${n > 1 ? 's' : ''} analysée${n > 1 ? 's' : ''}${rest ? ` · ${rest} restante${rest > 1 ? 's' : ''}` : ''}. Tes erreurs sont dans le paquet de révision.` });
  }

  async function doImport() {
    if (user.trim() !== saved) await saveUser();
    setMsg(null);
    setBusy('Connexion à Chess.com…');
    try {
      const r = await importChesscom(user, { onProgress: (m) => alive.current && setBusy(m) });
      if (!alive.current) return;
      const pp = await pendingImports();
      setMsg({ text: describeReport(r) + (r.added ? ` Elles n’ont aucun effet sur ton niveau Maia. Analyse automatique : ${pp.recent.length} partie${pp.recent.length > 1 ? 's' : ''} depuis le ${SINCE_LABEL}${pp.old.length ? ` ; ${pp.old.length} plus ancienne${pp.old.length > 1 ? 's' : ''} importée${pp.old.length > 1 ? 's' : ''} sans analyse` : ''}.` : '') });
      await refreshPending();
      if (r.added && pp.recent.length) analyse('recent');
    } catch (e) {
      setMsg({ text: (e as Error).message, bad: true });
    } finally { if (alive.current) setBusy(null); }
  }

  async function doPgn() {
    setMsg(null);
    const r = await importPgnText(pgn, user, pgnColor || undefined);
    setMsg({ text: describeReport(r), bad: r.added === 0 && r.already === 0 });
    if (r.added) {
      setPgn('');
      await refreshPending();
      if ((await pendingImports()).recent.length) analyse('recent');
    }
  }

  return (
    <section className="card chesscom">
      <h2>Chess.com</h2>
      <label htmlFor="cc-user"><b>Mon pseudo Chess.com</b></label>
      <div className="row">
        <input id="cc-user" value={user} autoCapitalize="none" autoCorrect="off" spellCheck={false}
          onChange={(e) => setUser(e.target.value)} placeholder="ex. lightning_light" />
        <button onClick={saveUser} aria-label="Enregistrer mon pseudo">Enregistrer</button>
      </div>
      <div className="row">
        <button className="primary" disabled={!!busy || !user.trim()} onClick={doImport}>Importer mes parties</button>
        {pending.recent > 0 && !analysing && (
          <button onClick={() => analyse('recent')}>Analyser les {pending.recent} partie{pending.recent > 1 ? 's' : ''} récente{pending.recent > 1 ? 's' : ''}</button>
        )}
        {pending.old > 0 && !analysing && (
          <button onClick={() => analyse('old')}>Analyser aussi les anciennes ({pending.old})</button>
        )}
        {analysing && <button onClick={() => { stopRef.current = true; }}>Arrêter l’analyse</button>}
      </div>
      {busy && <p className="pulse muted">{busy}</p>}
      {analysing && (
        <div className="analysis-progress" data-testid="cc-analysing">
          <p><b>Analyse{analysing.scope === 'old' ? ' des anciennes parties' : ''} : {Math.min(analysing.p.done + 1, Math.max(1, analysing.p.total))}/{analysing.p.total}</b>
            {' '}<span className="muted">(partie en cours : {analysing.p.pct} %)</span>
            <br /><span className="muted">Temps restant estimé : {formatEta(analysing.p.etaSec)}</span></p>
          <div className="progress"><div style={{ width: `${analysing.p.total ? (100 * (analysing.p.done + analysing.p.pct / 100)) / analysing.p.total : 0}%` }} /></div>
        </div>
      )}
      {msg && <p className={msg.bad ? 'bad-text' : 'notice'} data-testid="cc-msg">{msg.text}</p>}
      <p className="muted small">Seulement les parties pas encore importées. Chaque partie est analysée comme une partie contre Maia
        {' '}(classement des coups, cartes de révision pour tes erreurs), marquée « Chess.com », sans effet sur ton niveau Maia.
        {' '}Analyse automatique des parties jouées depuis le {SINCE_LABEL}, les plus récentes d’abord ; les plus anciennes restent
        {' '}importées sans analyse (bouton « Analyser aussi les anciennes »). Tu peux arrêter l’analyse et la reprendre plus tard.</p>

      <details className="pgn-paste">
        <summary>Plan B : coller un PGN</summary>
        <p className="muted small">Sur Chess.com : partie → Partager → PGN → Copier. Tu peux coller plusieurs parties à la suite.</p>
        <textarea rows={6} value={pgn} onChange={(e) => setPgn(e.target.value)} placeholder={'[Event "Live Chess"]\n…\n1. c4 e5 2. Nc3 …'} aria-label="PGN à importer" />
        <div className="row">
          <label>Ma couleur
            <select aria-label="Ma couleur dans ce PGN" value={pgnColor} onChange={(e) => setPgnColor(e.target.value as 'w' | 'b' | '')}>
              <option value="">d’après mon pseudo</option><option value="w">Blancs</option><option value="b">Noirs</option>
            </select>
          </label>
          <button className="primary" disabled={!pgn.trim()} onClick={doPgn}>Importer ce PGN</button>
        </div>
      </details>
    </section>
  );
}
