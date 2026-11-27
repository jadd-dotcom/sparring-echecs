// « Toutes mes cartes » : chaque position de révision avec son origine (partie, adversaire, date, coup),
// le coup joué et le meilleur coup, la prochaine révision ; on peut supprimer une carte d'erreur ou de mat.
// Les positions du répertoire se gèrent depuis l'éditeur de répertoire.
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { db, type Card } from '../db';
import { dayKey } from '../lib/srs';
import { fig } from '../lib/notation';
import { pieceUrl, usePrefs } from '../prefs';
import { cardOrigin, type CardOrigin } from '../reviseService';
import { moveNo } from '../lib/reviseText';
import { MATE_LEVELS } from '../lib/mates';
import { go } from '../router';
import { BookOpen, Crown, Layers, Trash2, TriangleAlert } from '../icons';

const FILES = 'abcdefgh';

/** Petit échiquier figé : pièces du jeu choisi, cases du coup joué (rouge) et du meilleur coup (vert). */
export function MiniBoard({ fen, orientation, played, best }: { fen: string; orientation: 'w' | 'b'; played?: string; best?: string }) {
  const { pieces } = usePrefs();
  const board = useMemo(() => new Chess(fen).board(), [fen]);
  const mark = (sq: string) => (best && (best.slice(0, 2) === sq || best.slice(2, 4) === sq) ? 'best'
    : played && (played.slice(0, 2) === sq || played.slice(2, 4) === sq) ? 'played' : '');
  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const row = orientation === 'w' ? r : 7 - r;
      const col = orientation === 'w' ? f : 7 - f;
      const sq = `${FILES[col]}${8 - row}`;
      const p = board[row][col];
      cells.push(
        <div key={sq} className={`mini-sq ${(row + col) % 2 ? 'dark' : 'light'} ${mark(sq)}`}>
          {p && <img src={pieceUrl(pieces, `${p.color}${p.type.toUpperCase()}`)} alt="" draggable={false} />}
        </div>,
      );
    }
  }
  return <div className="mini-board" aria-hidden>{cells}</div>;
}

const fmtDay = (d: string) => {
  const [y, m, j] = d.split('-');
  return `${j}/${m}/${y}`;
};

function dueLabel(c: Card, today: string) {
  if (c.due === 'new') return 'nouvelle';
  return c.due <= today ? 'à revoir aujourd’hui' : `prochaine révision le ${fmtDay(c.due)}`;
}

function OriginLine({ o }: { o: CardOrigin | undefined }) {
  if (!o) return <span className="muted">…</span>;
  return (
    <>
      <b>{o.source}</b>{o.opponent ? <> · contre {o.opponent}</> : null}
      {o.date ? <> · {new Date(o.date).toLocaleDateString('fr-FR')}</> : null}
      {o.ply !== undefined ? <> · coup {moveNo(o.ply)}</> : null}
    </>
  );
}

export default function Cards() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [origins, setOrigins] = useState<Record<number, CardOrigin>>({});
  const today = dayKey();

  useEffect(() => {
    db.cards.toArray().then(async (all) => {
      const list = all.sort((a, b) => a.due.localeCompare(b.due) || b.createdAt - a.createdAt);
      setCards(list);
      const res: Record<number, CardOrigin> = {};
      for (const c of list.filter((x) => x.kind !== 'drill' && x.kind !== 'mate')) res[c.id!] = await cardOrigin(c);
      setOrigins(res);
    });
  }, []);

  async function remove(c: Card) {
    const what = c.kind === 'mate' ? 'cette position de mat' : c.kind === 'threat' ? 'cette position « Lis la menace »' : `cette position (${fig(c.playedSan)} au lieu de ${fig(c.bestSan)})`;
    if (!confirm(`Supprimer ${what} de tes révisions ?`)) return;
    await db.cards.delete(c.id!);
    setCards((cs) => cs!.filter((x) => x.id !== c.id));
  }

  if (!cards) return null;
  const mistakes = cards.filter((c) => c.kind !== 'drill' && c.kind !== 'mate' && c.kind !== 'threat');
  const threats = cards.filter((c) => c.kind === 'threat');
  const mates = cards.filter((c) => c.kind === 'mate');
  const drills = cards.filter((c) => c.kind === 'drill');
  const dueCount = cards.filter((c) => c.due <= today).length;

  return (
    <div className="cards-list">
      <h2><Layers aria-hidden className="ico" /> Toutes mes cartes</h2>
      <p className="muted">{dueCount === 0 ? 'Rien à revoir aujourd’hui.' : `${dueCount} position${dueCount > 1 ? 's' : ''} à revoir aujourd’hui.`}</p>
      {dueCount > 0 && <button className="primary" onClick={() => go({ name: 'revise' })}>Réviser maintenant</button>}

      <section className="card">
        <h3>Erreurs de mes parties <span className="muted">({mistakes.length})</span></h3>
        {mistakes.length === 0 && <p className="muted">Aucune pour l’instant : les gaffes et erreurs de tes parties analysées arrivent ici.</p>}
        <ul className="card-items">
          {mistakes.map((c) => {
            const ok = c.attempts.filter((a) => a.ok).length;
            return (
              <li key={c.id} className="card-item" data-testid="card-item" data-card={c.id}>
                <MiniBoard fen={c.fen} orientation={c.myColor} played={c.playedUci} best={c.bestUci} />
                <div className="card-info">
                  <p className="small" data-testid="card-origin"><OriginLine o={origins[c.id!]} /></p>
                  <p>Joué : <b className="bad-text">{fig(c.playedSan)}</b> ({c.severity === 'blunder' ? 'gaffe' : 'erreur'}) · meilleur : <b className="good-text">{fig(c.bestSan)}</b></p>
                  <p className="muted small">{dueLabel(c, today)} · {c.attempts.length} essai{c.attempts.length > 1 ? 's' : ''}, {ok} réussi{ok > 1 ? 's' : ''}</p>
                  <div className="row">
                    {origins[c.id!]?.game && <button className="small" onClick={() => go({ name: 'review', id: c.gameId })}>Voir la partie</button>}
                    <button className="small danger" onClick={() => remove(c)} aria-label="Supprimer la carte"><Trash2 aria-hidden className="ico" />Supprimer</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {threats.length > 0 && (
        <section className="card" data-testid="threat-cards">
          <h3><TriangleAlert aria-hidden className="ico sm" /> Lis la menace <span className="muted">({threats.length})</span></h3>
          <p className="muted small">Positions de tes parties juste après un coup adverse qui menaçait quelque chose : lis sa menace, puis pare-la.</p>
          <ul className="card-items">
            {threats.map((c) => {
              const read = c.attempts.filter((a) => a.q === 1);
              return (
                <li key={c.id} className="card-item" data-testid="card-item" data-card={c.id}>
                  <MiniBoard fen={c.fen} orientation={c.myColor} played={c.threatUci} best={c.bestUci} />
                  <div className="card-info">
                    <p className="small" data-testid="card-origin"><OriginLine o={origins[c.id!]} /></p>
                    <p>Sa menace : <b className="bad-text">{fig(c.threatSan ?? '')}</b>{c.ignored ? ' (ignorée dans la partie)' : ' (parée dans la partie)'} · pour la parer : <b className="good-text">{fig(c.bestSan)}</b></p>
                    <p className="muted small">{dueLabel(c, today)} · menace lue {read.filter((a) => a.ok).length} fois sur {read.length}</p>
                    <div className="row">
                      {origins[c.id!]?.game && <button className="small" onClick={() => go({ name: 'review', id: c.gameId })}>Voir la partie</button>}
                      <button className="small danger" onClick={() => remove(c)} aria-label="Supprimer la carte"><Trash2 aria-hidden className="ico" />Supprimer</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {mates.length > 0 && (
        <section className="card">
          <h3><Crown aria-hidden className="ico sm" /> Mats élémentaires ratés <span className="muted">({mates.length})</span></h3>
          <ul className="card-items">
            {mates.map((c) => (
              <li key={c.id} className="card-item" data-testid="card-item" data-card={c.id}>
                <MiniBoard fen={c.fen} orientation={c.myColor} />
                <div className="card-info">
                  <p className="small"><b>Mats élémentaires</b> · {MATE_LEVELS.find((l) => l.id === c.mateLevel)?.name ?? ''} · {new Date(c.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p className="muted small">{dueLabel(c, today)} · {c.attempts.length} essai{c.attempts.length > 1 ? 's' : ''}</p>
                  <div className="row"><button className="small danger" onClick={() => remove(c)} aria-label="Supprimer la carte"><Trash2 aria-hidden className="ico" />Supprimer</button></div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {drills.length > 0 && (
        <section className="card">
          <h3><BookOpen aria-hidden className="ico sm" /> Positions du répertoire <span className="muted">({drills.length})</span></h3>
          <p className="muted">Elles suivent tes ouvertures : pour en retirer, modifie la ligne dans le répertoire.</p>
          <button onClick={() => go({ name: 'openings' })}>Mes ouvertures</button>
        </section>
      )}
    </div>
  );
}
