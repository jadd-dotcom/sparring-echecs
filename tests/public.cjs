// Test de l'URL publique (GitHub Pages) sur iPad émulé : chargement, partie contre Maia, analyse, puis hors ligne.
// Usage : PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1 node tests/public.cjs https://jadd-dotcom.github.io/sparring-echecs/
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const URL = process.argv[2] || 'https://jadd-dotcom.github.io/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  let bytes = 0;
  ctx.on('requestfinished', async (r) => { try { const s = await r.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; } catch {} });
  const p = await ctx.newPage();
  globalThis.__page = p;
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const waitPlies = async (n) => { const end = Date.now() + 60000; for (;;) { const g = await cur(); if (g && g.uci.length >= n) return g; if (Date.now() > end) throw new Error(`Maia ne répond pas (attendu ${n} demi-coups, partie : ${g ? g.uci.join(' ') + ' / ' + g.myColor : 'aucune'})`); await p.waitForTimeout(100); } };

  const t0 = Date.now();
  const resp = await p.goto(URL);
  assert(resp.ok(), `HTTP ${resp.status()} sur ${URL}`);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  const tHome = Date.now() - t0;
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  await p.getByText('à toi de jouer').waitFor({ timeout: 600000 });
  const tReady = Date.now() - t0;
  await p.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 600000 });
  console.log(`   accueil ${tHome} ms · Maia prête et hors ligne prêt ${(tReady / 1000).toFixed(1)} s · ${(bytes / 1048576).toFixed(1)} Mo transférés`);

  // Partie : 5 coups (le premier coup légal non perdant par ordre alphabétique), Maia répond à chaque fois
  const times = [];
  for (let k = 0; k < 5; k++) {
    const g = await cur();
    const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
    if (c.isGameOver()) break;
    // Coup sensé (Stockfish, 100 ms) : des coups naïfs comme a3-a4-a5 se font mater en 4 coups.
    const u = await p.evaluate((f) => window.__sfBest(f, 100), c.fen());
    const m = { from: u.slice(0, 2), to: u.slice(2, 4) };
    const t = Date.now();
    await sq(m.from).tap(); await sq(m.to).tap();
    await waitPlies(g.uci.length + 2);
    times.push(Date.now() - t);
  }
  assert(times.length === 5, `5 coups joués, réponse de Maia (délai de « réflexion » de 450 ms inclus) : ${times.map((x) => x + ' ms').join(', ')}`);
  await p.getByRole('button', { name: /Abandonner/ }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  const ta = Date.now();
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.locator('table.classes').waitFor({ timeout: 300000 });
  assert(true, `analyse Stockfish en ligne : ${((Date.now() - ta) / 1000).toFixed(1)} s`);

  // Revue façon Chess.com et leçon d'ouverture
  assert(await p.locator('table.classes').count() === 1 && await p.locator('.mv .ic').count() >= 10, 'revue : bilan par catégorie et icônes sur les coups');
  await p.goto(URL + '#/lesson/english');
  await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByText(/Mot nouveau — centre/).waitFor();
  assert(true, 'leçon Anglaise : 1er coup expliqué, « centre » défini');

  // Mats élémentaires en ligne : leçon (figurines) + exercice joué jusqu'au mat (mon camp : Stockfish via le plateau)
  await p.goto(URL + '#/mates/kq/lesson');
  for (let i = 0; i < 12; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByText(/Piège du pat : ♕c7/).first().waitFor();
  assert(true, 'leçon Dame : piège du pat affiché en figurines (♕c7)');
  await p.goto(URL); await p.goto(URL + '#/mates/kq/play');
  await p.getByText(/Coups : /).waitFor({ timeout: 60000 });
  const n0 = await p.evaluate(() => window.__db.mateRuns.count());
  for (let k = 0; k < 40 && (await p.evaluate(() => window.__db.mateRuns.count())) === n0; k++) {
    await p.getByText('À toi : mate le roi noir.').waitFor({ timeout: 30000 }).catch(() => {});
    if ((await p.evaluate(() => window.__db.mateRuns.count())) > n0) break;
    const fen0 = await p.locator('[data-start-fen]').getAttribute('data-start-fen');
    const shown = await p.locator('.moves').innerText();
    const c = new Chess(fen0);
    const FIG = { '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N' };
    if (!shown.includes('Aucun')) for (const t of shown.replace(/[♔♕♖♗♘]/g, (x) => FIG[x]).split(/\s+/)) { const mv = t.replace(/^\d+(\.|…)/, ''); if (mv) c.move(mv); }
    if (c.turn() !== 'w') { await p.waitForTimeout(150); continue; }
    const u = await p.evaluate((f) => window.__sfBest(f, 300), c.fen());
    await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap();
    await p.waitForTimeout(150);
  }
  const run = await p.evaluate(() => window.__db.mateRuns.toArray().then((a) => a[a.length - 1]));
  assert(run.outcome === 'mate', `exercice D+R en ligne : mat en ${run.myMoves} coups (minimum exact ${run.minMoves})`);
  const movesShown = await p.locator('.moves').innerText();
  assert(/[♔♕]/.test(movesShown) && !/[KQRBN][a-h]?x?[a-h][1-8]/.test(movesShown), 'liste des coups en figurines : ' + movesShown.slice(0, 60));

  // Hors ligne
  await ctx.setOffline(true);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor({ timeout: 20000 });
  assert(true, 'accueil rechargé hors ligne');
  await p.getByRole('button', { name: /^(Jouer|Reprendre)/ }).tap();
  const g0 = await waitPlies(0);
  if (g0.myColor === 'b') await waitPlies(1);
  await p.getByText('à toi de jouer').waitFor({ timeout: 60000 });
  const g1 = await cur();
  const c1 = new Chess(); g1.uci.forEach((u) => c1.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
  const m1 = c1.moves({ verbose: true })[0];
  await sq(m1.from).tap(); await sq(m1.to).tap();
  await waitPlies(g1.uci.length + 2);
  assert(true, 'Maia répond hors ligne');
  await p.getByRole('button', { name: /Abandonner/ }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.locator('table.classes').waitFor({ timeout: 120000 });
  assert(true, 'analyse Stockfish hors ligne');
  await p.goto(URL + '#/mates');
  await p.getByRole('heading', { name: /1\. Dame/ }).waitFor();
  await p.goto(URL + '#/mates/kq/play');
  await p.getByText(/Coups : /).waitFor({ timeout: 30000 });
  assert(true, 'exercice de mat prêt hors ligne (position précalculée)');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch(async (e) => { console.error(e); try { await globalThis.__page?.screenshot({ path: process.env.SHOT ?? '/tmp/public-fail.png' }); console.error('capture :', process.env.SHOT); } catch {} process.exit(1); });
