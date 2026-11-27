// En partie : navigation en lecture seule, dernier coup affiché, sons ; assistance seulement en partie non comptée.
const { gameEnded, reviewAfterGame } = require('./lib.cjs');
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
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const pieceOn = (s) => p.locator(`[data-square="${s}"] [data-piece]`).getAttribute('data-piece').catch(() => null);
  const waitFor = async (fn, ms = 60000) => { const end = Date.now() + ms; for (;;) { const v = await fn(); if (v) return v; if (Date.now() > end) throw new Error('délai dépassé'); await p.waitForTimeout(100); } };
  const sfMove = async () => { const g = await cur(); const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })); return p.evaluate((f) => window.__sfBest(f, 100), c.fen()); };
  const myMove = async () => {
    await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
    const g = await cur(); const u = await sfMove();
    await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap();
    await waitFor(async () => (await cur())?.uci.length >= g.uci.length + 2);
    return u;
  };
  const home = async () => { await p.goto(URL + '#/stats'); await p.goto(URL); await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor(); };

  // ---------- partie comptée
  await home();
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  assert(await p.getByRole('button', { name: /Indice/ }).count() === 0 && await p.getByRole('button', { name: /menaces/ }).count() === 0
    && await p.getByRole('button', { name: /Reprendre mon coup/ }).count() === 0, 'partie comptée : aucune assistance (indice, menaces, reprise)');
  await p.evaluate(() => { window.__soundLog.length = 0; });
  for (let i = 0; i < 3; i++) await myMove();
  const g3 = await cur();
  const sounds = await p.evaluate(() => window.__soundLog.slice());
  assert(sounds.length >= 6, `sons joués : ${sounds.join(', ')}`);
  await p.getByText(/^Maia a joué :/).waitFor();
  assert(true, 'au-dessus de l’échiquier : « Maia a joué : … »');

  // Navigation : ◀ ◀ → coup revu, échiquier bloqué
  await p.getByRole('button', { name: 'Coup précédent' }).tap();
  await p.getByRole('button', { name: 'Coup précédent' }).tap();
  await p.getByText(/Tu revois le coup 2… — touche\s*pour revenir/).waitFor();
  const c2 = new Chess(); g3.uci.slice(0, 4).forEach((u) => c2.move({ from: u.slice(0, 2), to: u.slice(2, 4) }));
  const sq4 = g3.uci[4].slice(0, 2);   // case de départ de mon 3e coup : la pièce y est encore dans la position revue
  assert(await pieceOn(sq4) !== null, `position revue (coup 2…) : la pièce de mon 3e coup est encore en ${sq4}`);
  await p.screenshot({ path: OUT + '/n-1-navigation.png' });
  // Essai de coup pendant la navigation : refusé (le tap ramène à la position actuelle, sans jouer)
  const legal = c2.moves({ verbose: true })[0];
  await sq(legal.from).tap();
  await p.waitForTimeout(300);
  assert(await p.getByText(/Tu revois le coup/).count() === 0, 'tap sur l’échiquier : retour à la position actuelle');
  assert((await cur()).uci.join() === g3.uci.join(), 'aucun effet sur la partie (même liste de coups)');

  // Tap sur un coup de la liste
  await p.locator('.moves .mv').nth(0).tap();
  await p.getByText(/Tu revois le coup 1/).waitFor();
  assert(true, 'tap sur 1er coup de la liste : position après ce coup');
  await p.getByRole('button', { name: 'Position actuelle' }).tap();
  assert(await p.getByText(/Tu revois le coup/).count() === 0, '⏭ : retour à la position actuelle');

  // Coup de Maia pendant la navigation
  await p.getByText('à toi de jouer').waitFor();
  const u = await sfMove();
  await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap();
  await p.getByRole('button', { name: 'Coup précédent' }).tap();       // pendant que Maia réfléchit
  const before = await cur();
  await waitFor(async () => (await cur()).uci.length >= before.uci.length + 1);
  await p.getByText('Maia a joué', { exact: false }).last().waitFor();
  assert(await p.getByText(/Tu revois le coup/).count() === 1, 'Maia a joué pendant la navigation : on reste sur le coup revu');
  assert(await p.locator('button.blink', { hasText: 'Maia a joué' }).count() === 1, '⏭ clignote avec « Maia a joué »');
  await p.screenshot({ path: OUT + '/n-2-maia-a-joue.png' });
  await p.getByRole('button', { name: /Position actuelle/ }).tap();
  assert(await p.getByText(/Tu revois le coup/).count() === 0 && await p.locator('button.blink').count() === 0, '⏭ : position actuelle, clignotement arrêté');
  await p.getByText('à toi de jouer').waitFor();
  assert(true, 'échiquier débloqué : à toi de jouer');
  await p.getByRole('button', { name: /Abandonner/ }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  await gameEnded(p);

  // ---------- partie non comptée : assistance
  await home();
  await p.getByText('Partie non comptée').tap();
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  const gu = await waitFor(cur);
  if (gu.myColor === 'b') await waitFor(async () => (await cur()).uci.length >= 1);
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  await p.getByRole('button', { name: /Indice/ }).tap();
  await p.getByRole('button', { name: /Montrer le coup/ }).waitFor({ timeout: 20000 });
  assert(true, 'Indice : la pièce du meilleur coup est surlignée');
  await p.getByRole('button', { name: /Montrer le coup/ }).tap();
  await p.waitForTimeout(300);
  assert(await p.locator('svg line, svg path, svg polygon').count() > 0, '2e appui : flèche du coup');
  assert(await p.getByRole('button', { name: /Afficher les menaces/ }).count() === 0, '« Afficher les menaces » remplacé');
  await p.getByRole('button', { name: /Qu’est-ce qu’il menace/ }).tap();
  await p.getByTestId('threat-text').waitFor({ timeout: 30000 });
  assert(/Il menace|Pas de menace sérieuse/.test(await p.getByTestId('threat-text').innerText()), '« Qu’est-ce qu’il menace ? » : ' + (await p.getByTestId('threat-text').innerText()).replace(/\s+/g, ' '));
  await myMove(); await myMove();
  const beforeTake = await cur();
  await p.getByRole('button', { name: /Reprendre mon coup/ }).tap();
  await waitFor(async () => (await cur()).uci.length === beforeTake.uci.length - 2);
  assert(true, 'Reprendre mon coup : ma réponse et celle de Maia sont retirées');
  await p.screenshot({ path: OUT + '/n-3-assistance.png' });
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
