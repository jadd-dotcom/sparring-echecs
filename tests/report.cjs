// V1.5 — 3 parties de test (moi = Maia 600 joué au toucher), analyse, « ce que je pensais »,
// révisions ratées, 2 parties Chess.com (PGN enregistrés), puis génération du rapport → docs/exemple-rapport.md
const { gameEnded, reviewAfterGame } = require('./lib.cjs');
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const fs = require('fs');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const DEST = process.argv[4] || 'docs/exemple-rapport.md';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const THOUGHTS = [
  'Je voulais attaquer vite, je n’ai pas regardé ce que sa pièce menaçait.',
  'Je pensais que ma pièce était protégée.',
  'Je cherchais à échanger les dames pour simplifier.',
];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1, acceptDownloads: true });
  // Pseudo Chess.com enregistré plus bas (PGN collé) : l'import automatique ne doit rien demander au vrai site.
  await ctx.route('https://api.chess.com/**', (r) => r.abort());
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const PROMO = { q: /Dame/, r: /Tour/, b: /Fou/, n: /Cavalier/ };
  let thoughtIdx = 0;

  await p.goto(URL);
  for (let n = 0; n < 3; n++) {
    await p.goto(URL);
    await p.getByRole('button', { name: /^(Jouer|Reprendre)/ }).tap();
    await p.waitForSelector('[data-square="e2"]');
    let myMoves = 0;
    for (;;) {
      // attendre : mon tour, ou fin de partie
      const end = Date.now() + 60000;
      let g;
      for (;;) {
        g = await cur();
        if (!g) break;
        const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
        if (c.turn() === g.myColor && await p.getByText('à toi de jouer').isVisible()) break;
        if (Date.now() > end) throw new Error('attente trop longue');
        await p.waitForTimeout(120);
      }
      if (!g) break; // partie terminée (mat, nulle…)
      if (myMoves >= 45) { // partie trop longue : abandon
        await p.getByRole('button', { name: /Abandonner/ }).tap();
        await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
        break;
      }
      const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
      if (c.isGameOver()) break; // partie finie (mat, pat) : l'écran de fin arrive
      const u = await p.evaluate(([f, h, r]) => window.__maiaPick(f, h, 600, r), [c.fen(), g.uci, g.botElo]);
      await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap();
      if (u.length === 5) await p.getByRole('button', { name: PROMO[u[4]] }).tap();
      myMoves++;
      const n0 = g.uci.length;
      const end2 = Date.now() + 30000;
      for (;;) { const g2 = await cur(); if (!g2 || g2.uci.length > n0) break; if (Date.now() > end2) throw new Error('coup non joué ' + u); await p.waitForTimeout(80); }
    }
    await gameEnded(p);
    const last = await p.evaluate(() => window.__db.games.toArray().then((a) => a[a.length - 1]));
    console.log(`   partie ${n + 1} : ${last.myColor === 'w' ? 'Blancs' : 'Noirs'}, ${last.result} (${last.termination}), ${last.uci.length} demi-coups`);
    const t0 = Date.now();
    await reviewAfterGame(p);
    await p.locator('table.classes').waitFor({ timeout: 600000 });
    const ga = await p.evaluate((id) => window.__db.games.get(id), last.id);
    const errs = ga.analysis.filter((a) => a.severity === 'mistake' || a.severity === 'blunder');
    assert(errs.every((a) => a.detail && a.detail.motif), `partie ${n + 1} analysée en ${((Date.now() - t0) / 1000).toFixed(0)} s : ${errs.length} erreurs/gaffes, motifs ${errs.map((a) => a.detail.motif).join(', ')}`);
    // « Ce que je pensais » sur la 1re erreur/gaffe
    if (errs.length) {
      await p.locator('.mv').nth(errs[0].ply).tap();
      // « Ce que je pensais » en un toucher (avant de voir le meilleur coup), puis le texte libre.
      await p.getByTestId('thought-tags').getByRole('button').nth(thoughtIdx % 5).tap();
      await p.getByTestId('thought-tags').locator('button.on').waitFor();
      const box = p.getByPlaceholder(/Je voulais attaquer le roi/);
      await box.tap();
      await box.fill(THOUGHTS[thoughtIdx++ % THOUGHTS.length]);
      await box.blur();
      await p.getByText('enregistré', { exact: true }).waitFor();
      if (n === 0) await p.screenshot({ path: OUT + '/r-1-pensee.png' });
    }
  }
  const saved = await p.evaluate(() => window.__db.games.toArray().then((a) => a.filter((g) => g.thoughts && Object.keys(g.thoughts).length).length));
  assert(saved >= 1, `« ce que je pensais » enregistré dans ${saved} partie(s)`);

  // Révision : une carte d'erreur ratée 2 fois, une réussie
  const mistakeCards = await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'drill').toArray());
  if (mistakeCards.length) {
    const card = mistakeCards[0];
    const wrong = card.playedUci;
    for (let k = 0; k < 2; k++) {
      await p.evaluate((id) => window.__db.cards.update(id, { due: '2000-01-01' }), card.id);
      await p.goto(URL); await p.goto(URL + '#/revise');
      await p.getByTestId('instruction').waitFor();
      await sq(wrong.slice(0, 2)).tap(); await sq(wrong.slice(2, 4)).tap();
      if (wrong.length === 5) await p.getByRole('button', { name: PROMO[wrong[4]] }).tap();
      await p.getByTestId('try-msg').waitFor({ timeout: 30000 });
    }
    if (mistakeCards[1]) {
      const c2 = mistakeCards[1];
      await p.evaluate((id) => window.__db.cards.update(id, { due: '2000-01-01' }), c2.id);
      await p.goto(URL); await p.goto(URL + '#/revise');
      await p.getByTestId('instruction').waitFor();
      await sq(c2.bestUci.slice(0, 2)).tap(); await sq(c2.bestUci.slice(2, 4)).tap();
      if (c2.bestUci.length === 5) await p.getByRole('button', { name: PROMO[c2.bestUci[4]] }).tap();
      await p.getByText(/Bien joué/).waitFor({ timeout: 30000 });
    }
    const after = await p.evaluate((id) => window.__db.cards.get(id), card.id);
    assert(after.attempts.filter((t) => !t.ok).length === 2, 'révisions faites : 1 carte ratée 2 fois');
  }

  // 2 parties Chess.com (réponses enregistrées, collées en PGN : aucun réseau) : une défaite avec les Blancs, une victoire avec les Noirs
  const FX = require('./fixtures/chesscom/games-2026-11.json').games;
  const pgns = ['https://www.chess.com/game/live/186577292142', 'https://www.chess.com/game/live/187493069154'].map((u) => FX.find((g) => g.url === u).pgn);
  await p.goto(URL + '#/settings');
  await p.getByLabel('Mon pseudo Chess.com').fill('lightning_light');
  await p.getByText('Plan B : coller un PGN').tap();
  await p.getByLabel('PGN à importer').fill(pgns.join('\n\n'));
  await p.getByRole('button', { name: 'Importer ce PGN' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /2 parties importées/ }).waitFor();
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap().catch(() => {});
  assert(true, '2 parties Chess.com importées (PGN collé)');

  // Rapport
  await p.goto(URL);
  await p.getByRole('button', { name: 'Rapport pour Claude' }).tap();
  await p.getByText(/Depuis le début/).tap();
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 300000 });
  await p.screenshot({ path: OUT + '/r-2-rapport.png' });
  const [dl] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Télécharger .md' }).tap()]);
  const md = fs.readFileSync(await dl.path(), 'utf8');
  fs.writeFileSync(DEST, md);
  for (const h of ['## 1. Résumé de la période', '### Par source', '### Par ouverture', '### Par phase', '### Motifs des erreurs et gaffes', '## 2. Mes coups les plus coûteux', '## 3. Mes parties', '## 4. Positions du paquet ratées']) assert(md.includes(h), 'section « ' + h + ' »');
  assert(/\| Chess.com \| 2 \|/.test(md) && /Resté dans mon répertoire jusqu’au coup 8 : \d+ \/ \d+ parties/.test(md), 'parties Chess.com et suivi du répertoire dans le rapport');
  assert(/\[Event "Chess.com — partie n°\d+"\]/.test(md), 'PGN annoté d’une partie Chess.com');
  assert(/Ce que je pensais : J[^\n]*« /.test(md) || /Ce que je pensais : Je ne sais pas — « /.test(md), '« ce que je pensais » (réponse + texte) présent dans le rapport');
  const tagged = await p.evaluate(() => window.__db.games.toArray().then((a) => a.reduce((n, g) => n + Object.keys(g.thoughtTags ?? {}).length, 0)));
  const tot = md.match(/\| \*\*Total\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/);
  assert(md.includes('### Ce que je pensais (réponse en un toucher), par motif') && tot && tot.slice(1, 6).reduce((x, y) => x + +y, 0) <= tagged && tot.slice(1, 6).reduce((x, y) => x + +y, 0) >= 1,
    `réponses en un toucher comptées par motif (${tot ? tot.slice(1, 6).join('/') : '?'} ; ${tagged} au total)`);
  assert(md.includes('#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)'), 'sorties adverses du répertoire listées');
  assert((md.match(/```pgn/g) ?? []).length === 5, '« Mes parties » : 5 PGN annotés (défaites, puis nulles, puis victoires)');
  const last = await p.evaluate(() => window.__db.meta.get('lastReportAt').then((m) => m?.value));
  assert(typeof last === 'number', 'date du dernier rapport mémorisée');
  await p.goto(URL); await p.goto(URL + '#/report');
  await p.getByText(/Depuis le dernier rapport .* · 0 partie/).waitFor();
  assert(true, 'période par défaut : depuis le dernier rapport (0 partie)');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  console.log(`rapport écrit dans ${DEST} (${md.length} caractères)`);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
