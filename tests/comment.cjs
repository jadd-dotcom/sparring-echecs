// « Ce que je pensais » au bon moment (iPad émulé) : partie contre Maia où je laisse ma dame en prise → dès la fin,
// résultat puis chacune de mes erreurs/gaffes (position AVANT mon coup, mon coup en flèche rouge), 5 réponses en un
// toucher, PUIS le meilleur coup ; « Plus tard » ; badge « X erreurs à commenter » sur l'accueil → même écran.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const RED = /220,\s*40,\s*40/, GREEN = /30,\s*160,\s*60/;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const arrows = (re) => p.evaluate((src) => [...document.querySelectorAll('.board-wrap [stroke]')].filter((e) => new RegExp(src).test(e.getAttribute('stroke'))).length, re.source);
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  assert(await p.getByTestId('to-comment').count() === 0, 'accueil : pas de badge au départ');

  // Partie : 3 coups où ma dame se met en prise (si possible), puis abandon.
  await p.getByRole('button', { name: /^Jouer/ }).tap();
  let myMoves = 0;
  for (let guard = 0; myMoves < 3 && guard < 200; guard++) {
    const g = await cur();
    if (!g) { if (/#\/comment\//.test(p.url())) break; await p.waitForTimeout(150); continue; }   // partie finie (mat)
    const c = new Chess(); g.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
    if (c.turn() !== g.myColor || !(await p.getByText('à toi de jouer').isVisible())) { await p.waitForTimeout(150); continue; }
    const them = g.myColor === 'w' ? 'b' : 'w';
    const moves = c.moves({ verbose: true });
    const hang = moves.find((m) => m.piece === 'q' && c.isAttacked(m.to, them)) ?? moves.find((m) => m.piece === 'q') ?? moves.find((m) => m.san === 'e4' || m.san === 'e5' || m.san === 'd4' || m.san === 'd5') ?? moves[0];
    await sq(hang.from).tap(); await sq(hang.to).tap();
    if (hang.promotion) await p.getByRole('button', { name: 'Dame' }).tap();
    myMoves++;
    for (let i = 0; i < 100 && ((await cur())?.uci.length ?? 999) <= g.uci.length; i++) await p.waitForTimeout(80);
  }
  if (!/#\/comment\//.test(p.url())) {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  }

  // Fin de partie : écran de commentaire, résultat d'abord.
  await p.waitForURL(/#\/comment\/\d+$/);
  await p.getByTestId('game-result').waitFor();
  assert(/Défaite/.test(await p.getByTestId('game-result').innerText()), 'fin de partie : résultat affiché tout de suite (Défaite)');
  if (await p.getByTestId('comment-analysing').count()) await p.screenshot({ path: OUT + '/c-0-analyse.png' });
  await p.locator('.comment[data-ply], [data-testid="comment-done"]').first().waitFor({ timeout: 300000 });
  const gid = Number(p.url().match(/comment\/(\d+)/)[1]);
  const game = await p.evaluate((id) => window.__db.games.get(id), gid);
  const errs = game.analysis.filter((a) => a.severity === 'mistake' || a.severity === 'blunder');
  assert(errs.length >= 1, `partie analysée : ${errs.length} erreur(s)/gaffe(s) à commenter`);

  // 1re erreur : position AVANT mon coup, mon coup en rouge, pas encore de meilleur coup.
  const ply = Number(await p.locator('.comment').getAttribute('data-ply'));
  assert(ply === errs[0].ply, `ordre de la partie : 1re erreur au demi-coup ${ply}`);
  const fenBefore = await p.evaluate(([id, ply]) => window.__db.games.get(id).then((g) => g), [gid, ply]);
  const c = new Chess(); fenBefore.uci.slice(0, ply).forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
  const mine = errs[0].uci;
  const pieceThere = await sq(mine.slice(0, 2)).locator('img').count();
  assert(pieceThere === 1 && c.get(mine.slice(0, 2)), 'échiquier : position avant mon coup (ma pièce encore sur sa case de départ)');
  assert(await arrows(RED) === 1 && await arrows(GREEN) === 0, 'mon coup en flèche rouge, pas de flèche verte');
  assert(await p.getByTestId('comment-best').count() === 0, 'meilleur coup caché avant la réponse');
  const labels = await p.getByTestId('thought-tags').getByRole('button').allInnerTexts();
  assert(labels.length === 5 && labels[0] === 'Je n’ai pas vu la menace' && labels[4] === 'Je ne sais pas', '5 réponses en un toucher');
  await p.screenshot({ path: OUT + '/c-1-question.png' });
  await p.getByRole('button', { name: 'Je n’ai pas vu la menace' }).tap();
  await p.getByTestId('comment-best').waitFor();
  assert(await arrows(GREEN) === 1 && /Meilleur : /.test(await p.getByTestId('comment-best').innerText()), 'PUIS le meilleur coup : flèche verte et « Meilleur : … »');
  assert((await p.evaluate((id) => window.__db.games.get(id), gid)).thoughtTags[ply] === 'menace', 'réponse enregistrée');
  await p.getByPlaceholder(/Je voulais attaquer le roi/).fill('Je regardais seulement mon attaque.');
  await p.getByPlaceholder(/Je voulais attaquer le roi/).blur();
  await p.screenshot({ path: OUT + '/c-2-meilleur.png' });

  // « Plus tard » : la suite reste à commenter.
  await p.getByRole('button', { name: 'Plus tard' }).tap();
  const done = await p.getByTestId('comment-done').innerText();
  const left = errs.length - 1;
  assert(left === 0 ? /Merci/.test(done) : new RegExp(`${left} erreurs? reste`).test(done), 'Plus tard : ' + done.split('\n')[0]);
  assert(await p.getByRole('button', { name: 'Revoir la partie' }).count() === 1 && await p.getByRole('button', { name: 'Nouvelle partie' }).count() === 1, 'puis : revoir la partie / nouvelle partie / accueil');

  // Accueil : badge « X erreurs à commenter » (parties importées ou « plus tard ») → même écran.
  // Une partie importée analysée, avec une gaffe, s'ajoute au compte.
  await p.evaluate(async () => {
    const g = { source: 'chesscom', externalId: 'test:1', date: Date.now() - 60e3, myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
      ext: { site: 'chess.com', me: { name: 'moi' }, opp: { name: 'Adversaire7', rating: 500 } } };
    window.__testImported = await window.__db.games.add(g);
  });
  const imported = await p.evaluate(() => window.__testImported);
  await p.goto(URL + '#/review/' + imported);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  // Une partie plus ancienne (20/11), analysée, avec une gaffe : pas dans le badge, mais commentable dans la revue.
  const oldId = await p.evaluate(() => window.__db.games.add({
    source: 'chesscom', externalId: 'test:old', date: new Date(2026, 10, 20, 18).getTime(), myColor: 'w',
    startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'],
    result: '0-1', score: 0, termination: 'Abandon', ext: { site: 'chess.com', me: { name: 'moi' }, opp: { name: 'Ancien', rating: 480 } } }));
  await p.goto(URL + '#/review/' + oldId);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  await p.locator('.moves .mv').nth(2).tap();
  assert(await p.getByTestId('thought-tags').count() === 1, 'partie du 20/11 : l’erreur reste commentable dans la revue');
  await p.goto(URL);
  await p.getByTestId('to-comment').waitFor();
  const badge = await p.getByTestId('to-comment').innerText();
  assert(new RegExp(`^${left + 1} erreurs? à commenter$`).test(badge.trim()), 'accueil : badge « ' + badge.trim() + ' » (parties d’aujourd’hui seulement, pas celle du 20/11)');
  await p.screenshot({ path: OUT + '/c-3-accueil.png' });
  await p.getByTestId('to-comment').tap();
  await p.locator('.comment[data-ply]').waitFor();
  assert(/Chess\.com contre Adversaire7/.test(await p.getByTestId('comment-origin').innerText()), 'badge → même écran, la partie importée (la plus récente) en premier');
  for (let k = 0; k < left + 1; k++) {
    await p.getByTestId('thought-tags').getByRole('button').nth(k % 5).tap();
    await p.getByTestId('comment-best').waitFor();
    await p.getByRole('button', { name: /Erreur suivante|Terminer/ }).tap();
  }
  assert(/Merci : \d+ erreurs? commentées?/.test(await p.getByTestId('comment-done').innerText()), 'toutes commentées : « Merci »');
  await p.getByTestId('comment-done').getByRole('button', { name: 'Accueil' }).tap();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForTimeout(500);
  assert(await p.getByTestId('to-comment').count() === 0, 'accueil : badge disparu');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
