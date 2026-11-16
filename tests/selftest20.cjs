// 20 parties Maia contre un joueur aléatoire, dans le navigateur, jusqu'au bout.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4173/sparring-echecs/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(URL);
  await p.waitForFunction(() => typeof window.__selftest === 'function');
  const t0 = Date.now();
  const r = await p.evaluate(() => window.__selftest(20, 900));
  r.pageErrors = errors;
  r.wallSeconds = (Date.now() - t0) / 1000;
  console.log(JSON.stringify(r, null, 1));
  await b.close();
  process.exit(r.crashes === 0 && r.illegal === 0 && r.games === 20 && errors.length === 0 ? 0 : 1);
})();
