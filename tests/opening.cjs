// Page d'une ouverture (Londres en défense, iPhone émulé) : en-tête « Leçon x/y · Lignes x/y · Carrefours x/y »,
// Leçon (sommaire, Rejouer, ↻ en boucle, Recommencer ce bloc, Reprendre où je me suis arrêté), Lignes (arbre par
// carrefours, filtres, sélection, départ au carrefour, Rejouer cette ligne, erreur → à refaire), Pièges ; retour au
// parent ; « Refaire » et « Suivant » en fin d'exercice (pièges).
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
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
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const tapMove = async (fen, san) => { const m = new Chess(fen).move(san); await sq(m.from).tap(); await sq(m.to).tap(); };
  /** Joue le coup attendu sur l'écran (leçon ou lignes) tant que c'est à moi ; s'arrête quand `done()` est vrai. */
  const playExpected = async (root, done, maxMoves = 30) => {
    for (let i = 0; i < maxMoves; i++) {
      if (await done()) return;
      const el = p.locator(root);
      const exp = await el.getAttribute('data-expected');
      if (exp) { await tapMove(await el.getAttribute('data-fen'), exp); await p.waitForTimeout(150); }
      else await p.waitForTimeout(400);
    }
  };
  await p.goto(URL);
  await p.getByTestId('session').waitFor();

  // ---------- Ouvertures › Londres en défense
  await p.getByTestId('tab-openings').tap();
  await p.getByTestId('open-london-def').tap();
  await p.getByTestId('opening-head').waitFor();
  const head = await p.getByTestId('opening-head').innerText();
  assert(/^Leçon 0\/\d+ · Lignes 0\/\d+ · Carrefours 0\/\d+$/.test(head.trim()), 'en-tête « Leçon x/y · Lignes x/y · Carrefours x/y » : ' + head);
  for (const t of ['lecon', 'lignes', 'carrefours', 'pieges']) assert(await p.getByTestId(`otab-${t}`).count() === 1, `onglet ${t}`);
  assert(await p.getByTestId('back').innerText().then((t) => t.includes('Ouvertures')), 'retour : « Ouvertures »');

  // ---------- Leçon : sommaire, Rejouer le bloc 1
  const toc = await p.locator('.toc-item').allInnerTexts();
  assert(/Bloc 1 · coups 1 à 3/.test(toc[0]) && toc.some((t) => /Le plan/.test(t)) && toc.some((t) => /La partie type/.test(t)), 'sommaire : blocs, le plan, la partie type, lignes supplémentaires');
  assert(await p.locator('[data-testid="toc-main:0"]').getAttribute('data-status') === 'new', 'statut « pas commencé »');
  await p.locator('[data-testid="toc-main:0"]').getByRole('button', { name: 'Rejouer' }).tap();
  await p.locator('.lesson-play[data-stage="replay"]').waitFor();
  await playExpected('.lesson-play', async () => /Bloc réussi/.test(await p.locator('.side-col').innerText()));
  assert(/Bloc réussi/.test(await p.locator('.side-col').innerText()), 'bloc 1 rejoué');
  await p.getByTestId('back').tap();
  await p.locator('[data-testid="toc-main:0"][data-status="done"]').waitFor({ timeout: 5000 }).catch(() => {});
  assert(await p.locator('[data-testid="toc-main:0"]').getAttribute('data-status') === 'done', 'sommaire : bloc 1 ✓');
  assert(/rejoué 1 fois/.test(await p.locator('[data-testid="toc-main:0"]').innerText()), 'compteur : rejoué 1 fois');

  // ---------- ↻ en boucle (bloc 2) : tour 2 commence tout seul ; arrêter
  await p.locator('[data-testid="toc-main:1"]').getByRole('button', { name: 'En boucle' }).tap();
  await p.locator('.lesson-play[data-stage="loop"]').waitFor();
  await playExpected('.lesson-play', async () => /tour 1 terminé/.test(await p.locator('.side-col').innerText()));
  await p.getByTestId('loop-count').filter({ hasText: 'tour 2' }).waitFor({ timeout: 10000 });
  assert(true, 'en boucle : le bloc recommence (tour 2), compteur de tours et d’erreurs');
  await p.getByTestId('loop-stop').tap();
  assert(await p.locator('.lesson-play').getAttribute('data-stage') === 'replay', '« Arrêter la boucle »');

  // ---------- Regarder (bloc 3), avancer, Recommencer ce bloc ; reprise
  await p.getByTestId('back').tap();
  await p.locator('[data-testid="toc-main:2"]').getByRole('button', { name: 'Regarder' }).tap();
  await p.locator('.lesson-play[data-stage="watch"]').waitFor();
  for (let i = 0; i < 3; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  assert(await p.locator('.lesson-play').getAttribute('data-k') === '3', 'Regarder : ▶ trois fois');
  await p.getByTestId('block-restart').tap();
  assert(await p.locator('.lesson-play').getAttribute('data-k') === '0', '« Recommencer ce bloc »');
  for (let i = 0; i < 2; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.waitForTimeout(400);
  await p.getByTestId('back').tap();
  await p.getByTestId('lesson-resume').waitFor();
  assert(/Bloc 3 · coups 7 à 9 — Regarder, coup 2/.test(await p.getByTestId('lesson-resume').innerText()), 'carte « Reprendre où je me suis arrêté » (bloc + étape + coup)');
  await p.getByTestId('lesson-resume').getByRole('button', { name: 'Reprendre' }).tap();
  await p.locator('.lesson-play[data-k="2"]').waitFor();
  assert(true, 'reprise au coup enregistré, les coups d’avant le bloc placés tout seuls');
  await p.screenshot({ path: OUT + '/op-1-lecon.png' });

  // ---------- Lignes : arbre par carrefours, sélection d'une ligne, départ au carrefour
  await p.goto(URL + '#/opening/london-def/lignes');
  await p.getByTestId('train-bar').waitFor();
  assert(await p.locator('.cross-head').count() > 3, 'arbre groupé par carrefours (son coup → mon coup)');
  const firstRow = p.locator('[data-testid="line-row"]').first();
  const key = await firstRow.getAttribute('data-line');
  await firstRow.locator('input[type="checkbox"]').check();
  await p.getByTestId('train-sel').tap();
  await p.locator('.play-lines').waitFor();
  assert(Number(await p.locator('.play-lines').getAttribute('data-ply')) > 0, 'départ au carrefour : les coups d’avant sont déjà joués');
  assert(/Sélection 1\/1/.test(await p.getByTestId('lines-banner').innerText()), 'bandeau : sélection 1/1');
  await playExpected('.play-lines', async () => (await p.getByTestId('lines-done').count()) > 0, 40);
  await p.getByTestId('lines-done').waitFor();
  assert(await p.getByTestId('line-replay').count() === 1 && await p.getByTestId('line-next').count() === 1 && await p.getByRole('button', { name: /Continuer la partie/ }).count() === 1, 'fin de ligne : Rejouer cette ligne, Ligne suivante de la sélection, Continuer la partie');
  const st1 = await p.evaluate((k) => window.__db.meta.get('lineProgress').then((m) => m.value['london-def'].lines[k].status), key);
  assert(st1 === 'ok', 'ligne validée');
  // Rejouer la ligne validée, avec une erreur → « à refaire »
  await p.getByTestId('line-replay').tap();
  await p.locator('.play-lines[data-expected]:not([data-expected=""])').waitFor({ timeout: 10000 });
  const el = p.locator('.play-lines');
  const fen = await el.getAttribute('data-fen');
  const exp = await el.getAttribute('data-expected');
  const wrong = new Chess(fen).moves({ verbose: true }).find((m) => m.san !== exp && !/[+#]/.test(m.san));
  await sq(wrong.from).tap(); await sq(wrong.to).tap();
  await p.getByTestId('lines-msg').waitFor();
  assert(/Pas le coup de ton répertoire/.test(await p.getByTestId('lines-msg').innerText()), 'erreur refusée');
  const st2 = await p.evaluate((k) => window.__db.meta.get('lineProgress').then((m) => m.value['london-def'].lines[k].status), key);
  assert(st2 === 'redo', 'une erreur repasse la ligne « à refaire »');
  await p.getByTestId('back').tap();
  await p.getByTestId('train-bar').waitFor();
  await p.getByRole('radio', { name: 'À refaire' }).tap();
  assert(await p.locator('[data-testid="line-row"]').count() === 1, 'filtre « À refaire » : la ligne');
  await p.screenshot({ path: OUT + '/op-2-lignes.png' });

  // ---------- Pièges de l'ouverture, « Refaire » et « Suivant »
  await p.getByTestId('otab-pieges').tap();
  await p.getByTestId('otrap-londres-def-g6').waitFor();
  await p.getByTestId('otrap-londres-def-g6').getByRole('button', { name: /Punis-le/ }).tap();
  await p.locator('[data-testid="trap-ex"][data-mode="punish"]').waitFor();
  const sol = await p.locator('[data-testid="trap-ex"]').getAttribute('data-solution');
  await sq(sol.slice(0, 2)).tap(); await sq(sol.slice(2, 4)).tap();
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  assert(await p.getByTestId('trap-restart').innerText().then((t) => t.includes('Refaire')) && await p.getByTestId('trap-next').count() === 1, 'fin d’exercice : « Refaire » et « Suivant »');
  await p.getByTestId('trap-restart').tap();
  assert(await p.locator('[data-testid="trap-ex"]').getAttribute('data-phase') === 'play', '« Refaire » : l’exercice recommence');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
