import { useEffect, useState } from 'react';
import { exportAll, getCurrent, getProfile, importAll, setProfile, type Profile } from '../db';
import { colorModeOf, withManualRating, type ColorMode } from '../lib/profile';
import { CALIBRATION_GAMES, K_CALIBRATION, RATING_MAX, RATING_MIN } from '../lib/rating';
import { loadSoundSetting, playSound, setSoundEnabled } from '../sound';
import ChesscomImport from '../ChesscomImport';

export default function Settings() {
  const [msg, setMsg] = useState<string | null>(null);
  const [p, setP] = useState<Profile | null>(null);
  const [ratingInput, setRatingInput] = useState('');
  const [levelMsg, setLevelMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    (async () => {
      const prof = await getProfile();
      setP(prof);
      setRatingInput(String(Math.round(prof.rating)));
      setInProgress(!!(await getCurrent()));
      setSound(await loadSoundSetting());
    })();
  }, []);

  async function saveRating() {
    if (!p) return;
    const v = Number(ratingInput.replace(',', '.'));
    if (!Number.isFinite(v) || v < RATING_MIN || v > RATING_MAX) {
      setLevelMsg({ text: `Entre un nombre entre ${RATING_MIN} et ${RATING_MAX}.`, bad: true });
      return;
    }
    const next = withManualRating(p, v);
    await setProfile(next);
    setP(next);
    setRatingInput(String(next.rating));
    setLevelMsg({
      text: `Niveau réglé à ${next.rating} : Maia jouera à ${Math.min(RATING_MAX, next.rating + 50)}. ` +
        `Calibration relancée : K = ${K_CALIBRATION} pour les ${CALIBRATION_GAMES} prochaines parties.` +
        (inProgress ? ' La partie en cours garde son ancien réglage.' : ''),
    });
  }

  async function saveColor(mode: ColorMode) {
    if (!p) return;
    const next = { ...p, colorMode: mode };
    await setProfile(next);
    setP(next);
  }

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

  const mode = p ? colorModeOf(p) : 'alternate';
  const colors: [ColorMode, string][] = [['w', 'Blancs'], ['b', 'Noirs'], ['alternate', 'Alterner']];

  return (
    <div className="settings">
      <section className="card">
        <h2>Réglages</h2>
        <label htmlFor="rating"><b>Mon niveau</b> <span className="muted small">(échelle de l’appli, pas celle de Chess.com)</span></label>
        <div className="row">
          <input id="rating" type="number" inputMode="numeric" min={RATING_MIN} max={RATING_MAX} step={1}
            value={ratingInput} onChange={(e) => setRatingInput(e.target.value)} />
          <button className="primary" onClick={saveRating}>Enregistrer</button>
        </div>
        <p className="muted small">De {RATING_MIN} à {RATING_MAX}. Maia joue 50 points au-dessus. Après un changement, l’appli
          {' '}repasse en calibration (K = {K_CALIBRATION} pour les {CALIBRATION_GAMES} parties suivantes).</p>
        {levelMsg && <p className={levelMsg.bad ? 'bad-text' : 'notice'}>{levelMsg.text}</p>}

        <p style={{ marginTop: 18 }}><b>Ma couleur</b> <span className="muted small">(parties libres ; les parties à thème gardent la couleur de l’ouverture)</span></p>
        <div className="row" role="radiogroup" aria-label="Ma couleur">
          {colors.map(([m, label]) => (
            <label key={m} className={`radio ${mode === m ? 'on' : ''}`}>
              <input type="radio" name="color" checked={mode === m} onChange={() => saveColor(m)} /> {label}
            </label>
          ))}
        </div>
        {p && mode === 'alternate' && <p className="muted small">Prochaine partie : {p.nextColor === 'w' ? 'Blancs' : 'Noirs'}.</p>}

        <p style={{ marginTop: 18 }}><b>Sons</b> <span className="muted small">(coup, prise, échec, roque, fin de partie)</span></p>
        <div className="row" role="radiogroup" aria-label="Sons">
          {([[true, 'Oui'], [false, 'Non']] as const).map(([on, label]) => (
            <label key={label} className={`radio ${sound === on ? 'on' : ''}`}>
              <input type="radio" name="sound" checked={sound === on} onChange={async () => { await setSoundEnabled(on); setSound(on); if (on) playSound('move'); }} /> {label}
            </label>
          ))}
        </div>
      </section>

      <ChesscomImport />

      <section className="card">
        <h2>Sauvegarde</h2>
        <p>Tes parties, ton niveau et tes cartes sont stockés uniquement sur cet appareil. Exporte-les régulièrement.</p>
        <div className="col">
          <button className="primary" onClick={doExport}>Exporter (JSON)</button>
          <label className="button">Importer un fichier JSON
            <input type="file" accept="application/json,.json" hidden onChange={(e) => doImport(e.target.files?.[0])} />
          </label>
        </div>
        {msg && <p className="notice">{msg}</p>}
        <p className="muted small">Adversaire : Maia-3 (5M) · Correcteur : Stockfish 19 lite</p>
      </section>
    </div>
  );
}
