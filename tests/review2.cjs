// Revue : raison dans la phrase, précision, courbe d'évaluation, « Réessayer », précision dans les Stats.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  // Partie connue : 1.e4 d5 2.Qg4?? Bxg4, abandon
  const id = await p.evaluate(() => window.__db.games.add({
    source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
    ratingBefore: 900, ratingAfter: 870, botElo: 950,
  }));
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  const accText = await p.locator('.accuracy').innerText();
  assert(/Précision : toi \d/.test(accText) && /Maia \d/.test(accText), 'précision affichée pour les deux camps : ' + accText.replace(/\s+/g, ' '));
  assert(await p.locator('svg.evalcurve').count() === 1, 'courbe d’évaluation présente');

  // Phrase avec raison sur 2.Qg4??
  await p.locator('.moves .mv').nth(2).tap();
  // « Ce que je pensais » en un toucher : avant de répondre, ni meilleur coup, ni raison, ni flèche verte.
  await p.getByTestId('thought-tags').waitFor();
  const before = await p.locator('.move-sentence').innerText();
  assert(/♕g4 est une gaffe\./.test(before) && !/Meilleur/.test(before) && !/prend ta dame/.test(before), 'avant la réponse : meilleur coup et raison cachés (' + before.replace(/\s+/g, ' ') + ')');
  assert(await p.evaluate(() => [...document.querySelectorAll('.board-wrap [stroke]')].filter((e) => /30,\s*160,\s*60/.test(e.getAttribute('stroke'))).length) === 0, 'avant la réponse : pas de flèche verte');
  assert(await p.getByText('Motif :').count() === 0, 'avant la réponse : motif caché');
  const labels = await p.getByTestId('thought-tags').getByRole('button').allInnerTexts();
  assert(labels.join(' | ') === 'Je n’ai pas vu la menace | J’ai vu, mais mal calculé | Je voulais attaquer autre chose | J’ai joué trop vite | Je ne sais pas', '5 réponses proposées');
  await p.screenshot({ path: OUT + '/r2-0-pensee.png' });
  await p.getByRole('button', { name: 'Je n’ai pas vu la menace' }).tap();
  await p.getByText('Motif :').waitFor();
  assert((await p.evaluate((id) => window.__db.games.get(id), id)).thoughtTags[2] === 'menace', 'réponse enregistrée (demi-coup 2 : menace)');
  assert(await p.getByPlaceholder(/Je voulais attaquer le roi/).count() === 1, 'texte libre facultatif proposé après la réponse');
  const sentence = await p.locator('.move-sentence').innerText();
  assert(/♕g4 est une gaffe : après ton coup, son fou prend ta dame g4 \(pièce laissée en prise\)\. Meilleur : /.test(sentence), 'phrase en mots : ' + sentence.replace(/\s+/g, ' '));
  await p.screenshot({ path: OUT + '/r2-1-revue.png' });

  // Tap sur la courbe → coup
  const box = await p.locator('svg.evalcurve').boundingBox();
  await p.mouse.click(box.x + box.width * 0.99, box.y + box.height / 2);
  await p.waitForTimeout(300);
  assert(/Bxg4|♗xg4/.test(await p.locator('.move-sentence').innerText()), 'tap en fin de courbe : dernier coup (2… ♗xg4)');

  // Réessayer : deux échecs → solution ; puis réussite
  await p.locator('.moves .mv').nth(2).tap();
  await p.getByRole('button', { name: 'Réessayer' }).tap();
  await p.getByText(/trouve un meilleur coup que ♕g4/).waitFor();
  await sq('d1').tap(); await sq('g4').tap();
  await p.getByText(/Essaie encore/).waitFor({ timeout: 30000 });
  assert(true, '1er essai raté : « Essaie encore »');
  await sq('d1').tap(); await sq('g4').tap();
  await p.getByText(/Solution : /).waitFor({ timeout: 30000 });
  assert(true, '2e essai raté : la solution s’affiche');
  await p.screenshot({ path: OUT + '/r2-2-solution.png' });
  await p.getByRole('button', { name: 'Fermer' }).tap();
  await p.getByRole('button', { name: 'Réessayer' }).tap();
  await sq('e4').tap(); await sq('d5').tap();   // exd5 : le meilleur coup
  await p.getByText(/Bien vu : exd5/).waitFor({ timeout: 30000 });
  assert(true, 'réussite : exd5 classé Bon ou mieux');

  // Stats : courbe de précision
  await p.goto(URL + '#/stats');
  await p.getByRole('heading', { name: /Ma précision/ }).waitFor();
  assert(await p.locator('svg[aria-label="Ma précision partie après partie"]').count() === 1, 'Stats : courbe de ma précision');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
