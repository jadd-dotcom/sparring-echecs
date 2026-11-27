import { useEffect, useState, useSyncExternalStore } from 'react';
import { db, getCurrent, getProfile, type Profile } from '../db';
import { botRating, CALIBRATION_GAMES } from '../lib/rating';
import { colorForNewGame, gamesSinceCalibration, inCalibration } from '../lib/profile';
import { go } from '../router';
import { reviewQueue } from '../openings';
import { isOfflineReady, waitOfflineReady } from '../offline';
import { BookOpen, ChartLine, CircleCheck, Crown, FileText, Flame, Grid3x3, Layers, PartyPopper, Play, Settings, Swords } from '../icons';
import { getBoardProgress } from '../boardService';
import { dueChapters } from '../lib/board/levels';
import { dayKey } from '../lib/srs';
import { errorsToComment } from '../lib/commentQueue';
import { bgAnalysis } from '../chesscomImport';
import { fillThreatCards } from '../threatService';
import GoalCard from '../GoalCard';
import { MessageCircleQuestion } from '../icons';

export default function Home() {
  const [p, setP] = useState<Profile | null>(null);
  const [due, setDue] = useState(0);
  const [total, setTotal] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [unrated, setUnrated] = useState(false);
  const [boardDue, setBoardDue] = useState(0);
  const [offline, setOffline] = useState<string>(isOfflineReady() ? 'ready' : '');
  const [toComment, setToComment] = useState(0);
  const bg = useSyncExternalStore(bgAnalysis.subscribe, bgAnalysis.get);
  // Erreurs à commenter : recalculées à l'ouverture et à chaque fin d'analyse en arrière-plan (parties importées).
  useEffect(() => { db.games.toArray().then((gs) => setToComment(errorsToComment(gs).length)); }, [bg.running, bg.last?.at]);
  useEffect(() => {
    (async () => {
      // Tout charger avant le premier affichage (pas de « Jouer » qui devient « Reprendre la partie »).
      const [prof, queue, nCards, current, bp] = await Promise.all([getProfile(), reviewQueue(), db.cards.count(), getCurrent(), getBoardProgress()]);
      setBoardDue(dueChapters(bp, dayKey()).length);
      setDue(queue.length);
      setTotal(nCards);
      setInProgress(!!current);
      setP(prof);
      // Rien à revoir et pas de partie en cours : on cherche discrètement de nouvelles cartes « Lis la menace ».
      if (queue.length === 0 && !current) {
        fillThreatCards({ maxChecks: 8 }).then((made) => {
          if (made.length) { setDue((d) => d + made.length); setTotal((t) => t + made.length); }
        }).catch(() => {});
      }
      if (!isOfflineReady()) {
        const ok = await waitOfflineReady((b, t) => setOffline(`${Math.round((100 * b) / t)} %`));
        setOffline(ok ? 'ready' : '');
      }
    })();
  }, []);
  if (!p) return null;
  return (
    <div className="home">
      <h1>Sparring Échecs</h1>
      <GoalCard />
      <section className="card rating-card">
        <div className="big rating-num">{Math.round(p.rating)}</div>
        <div className="muted">
          Ton niveau estimé · Maia jouera à {Math.round(botRating(p.rating))}
          {inCalibration(p) && <><br />Calibration : partie {gamesSinceCalibration(p) + 1}/{CALIBRATION_GAMES}</>}
        </div>
      </section>
      {!inProgress && (
        <label className="unrated-toggle">
          <input type="checkbox" checked={unrated} onChange={(e) => setUnrated(e.target.checked)} />
          Partie non comptée <span className="muted small">(analysée normalement, sans effet sur mon niveau)</span>
        </label>
      )}
      <button className="primary huge play-btn" onClick={() => go({ name: 'play', ...(unrated && !inProgress ? { unrated: true } : {}) })}>
        <Play aria-hidden className="ico" />{inProgress ? 'Reprendre la partie' : `Jouer (${colorForNewGame(p) === 'w' ? 'Blancs' : 'Noirs'})`}
      </button>
      <button className="huge" disabled={due === 0} onClick={() => go({ name: 'revise' })}>
        {due === 0 && total > 0 ? <PartyPopper aria-hidden className="ico" /> : <Layers aria-hidden className="ico" />}
        {due === 0
          ? total === 0 ? 'Aucune position à revoir pour l’instant' : 'Rien à revoir aujourd’hui'
          : `${due} position${due > 1 ? 's' : ''} à revoir aujourd’hui`}
      </button>
      {total > 0 && <button className="ghost small all-cards" onClick={() => go({ name: 'cards' })}>Voir toutes mes cartes</button>}
      {toComment > 0 && (
        <button className="comment-badge" data-testid="to-comment" onClick={() => go({ name: 'comment' })}>
          <MessageCircleQuestion aria-hidden className="ico" />{toComment} erreur{toComment > 1 ? 's' : ''} à commenter
        </button>
      )}
      <div className="row">
        <button className="huge" onClick={() => go({ name: 'openings' })}><BookOpen aria-hidden className="ico" />Ouvertures</button>
        <button className="huge" onClick={() => go({ name: 'traps' })}><Swords aria-hidden className="ico" />Pièges d’ouverture</button>
      </div>
      <div className="row">
        <button className="huge" onClick={() => go({ name: 'mates' })}><Crown aria-hidden className="ico" />Mats élémentaires</button>
        <button className="huge" onClick={() => go({ name: 'board' })}><Grid3x3 aria-hidden className="ico" />Maîtrise de l’échiquier</button>
      </div>
      <div className="row">
        <button className="huge" onClick={() => go({ name: 'board', view: 'warmup' })}><Flame aria-hidden className="ico" />Échauffement échiquier (3 min){boardDue ? ` · ${boardDue}` : ''}</button>
      </div>
      <div className="row">
        <button onClick={() => go({ name: 'stats' })}><ChartLine aria-hidden className="ico" />Statistiques et parties</button>
        <button onClick={() => go({ name: 'report' })}><FileText aria-hidden className="ico" />Rapport pour Claude</button>
        <button onClick={() => go({ name: 'settings' })}><Settings aria-hidden className="ico" />Réglages et sauvegarde</button>
      </div>
      <p className="muted small center-text">
        {offline === 'ready' ? <><CircleCheck aria-hidden className="ico sm" /> Disponible hors ligne</> : offline ? `Préparation du mode hors ligne… ${offline}` : ''}
      </p>
    </div>
  );
}
