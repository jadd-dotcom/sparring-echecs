// Refonte visuelle : thème sombre par défaut, réglage Sombre / Clair / Auto (persistant), jeu de pièces,
// zones tactiles ≥ 48 px (boutons actifs) et aucun emoji affiché, sur iPhone portrait et iPad paysage.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
// Emojis (pictogrammes) : les figurines d'échecs ♔♕♖♗♘ de la notation sont autorisées.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{2653}\u{2660}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{23E9}-\u{23FF}\u{25B6}\u{25C0}\u{21B6}\u{21BB}]/u;

(async () => {
  const b = await chromium.launch();
  const errors = [];

  // 1. iPad, système en clair : l'appli reste en sombre par défaut ; Clair puis Auto
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1, colorScheme: 'light' });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  const theme = () => p.evaluate(() => document.documentElement.dataset.theme);
  const bg = () => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  assert(await theme() === 'dark' && await bg() === 'rgb(31, 32, 35)', `thème sombre par défaut (fond anthracite ${await bg()}), même si l’appareil est en clair`);
  const font = await p.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 16px Inter') && [...document.fonts].some((f) => f.family.includes('Inter') && f.status === 'loaded'); });
  assert(font, 'police Inter chargée (fichier local)');

  await p.goto(URL + '#/settings');
  await p.getByRole('radiogroup', { name: 'Thème' }).getByText('Clair').tap();
  assert(await theme() === 'light', 'Réglages → Clair : appliqué immédiatement');
  for (let i = 0; i < 50 && await p.evaluate(() => window.__db.meta.get('theme').then((m) => m?.value)) !== 'light'; i++) await p.waitForTimeout(50);
  await p.reload();
  await p.getByRole('heading', { name: 'Apparence' }).waitFor();
  assert(await theme() === 'light' && await p.evaluate(() => window.__db.meta.get('theme').then((m) => m.value)) === 'light', 'Clair conservé après rechargement');
  await p.getByRole('radiogroup', { name: 'Thème' }).getByText('Auto').tap();
  assert(await theme() === 'light', 'Auto : suit l’appareil (clair)');
  await p.emulateMedia({ colorScheme: 'dark' });
  await p.waitForTimeout(200);
  assert(await theme() === 'dark', 'Auto : bascule en sombre quand l’appareil passe en sombre');
  await p.getByRole('radiogroup', { name: 'Thème' }).getByText('Sombre').tap();

  // 2. Jeu de pièces
  const pieceSrc = () => p.locator('[data-square="e1"] img').first().getAttribute('src');
  await p.goto(URL + '#/mates/kq/lesson');
  await p.locator('[data-square="e1"], .piece-img').first().waitFor();
  const kingSquare = await p.evaluate(() => { const i = document.querySelector('.piece-img'); return i?.getAttribute('src'); });
  assert(/pieces\/relief\/[wb][KQRBNP]\.svg$/.test(kingSquare), 'pièces par défaut : Relief (' + kingSquare + ')');
  const names = await (async () => { await p.goto(URL + '#/settings'); return p.getByRole('radiogroup', { name: 'Pièces' }).locator('label').allInnerTexts(); })();
  assert(names.length === 3 && /Relief/.test(names[0]) && /Merida/.test(names[1]) && /Maestro/.test(names[2]) && !names.some((n) => /Celtic|Cburnett/.test(n)),
    'Réglages : 3 jeux, Relief, Merida, Maestro (' + names.map((n) => n.split('\n')[0]).join(', ') + ')');
  await p.goto(URL + '#/settings');
  await p.getByRole('radiogroup', { name: 'Pièces' }).getByText('Merida').tap();
  await p.goto(URL + '#/mates/kq/lesson');
  await p.locator('.piece-img').first().waitFor();
  const src2 = await p.evaluate(() => document.querySelector('.piece-img').getAttribute('src'));
  assert(/pieces\/merida\//.test(src2), 'Réglages → Merida : pièces changées (' + src2 + ')');
  const ok = await p.evaluate(async (u) => (await fetch(u)).ok, src2);
  assert(ok, 'fichier de pièce servi par l’appli');
  void pieceSrc;
  await p.screenshot({ path: OUT + '/a-1-merida.png' });
  await p.goto(URL + '#/settings');
  await p.getByRole('radiogroup', { name: 'Pièces' }).getByText('Maestro').tap();
  await p.goto(URL + '#/mates/kq/lesson');
  await p.locator('.piece-img').first().waitFor();
  const src3 = await p.evaluate(() => document.querySelector('.piece-img').getAttribute('src'));
  assert(/pieces\/maestro\//.test(src3) && await p.evaluate(async (u) => (await fetch(u)).ok, src3), 'Réglages → Maestro : pièces changées et servies (' + src3 + ')');
  // Ancien réglage « celtic » : on retombe sur Relief.
  await p.evaluate(() => window.__db.meta.put({ key: 'pieces', value: 'celtic' }));
  await p.reload();
  await p.goto(URL + '#/mates/kq/lesson');
  await p.locator('.piece-img').first().waitFor();
  assert(/pieces\/relief\//.test(await p.evaluate(() => document.querySelector('.piece-img').getAttribute('src'))), 'ancien réglage Celtic → Relief');
  await ctx.close();

  // 3. Zones tactiles ≥ 48 px et aucun emoji, sur les écrans principaux (iPhone et iPad)
  for (const [dname, dev] of [['iPhone', devices['iPhone 13']], ['iPad', devices['iPad (gen 7) landscape']]]) {
    const c2 = await b.newContext({ ...dev, deviceScaleFactor: 1 });
    const q = await c2.newPage();
    q.on('pageerror', (e) => errors.push(e.message));
    await q.goto(URL);
    await q.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
    const id = await q.evaluate(() => window.__db.games.add({
      source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
      ratingBefore: 900, ratingAfter: 870, botElo: 950,
    }));
    const screens = ['', '#/openings', '#/settings', '#/stats', '#/report', '#/mates', '#/lesson/english', '#/board', '#/board/lesson/1', '#/board/ex/1a/practice', '#/board/warmup', `#/review/${id}`];
    for (const h of screens) {
      await q.goto(URL + '#/stats'); await q.goto(URL + h);
      await q.waitForTimeout(h.startsWith('#/review') ? 0 : 800);
      if (h.startsWith('#/review')) await q.locator('table.classes').waitFor({ timeout: 180000 });
      const small = await q.evaluate(() => [...document.querySelectorAll('button, .button, input:not([type=radio]):not([type=checkbox]), select, summary, label.radio')]
        .filter((el) => { const r = el.getBoundingClientRect(); return !el.disabled && r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; })
        .map((el) => ({ t: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) }))
        .filter((x) => x.h < 48 || x.w < 44));
      assert(small.length === 0, `${dname} ${h || 'accueil'} : zones tactiles ≥ 48 px ${small.length ? JSON.stringify(small.slice(0, 5)) : ''}`);
      const text = await q.evaluate(() => document.body.innerText);
      const found = text.match(new RegExp(EMOJI.source, 'gu'));
      assert(!found, `${dname} ${h || 'accueil'} : aucun emoji affiché ${found ? found.join(' ') : ''}`);
    }
    await c2.close();
  }
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
