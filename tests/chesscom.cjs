// Import Chess.com sur iPad émulé, avec les réponses de l'API ENREGISTRÉES (tests/fixtures/chesscom) :
// aucune requête ne part vers Chess.com (page.route intercepte tout et compte les appels).
// Pseudo → import → analyse (arrêtée après la 1re partie) → revue (source, répertoire) → statistiques →
// 2e import (rien de nouveau, mois passés non redemandés) → plan B (PGN collé) → niveau Maia inchangé.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const FX = path.join(__dirname, 'fixtures/chesscom');
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  // Service worker bloqué : toutes les requêtes passent par page.route (aucune vers le vrai Chess.com).
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1, serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const calls = [];
  await ctx.route('https://api.chess.com/**', async (route) => {
    const u = route.request().url();
    calls.push(u.replace('https://api.chess.com/pub/player/', ''));
    const file = u.endsWith('/games/archives') ? 'archives.json'
      : u.match(/games\/(\d{4})\/(\d{2})$/) ? `games-${RegExp.$1}-${RegExp.$2}.json` : null;
    if (!file || !u.includes('/player/lightning_light/')) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"code":0,"message":"not found"}' });
    route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(path.join(FX, file), 'utf8') });
  });
  const waitFor = async (fn, ms = 120000) => { const end = Date.now() + ms; for (;;) { const v = await fn(); if (v) return v; if (Date.now() > end) throw new Error('délai dépassé'); await p.waitForTimeout(200); } };
  const prof = () => p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? null));
  const ccGames = () => p.evaluate(() => window.__db.games.where('source').equals('chesscom').toArray());
  const expected = ['games-2026-10.json', 'games-2026-11.json']
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(FX, f), 'utf8')).games);

  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  // Niveau Maia réglé à 1000 avant l'import : il ne doit pas bouger.
  await p.goto(URL + '#/settings');
  await p.locator('#rating').fill('1000');
  await p.getByRole('button', { name: 'Enregistrer' }).first().tap();
  await p.getByText(/Niveau réglé à 1000/).waitFor();
  const p0 = await prof();

  // Pseudo inconnu → message clair
  await p.goto(URL + '#/settings');
  await p.getByLabel('Mon pseudo Chess.com').fill('personne_inconnue');
  await p.getByRole('button', { name: 'Importer mes parties' }).tap();
  await p.getByText(/Pseudo introuvable sur Chess.com/).waitFor();
  assert(true, 'pseudo inconnu : « Pseudo introuvable sur Chess.com »');

  // Import réel (réponses enregistrées)
  calls.length = 0;
  await p.getByLabel('Mon pseudo Chess.com').fill('Lightning_Light');
  await p.getByRole('button', { name: 'Importer mes parties' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /importées/ }).waitFor({ timeout: 60000 });
  const msg = await p.getByTestId('cc-msg').innerText();
  const games = await ccGames();
  assert(games.length > 150 && games.length <= expected.length, `${games.length} parties importées sur ${expected.length} (« ${msg} »)`);
  assert(calls.length === 3 && calls[0].endsWith('/games/archives'), `3 requêtes, une à une : ${calls.join(', ')}`);
  assert(new Set(games.map((g) => g.externalId)).size === games.length, 'aucun doublon (identifiant = URL de la partie)');
  assert(games.every((g) => g.ext?.site === 'chess.com' && g.ratingAfter === undefined), 'parties marquées Chess.com, sans niveau Maia');
  assert(games.filter((g) => g.myColor === 'w').every((g) => g.bookExit !== undefined), 'suivi du répertoire calculé pour chaque partie');
  const inRep = games.filter((g) => g.repOpeningId === 'english').length;
  assert(inRep > 20, `${inRep} parties avec les Blancs ont suivi l’Anglaise du répertoire`);
  await p.screenshot({ path: OUT + '/cc-1-import.png' });

  // Analyse automatique : seulement les parties depuis le 16/11/2026, les plus récentes d'abord ; X/Y et temps restant
  const since = await p.evaluate(() => new Date(2026, 10, 16).getTime());
  const nRecent = games.filter((g) => g.date >= since).length;
  const nOld = games.length - nRecent;
  await p.getByTestId('cc-analysing').waitFor();
  const prog = p.getByTestId('cc-analysing');
  await prog.getByText(new RegExp(`^Analyse : 1/${nRecent}$`)).waitFor();
  assert(nRecent > 0 && nOld > 0, `progression « Analyse : 1/${nRecent} » (parties depuis le 16/11/2026 ; ${nOld} plus anciennes non analysées)`);
  assert(new RegExp(`Analyse automatique : ${nRecent} parties depuis le 16/11/2026 ; ${nOld} plus anciennes importées sans analyse`).test(await p.getByTestId('cc-msg').innerText()), 'bilan de l’import : parties analysées automatiquement et anciennes sans analyse');
  await prog.getByText(/Temps restant estimé : (≈ \d+ min|≈ \d+ h \d+ min|moins d’une minute)/).waitFor({ timeout: 120000 });
  const progText = (await prog.innerText()).replace(/\s+/g, ' ');
  assert(true, 'temps restant estimé affiché : ' + progText);
  await p.screenshot({ path: OUT + '/cc-1b-analyse.png' });
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /analysée/ }).waitFor({ timeout: 180000 });
  let analysed = (await ccGames()).filter((g) => g.analysis);
  const recentSorted = games.filter((g) => g.date >= since).sort((x, y) => y.date - x.date);
  assert(analysed.length >= 1 && analysed.every((g) => g.date >= since), `${analysed.length} partie(s) analysée(s), toutes depuis le 16/11/2026, puis arrêt`);
  assert(analysed.some((g) => g.id === recentSorted[0].id), 'la plus récente est analysée en premier');
  assert(await p.getByRole('button', { name: new RegExp(`Analyser les ${nRecent - analysed.length} parties récentes`) }).count() === 1, 'reprise des récentes possible');
  // Les anciennes : à la demande
  await p.getByRole('button', { name: `Analyser aussi les anciennes (${nOld})` }).tap();
  await prog.getByText(new RegExp(`^Analyse des anciennes parties : 1/${nOld}$`)).waitFor();
  assert(await p.getByTestId('cc-msg').count() === 0, 'message précédent effacé au démarrage');
  assert(true, `« Analyser aussi les anciennes (${nOld}) » → « Analyse des anciennes parties : 1/${nOld} »`);
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /analysée/ }).waitFor({ timeout: 180000 });
  analysed = (await ccGames()).filter((g) => g.analysis);
  const oldSorted = games.filter((g) => g.date < since).sort((x, y) => y.date - x.date);
  assert(analysed.some((g) => g.id === oldSorted[0].id), 'anciennes : la plus récente d’entre elles analysée en premier');

  // Une partie avec des erreurs → cartes de révision « chesscom »
  const withErrors = games.filter((g) => g.uci.length > 30).sort((x, y) => y.date - x.date)[0];
  await p.goto(URL + '#/review/' + withErrors.id);
  await p.getByText('Précision', { exact: false }).first().waitFor({ timeout: 240000 });
  await p.getByText(/Chess.com/).first().waitFor();
  const head = await p.locator('.source-line').innerText();
  assert(/contre .+ · sans effet sur ton niveau Maia/.test(head), 'revue : « Chess.com contre … sans effet sur ton niveau Maia »');
  const book = await p.getByTestId('book-info').innerText().catch(() => '');
  assert(book.length > 0, 'revue : suivi du répertoire — ' + book.replace(/\s+/g, ' '));
  assert(await p.getByText('Maia', { exact: true }).count() === 0, 'revue : « Adversaire » au lieu de « Maia »');
  const cards = await p.evaluate((id) => window.__db.cards.where('gameId').equals(id).toArray(), withErrors.id);
  const g2 = await p.evaluate((id) => window.__db.games.get(id), withErrors.id);
  const nErr = g2.analysis.filter((a) => a.severity === 'mistake' || a.severity === 'blunder').length;
  assert(cards.length === nErr && cards.every((c) => c.source === 'chesscom'), `${cards.length} carte(s) de révision pour mes erreurs (source chesscom)`);
  await p.screenshot({ path: OUT + '/cc-2-revue.png' });

  // Statistiques : liste à part
  await p.goto(URL + '#/stats');
  await p.getByTestId('chesscom-games').waitFor();
  const st = await p.getByTestId('chesscom-games').locator('p').first().innerText();
  assert(/resté dans mon répertoire jusqu’au coup 8 : \d+ %/.test(st), 'statistiques : ' + st);
  await p.screenshot({ path: OUT + '/cc-3-stats.png', fullPage: true });

  // 2e import : rien de nouveau ; le mois passé (octobre) n'est pas redemandé
  calls.length = 0;
  await p.goto(URL + '#/settings');
  await p.getByRole('button', { name: 'Importer mes parties' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /0 partie importée/ }).waitFor({ timeout: 60000 });
  assert(calls.length === 2 && !calls.some((c) => c.endsWith('2026/10')), `2e import : ${calls.join(', ')} (octobre non redemandé)`);
  assert((await ccGames()).length === games.length, '2e import : aucune partie en double');
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap().catch(() => {});

  // Plan B : PGN collé (déjà présent, puis nouveau sans pseudo → couleur choisie)
  await p.getByText('Plan B : coller un PGN').tap();
  await p.getByLabel('PGN à importer').fill(expected[0].pgn);
  await p.getByRole('button', { name: 'Importer ce PGN' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /déjà présente/ }).waitFor();
  assert(true, 'PGN d’une partie déjà importée : « 1 déjà présente »');
  await p.getByLabel('PGN à importer').fill('[White "Ami"]\n[Black "Moi"]\n[Result "0-1"]\n\n1. f3 e5 2. g4 Qh4# 0-1');
  await p.getByLabel('Ma couleur dans ce PGN').selectOption('b');
  await p.getByRole('button', { name: 'Importer ce PGN' }).tap();
  await p.getByTestId('cc-msg').filter({ hasText: /1 partie importée/ }).waitFor();
  const pasted = (await ccGames()).find((g) => g.ext.site === 'pgn');
  assert(pasted && pasted.myColor === 'b' && pasted.score === 1 && pasted.termination === 'Échec et mat', 'PGN collé : mat du berger inversé, Noirs, victoire');
  await p.getByRole('button', { name: 'Arrêter l’analyse' }).tap().catch(() => {});
  await p.screenshot({ path: OUT + '/cc-4-pgn.png' });

  const p1 = await prof();
  assert(JSON.stringify(p0) === JSON.stringify(p1), `niveau Maia inchangé (${p0 ? `${Math.round(p0.rating)}, ${p0.gamesPlayed} parties` : 'profil de départ, 0 partie contre Maia'})`);
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
