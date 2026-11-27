// Mesures du 1er chargement + test hors ligne complet (Playwright, iPad émulé).
// Usage : PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1 node tests/offline.cjs <url>
const { gameEnded, reviewAfterGame } = require('./lib.cjs');
const { chromium, devices } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const bytes = new Map();
  ctx.on('requestfinished', async (r) => {
    try {
      const s = await r.sizes();
      const u = r.url().replace(/\?.*/, '');
      const fromSW = !!r.serviceWorker();
      const k = `${fromSW ? '[sw] ' : ''}${u.split('/').pop() || '/'}`;
      bytes.set(k, (bytes.get(k) ?? 0) + s.responseBodySize + s.responseHeadersSize);
    } catch {}
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));

  const t0 = Date.now();
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  const tHome = Date.now() - t0;
  await p.getByTestId('tab-jouer').tap();
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  await p.getByText('à toi de jouer').waitFor({ timeout: 300000 });
  const tMaia = Date.now() - t0;
  await p.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 300000 });
  const tSW = Date.now() - t0;
  await p.waitForTimeout(1500);
  const total = [...bytes.values()].reduce((a, b) => a + b, 0);
  console.log(`1er chargement : accueil ${tHome} ms · Maia prête ${tMaia} ms · hors ligne prêt (SW actif) ${tSW} ms`);
  console.log(`Poids transféré total : ${(total / 1048576).toFixed(1)} Mo`);
  for (const [k, v] of [...bytes].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`   ${(v / 1048576).toFixed(2).padStart(7)} Mo  ${k}`);

  // ---- Hors ligne ----
  await ctx.setOffline(true);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor({ timeout: 15000 });
  assert(true, 'accueil chargé hors ligne');
  await p.getByTestId('tab-jouer').tap();
  await p.getByRole('button', { name: /^(Jouer|Reprendre)/ }).tap();
  await p.getByText('à toi de jouer').waitFor({ timeout: 60000 });
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const before = (await cur()).uci.length;
  await p.locator('[data-square="e2"]').tap(); await p.locator('[data-square="e4"]').tap();
  const end = Date.now() + 20000;
  let g; do { await p.waitForTimeout(150); g = await cur(); } while (g.uci.length < before + 2 && Date.now() < end);
  assert(g.uci.length >= before + 2, 'Maia répond hors ligne (' + g.uci.join(' ') + ')');
  const imgs = await p.evaluate(() => [...document.querySelectorAll('.piece-img')].map((i) => i.complete && i.naturalWidth > 0));
  const font = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => f.family.includes('Inter') && f.status === 'loaded'); });
  assert(imgs.length >= 30 && imgs.every(Boolean) && font, `pièces (${imgs.length} images) et police Inter affichées hors ligne`);
  await p.getByRole('button', { name: /Abandonner/ }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  await reviewAfterGame(p);
  await p.locator('table.classes').waitFor({ timeout: 60000 });
  assert(true, 'analyse Stockfish hors ligne');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
