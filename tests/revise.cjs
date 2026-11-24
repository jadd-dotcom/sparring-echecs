// Révision « Trouve le bon coup » (iPad émulé) : partie Chess.com connue 1.e4 e5 2.Nf3 Bc5 3.Nc3 Bxf2+ 4.Ke2? (au lieu
// de 4.Kxf2, qui gagnait le fou) → motif « Gain raté » dans la revue, puis la carte : origine et consigne, flèche rouge
// désactivable, Indice ×2, Solution, Passer, explication ; enfin « Toutes mes cartes » et suppression d'une carte.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const RED = 'rgba(220,40,40,.85)';

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const today = () => p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  const redArrows = () => p.evaluate((c) => [...document.querySelectorAll('.board-wrap [stroke]')].filter((e) => e.getAttribute('stroke') === c).length, RED);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();

  const date = new Date(2026, 10, 20, 18, 30).getTime();
  const id = await p.evaluate((date) => window.__db.games.add({
    source: 'chesscom', date, myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    uci: ['e2e4', 'e7e5', 'g1f3', 'f8c5', 'b1c3', 'c5f2', 'e1e2', 'f2b6'], san: ['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+', 'Ke2', 'Bb6'],
    result: '0-1', score: 0, termination: 'Abandon', unrated: true,
    ext: { site: 'chess.com', me: { name: 'Moi', rating: 400 }, opp: { name: 'Adversaire42', rating: 420 }, timeClass: 'rapid' },
  }), date);

  // Revue : 4.Ke2 est une erreur « Gain raté ».
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  await p.locator('.moves .mv').nth(6).tap();
  await p.getByRole('button', { name: 'Je voulais attaquer autre chose' }).tap();
  await p.getByText('Motif :').waitFor();
  const sentence = (await p.locator('.move-sentence').innerText()).replace(/\s+/g, ' ');
  assert(/♔e2 est une (erreur|gaffe) : tu pouvais prendre le ♗f2 avec ♔xf2 .*\(gain raté\)/.test(sentence), 'revue : ' + sentence);
  await p.screenshot({ path: OUT + '/rv-0-revue.png' });

  // Carte créée pour 4.Ke2 ; on la rend due aujourd'hui.
  let card;
  for (let i = 0; i < 60 && !card; i++) {
    card = await p.evaluate((id) => window.__db.cards.where('gameId').equals(id).first(), id);
    if (!card) await p.waitForTimeout(500);
  }
  assert(card && card.playedUci === 'e1e2' && card.bestUci === 'e1f2', 'carte de révision : joué e1e2, meilleur e1f2');
  const t = await today();
  await p.evaluate(([cid, t]) => window.__db.cards.update(cid, { due: t }), [card.id, t]);

  await p.goto(URL + '#/revise');
  await p.getByTestId('instruction').waitFor();
  await p.getByTestId('origin').filter({ hasText: 'coup 4.' }).waitFor({ timeout: 30000 });
  const origin = (await p.getByTestId('origin').innerText()).replace(/\s+/g, ' ');
  assert(/Chess\.com · contre Adversaire42 \(420\) · 20\/11\/2026 · coup 4\./.test(origin), 'origine : ' + origin);
  const instr = await p.getByTestId('instruction').innerText();
  assert(instr === 'Joue sur l’échiquier un meilleur coup que 4. ♔e2', 'consigne : ' + instr);

  // Flèche rouge de mon coup, désactivable (et réglage mémorisé).
  await p.waitForTimeout(300);
  assert(await redArrows() >= 1, 'flèche rouge de mon coup affichée');
  await p.screenshot({ path: OUT + '/rv-1-carte.png' });
  await p.getByLabel(/Montrer mon coup de la partie/).uncheck();
  await p.waitForTimeout(300);
  assert(await redArrows() === 0, 'flèche rouge masquée');
  assert((await p.evaluate(() => window.__db.meta.get('reviseShowMine')))?.value === false, 'réglage de la flèche mémorisé');
  await p.getByLabel(/Montrer mon coup de la partie/).check();

  // Solution indisponible au départ ; Indice 1 = motif en mots ; Indice 2 = pièce surlignée.
  assert(await p.getByRole('button', { name: 'Solution' }).isDisabled(), 'Solution désactivée au départ');
  await p.getByRole('button', { name: /^Indice/ }).tap();
  await p.getByTestId('hint').filter({ hasText: /défendue|prise/ }).waitFor({ timeout: 60000 });
  const hint = await p.getByTestId('hint').innerText();
  assert(hint === 'Une pièce adverse n’est pas défendue : cherche une prise.', 'indice 1 : ' + hint);
  await p.getByRole('button', { name: /^Indice/ }).tap();
  await p.getByTestId('hint2').waitFor();
  const hl = await sq('e1').evaluate((e) => [e, ...e.querySelectorAll('*')].some((x) => /255, ?170, ?0/.test(x.getAttribute('style') ?? '')));
  assert(hl, 'indice 2 : la case e1 (pièce à jouer) est surlignée');
  assert(await p.getByRole('button', { name: /^Indice/ }).isDisabled(), 'plus d’indice après 2');
  assert(await p.getByRole('button', { name: 'Solution' }).isEnabled(), 'Solution disponible après 2 indices');
  await p.screenshot({ path: OUT + '/rv-2-indices.png' });

  // Un essai raté (Ke1-d3 ? non : e2 est le coup joué → toujours mauvais), puis la solution.
  await sq('e1').tap(); await sq('e2').tap();
  await p.getByTestId('try-msg').waitFor({ timeout: 60000 });
  assert(/♔e2 n’est pas mieux/.test(await p.getByTestId('try-msg').innerText()), 'essai raté : « Essaie encore »');
  await p.getByRole('button', { name: 'Solution' }).tap();
  await p.getByTestId('revise-result').waitFor();
  await p.getByTestId('why').waitFor({ timeout: 60000 });
  const res = (await p.getByTestId('revise-result').innerText()).replace(/\s+/g, ' ');
  assert(/Solution : ♔xf2/.test(res), 'solution : ♔xf2');
  assert(/Pourquoi : ♔xf2 prend le ♗f2, qui n’était pas assez défendu \(suite : 4\. ♔xf2 .*bilan matériel pour toi : \+\d\)/.test(res), 'pourquoi le bon coup est bon : ' + res);
  assert(/♔e2 était une (erreur|gaffe) \(gain raté\) : il laisse filer le ♗f2\. Après ♔e2 : 4… .*bilan matériel pour toi : /.test(res), 'pourquoi mon coup était moins bon (suite qui le réfute) : ' + res);
  assert(/reviendra demain/.test(res), 'ratée : la carte revient demain');
  await p.screenshot({ path: OUT + '/rv-3-explication.png' });
  const after = await p.evaluate((cid) => window.__db.cards.get(cid), card.id);
  const tomorrow = await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  assert(after.due === tomorrow && after.step === 0 && after.attempts.length === 1 && !after.attempts[0].ok, 'carte replanifiée demain, essai raté enregistré');

  // Réussite du premier coup : la carte avance (J+3 après une réussite).
  await p.evaluate(([cid, t]) => window.__db.cards.update(cid, { due: t, step: 1 }), [card.id, t]);
  await p.goto(URL + '#/'); await p.goto(URL + '#/revise');
  await p.getByTestId('instruction').waitFor();
  await sq('e1').tap(); await sq('f2').tap();
  await p.getByTestId('revise-result').waitFor({ timeout: 60000 });
  assert(/Bien joué : ♔xf2, le meilleur coup/.test(await p.getByTestId('revise-result').innerText()), 'réussite : ♔xf2');
  const ok = await p.evaluate((cid) => window.__db.cards.get(cid), card.id);
  assert(ok.step === 2 && ok.due > tomorrow, 'réussie du premier coup : la carte avance (' + ok.due + ')');

  // Passer : la carte revient demain, sans essai compté.
  await p.evaluate(([cid, t]) => window.__db.cards.update(cid, { due: t }), [card.id, t]);
  await p.goto(URL + '#/'); await p.goto(URL + '#/revise');
  await p.getByTestId('instruction').waitFor();
  const n0 = (await p.evaluate((cid) => window.__db.cards.get(cid), card.id)).attempts.length;
  await p.getByRole('button', { name: 'Passer' }).tap();
  await p.waitForTimeout(500);
  const sk = await p.evaluate((cid) => window.__db.cards.get(cid), card.id);
  assert(sk.due === tomorrow && sk.attempts.length === n0, 'Passer : la carte revient demain');

  // Toutes mes cartes : origine visible, suppression.
  await p.goto(URL + '#/cards');
  await p.getByRole('heading', { name: /Toutes mes cartes/ }).waitFor();
  const item = p.locator(`[data-card="${card.id}"]`);
  await item.getByTestId('card-origin').filter({ hasText: 'coup 4.' }).waitFor({ timeout: 30000 });
  const it = (await item.innerText()).replace(/\s+/g, ' ');
  assert(/Chess\.com · contre Adversaire42 \(420\) · 20\/11\/2026 · coup 4\./.test(it) && /Joué : ♔e2 .* meilleur : ♔xf2/.test(it), 'liste : origine et coups : ' + it);
  assert(await item.locator('.mini-board img').count() === 31, 'mini-échiquier : 31 pièces');
  await p.screenshot({ path: OUT + '/rv-4-cartes.png' });
  p.once('dialog', (d) => d.accept());
  await item.getByRole('button', { name: 'Supprimer la carte' }).tap();
  await p.waitForTimeout(400);
  assert(await p.locator(`[data-card="${card.id}"]`).count() === 0 && !(await p.evaluate((cid) => window.__db.cards.get(cid), card.id)), 'carte supprimée');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
