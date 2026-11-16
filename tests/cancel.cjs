// Annuler une partie (5 premiers coups, sans effet) et « Partie non comptée » (analysée, sans effet sur le niveau).
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const prof = () => p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? null));
  const nGames = () => p.evaluate(() => window.__db.games.count());
  const home = async () => { await p.goto(URL + '#/stats'); await p.goto(URL); await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor(); };
  const waitFor = async (fn, ms = 60000) => { const end = Date.now() + ms; for (;;) { const v = await fn(); if (v) return v; if (Date.now() > end) throw new Error('délai dépassé'); await p.waitForTimeout(120); } };
  const playMyMove = async () => {
    await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
    const g = await cur();
    const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
    const m = c.moves({ verbose: true }).filter((x) => !x.promotion && !x.captured)[0] ?? c.moves({ verbose: true })[0];
    await p.locator(`[data-square="${m.from}"]`).tap(); await p.locator(`[data-square="${m.to}"]`).tap();
    await waitFor(async () => { const x = await cur(); return !x || x.uci.length >= g.uci.length + 2; });
  };
  const resign = async () => {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
    await p.getByRole('button', { name: 'Analyser mes coups' }).waitFor();
  };

  await home();
  const p0 = (await prof()) ?? { rating: 900, gamesPlayed: 0, nextColor: 'w' };

  // 1. Annulation après 2 coups
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  await playMyMove(); await playMyMove();
  await p.getByRole('button', { name: 'Annuler la partie' }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Annuler la partie' }).tap();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  const p1 = (await prof()) ?? p0;
  assert(!(await cur()) && (await nGames()) === 0, 'partie annulée après 2 coups : supprimée (aucune partie enregistrée)');
  assert(p1.rating === p0.rating && p1.gamesPlayed === p0.gamesPlayed && p1.nextColor === p0.nextColor, `aucun effet sur le profil (niveau ${p1.rating}, couleur suivante ${p1.nextColor})`);
  assert(await p.getByRole('button', { name: /^Jouer/ }).innerText() === 'Jouer (Blancs)', 'toujours « Jouer (Blancs) »');

  // 2. Après le 5e coup : plus d'annulation
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  for (let i = 0; i < 4; i++) await playMyMove();
  assert(await p.getByRole('button', { name: 'Annuler la partie' }).isVisible(), 'avant mon 5e coup : « Annuler la partie » disponible');
  await playMyMove();
  await p.waitForTimeout(300);
  assert(!(await p.getByRole('button', { name: 'Annuler la partie' }).isVisible()), 'après mon 5e coup : plus de bouton d’annulation (seulement nulle ou abandon)');
  await p.screenshot({ path: OUT + '/c-1-apres5.png' });
  await resign();
  const p2 = await prof();
  assert(p2.gamesPlayed === p0.gamesPlayed + 1 && p2.rating < p0.rating, `partie normale abandonnée : comptée (niveau ${p2.rating.toFixed(1)})`);

  // 3. Annulation pendant que Maia réfléchit (Noirs : Maia joue d'abord)
  await home();
  await p.getByRole('button', { name: /^Jouer \(Noirs\)/ }).tap();
  await waitFor(cur);
  await p.getByRole('button', { name: 'Annuler la partie' }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Annuler la partie' }).tap();
  await p.waitForTimeout(2500);
  assert(!(await cur()), 'annulée pendant la réflexion de Maia : la partie ne réapparaît pas');

  // 4. Partie non comptée
  await home();
  await p.getByText('Partie non comptée').tap();
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  const g4 = await waitFor(cur);
  assert(g4.unrated === true, 'partie lancée « non comptée »');
  await p.getByText(/Partie non comptée : sans effet sur ton niveau/).waitFor();
  if (g4.myColor === 'b') await waitFor(async () => (await cur()).uci.length >= 1);
  await playMyMove(); await playMyMove();
  await resign();
  await p.getByText(/Partie non comptée : ton niveau reste à/).waitFor();
  const p4 = await prof();
  assert(p4.rating === p2.rating && p4.gamesPlayed === p2.gamesPlayed, 'défaite non comptée : niveau et calibration inchangés');
  assert(p4.nextColor !== g4.myColor, 'la couleur alterne quand même');
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.locator('.counts').waitFor({ timeout: 180000 });
  const last = await p.evaluate(() => window.__db.games.toArray().then((a) => a[a.length - 1]));
  assert(last.unrated && last.analysis?.length > 0 && last.ratingAfter === last.ratingBefore, 'partie non comptée enregistrée et analysée normalement');
  await p.goto(URL + '#/stats');
  await p.getByText(/non comptée\)/).first().waitFor();
  assert(true, 'statistiques : partie marquée « non comptée »');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
