// Onglet « Entraînement » : pièges, mats, échiquier, Lis la menace, révision (cartes du jour et en attente), erreurs
// à commenter, toutes mes cartes. Des cartes plates : l'action principale est sur « Aujourd'hui ».
import { useEffect, useState } from 'react';
import { db } from '../db';
import { go } from '../router';
import { reviewCounts } from '../openings';
import { errorsToComment } from '../lib/commentQueue';
import { getTrapProgress } from '../trapService';
import { trapStatus } from '../lib/traps';
import { TRAPS } from '../data/traps';
import { dueChapters } from '../lib/board/levels';
import { getBoardProgress } from '../boardService';
import { dayKey } from '../lib/srs';
import { Crown, Flame, Grid3x3, Layers, MessageCircleQuestion, Swords, TriangleAlert, ChevronRight } from '../icons';

function NavCard({ icon: Icon, title, sub, onClick, testId }: { icon: typeof Crown; title: string; sub: string; onClick: () => void; testId?: string }) {
  return (
    <button className="nav-card" onClick={onClick} data-testid={testId}>
      <Icon aria-hidden className="ico" />
      <span className="nav-card-text"><b>{title}</b><span className="muted small">{sub}</span></span>
      <ChevronRight aria-hidden className="ico sm muted" />
    </button>
  );
}

export default function Training() {
  const [c, setC] = useState<{ today: number; waiting: number; threat: number; comment: number; traps: number; board: number; cards: number } | null>(null);
  useEffect(() => {
    (async () => {
      const [rc, games, tp, bp, n] = await Promise.all([reviewCounts(), db.games.toArray(), getTrapProgress(), getBoardProgress(), db.cards.count()]);
      setC({ ...rc, comment: errorsToComment(games).length, traps: TRAPS.filter((t) => trapStatus(tp[t.id]) === 'maîtrisé').length,
        board: dueChapters(bp, dayKey()).length, cards: n });
    })();
  }, []);
  if (!c) return null;
  return (
    <div className="training">
      <h2>Entraînement</h2>
      <div className="nav-cards">
        <NavCard icon={Layers} title="Révision" testId="nav-revise" onClick={() => go({ name: 'revise' })}
          sub={`${c.today} carte${c.today > 1 ? 's' : ''} aujourd’hui${c.waiting ? ` · ${c.waiting} en attente (jours suivants)` : ''}`} />
        <NavCard icon={TriangleAlert} title="Lis la menace" testId="nav-threat" onClick={() => go({ name: 'revise', only: 'threat' })}
          sub={c.threat ? `${c.threat} position${c.threat > 1 ? 's' : ''} aujourd’hui` : 'rien aujourd’hui'} />
        <NavCard icon={Swords} title="Pièges d’ouverture" onClick={() => go({ name: 'traps' })} sub={`${c.traps}/${TRAPS.length} maîtrisés`} />
        <NavCard icon={Crown} title="Mats élémentaires" onClick={() => go({ name: 'mates' })} sub="dame, tours, fous…" />
        <NavCard icon={Grid3x3} title="Maîtrise de l’échiquier" onClick={() => go({ name: 'board' })} sub="cases, diagonales, partie à l’aveugle" />
        <NavCard icon={Flame} title="Échauffement échiquier (3 min)" onClick={() => go({ name: 'board', view: 'warmup' })}
          sub={c.board ? `${c.board} chapitre${c.board > 1 ? 's' : ''} à revoir` : 'mes cases les plus faibles'} />
        <NavCard icon={MessageCircleQuestion} title="Erreurs à commenter" testId="nav-comment" onClick={() => go({ name: 'comment' })}
          sub={c.comment ? `${c.comment} à commenter` : 'tout est commenté'} />
        <NavCard icon={Layers} title="Toutes mes cartes" onClick={() => go({ name: 'cards' })} sub={`${c.cards} carte${c.cards > 1 ? 's' : ''}`} />
      </div>
    </div>
  );
}
