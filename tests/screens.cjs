// Captures pour docs/design/ : accueil, partie, revue, Mats ; iPhone portrait et iPad paysage ; thème sombre et clair.
// Usage : node tests/screens.cjs <dossier-sortie> [url]
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const fs = require('fs');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const DEVICES = { iphone: devices['iPhone 13'], ipad: devices['iPad (gen 7) landscape'] };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [dname, dev] of Object.entries(DEVICES)) {
    for (const theme of ['dark', 'light']) {
      const ctx = await b.newContext({ ...dev, deviceScaleFactor: 2, colorScheme: theme });
      const p = await ctx.newPage();
      const shot = async (name) => { await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}/${name}-${dname}-${theme}.jpg`, type: 'jpeg', quality: 82 }); };
      await p.goto(URL);
      await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
      // Réglage de thème (s'il existe) : on suit le thème demandé.
      await p.evaluate((t) => window.__db.meta.put({ key: 'theme', value: t }), theme);
      await p.goto(URL + '#/stats'); await p.goto(URL);
      await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
      await shot('accueil');
      // Partie : 3 coups (mon camp joué par Stockfish)
      await p.getByRole('button', { name: /^(Jouer|Reprendre)/ }).tap();
      const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
      for (let k = 0; k < 3; k++) {
        await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
        const g = await cur(); const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
        const u = await p.evaluate((f) => window.__sfBest(f, 100), c.fen());
        await p.locator(`[data-square="${u.slice(0, 2)}"]`).tap(); await p.locator(`[data-square="${u.slice(2, 4)}"]`).tap();
        for (let i = 0; i < 100 && ((await cur())?.uci.length ?? 99) < g.uci.length + 2; i++) await p.waitForTimeout(100);
      }
      await p.getByText('à toi de jouer').waitFor({ timeout: 60000 });
      await shot('partie');
      // Revue d'une partie connue (1.e4 d5 2.Qg4?? Bxg4)
      const id = await p.evaluate(() => window.__db.games.add({
        source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
        ratingBefore: 900, ratingAfter: 870, botElo: 950,
      }));
      await p.goto(URL + '#/review/' + id);
      await p.locator('table.classes').waitFor({ timeout: 180000 });
      await p.locator('.moves .mv').nth(2).tap();
      await shot('revue');
      // Mats : exercice D+R
      await p.goto(URL + '#/stats'); await p.goto(URL + '#/mates/kq/play');
      await p.getByText(/Coups : /).waitFor({ timeout: 60000 });
      await shot('mats');
      await ctx.close();
      console.log(`${dname} ${theme} : 4 captures`);
    }
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
