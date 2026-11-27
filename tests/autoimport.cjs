// Import Chess.com automatique (iPad émulé, réponses de l'API ENREGISTRÉES : aucune requête vers Chess.com) :
// à l'ouverture, avec Internet et un pseudo enregistré → import sans toucher de bouton, message discret,
// analyse en arrière-plan ; pas de nouvel import dans les 2 minutes ; rien hors ligne ni sans pseudo.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const FX = path.join(__dirname, 'fixtures/chesscom');
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const calls = [];
  await ctx.route('https://api.chess.com/**', async (route) => {
    const u = route.request().url();
    calls.push(u.replace('https://api.chess.com/pub/player/', ''));
    const file = u.endsWith('/games/archives') ? 'archives.json' : u.match(/games\/(\d{4})\/(\d{2})$/) ? `games-${RegExp.$1}-${RegExp.$2}.json` : null;
    if (!file) return route.fulfill({ status: 404, body: '{}' });
    route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(path.join(FX, file), 'utf8') });
  });
  const ccCount = () => p.evaluate(() => window.__db.games.where('source').equals('chesscom').count());

  // Sans pseudo : rien.
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForTimeout(1500);
  assert(calls.length === 0 && await p.getByTestId('auto-import').count() === 0, 'sans pseudo : aucune requête, aucun message');

  // Pseudo enregistré, hors ligne : rien.
  await p.evaluate(() => window.__db.meta.put({ key: 'chesscomUser', value: 'lightning_light' }));
  await p.addInitScript(() => { if (sessionStorage.getItem('fakeOffline')) Object.defineProperty(Navigator.prototype, 'onLine', { get: () => false }); });
  await p.evaluate(() => sessionStorage.setItem('fakeOffline', '1'));
  await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForTimeout(1500);
  assert(calls.length === 0, 'hors ligne : aucun import');

  // Avec Internet : import automatique à l'ouverture, sans bouton.
  await p.evaluate(() => sessionStorage.removeItem('fakeOffline'));
  await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  const toast = p.getByTestId('auto-import');
  await toast.waitFor({ timeout: 60000 });
  const n = await ccCount();
  const text = await toast.innerText();
  assert(n > 150 && text === `${n} nouvelles parties importées`, `message discret : « ${text} »`);
  assert(calls.length === 3 && calls[0].endsWith('/games/archives'), `3 requêtes, une à une : ${calls.join(', ')}`);
  await p.screenshot({ path: OUT + '/ai-1-message.png' });
  // Analyse en arrière-plan, comme après l'import manuel (parties depuis le 16/11/2026, les plus récentes d'abord).
  const since = await p.evaluate(() => new Date(2026, 10, 16).getTime());
  for (let i = 0; i < 600; i++) {
    if (await p.evaluate(() => window.__db.games.where('source').equals('chesscom').filter((g) => !!g.analysis).count())) break;
    await p.waitForTimeout(500);
  }
  const analysed = await p.evaluate(() => window.__db.games.where('source').equals('chesscom').filter((g) => !!g.analysis).toArray());
  assert(analysed.length >= 1 && analysed.every((g) => g.date >= since), `analyse en arrière-plan : ${analysed.length} partie(s), toutes depuis le 16/11`);
  await p.waitForTimeout(9000);
  assert(await toast.count() === 0, 'le message disparaît tout seul');

  // Réglages : l'analyse en cours est visible et peut être arrêtée.
  await p.goto(URL + '#/settings');
  await p.getByTestId('cc-analysing').waitFor({ timeout: 30000 });
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /analysée/ }).waitFor({ timeout: 300000 });
  assert(true, 'Réglages : analyse de l’import automatique visible et arrêtable');

  // Réouverture dans les 2 minutes : pas de nouvelle requête.
  calls.length = 0;
  await p.reload();
  await p.getByRole('heading', { name: /Sparring Échecs|Réglages/ }).first().waitFor();
  await p.waitForTimeout(2000);
  assert(calls.length === 0, 'réouverture dans les 2 minutes : aucune requête');
  // Plus tard : seulement le mois en cours est redemandé, et rien de nouveau → pas de message.
  await p.evaluate(() => window.__db.meta.put({ key: 'chesscomAutoAt', value: Date.now() - 3600e3 }));
  await p.goto(URL); await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  for (let i = 0; i < 40 && calls.length < 2; i++) await p.waitForTimeout(250);
  await p.waitForTimeout(1500);
  assert(calls.length === 2 && !calls.some((c) => c.endsWith('2026/10')), `réouverture plus tard : ${calls.join(', ')} (mois passé non redemandé)`);
  assert(await p.getByTestId('auto-import').count() === 0 && await ccCount() === n, 'aucune nouvelle partie : aucun message, aucun doublon');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
