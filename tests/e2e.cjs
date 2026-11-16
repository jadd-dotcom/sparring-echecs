// Parcours tactile complet sur tablette : jouer (tap), abandon, analyse, revue, révision, stats, export.
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
  await p.goto(URL);
  await p.getByRole('button', { name: /^Jouer \(Blancs\)/ }).tap();
  await p.waitForSelector('[data-square="e2"]');
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const waitPlies = async (n, timeout = 30000) => {
    const end = Date.now() + timeout;
    for (;;) { const g = await cur(); if (!g || g.uci.length >= n) return g; if (Date.now() > end) throw new Error('timeout plies ' + n); await p.waitForTimeout(100); }
  };

  // 1er coup par tap-tap
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  await sq('e2').tap(); await sq('e4').tap();
  await waitPlies(2);
  assert((await cur()).uci[0] === 'e2e4', 'coup e2e4 joué au toucher, Maia a répondu');

  // Tap sur une case illégale : rien ne doit se passer
  await sq('a2').tap(); await sq('a6').tap();
  await p.waitForTimeout(400);
  { const u = (await cur()).uci; assert(u.length === 2, 'coup illégal refusé ' + u.join(',')); }
  await sq('a2').tap(); // désélection

  // Glisser-déposer pour le 2e coup (souris)
  {
    const c = new Chess(); for (const u of (await cur()).uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    const m = c.moves({ verbose: true }).find((x) => x.piece === 'n') ?? c.moves({ verbose: true })[0];
    const a = await sq(m.from).boundingBox(), z = await sq(m.to).boundingBox();
    await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await p.mouse.down();
    await p.mouse.move(a.x + a.width / 2 + 5, a.y + a.height / 2 + 5, { steps: 3 });
    await p.mouse.move(z.x + z.width / 2, z.y + z.height / 2, { steps: 12 });
    await p.mouse.up();
    await waitPlies(4);
    assert(true, `coup ${m.san} joué par glisser-déposer`);
  }

  // 10 coups aléatoires par tap (crée des erreurs à analyser)
  for (let i = 0; i < 4; i++) {
    const g = await cur(); if (!g) break;
    const c = new Chess(); for (const u of g.uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    if (c.isGameOver()) break;
    const ms = c.moves({ verbose: true }).filter((x) => !x.promotion);
    const m = ms[Math.floor(Math.random() * ms.length)];
    await sq(m.from).tap(); await sq(m.to).tap();
    const n = g.uci.length + 2;
    await waitPlies(n);
  }
  await p.screenshot({ path: OUT + '/1-partie.png' });

  // Nulle proposée trop tôt → refusée
  if (await cur()) {
    await p.getByRole('button', { name: /Proposer nulle/ }).tap();
    await p.getByText(/Maia refuse/).waitFor();
    assert(true, 'nulle refusée avant le 10e coup');
  }
  // Abandon
  if (await cur()) {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.getByRole('dialog').or(p.locator('.modal-box')).first().getByRole('button', { name: 'Abandonner' }).tap();
  }
  await p.getByRole('button', { name: 'Analyser mes coups' }).waitFor();
  await p.screenshot({ path: OUT + '/2-fin.png' });
  const prof = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m.value));
  assert(prof.gamesPlayed === 1 && prof.nextColor === 'b', `profil mis à jour (niveau ${prof.rating.toFixed(1)}, prochaine couleur Noirs)`);

  // Analyse
  const t0 = Date.now();
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.getByText(/Analyse de la partie/).waitFor();
  await p.screenshot({ path: OUT + '/3-analyse.png' });
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  const g = await p.evaluate(() => window.__db.games.toArray().then((a) => a[0]));
  assert(g.analysis.length === Math.ceil(g.uci.length / 2), `analyse de ${g.analysis.length} coups en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  console.log('   classement :', JSON.stringify(g.counts), g.analysis.map((a) => `${a.san}:${a.drop.toFixed(0)}`).join(' '));
  const nCards = await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'drill').count());
  assert(nCards === g.counts.mistake + g.counts.blunder, `${nCards} carte(s) créée(s) = erreurs + gaffes`);
  const errBtn = p.getByRole('button', { name: 'Erreur suivante' });
  await errBtn.tap();
  await p.waitForTimeout(400);
  await p.screenshot({ path: OUT + '/4-revue.png' });

  // Révision : on force l'échéance à aujourd'hui
  if (nCards > 0) {
    await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'drill').modify({ due: '2000-01-01' }));
    await p.goto(URL);
    await p.getByText(/positions? à revoir aujourd’hui/).waitFor();
    await p.screenshot({ path: OUT + '/5-accueil.png' });
    await p.getByText(/positions? à revoir aujourd’hui/).tap();
    const card = await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'drill').toArray().then((a) => a.sort((x, y) => x.due < y.due ? -1 : 1)[0]));
    await sq(card.bestUci.slice(0, 2)).tap(); await sq(card.bestUci.slice(2, 4)).tap();
    if (card.bestUci.length === 5) await p.getByRole('button', { name: /Dame/ }).tap();
    await p.getByText(/Juste !/).waitFor({ timeout: 20000 });
    await p.screenshot({ path: OUT + '/6-revision.png' });
    const after = await p.evaluate((id) => window.__db.cards.get(id), card.id);
    assert(after.step === 1 && after.attempts.length === 1, `carte réussie → prochaine échéance ${after.due} (J+3)`);
  }

  // Stats
  await p.goto(URL + '#/stats');
  await p.locator('svg.chart').first().waitFor();
  await p.screenshot({ path: OUT + '/7-stats.png', fullPage: true });

  // Export
  await p.goto(URL + '#/settings');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: /Exporter/ }).tap()]);
  const json = JSON.parse(require('fs').readFileSync(await dl.path(), 'utf8'));
  assert(json.games.length === 1 && json.cards.filter((c) => c.kind !== 'drill').length === nCards && json.openings.length === 3, 'export JSON complet (parties, cartes, ouvertures)');

  // Portrait
  await p.setViewportSize({ width: 768, height: 1024 });
  await p.goto(URL + '#/play');
  await p.locator('[data-square="e2"]').waitFor();
  await p.waitForTimeout(1500);
  await p.screenshot({ path: OUT + '/8-portrait.png' });

  assert(errors.length === 0, 'aucune erreur JS (' + errors.join(' | ') + ')');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
