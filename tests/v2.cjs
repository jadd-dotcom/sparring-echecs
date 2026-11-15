// V2 — parcours « Ouvertures » sur iPad émulé : partie à thème, sorties, trous, drill, éditeur, stats.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const ONLY = process.argv[4] || 'all';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const waitPlies = async (n, timeout = 30000, mustExist = true) => {
    const end = Date.now() + timeout;
    for (;;) { const g = await cur(); if ((!g && !mustExist) || (g && g.uci.length >= n)) return g; if (Date.now() > end) throw new Error('timeout plies ' + n); await p.waitForTimeout(100); }
  };
  const tapMove = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  const resign = async () => {
    await p.getByRole('button', { name: /Abandonner/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
    await p.getByRole('button', { name: 'Analyser mes coups' }).waitFor();
  };
  const lastGame = () => p.evaluate(() => window.__db.games.toArray().then((a) => a[a.length - 1]));

  await p.goto(URL);
  await p.getByRole('button', { name: /Ouvertures/ }).tap();
  await p.getByRole('heading', { name: 'Gambit Dame refusé' }).waitFor();
  const nOpen = await p.evaluate(() => window.__db.openings.count());
  assert(nOpen === 3, '3 ouvertures pré-chargées');
  await p.screenshot({ path: OUT + '/v2-1-ouvertures.png' });

  // --- GDR : je joue les Noirs, 1.d4 et 2.c4 imposés, puis je sors avec 2...c6
  await p.locator('section', { hasText: 'Gambit Dame refusé' }).getByRole('button', { name: 'Partie à thème' }).tap();
  let g = await waitPlies(1, 120000);
  assert(g.myColor === 'b' && g.openingId === 'qgd', 'partie à thème GDR avec les Noirs');
  assert(g.uci[0] === 'd2d4', '1.d4 imposé');
  await p.getByText('à toi de jouer').waitFor({ timeout: 120000 });
  await tapMove('d7d5');
  g = await waitPlies(3);
  assert(g.uci[2] === 'c2c4', '2.c4 imposé');
  await tapMove('c7c6'); // sortie du répertoire (prévu : 2...e6)
  g = await waitPlies(5);
  await p.screenshot({ path: OUT + '/v2-2-partie-theme.png' });
  await resign();
  await p.waitForTimeout(500);
  let lg = await lastGame();
  assert(lg.openingId === 'qgd' && lg.bookExit?.by === 'me' && lg.bookExit.expectedSan.join() === 'e6', `sortie détectée : 2...c6 au lieu de ${lg.bookExit?.expectedSan}`);
  const prof = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m.value));
  assert(prof.nextColor === 'w', 'la partie à thème ne change pas l’alternance des couleurs');

  // Revue : la sortie est signalée avec le coup prévu
  await p.getByRole('button', { name: 'Analyser mes coups' }).tap();
  await p.locator('.counts').waitFor({ timeout: 120000 });
  await p.getByText(/Sortie du répertoire/).waitFor();
  await p.screenshot({ path: OUT + '/v2-3-revue-sortie.png' });
  assert(true, 'revue : sortie du répertoire signalée');

  // --- Française : je suis mon répertoire jusqu'à ce que l'adversaire en sorte (trou) ou fin de ligne
  const { Chess } = require('chess.js');
  let hole = null;
  for (let attempt = 0; attempt < 4 && !hole; attempt++) {
    await p.goto(URL + '#/play/french');
    let g0 = await waitPlies(1, 120000);
    assert(g0.uci[0] === 'e2e4' && g0.myColor === 'b', `partie ${attempt + 1} : Française, 1.e4 imposé`);
    for (let k = 0; k < 15; k++) {
      await p.getByText('à toi de jouer').waitFor({ timeout: 60000 });
      const g1 = await cur();
      const c = new Chess(); g1.uci.forEach((u) => c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
      const mv = await p.evaluate(([f]) => window.__repMove('french', f), [c.fen()]);
      if (!mv) break;
      await tapMove(mv);
      await waitPlies(g1.uci.length + 2);
    }
    await resign();
    await p.waitForTimeout(2500); // trou + Stockfish en arrière-plan
    const lg2 = await lastGame();
    console.log('   sortie :', JSON.stringify(lg2.bookExit && { by: lg2.bookExit.by, ply: lg2.bookExit.ply, coup: lg2.bookExit.playedSan }));
    hole = await p.evaluate(() => window.__db.holes.where('openingId').equals('french').first());
  }
  assert(hole && hole.bestSan, `trou du répertoire enregistré : après ${hole?.path.join(' ')} → Stockfish ${hole?.bestSan}`);

  // --- Éditeur : combler le trou avec le coup Stockfish
  await p.goto(URL + '#/repertoire/french');
  await p.getByText(/Trous du répertoire/).waitFor();
  await p.screenshot({ path: OUT + '/v2-4-trous.png' });
  const linesBefore = await p.locator('.line-row').count();
  await p.getByRole('button', { name: `Ajouter ${hole.bestSan} au répertoire` }).tap();
  await p.getByText(/Trou comblé : 1 ligne ajoutée/).waitFor({ timeout: 60000 });
  assert(await p.locator('.line-row').count() === linesBefore + 1, 'trou comblé : +1 ligne, trou supprimé');
  const holeCard = await p.evaluate((k) => window.__db.cards.where('[openingId+key]').equals(['french', k]).first(), hole.key);
  assert(holeCard && holeCard.kind === 'drill', 'la position du trou devient une carte de drill');

  // --- Éditeur : ligne ajoutée sur l'échiquier (bonne) puis ligne fautive refusée
  const playLine = async (ucis) => {
    await p.getByRole('button', { name: '+ Ligne' }).tap();
    for (const u of ucis) await tapMove(u);
    await p.getByRole('button', { name: 'Enregistrer la ligne' }).tap();
  };
  await playLine(['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'd5e4']); // Rubinstein 3...dxe4
  await p.getByText(/Nouvelle ligne :/).waitFor({ timeout: 60000 });
  const m1 = await p.getByText(/Nouvelle ligne :/).innerText();
  assert(/1 ligne ajoutée\./.test(m1), 'ligne 3...dxe4 ajoutée et validée par Stockfish (' + m1 + ')');
  await playLine(['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'd8g5']); // 3...Qg5?? perd la dame
  await p.getByText(/Nouvelle ligne : 0/).waitFor({ timeout: 60000 });
  assert(/Refusée.*Qg5/.test(await p.getByText(/Nouvelle ligne : 0/).innerText()), 'message de refus');
  await p.screenshot({ path: OUT + '/v2-5-ligne-refusee.png' });
  assert(true, 'ligne 3...Qg5?? refusée (perte > 0,5 pion)');

  // --- Suppression
  p.once('dialog', (d) => d.accept());
  const n0 = await p.locator('.line-row').count();
  await p.locator('.line-row', { has: p.locator('.line-text', { hasText: /3\. Nc3 dxe4$/ }) }).getByTitle('Supprimer').tap();
  await p.getByText('Ligne supprimée.').waitFor();
  assert(await p.locator('.line-row').count() === n0 - 1, 'ligne supprimée');

  // --- Import PGN (variantes) + PGN illégal
  await p.getByRole('button', { name: 'Importer PGN' }).tap();
  await p.locator('textarea').fill('[Event "Étude"]\n\n1. e4 e6 2. d4 d5 3. Nc3 Bb4 (3... dxe4 4. Nxe4 Nd7) 4. e5 c5 *');
  await p.getByRole('button', { name: 'Importer', exact: true }).tap();
  await p.getByText(/Import \(1 chapitre\)/).waitFor({ timeout: 60000 });
  const m2 = await p.getByText(/Import \(1 chapitre\)/).innerText();
  assert(/2 lignes ajoutées/.test(m2), 'import PGN avec variante : 2 lignes (' + m2 + ')');
  await p.getByRole('button', { name: 'Importer PGN' }).tap();
  await p.locator('textarea').fill('1. e4 e6 2. Ke3 *');
  await p.getByRole('button', { name: 'Importer', exact: true }).tap();
  await p.getByText(/PGN refusé.*illégal « Ke3 »/).waitFor();
  assert(true, 'PGN illégal refusé avec message');

  // --- Drill : Système de Londres
  await p.goto(URL + '#/revise/london');
  await p.getByText(/Joue le coup de ton répertoire/).waitFor();
  const c1 = await p.evaluate(() => window.__db.cards.where('openingId').equals('london').toArray().then((a) => a.sort((x, y) => x.order - y.order)[0]));
  await tapMove(c1.accept[0]);
  await p.getByText(/est bien dans ton répertoire/).waitFor();
  await p.screenshot({ path: OUT + '/v2-6-drill.png' });
  const c1b = await p.evaluate((id) => window.__db.cards.get(id), c1.id);
  assert(c1b.due !== 'new' && c1b.attempts[0].ok, `drill juste (1.d4) → prochaine révision ${c1b.due}`);
  await p.getByRole('button', { name: 'Suivante' }).tap();
  const c2 = await p.evaluate(() => window.__db.cards.where('openingId').equals('london').toArray().then((a) => a.filter((c) => c.due === 'new').sort((x, y) => x.order - y.order)[0]));
  // mauvais coup : un coup légal hors répertoire
  const ch = new Chess(c2.fen);
  const bad = ch.moves({ verbose: true }).map((m) => m.from + m.to + (m.promotion ?? '')).find((u) => !c2.accept.includes(u) && !u.endsWith('q'));
  await tapMove(bad);
  await p.getByText(/n’est pas ton coup de répertoire/).waitFor();
  const c2b = await p.evaluate((id) => window.__db.cards.get(id), c2.id);
  assert(!c2b.attempts[0].ok, `drill faux → correction immédiate (prévu ${c2.acceptSan.join('/')}), à revoir ${c2b.due}`);

  // --- Stats par ouverture
  await p.goto(URL + '#/stats');
  await p.waitForTimeout(1500);
  await p.screenshot({ path: OUT + '/v2-7-stats.png', fullPage: true });
  if (errors.length) console.log('erreurs JS :', errors);
  const row = p.locator('tr', { hasText: 'Gambit Dame refusé (N)' });
  await row.waitFor();
  const cells = await row.locator('td').allInnerTexts();
  assert(cells[1] === '1' && cells[2] === '0 %' && /1 par moi/.test(cells[3]), 'stats GDR : 1 partie, 0 % de victoires, 1 sortie par moi');
  const fr = await p.locator('tr', { hasText: 'Défense française (N)' }).locator('td').allInnerTexts();
  assert(Number(fr[1]) >= 1 && /[1-9] par l’adversaire/.test(fr[3]), `stats Française : ${fr[1]} partie(s), ${fr[3]}`);
  await p.screenshot({ path: OUT + '/v2-7-stats.png', fullPage: true });

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
