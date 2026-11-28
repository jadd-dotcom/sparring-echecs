// Réglages : couleur (Alterner / Blancs / Noirs), alternance après abandon et partie interrompue, niveau à la main.
const { gameEnded, reviewAfterGame } = require('./lib.cjs');
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  // Le niveau enregistré s'affiche après le chargement du profil : saisir avant écraserait la saisie (course).
  const ratingReady = () => p.waitForFunction(() => document.querySelector('#rating')?.value !== '');
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const prof = () => p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? null));
  const home = async () => { await p.goto(URL + '#/stats'); await p.goto(URL); await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor(); await p.getByTestId('tab-jouer').tap(); await p.getByRole('heading', { name: 'Jouer contre Maia' }).waitFor(); };
  const waitFor = async (fn, ms = 60000) => { const end = Date.now() + ms; for (;;) { const v = await fn(); if (v) return v; if (Date.now() > end) throw new Error('délai dépassé'); await p.waitForTimeout(150); } };
  const playBtn = () => p.getByRole('button', { name: /^(Jouer|Reprendre)/ });
  const resign = async () => {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
    await gameEnded(p);
  };
  /** Lance une partie depuis l'accueil et renvoie la partie en cours. */
  const start = async () => { await playBtn().tap(); return waitFor(cur); };
  const played = [];

  await home();
  assert(await playBtn().innerText() === 'Jouer (Blancs)', 'accueil : « Jouer (Blancs) » au départ (Alterner par défaut)');

  // Partie 1 : Blancs, abandon immédiat
  let g = await start(); played.push(g.myColor);
  await resign();
  await home();
  assert(await playBtn().innerText() === 'Jouer (Noirs)', 'après un abandon (Blancs) → « Jouer (Noirs) »');

  // Partie 2 : Noirs, interrompue (rechargement) après quelques coups, puis reprise
  g = await start(); played.push(g.myColor);
  await waitFor(async () => (await cur())?.uci.length >= 1);           // Maia (Blancs) a joué
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  const c0 = await cur();
  await p.reload();                                                    // interruption
  await home();
  assert(await playBtn().innerText() === 'Reprendre la partie', 'partie interrompue : « Reprendre la partie »');
  const resumed = await start();
  assert(resumed.myColor === 'b' && resumed.uci.join() === c0.uci.join() && resumed.startedAt === c0.startedAt, 'reprise de la même partie, toujours avec les Noirs');
  await p.getByText('à toi de jouer').waitFor({ timeout: 60000 });
  await resign();
  await home();
  assert(await playBtn().innerText() === 'Jouer (Blancs)', 'après la partie interrompue puis abandonnée (Noirs) → « Jouer (Blancs) »');

  // Partie 3 : Blancs, interrompue avant tout coup, reprise, abandon
  g = await start(); played.push(g.myColor);
  await p.reload();
  await home();
  const r3 = await start();
  assert(r3.myColor === 'w' && r3.startedAt === g.startedAt, 'interruption avant le 1er coup : même partie, Blancs');
  await resign();
  assert(played.join() === 'w,b,w', 'alternance : Blancs, Noirs, Blancs');

  // Couleur fixe : Noirs deux fois
  await p.goto(URL + '#/settings');
  await p.getByText('Prochaine partie : Noirs').waitFor();
  await p.locator('label.radio', { hasText: 'Noirs' }).tap();
  await p.locator('label.radio.on', { hasText: 'Noirs' }).waitFor();
  await home();
  assert(await playBtn().innerText() === 'Jouer (Noirs)', 'réglage « Noirs » → « Jouer (Noirs) »');
  g = await start(); assert(g.myColor === 'b', 'partie 4 avec les Noirs'); await resign();
  await home();
  g = await start(); assert(g.myColor === 'b', 'partie 5 encore avec les Noirs'); await resign();
  await p.goto(URL + '#/settings');
  await p.locator('label.radio', { hasText: 'Blancs' }).tap();
  await p.locator('label.radio.on', { hasText: 'Blancs' }).waitFor();
  await home();
  assert(await playBtn().innerText() === 'Jouer (Blancs)', 'réglage « Blancs » → « Jouer (Blancs) »');
  await p.goto(URL + '#/settings');
  await p.locator('label.radio', { hasText: 'Alterner' }).tap();
  await p.locator('label.radio.on', { hasText: 'Alterner' }).waitFor();
  await home();
  assert(await playBtn().innerText() === 'Jouer (Blancs)', 'retour à « Alterner » : l’inverse de la dernière partie (Noirs) → Blancs');

  // Niveau à la main
  await p.evaluate(() => window.__db.meta.get('profile').then((m) => window.__db.meta.put({ key: 'profile', value: { ...m.value, gamesPlayed: 25, calibrationStart: 0 } })));
  await p.goto(URL + '#/settings');
  await p.getByText('échelle de l’appli, pas celle de Chess.com').waitFor();
  await ratingReady(); await p.locator('#rating').fill('400');
  await p.getByRole('button', { name: 'Enregistrer', exact: true }).tap();
  await p.getByText(/Entre un nombre entre 550 et 2600/).waitFor();
  assert(true, 'niveau hors bornes refusé (400)');
  await ratingReady(); await p.locator('#rating').fill('550');
  await p.getByRole('button', { name: 'Enregistrer', exact: true }).tap();
  await p.getByText(/Niveau réglé à 550 : Maia jouera à 600/).waitFor();
  await p.screenshot({ path: OUT + '/s-1-reglages.png' });
  let pr = await prof();
  assert(pr.rating === 550 && pr.calibrationStart === 25, 'niveau 550 enregistré, calibration relancée (début à la 26e partie)');
  await home();
  await p.getByText(/Maia jouera à 600/).waitFor();
  await p.getByText('Calibration : partie 1/10').waitFor();
  assert(true, 'accueil : Maia à 600, « Calibration : partie 1/10 »');
  await p.goto(URL + '#/settings');
  await ratingReady(); await p.locator('#rating').fill('1200');
  await p.getByRole('button', { name: 'Enregistrer', exact: true }).tap();
  await p.getByText(/Niveau réglé à 1200/).waitFor();
  await home();
  g = await start();
  assert(g.rating === 1200 && g.botElo === 1250, 'nouvelle partie à 1200 contre Maia 1250');
  await resign();
  pr = await prof();
  const expected = 1200 - 80 / (1 + Math.pow(10, (1250 - 1200) / 400));
  assert(Math.abs(pr.rating - expected) < 0.01, `défaite → ${pr.rating.toFixed(1)} (K = 80 malgré 26 parties jouées)`);
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
