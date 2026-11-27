// Onglet « Jouer » : couleur, interrupteur « Partie comptée / non comptée », reprendre la partie en cours, et les
// raccourcis vers « Jouer les lignes » et la partie à thème de chaque ouverture active.
import { useEffect, useState } from 'react';
import { db, getCurrent, getProfile, setProfile, type Opening } from '../db';
import { go } from '../router';
import { colorForNewGame, colorModeOf, gamesSinceCalibration, inCalibration, type ColorMode, type ProfileData } from '../lib/profile';
import { botRating, CALIBRATION_GAMES } from '../lib/rating';
import { BookOpen, Play, Repeat } from '../icons';

export default function PlayMenu() {
  const [p, setP] = useState<ProfileData | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [unrated, setUnrated] = useState(false);
  const [openings, setOpenings] = useState<Opening[]>([]);
  useEffect(() => {
    Promise.all([getProfile(), getCurrent(), db.openings.toArray()]).then(([prof, cur, os]) => {
      setP(prof); setInProgress(!!cur); setOpenings(os.filter((o) => !o.archived));
    });
  }, []);
  if (!p) return null;
  const mode = colorModeOf(p);
  const color = colorForNewGame(p);
  async function setMode(m: ColorMode) { const next = { ...p!, colorMode: m }; await setProfile(next); setP(next); }

  return (
    <div className="play-menu">
      <h2>Jouer contre Maia</h2>
      <p className="muted">Ton niveau : <b>{Math.round(p.rating)}</b> · Maia jouera à {Math.round(botRating(p.rating))}
        {inCalibration(p) && <> · calibration : partie {gamesSinceCalibration(p) + 1}/{CALIBRATION_GAMES}</>}</p>
      {inProgress ? (
        <button className="primary main-action" onClick={() => go({ name: 'play' })}><Play aria-hidden className="ico" />Reprendre la partie</button>
      ) : (
        <>
          <div className="segmented" role="radiogroup" aria-label="Couleur">
            {([['w', 'Blancs'], ['b', 'Noirs'], ['alternate', 'Alterner']] as [ColorMode, string][]).map(([m, l]) => (
              <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{l}</button>
            ))}
          </div>
          <div className="segmented rated" role="radiogroup" aria-label="Partie comptée ou non">
            <button role="radio" aria-checked={!unrated} className={!unrated ? 'on' : ''} onClick={() => setUnrated(false)}>Partie comptée</button>
            <button role="radio" aria-checked={unrated} className={unrated ? 'on' : ''} onClick={() => setUnrated(true)}>Partie non comptée</button>
          </div>
          <p className="muted small">{unrated ? 'Analysée normalement, sans effet sur ton niveau ; indices et menaces disponibles.' : 'Compte pour ton niveau.'}</p>
          <button className="primary main-action play-btn" onClick={() => go({ name: 'play', ...(unrated ? { unrated: true } : {}) })}>
            <Play aria-hidden className="ico" />Jouer ({color === 'w' ? 'Blancs' : 'Noirs'})
          </button>
        </>
      )}
      <section className="card flat">
        <h3>Raccourcis de mes ouvertures</h3>
        <ul className="nav-list">
          {openings.map((o) => (
            <li key={o.id} className="nav-row">
              <span className="nav-row-title">{o.name} <span className="muted small">({o.color === 'w' ? 'Blancs' : 'Noirs'})</span></span>
              <span className="row">
                <button className="flat-btn" onClick={() => go({ name: 'lines', id: o.id })}><Repeat aria-hidden className="ico" />Jouer les lignes</button>
                <button className="flat-btn" disabled={inProgress} onClick={() => go({ name: 'play', opening: o.id })}><BookOpen aria-hidden className="ico" />Partie à thème</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
