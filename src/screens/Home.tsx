import { useEffect, useState } from 'react';
import { db, getCurrent, getProfile, type Profile } from '../db';
import { dayKey } from '../lib/srs';
import { botRating, CALIBRATION_GAMES } from '../lib/rating';
import { go } from '../router';

export default function Home() {
  const [p, setP] = useState<Profile | null>(null);
  const [due, setDue] = useState(0);
  const [total, setTotal] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  useEffect(() => {
    (async () => {
      setP(await getProfile());
      setDue(await db.cards.where('due').belowOrEqual(dayKey()).count());
      setTotal(await db.cards.count());
      setInProgress(!!(await getCurrent()));
    })();
  }, []);
  if (!p) return null;
  return (
    <div className="home">
      <h1>Sparring Échecs</h1>
      <section className="card rating-card">
        <div className="big">{Math.round(p.rating)}</div>
        <div className="muted">
          Ton niveau estimé · Maia jouera à {Math.round(botRating(p.rating))}
          {p.gamesPlayed < CALIBRATION_GAMES && <><br />Calibration : partie {p.gamesPlayed + 1}/{CALIBRATION_GAMES}</>}
        </div>
      </section>
      <button className="primary huge" onClick={() => go({ name: 'play' })}>
        {inProgress ? 'Reprendre la partie' : `Jouer (${p.nextColor === 'w' ? 'Blancs' : 'Noirs'})`}
      </button>
      <button className="huge" disabled={due === 0} onClick={() => go({ name: 'revise' })}>
        {due === 0
          ? total === 0 ? 'Aucune position à revoir pour l’instant' : 'Rien à revoir aujourd’hui 🎉'
          : `${due} position${due > 1 ? 's' : ''} à revoir aujourd’hui`}
      </button>
      <div className="row">
        <button onClick={() => go({ name: 'stats' })}>Statistiques et parties</button>
        <button onClick={() => go({ name: 'settings' })}>Sauvegarde</button>
      </div>
    </div>
  );
}
