import { useEffect, useState } from 'react';
import { fig } from '../lib/notation';
import { db, DUE_NEW, type Opening } from '../db';
import { go } from '../router';
import { lines, parsePgn } from '../lib/repertoire';
import { dayKey } from '../lib/srs';
import { getLessonProgress, setArchived, syncDrillCards, type LessonProgress } from '../openings';
import { BUILTIN_OPENINGS } from '../data/openings';
import { OPENING_LESSONS } from '../data/openingLessons';
import { Check } from '../icons';

interface Row { o: Opening; lines: number; due: number; fresh: number; holes: number; lesson?: LessonProgress }

export default function Openings() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', color: 'w' as 'w' | 'b', forced: '' });
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'archives'>('active');

  async function load() {
    const today = dayKey();
    const progress = await getLessonProgress();
    const out: Row[] = [];
    for (const o of await db.openings.toArray()) {
      const cards = await db.cards.where('openingId').equals(o.id).toArray();
      out.push({
        o, lines: lines(parsePgn(o.pgn).root).length,
        due: cards.filter((c) => c.due !== DUE_NEW && c.due <= today).length,
        fresh: cards.filter((c) => c.due === DUE_NEW).length,
        holes: await db.holes.where('openingId').equals(o.id).count(),
        lesson: progress[o.id],
      });
    }
    // Ordre conseillé : celui des ouvertures pré-chargées (Anglaise, puis système …c5/…g6) ; ensuite les ouvertures ajoutées.
    const rank = (o: Opening) => { const i = BUILTIN_OPENINGS.findIndex((b) => b.id === o.id); return i < 0 ? 99 : i; };
    out.sort((a, b) => rank(a.o) - rank(b.o) || a.o.name.localeCompare(b.o.name));
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
  const shown = rows.filter((r) => (tab === 'archives') === !!r.o.archived);
  const nArch = rows.filter((r) => r.o.archived).length;
  async function toggleArchive(o: Opening) {
    await setArchived(o.id, !o.archived);
    await load();
  }
  return (
    <div className="openings">
      <h2>Ouvertures</h2>
      <div className="row tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'active'} className={tab === 'active' ? 'primary' : ''} onClick={() => setTab('active')}>Mon répertoire</button>
        <button role="tab" aria-selected={tab === 'archives'} className={tab === 'archives' ? 'primary' : ''} onClick={() => setTab('archives')}>Archives{nArch ? ` (${nArch})` : ''}</button>
      </div>
      {tab === 'active' ? (
        <p className="notice">Ordre conseillé pour chaque ouverture : <b>1. Leçon → 2. Drill → 3. Partie à thème</b>.
          {' '}Commence par l’Anglaise (Blancs), puis le système …c5/…g6 (Noirs).</p>
      ) : (
        <p className="notice">Ouvertures rangées : tu peux relire leur leçon et leur répertoire. Elles ne comptent plus
          {' '}dans le drill du jour, le « livre » de la revue ni les parties à thème.</p>
      )}
      {shown.length === 0 && <p className="muted">Aucune ouverture ici.</p>}
      {shown.map(({ o, lines: n, due, fresh, holes, lesson }) => (
        <section key={o.id} className="card opening" data-opening={o.id}>
          <div className="opening-head">
            <h3>{o.name}</h3>
            <span className="muted">{o.color === 'w' ? 'Blancs' : 'Noirs'} · {n} ligne{n > 1 ? 's' : ''}
              {o.forced.length > 0 && <> · l’adversaire joue {fig(o.forced.map((f) => f.split('|').join(' ou ')).join(', '))}</>}</span>
          </div>
          <div className="row">
            {OPENING_LESSONS.some((l) => l.openingId === o.id) && (
              <button className={lesson?.done || o.archived ? '' : 'primary'} onClick={() => go({ name: 'lesson', id: o.id })}>
                {o.archived ? 'Leçon' : '1. Leçon'}{lesson?.done ? <><Check aria-hidden className="ico sm" /><span className="sr-only"> terminée</span></> : lesson?.blocksDone ? ` (${lesson.blocksDone} bloc${lesson.blocksDone > 1 ? 's' : ''})` : ''}
              </button>
            )}
            {!o.archived && OPENING_LESSONS.find((l) => l.openingId === o.id)?.extras?.map((x) => (
              <button key={x.id} onClick={() => go({ name: 'lesson', id: o.id, part: x.id })} data-testid={`extra-${x.id}`}>Leçon : {x.title.charAt(0).toLowerCase() + x.title.slice(1)}</button>
            ))}
            {!o.archived && (
              <>
                <button disabled={due + fresh === 0} onClick={() => go({ name: 'revise', opening: o.id })}>
                  2. Drill · {due} à revoir{fresh ? ` · ${fresh} nouvelles` : ''}
                </button>
                <button className={lesson?.done ? 'primary' : ''} disabled={n === 0} onClick={() => go({ name: 'play', opening: o.id })}>3. Partie à thème</button>
              </>
            )}
            <button onClick={() => go({ name: 'repertoire', id: o.id })}>
              Répertoire{holes ? ` · ${holes} trou${holes > 1 ? 's' : ''}` : ''}
            </button>
            <button onClick={() => toggleArchive(o)}>{o.archived ? 'Remettre dans mon répertoire' : 'Archiver'}</button>
          </div>
        </section>
      ))}
      {tab === 'archives' ? null : !adding ? (
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
