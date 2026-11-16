import { useEffect, useState } from 'react';
import { fig } from '../lib/notation';
import { db, DUE_NEW, type Opening } from '../db';
import { go } from '../router';
import { lines, parsePgn } from '../lib/repertoire';
import { dayKey } from '../lib/srs';
import { syncDrillCards } from '../openings';

interface Row { o: Opening; lines: number; due: number; fresh: number; holes: number }

export default function Openings() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', color: 'w' as 'w' | 'b', forced: '' });
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const today = dayKey();
    const out: Row[] = [];
    for (const o of await db.openings.toArray()) {
      const cards = await db.cards.where('openingId').equals(o.id).toArray();
      out.push({
        o, lines: lines(parsePgn(o.pgn).root).length,
        due: cards.filter((c) => c.due !== DUE_NEW && c.due <= today).length,
        fresh: cards.filter((c) => c.due === DUE_NEW).length,
        holes: await db.holes.where('openingId').equals(o.id).count(),
      });
    }
    out.sort((a, b) => Number(b.o.builtin) - Number(a.o.builtin) || a.o.name.localeCompare(b.o.name));
    setRows(out);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    setErr(null);
    const name = form.name.trim();
    if (!name) { setErr('Donne un nom à l’ouverture.'); return; }
    const forced = form.forced.replace(/\d+\.+/g, ' ').split(/\s+/).filter(Boolean);
    const id = name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    await db.openings.add({ id, name, color: form.color, forced, pgn: '*', builtin: false, checks: {}, updatedAt: Date.now() });
    await syncDrillCards(id);
    go({ name: 'repertoire', id });
  }

  if (!rows) return null;
  return (
    <div className="openings">
      <h2>Ouvertures</h2>
      {rows.map(({ o, lines: n, due, fresh, holes }) => (
        <section key={o.id} className="card opening">
          <div className="opening-head">
            <h3>{o.name}</h3>
            <span className="muted">{o.color === 'w' ? 'Blancs' : 'Noirs'} · {n} ligne{n > 1 ? 's' : ''}
              {o.forced.length > 0 && <> · l’adversaire joue {fig(o.forced.join(', '))}</>}</span>
          </div>
          <div className="row">
            <button className="primary" disabled={n === 0} onClick={() => go({ name: 'play', opening: o.id })}>Partie à thème</button>
            <button disabled={due + fresh === 0} onClick={() => go({ name: 'revise', opening: o.id })}>
              Drill · {due} à revoir{fresh ? ` · ${fresh} nouvelles` : ''}
            </button>
            <button onClick={() => go({ name: 'repertoire', id: o.id })}>
              Répertoire{holes ? ` · ${holes} trou${holes > 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </section>
      ))}
      {!adding ? (
        <button onClick={() => setAdding(true)}>+ Ajouter une ouverture</button>
      ) : (
        <section className="card col">
          <h3>Nouvelle ouverture</h3>
          <label>Nom <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ex. Défense Caro-Kann" /></label>
          <label>Je joue
            <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value as 'w' | 'b' })}>
              <option value="w">les Blancs</option><option value="b">les Noirs</option>
            </select>
          </label>
          <label>Coups adverses imposés (facultatif)
            <input value={form.forced} onChange={(e) => setForm({ ...form, forced: e.target.value })} placeholder="ex. e4 (Caro-Kann) ou d4 c4" />
          </label>
          {err && <p className="bad-text">{err}</p>}
          <div className="row"><button onClick={() => setAdding(false)}>Annuler</button><button className="primary" onClick={create}>Créer</button></div>
        </section>
      )}
    </div>
  );
}
