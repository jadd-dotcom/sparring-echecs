// Captures des 3 jeux de pièces pour docs/design/pieces/ : une position de milieu de partie (toutes les sortes de
// pièces, des deux couleurs) sur iPad paysage et iPhone, thèmes sombre et clair, + le choix dans Réglages → Apparence.
// Usage : node tests/pieces-shots.cjs <dossier-sortie> [url]
const { chromium, devices } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const SETS = ['relief', 'merida', 'maestro'];
// Partie italienne courte : position après 8 coups (dames, tours, fous, cavaliers, pions, rois roqués).
const UCI = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3', 'g8f6', 'd2d3', 'd7d6', 'e1g1', 'e8g8', 'b1d2', 'a7a6', 'a2a4', 'c8e6'];
const SAN = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Nbd2', 'a6', 'a4', 'Be6'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [dname, dev] of [['ipad', devices['iPad (gen 7) landscape']], ['iphone', devices['iPhone 13']]]) {
    for (const theme of ['dark', 'light']) {
      const ctx = await b.newContext({ ...dev, deviceScaleFactor: 2 });
      const p = await ctx.newPage();
      await p.goto(URL);
      await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
      await p.evaluate((t) => window.__db.meta.put({ key: 'theme', value: t }), theme);
      const id = await p.evaluate(([uci, san]) => window.__db.games.add({
        source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        uci, san, result: '1/2-1/2', score: 0.5, termination: 'Nulle', ratingBefore: 900, ratingAfter: 900, botElo: 950,
      }), [UCI, SAN]);
      for (const set of SETS) {
        await p.evaluate((s) => window.__db.meta.put({ key: 'pieces', value: s }), set);
        await p.goto(URL + '#/stats'); await p.reload();
        await p.getByRole('heading', { name: /Mon niveau/ }).waitFor();
        await p.goto(URL + '#/review/' + id);
        await p.locator('table.classes').waitFor({ timeout: 180000 });
        await p.waitForFunction((s) => [...document.querySelectorAll('img.piece-img')].every((i) => i.src.includes(`/pieces/${s}/`) && i.complete), set);
        await p.locator('.moves .mv').last().tap();   // position après 8 coups
        await p.evaluate(() => window.scrollTo(0, 0));
        await p.waitForTimeout(500);
        const box = await p.locator('.board-wrap').first().boundingBox();
        await p.screenshot({ path: `${OUT}/${set}-${dname}-${theme}.jpg`, type: 'jpeg', quality: 85, clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 } });
      }
      if (dname === 'ipad') {
        await p.evaluate(() => window.__db.meta.put({ key: 'pieces', value: 'relief' }));   // jeu par défaut sélectionné
        await p.reload();
        await p.goto(URL + '#/settings');
        const g = p.getByRole('radiogroup', { name: 'Pièces' });
        await g.scrollIntoViewIfNeeded();
        await p.waitForTimeout(400);
        await g.screenshot({ path: `${OUT}/reglages-${theme}.jpg`, type: 'jpeg', quality: 85 });
      }
      await ctx.close();
      console.log(`${dname} ${theme} : ${SETS.length} jeux`);
    }
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
