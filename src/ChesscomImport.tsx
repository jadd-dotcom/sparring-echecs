// Réglages → Chess.com : pseudo, import de mes parties (API publique), plan B par PGN collé,
// analyse des parties importées (une à une, interrompable).
import { useEffect, useRef, useState } from 'react';
import {
  analysePending, describeReport, getChesscomUser, importChesscom, importPgnText, pendingImports, setChesscomUser,
} from './chesscomImport';

export default function ChesscomImport() {
  const [user, setUser] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [pending, setPending] = useState(0);
  const [analysing, setAnalysing] = useState<string | null>(null);
  const [pgn, setPgn] = useState('');
  const [pgnColor, setPgnColor] = useState<'w' | 'b' | ''>('');
  const stopRef = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    (async () => {
      const u = await getChesscomUser();
      setUser(u); setSaved(u);
      setPending((await pendingImports()).length);
    })();
    return () => { alive.current = false; stopRef.current = true; };
  }, []);

  async function saveUser() {
    await setChesscomUser(user);
    setSaved(user.trim());
    setMsg({ text: user.trim() ? `Pseudo enregistré : ${user.trim()}.` : 'Pseudo effacé.' });
  }

  async function analyse() {
    stopRef.current = false;
    setAnalysing('Préparation…');
    const n = await analysePending((i, total, pct) => alive.current && setAnalysing(`Analyse de la partie ${i + 1}/${total}… ${pct} %`), () => stopRef.current);
    if (!alive.current) return;
    setAnalysing(null);
    const left = (await pendingImports()).length;
    setPending(left);
    setMsg({ text: `${n} partie${n > 1 ? 's' : ''} analysée${n > 1 ? 's' : ''}${left ? ` · ${left} restante${left > 1 ? 's' : ''}` : ''}. Tes erreurs sont dans le paquet de révision.` });
  }

  async function doImport() {
    if (user.trim() !== saved) await saveUser();
    setMsg(null);
    setBusy('Connexion à Chess.com…');
    try {
      const r = await importChesscom(user, { onProgress: (m) => alive.current && setBusy(m) });
      if (!alive.current) return;
      setMsg({ text: describeReport(r) + (r.added ? ' Elles n’ont aucun effet sur ton niveau Maia.' : '') });
      setPending((await pendingImports()).length);
      if (r.added) analyse();
    } catch (e) {
      setMsg({ text: (e as Error).message, bad: true });
    } finally { if (alive.current) setBusy(null); }
  }

  async function doPgn() {
    setMsg(null);
    const r = await importPgnText(pgn, user, pgnColor || undefined);
    setMsg({ text: describeReport(r), bad: r.added === 0 && r.already === 0 });
    if (r.added) { setPgn(''); setPending((await pendingImports()).length); analyse(); }
  }

  return (
    <section className="card chesscom">
      <h2>Chess.com</h2>
      <label htmlFor="cc-user"><b>Mon pseudo Chess.com</b></label>
      <div className="row">
        <input id="cc-user" value={user} autoCapitalize="none" autoCorrect="off" spellCheck={false}
          onChange={(e) => setUser(e.target.value)} placeholder="ex. lightning_light" />
        <button onClick={saveUser}>Enregistrer</button>
      </div>
      <div className="row">
        <button className="primary" disabled={!!busy || !user.trim()} onClick={doImport}>Importer mes parties</button>
        {pending > 0 && !analysing && <button onClick={analyse}>Analyser les {pending} partie{pending > 1 ? 's' : ''} importée{pending > 1 ? 's' : ''}</button>}
        {analysing && <button onClick={() => { stopRef.current = true; }}>Arrêter l’analyse</button>}
      </div>
      {busy && <p className="pulse muted">{busy}</p>}
      {analysing && <p className="pulse muted" data-testid="cc-analysing">{analysing}</p>}
      {msg && <p className={msg.bad ? 'bad-text' : 'notice'} data-testid="cc-msg">{msg.text}</p>}
      <p className="muted small">Seulement les parties pas encore importées. Chaque partie est analysée comme une partie contre Maia
        {' '}(classement des coups, cartes de révision pour tes erreurs), marquée « Chess.com », sans effet sur ton niveau Maia.
        {' '}L’analyse peut être longue : tu peux l’arrêter et la reprendre plus tard.</p>

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
