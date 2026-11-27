// Système de Londres (iPad émulé) : mise à jour d'un répertoire déjà enregistré (Londres sorti des Archives et complété,
// lignes …c5/…g6 contre 1.d4/1.c4/1.Nf3 archivées, « Londres en défense » ajouté), leçons, partie à thème, drill.
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
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();

  // 1. État d'AVANT la mise à jour : Londres archivé et court, …c5/…g6 avec 1.d4, pas de Londres en défense.
  await p.evaluate(async () => {
    const db = window.__db;
    await db.openings.update('london', { archived: true, pgn: '[Event "Système de Londres"]\n[Orientation "white"]\n\n1. d4 d5 2. Bf4 Nf6 3. e3 c5 *\n' });
    await db.openings.update('g6-system', { pgn: '[Event "x"]\n[Orientation "black"]\n\n1. e4 (1. d4 Nf6 2. c4 g6 3. Nc3 Bg7) 1... c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 *\n' });
    await db.openings.bulkDelete(['london-def', 'g6-old']);
    const cards = await db.cards.where('openingId').anyOf(['london-def', 'g6-old', 'london', 'g6-system']).toArray();
    await db.cards.bulkDelete(cards.map((c) => c.id));
    await db.meta.put({ key: 'openingsSeeded', value: ['english', 'g6-system', 'london', 'qgd', 'french'] });
    await db.meta.put({ key: 'openingsArchived', value: ['london', 'qgd', 'french'] });
    await db.meta.put({ key: 'openingsRev', value: { 'g6-system': 1 } });
  });
  await p.reload();
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.waitForFunction(() => window.__db.meta.get('openingsRev').then((m) => m?.value?.london === 1 && m?.value?.['g6-system'] === 2), null, { timeout: 30000 });
  const all = await p.evaluate(() => window.__db.openings.toArray());
  const by = Object.fromEntries(all.map((o) => [o.id, o]));
  assert(!by.london.archived && by.london.pgn.includes('1... e5') && by.london.pgn.includes('Bg5') && by.london.pgn.includes('3. e3 c5'), 'Londres sorti des Archives, complété (…e5, …e6, …c5, …g6, …f5), lignes existantes gardées');
  assert(!by['g6-system'].pgn.includes('1. d4') && by['g6-system'].pgn.includes('4. Nxd4 g6'), '…c5/…g6 : lignes contre 1.d4 retirées, 1.e4 gardé');
  assert(by['g6-old']?.archived && by['g6-old'].pgn.includes('1. d4'), 'anciennes lignes …c5/…g6 contre 1.d4/1.c4/1.Nf3 dans les Archives');
  assert(by['london-def'] && !by['london-def'].archived, '« Londres en défense » ajouté au répertoire');
  const drill = await p.evaluate(() => window.__db.cards.where('openingId').anyOf(['london', 'london-def', 'g6-system']).toArray());
  const c1 = new Chess(); c1.move('d4');
  const key = (c) => c.fen().split(' ').slice(0, 4).join(' ');
  assert(drill.some((c) => c.openingId === 'london-def' && c.key === key(c1) && c.acceptSan.join() === 'd5'), 'drill : Londres en défense, 1.d4 → …d5');
  assert(!drill.some((c) => c.openingId === 'g6-system' && c.key === key(c1)), 'drill : plus de carte …c5/…g6 après 1.d4');
  const c2 = new Chess(); ['d4', 'e5', 'dxe5', 'Nc6', 'Nf3', 'Qe7'].forEach((m) => c2.move(m));
  assert(drill.some((c) => c.openingId === 'london' && c.key === key(c2) && c.acceptSan.join() === 'Bg5'), 'drill : Englund, 4.Bg5 (pas le piège Bf4)');

  // 2. Écran Ouvertures : Blancs puis Noirs, accès aux nouvelles leçons.
  await p.goto(URL + '#/openings');
  await p.locator('section.opening[data-opening="london-def"] h3').waitFor();
  const titles = await p.locator('section.opening h3').allInnerTexts();
  assert(titles.join(' | ') === 'Anglaise (système fermé) | Système de Londres | Système …c5 / …g6 (Dragon accéléré) | Londres en défense', 'Ouvertures : ' + titles.join(' | '));
  const def = p.locator('section.opening[data-opening="london-def"]');
  assert(/l’adversaire joue d4 ou c4 ou ♘f3/.test(await def.innerText()), 'Londres en défense : l’adversaire commence par 1.d4, 1.c4 ou 1.♘f3');
  await p.screenshot({ path: OUT + '/lon-1-ouvertures.png' });

  // 3. Leçon « Londres en défense » : le fou sort avant …e6.
  await def.getByRole('button', { name: /1\. Leçon/ }).tap();
  await p.getByText(/Londres en défense » : contre 1\.d4/).waitFor();
  for (let i = 0; i < 6; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByRole('button', { name: 'À toi : rejoue ce bloc' }).waitFor();
  await p.getByRole('button', { name: 'À toi : rejoue ce bloc' }).tap();
  for (const [f, t] of [['d7', 'd5'], ['c7', 'c6'], ['g8', 'f6']]) { await p.getByText('Joue le coup de la leçon.').waitFor({ timeout: 10000 }); await sq(f).tap(); await sq(t).tap(); }
  await p.getByText('Bloc réussi').waitFor({ timeout: 10000 });
  await p.getByRole('button', { name: 'Bloc suivant' }).tap();
  for (let i = 0; i < 2; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  assert(/Ton fou sort AVANT …e6/.test(await p.locator('.side-col').innerText()), 'leçon : 4…♗f5, le fou sort avant …e6');
  await p.screenshot({ path: OUT + '/lon-2-lecon-noirs.png' });

  // 4. Leçon Londres (Blancs), bloc « autres premiers coups » : le piège de l'Englund.
  await p.goto(URL + '#/openings');
  await p.locator('section.opening[data-opening="london"] h3').waitFor();
  await p.locator('section.opening[data-opening="london"]').getByRole('button', { name: 'Leçon : contre les autres premiers coups noirs' }).tap();
  await p.getByTestId('extra-title').waitFor();
  assert(/Ligne 1\/5 : 1…e6/.test(await p.locator('.side-col').innerText()), 'Londres : bloc « autres premiers coups », ligne 1/5 (1…e6)');
  assert(await p.getByText(/Contre 1…e6, 1…g6 et 1…f5/).count() === 1, 'introduction : placement gardé, exceptions 1…c5 et Englund');
  await p.screenshot({ path: OUT + '/lon-3-lecon-blancs.png' });

  // 5. Partie à thème « Londres en défense » : l'adversaire commence par 1.d4, 1.c4 ou 1.Nf3.
  const firsts = new Set();
  for (let k = 0; k < 3; k++) {
    await p.goto(URL + '#/openings');
    await p.locator('section.opening[data-opening="london-def"] h3').waitFor();
    await p.locator('section.opening[data-opening="london-def"]').getByRole('button', { name: /Partie à thème/ }).tap();
    for (let i = 0; i < 300; i++) {
      const cur = await p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
      if (cur && cur.uci.length >= 1) { firsts.add(cur.uci[0]); assert(cur.myColor === 'b', `partie ${k + 1} : je joue les Noirs, 1er coup blanc ${cur.uci[0]}`); break; }
      await p.waitForTimeout(200);
    }
    await p.getByRole('button', { name: /Annuler la partie/ }).tap();
    await p.locator('.modal-box').getByRole('button', { name: 'Annuler la partie' }).tap();
    await p.getByRole('heading', { name: 'Jouer contre Maia' }).waitFor();
  }
  assert([...firsts].every((u) => ['d2d4', 'c2c4', 'g1f3'].includes(u)), 'premiers coups imposés : ' + [...firsts].join(', '));

  // 6. Drill de l'ouverture.
  await p.goto(URL + '#/revise/london-def');
  await p.getByText(/Joue le coup de ton répertoire \(Noirs\)/).waitFor();
  assert(true, 'drill « Londres en défense » disponible');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
