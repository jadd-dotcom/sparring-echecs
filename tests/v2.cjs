// V2 — parcours « Ouvertures » sur iPad émulé : partie à thème, sorties, trous, drill, éditeur, stats.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const ONLY = process.argv[4] || 'all';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const waitPlies = async (n, timeout = 30000, mustExist = true) => {
    const end = Date.now() + timeout;
    for (;;) { const g = await cur(); if ((!g && !mustExist) || (g && g.uci.length >= n)) return g; if (Date.now() > end) throw new Error('timeout plies ' + n); await p.waitForTimeout(100); }
  };
  const tapMove = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  const resign = async () => {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
    await p.getByRole('button', { name: 'Analyser mes coups' }).waitFor();
  };
  const lastGame = () => p.evaluate(() => window.__db.games.toArray().then((a) => a[a.length - 1]));

  await p.goto(URL);
  await p.getByRole('button', { name: /Ouvertures/ }).tap();
  await p.getByRole('heading', { name: 'Gambit Dame refusé' }).waitFor();
  const nOpen = await p.evaluate(() => window.__db.openings.count());
  assert(nOpen === 3, '3 ouvertures pré-chargées');
  await p.screenshot({ path: OUT + '/v2-1-ouvertures.png' });

  // --- GDR : je joue les Noirs, 1.d4 et 2.c4 imposés, puis je sors avec 2...c6
  await p.locator('section', { hasText: 'Gambit Dame refusé' }).getByRole('button', { name: 'Partie à thème' }).tap();
  let g = await waitPlies(1, 120000);
  assert(g.myColor === 'b' && g.openingId === 'qgd', 'partie à thème GDR avec les Noirs');
  assert(g.uci[0] === 'd2d4', '1.d4 imposé');
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  await tapMove('d7d5');
  g = await waitPlies(3);
  assert(g.uci[2] === 'c2c4', '2.c4 imposé');
  await tapMove('c7c6'); // sortie du répertoire (prévu : 2...e6)
  g = await waitPlies(5);
  await p.screenshot({ path: OUT + '/v2-2-partie-theme.png' });
  await resign();
  await p.waitForTimeout(500);
  let lg = await lastGame();
  assert(lg.openingId === 'qgd' && lg.bookExit?.by === 'me' && lg.bookExit.expectedSan.join() === 'e6', `sortie détectée : 2...c6 au lieu de ${lg.bookExit?.expectedSan}`);
  const prof = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m.value));
  assert(prof.nextColor === 'w', 'la partie à thème ne change pas l’alternance des couleurs');

  // Revue : la sortie est signalée avec le coup prévu
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.locator('.counts').waitFor({ timeout: 120000 });
  await p.getByText(/Sortie du répertoire/).waitFor();
  await p.screenshot({ path: OUT + '/v2-3-revue-sortie.png' });
  assert(true, 'revue : sortie du répertoire signalée');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
