// Répertoire Noirs (24/11) sur iPad émulé : bloc de leçon « Contre les attaques rapides sur f7 » (regarder, rejouer,
// entrée dans le drill) et fusion, une seule fois, des nouvelles lignes dans un répertoire déjà enregistré.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const LINE1 = ['e4', 'c5', 'Qh5', 'd6', 'Bc4', 'g6', 'Qe2', 'Bg7', 'Nf3', 'Nc6', 'O-O', 'Nf6', 'h3', 'O-O', 'd3', 'Rb8'];
const key = (fen) => fen.split(' ').slice(0, 4).join(' ');

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();

  // 1. Répertoire déjà enregistré AVANT la mise à jour : un arbre court, pas de révision enregistrée.
  const OLD = '[Event "Système …c5 / …g6 (Dragon accéléré)"]\n[Orientation "black"]\n\n1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 *\n';
  await p.evaluate(async (pgn) => {
    await window.__db.openings.update('g6-system', { pgn });
    await window.__db.meta.delete('openingsRev');
    const old = await window.__db.cards.where('openingId').equals('g6-system').toArray();
    await window.__db.cards.bulkDelete(old.map((c) => c.id));
  }, OLD);
  await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForFunction(() => window.__db.meta.get('openingsRev').then((m) => m?.value?.['g6-system'] === 1), null, { timeout: 30000 });
  const o = await p.evaluate(() => window.__db.openings.get('g6-system'));
  assert(o.pgn.includes('2. Qh5') && o.pgn.includes('2. Qf3') && o.pgn.includes('1. e3'), 'nouvelles lignes fusionnées dans le répertoire enregistré');
  assert(o.pgn.includes('3... cxd4 4. Nxd4 g6') && !o.pgn.includes('1. d4'), 'lignes existantes gardées ; seules les lignes ajoutées sont fusionnées (pas tout le répertoire par défaut)');
  const c = new Chess(); ['e4', 'c5', 'Qh5'].forEach((m) => c.move(m));
  const card = await p.evaluate((k) => window.__db.cards.where('openingId').equals('g6-system').filter((x) => x.key === k).first(), key(c.fen()));
  assert(card && card.acceptSan.join() === 'd6' && card.due === 'new', 'position après 2.♕h5 : nouvelle carte de drill (réponse …d6)');
  const nChecks = Object.keys(o.checks).length;
  await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForTimeout(1500);
  const o2 = await p.evaluate(() => window.__db.openings.get('g6-system'));
  assert(o2.pgn === o.pgn && Object.keys(o2.checks).length === nChecks && nChecks > 50, `fusion faite une seule fois ; vérifications Stockfish reprises (${nChecks})`);

  // 2. Bloc de leçon « Contre les attaques rapides sur f7 » depuis l'écran Ouvertures.
  await p.goto(URL + '#/openings');
  const g6 = p.locator('section.opening[data-opening="g6-system"]');
  await g6.getByRole('button', { name: 'Leçon : contre les attaques rapides sur f7' }).tap();
  await p.getByTestId('extra-title').filter({ hasText: 'Contre les attaques rapides sur f7' }).waitFor();
  assert(await p.getByText(/que seul ton roi protège/).count() === 1, 'introduction du bloc');
  assert(/Ligne 1\/6 : 2\.♕h5/.test(await p.getByText(/Ligne 1\/6/).innerText()), 'ligne 1/6 : 2.♕h5');
  for (let i = 0; i < 14; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  assert(await p.getByText(/Ta tour prépare …b5/).count() === 1, 'une phrase par coup, jusqu’à 8…♖b8');
  for (let i = 0; i < 10; i++) await p.getByRole('button', { name: /Coup précédent/ }).tap();
  assert(await p.getByText(/Le pion g6 coupe la route de la dame vers f7/).count() === 1, '3…g6 : la dame est coupée de f7 et attaquée');
  await p.screenshot({ path: OUT + '/f7-1-regarder.png' });
  for (let i = 0; i < 10; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByRole('button', { name: 'À toi : rejoue ce bloc' }).tap();

  // Rejouer : mes 7 coups (les coups blancs se jouent seuls) ; une erreur d'abord → case surlignée.
  const ch = new Chess(); ['e4', 'c5'].forEach((m) => ch.move(m));
  let first = true;
  for (let k = 2; k < LINE1.length; k++) {
    if (k % 2 === 0) { ch.move(LINE1[k]); continue; }
    await p.getByText('Joue le coup de la leçon.').waitFor({ timeout: 10000 });
    if (first) {
      first = false;
      await sq('b8').tap(); await sq('c6').tap();      // …♘c6 ? (la dame prendrait c5)
      await p.getByText(/la pièce à jouer est surlignée/).waitFor();
      assert(true, 'mauvais coup : la pièce à jouer est surlignée');
    }
    const m = ch.move(LINE1[k]);
    await sq(m.from).tap(); await sq(m.to).tap();
  }
  await p.getByText(/Ligne à revoir \(1 erreur\)/).waitFor({ timeout: 10000 });
  assert(true, 'ligne rejouée avec une erreur : « à revoir »');
  await p.screenshot({ path: OUT + '/f7-2-rejouer.png' });
  const dd = await p.evaluate((k) => window.__db.cards.where('openingId').equals('g6-system').filter((x) => x.key === k).first(), key(c.fen()));
  assert(dd.due !== 'new', `après la ligne rejouée : la position après 2.♕h5 entre dans le drill (révision le ${dd.due})`);
  assert(await p.getByRole('button', { name: 'Ligne suivante' }).count() === 1, 'ligne suivante proposée');
  await p.getByRole('button', { name: 'Ligne suivante' }).tap();
  assert(/Ligne 2\/6 : 2\.♕h5 d6 3\.♗c4 g6 4\.♕f3/.test(await p.getByText(/Ligne 2\/6/).innerText()), 'ligne 2/6 : la dame revient en f3');
  assert(await p.getByText(/Début : 1\.e4 c5 2\.♕h5 d6 3\.♗c4 g6/).count() === 1, 'ligne 2 : début rappelé, l’échiquier part de 3…g6');

  // 3. Drill de l'ouverture : la nouvelle position y est proposée.
  await p.evaluate((id) => window.__db.cards.update(id, { due: '2000-01-01' }), dd.id);
  await p.goto(URL + '#/openings'); await p.goto(URL + '#/revise/g6-system');
  await p.getByText(/Joue le coup de ton répertoire/).waitFor();
  const shown = await p.locator('.line-text').innerText();
  assert(/2\. ?♕h5$/.test(shown), 'drill : la position après 2.♕h5 est proposée (' + shown + ')');
  await sq('d7').tap(); await sq('d6').tap();
  await p.getByText(/Juste !/).waitFor();
  assert(true, 'drill : …d6 accepté');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
