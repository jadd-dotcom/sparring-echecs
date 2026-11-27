import { useCallback, useEffect, useMemo, useState } from 'react';
import { fig } from '../lib/notation';
import { Chess } from 'chess.js';
import Board, { type BoardArrow } from '../Board';
import { db, type Hole, type MoveCheck, type Opening } from '../db';
import {
  cloneTree, formatLine, lines, parsePgn, removeLine, addLine, toPgn, type RepNode,
} from '../lib/repertoire';
import { checkMyMoves, lineLoss, MAX_LOSS_CP, saveTree, treeOf } from '../openings';
import { Check, Trash2, TriangleAlert, Undo2 } from '../icons';

type Mode = { kind: 'view' } | { kind: 'add'; moves: string[] } | { kind: 'import'; text: string };

function fenAfter(sans: string[]) {
  const c = new Chess();
  for (const s of sans) c.move(s);
  return c;
}

export default function RepertoireEditor({ id }: { id: string }) {
  const [o, setO] = useState<Opening | null>(null);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: 'view' });
  const [preview, setPreview] = useState<{ sans: string[]; arrow?: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);

  const reload = useCallback(async () => {
    setO((await db.openings.get(id)) ?? null);
    setHoles(await db.holes.where('openingId').equals(id).reverse().sortBy('createdAt'));
  }, [id]);
  useEffect(() => { reload(); }, [reload]);

  const tree = useMemo(() => (o ? treeOf(o) : null), [o]);
  const allLines = useMemo(() => (tree ? lines(tree) : []), [tree]);

  if (!o || !tree) return null;
  const opening = o;

  /** Fusionne `incoming`, vérifie mes nouveaux coups avec Stockfish, refuse les lignes fautives. */
  async function mergeValidated(incoming: RepNode, label: string) {
    const candidate = cloneTree(tree!);
    const newLines = lines(incoming);
    for (const l of newLines) addLine(candidate, l);
    setBusy('Vérification Stockfish… 0 %');
    let checks: Record<string, MoveCheck>;
    try {
      checks = await checkMyMoves(candidate, opening, (d, t) => setBusy(`Vérification Stockfish de tes coups… ${d}/${t}`));
    } finally { setBusy(null); }
    const rejected: string[] = [];
    for (const l of newLines) {
      const r = lineLoss({ color: opening.color, checks }, l);
      if (r.bad.length) { removeLine(candidate, l); rejected.push(fig(`${formatLine(l)} → ${r.bad.join(', ')}`)); }
    }
    await saveTree(opening.id, candidate, checks);
    await reload();
    const kept = newLines.length - rejected.length;
    setMsg({
      text: `${label} : ${kept} ligne${kept > 1 ? 's' : ''} ajoutée${kept > 1 ? 's' : ''}` +
        (rejected.length ? `. Refusée${rejected.length > 1 ? 's' : ''} (perte > 0,5 pion) : ${rejected.join(' ; ')}` : '.'),
      bad: rejected.length > 0,
    });
  }

  async function saveAddedLine(moves: string[]) {
    if (!moves.length) return;
    const t = parsePgn('*').root;
    addLine(t, moves);
    setMode({ kind: 'view' });
    await mergeValidated(t, 'Nouvelle ligne');
  }

  async function doImport(text: string) {
    try {
      const r = parsePgn(text);
      setMode({ kind: 'view' });
      if (r.skipped.length) setMsg({ text: 'Ignoré : ' + r.skipped.join(' ; '), bad: true });
      await mergeValidated(r.root, `Import (${r.games} chapitre${r.games > 1 ? 's' : ''})`);
    } catch (e) {
      setMsg({ text: 'PGN refusé : ' + (e as Error).message, bad: true });
    }
  }

  async function deleteLine(l: string[]) {
    if (!confirm(`Supprimer la ligne ${fig(formatLine(l))} ?`)) return;
    const t = cloneTree(tree!);
    removeLine(t, l);
    await saveTree(opening.id, t);
    await reload();
    setMsg({ text: 'Ligne supprimée.' });
  }

  async function verifyAll() {
    setBusy('Vérification Stockfish…');
    try {
      const checks = await checkMyMoves(tree!, opening, (d, t) => setBusy(`Vérification Stockfish de tes coups… ${d}/${t}`));
      await saveTree(opening.id, tree!, checks);
      await reload();
      setMsg({ text: 'Vérification terminée.' });
    } finally { setBusy(null); }
  }

  function exportPgn() {
    const pgn = toPgn(tree!, { Event: opening.name, Orientation: opening.color === 'w' ? 'white' : 'black' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([pgn], { type: 'application/x-chess-pgn' }));
    a.download = `${opening.id}.pgn`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  async function addHole(h: Hole) {
    if (!h.bestSan) return;
    const t = parsePgn('*').root;
    addLine(t, [...h.path, h.bestSan]);
    await mergeValidated(t, 'Trou comblé');
  }

  // ----- plateau
  let boardFen = new Chess().fen();
  let movable: 'w' | 'b' | null = null;
  const arrows: BoardArrow[] = [];
  if (mode.kind === 'add') {
    const c = fenAfter(mode.moves);
    boardFen = c.fen();
    movable = c.turn();
  } else if (preview) {
    boardFen = fenAfter(preview.sans).fen();
    if (preview.arrow) {
      const m = new Chess(boardFen).move(preview.arrow);
      arrows.push({ from: m.from, to: m.to, color: 'rgba(30,160,60,.9)' });
    }
  }
  const unchecked = allLines.some((l) => lineLoss(opening, l).max === undefined);

  return (
    <div className="play">
      <div className="board-col">
        <Board fen={boardFen} orientation={opening.color} movable={movable} arrows={arrows}
          onMove={(u) => {
            if (mode.kind !== 'add') return;
            const c = fenAfter(mode.moves);
            const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
            setMode({ kind: 'add', moves: [...mode.moves, m.san] });
          }} />
        {mode.kind === 'add' && (
          <div className="card">
            <p className="line-text">{fig(formatLine(mode.moves)) || 'Joue les coups des deux camps sur l’échiquier.'}</p>
            <div className="row">
              <button disabled={!mode.moves.length} onClick={() => setMode({ kind: 'add', moves: mode.moves.slice(0, -1) })}><Undo2 aria-hidden className="ico" />Retirer le dernier coup</button>
              <button onClick={() => setMode({ kind: 'view' })}>Annuler</button>
              <button className="primary" disabled={!mode.moves.length || !!busy} onClick={() => saveAddedLine(mode.moves)}>Enregistrer la ligne</button>
            </div>
          </div>
        )}
      </div>
      <aside className="side-col">
        <div className="card">
          <h2>{opening.name}</h2>
          <p className="muted">{opening.color === 'w' ? 'Blancs' : 'Noirs'} · {allLines.length} lignes
            {opening.forced.length > 0 && <> · coups adverses imposés : {fig(opening.forced.map((f) => f.split('|').join(' ou ')).join(', '))}</>}</p>
          <div className="row wrap">
            <button onClick={() => { setPreview(null); setMode({ kind: 'add', moves: [] }); }}>+ Ligne</button>
            <button onClick={() => setMode({ kind: 'import', text: '' })}>Importer PGN</button>
            <button onClick={exportPgn}>Exporter PGN</button>
            {unchecked && <button onClick={verifyAll} disabled={!!busy}>Vérifier (Stockfish)</button>}
          </div>
          {busy && <p className="pulse">{busy}</p>}
          {msg && <p className={msg.bad ? 'bad-text' : 'notice'}>{msg.text}</p>}
        </div>

        {mode.kind === 'import' && (
          <div className="card col">
            <p>Colle un PGN (par ex. l’export d’une étude Lichess) ou choisis un fichier. Les variantes sont prises en compte.</p>
            <textarea rows={6} value={mode.text} onChange={(e) => setMode({ kind: 'import', text: e.target.value })} placeholder="1. d4 d5 2. Bf4 (2. c4) 2... Nf6 *" />
            <label className="button">Choisir un fichier .pgn
              <input type="file" accept=".pgn,text/plain" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) setMode({ kind: 'import', text: await f.text() }); }} />
            </label>
            <div className="row">
              <button onClick={() => setMode({ kind: 'view' })}>Annuler</button>
              <button className="primary" disabled={!mode.text.trim() || !!busy} onClick={() => doImport(mode.text)}>Importer</button>
            </div>
          </div>
        )}

        {holes.length > 0 && (
          <div className="card">
            <h3>Trous du répertoire ({holes.length})</h3>
            {holes.map((h) => (
              <div key={h.id} className="hole">
                <button className="ghost line-btn" onClick={() => setPreview({ sans: h.path, arrow: h.bestSan ?? undefined })}>
                  <span className="line-text">{fig(formatLine(h.path))}</span>
                </button>
                <div className="muted small">L’adversaire a joué {fig(h.oppSan)}{h.count > 1 ? ` (${h.count} fois)` : ''}.
                  {' '}Stockfish conseille <b>{h.bestSan ? fig(h.bestSan) : '…'}</b>.</div>
                <div className="row">
                  <button className="small primary" disabled={!h.bestSan || !!busy} onClick={() => addHole(h)}>Ajouter {fig(h.bestSan ?? '')} au répertoire</button>
                  <button className="small" onClick={() => { setPreview(null); setMode({ kind: 'add', moves: h.path }); }}>Compléter à la main</button>
                  <button className="small" onClick={async () => { await db.holes.delete(h.id!); reload(); }}>Ignorer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card lines">
          <h3>Lignes</h3>
          {allLines.length === 0 && <p className="muted">Aucune ligne : ajoute-en une ou importe un PGN.</p>}
          {allLines.map((l) => {
            const r = lineLoss(opening, l);
            const key = l.join(' ');
            return (
              <div key={key} className="line-row">
                <span className={`status ${r.max === undefined ? '' : r.max > MAX_LOSS_CP ? 'bad-text' : 'good-text'}`}
                  title={r.bad.join(', ')}>{r.max === undefined ? '?' : r.max > MAX_LOSS_CP ? <TriangleAlert aria-label="perd plus de 0,5 pion" className="ico sm bad-text" /> : <Check aria-label="vérifiée" className="ico sm good-text" />}</span>
                <button className="ghost line-btn" onClick={() => { setMode({ kind: 'view' }); setPreview({ sans: l }); }}>
                  <span className="line-text">{fig(formatLine(l))}</span>
                </button>
                <button className="small" title="Partir de cette ligne" onClick={() => { setPreview(null); setMode({ kind: 'add', moves: l }); }}>⑂</button>
                <button className="small danger" title="Supprimer" onClick={() => deleteLine(l)}><Trash2 aria-hidden className="ico sm" /></button>
              </div>
            );
          })}
          <p className="muted small"><Check aria-hidden className="ico sm good-text" /> aucun de tes coups ne perd plus de 0,5 pion · <TriangleAlert aria-hidden className="ico sm bad-text" /> un coup perd plus · ? pas encore vérifié</p>
        </div>
      </aside>
    </div>
  );
}
