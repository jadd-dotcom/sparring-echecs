import { useState } from 'react';
import { exportAll, importAll } from '../db';

export default function Settings() {
  const [msg, setMsg] = useState<string | null>(null);
  async function doExport() {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sparring-echecs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    setMsg(`Exporté : ${data.games.length} parties, ${data.cards.length} cartes.`);
  }
  async function doImport(f: File | undefined) {
    if (!f) return;
    if (!confirm('Remplacer toutes les données actuelles par ce fichier ?')) return;
    try {
      const data = JSON.parse(await f.text());
      await importAll(data);
      setMsg(`Importé : ${data.games.length} parties, ${data.cards.length} cartes.`);
    } catch (e) { setMsg('Erreur : ' + (e as Error).message); }
  }
  return (
    <div className="card settings">
      <h2>Sauvegarde</h2>
      <p>Tes parties, ton niveau et tes cartes sont stockés uniquement sur cet appareil. Exporte-les régulièrement.</p>
      <div className="col">
        <button className="primary" onClick={doExport}>Exporter (JSON)</button>
        <label className="button">Importer un fichier JSON
          <input type="file" accept="application/json,.json" hidden onChange={(e) => doImport(e.target.files?.[0])} />
        </label>
      </div>
      {msg && <p className="notice">{msg}</p>}
      <p className="muted small">Adversaire : Maia-3 (5M) · Correcteur : Stockfish 19 lite · v1</p>
    </div>
  );
}
