// Mesure des motifs (version 3 du détail) : un détail ancien est recalculé en arrière-plan au démarrage ; une
// fourchette de cavalier avec échec (4.Nb5 Qe7?? 5.Nxc7+ Kd8 6.Nxa8) compte comme « Pièce laissée en prise » ;
// « Autre » s'appelle « Erreur de position (pas de perte de matériel tout de suite) » (iPhone émulé).
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/api.chess.com/**', (r) => r.abort());
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  // Partie analysée avec l'ancienne mesure (v2) : 4…Qe7?? notée « Autre » (2 demi-coups : Nxc7+ Kd8 = 1 pion).
  const sans = ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6', 'Nb5', 'Qe7', 'Nxc7+', 'Kd8', 'Nxa8'];
  const id = await p.evaluate((sans) => {
    const uci = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'b1c3', 'g8f6', 'c3b5', 'd8e7', 'b5c7', 'e8d8', 'c7a8'];
    const an = (ply, x = {}) => ({ ply, san: sans[ply], uci: uci[ply], bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 50, drop: 0, severity: 'ok', ...x });
    return window.__db.games.add({
      source: 'chesscom', date: Date.now() - 3600000, myColor: 'b', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci, san: sans, result: '1-0', score: 0, termination: 'Abandon', ext: { site: 'chess.com', me: { name: 'moi' }, opp: { name: 'Fourchette' } },
      analysis: [an(1), an(3), an(5), an(7, { bestUci: 'd7d6', bestSan: 'd6', wpBefore: 55, wpAfter: 10, drop: 45, severity: 'blunder',
        detail: { v: 2, depth: 12, bestLine: '4… d6', bestMaterial: 0, refutation: '5. Nxc7+ Kd8', refutationMaterial: -1, motifs: ['autre'], motif: 'autre' } }), an(9)],
    });
  }, sans);
  // Au démarrage suivant, le recalcul se lance en arrière-plan.
  await p.reload();
  // Attente du recalcul (on interroge la base toutes les secondes).
  const t0 = Date.now();
  while (!(await p.evaluate((id) => window.__db.games.get(id).then((g) => g.analysis.find((a) => a.ply === 7).detail.v === 3), id))) {
    if (Date.now() - t0 > 240000) throw new Error('recalcul trop long');
    await p.waitForTimeout(1000);
  }
  const d = await p.evaluate((id) => window.__db.games.get(id).then((g) => g.analysis.find((a) => a.ply === 7).detail), id);
  assert(d.motif === 'piece-en-prise', 'fourchette de cavalier recalculée : « Pièce laissée en prise » (' + d.motif + ', ' + d.refutation + ')');
  assert(/^5\. Nxc7\+ Kd8 6\. Nxa8/.test(d.refutation), 'réfutation sur 4 demi-coups : ' + d.refutation);
  // Revue : le motif affiché.
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  await p.locator('.moves .mv').nth(7).tap();
  const tags = p.getByTestId('thought-tags');
  if (await tags.count()) await p.getByRole('button', { name: 'Je ne sais pas' }).tap();
  await p.getByText('Motif :').waitFor();
  assert(/Motif : Pièce laissée en prise/.test(await p.locator('.explain').innerText()), 'revue : « Pièce laissée en prise »');
  // Rapport : définitions et nouveau nom de « Autre ».
  await p.goto(URL + '#/report');
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 300000 });
  const md = await p.locator('.md-preview').innerText();
  assert(/Erreur de position \(pas de perte de matériel tout de suite\)/.test(md) && !/\| Autre \|/.test(md), 'rapport : « Erreur de position (pas de perte de matériel tout de suite) »');
  assert(/4 demi-coups \(lui, moi, lui, moi\) : une fourchette avec échec compte/.test(md), 'rapport : définition sur 4 demi-coups');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
