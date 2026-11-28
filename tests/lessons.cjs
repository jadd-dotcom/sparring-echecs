// Mode Leçon des ouvertures (Anglaise) sur iPad émulé.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const MAIN = ['c4', 'e5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'd3', 'd6', 'e4', 'Nge7', 'Nge2', 'O-O', 'O-O', 'Be6', 'Nd5', 'Qd7', 'Be3', 'f5'];
const MODEL_LEN = 16;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const uciOf = (k) => { const c = new Chess(); MAIN.slice(0, k).forEach((s) => c.move(s)); const m = c.move(MAIN[k]); return m.from + m.to; };
  const tap = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };

  await p.goto(URL + '#/openings');
  await p.getByText(/Ordre conseillé pour chaque ouverture : 1\. Leçon → 2\. Drill → 3\. Jouer les lignes → 4\. Partie à thème/).waitFor();
  const titles = await p.locator('section.opening h3').allInnerTexts();
  assert(titles.join(' | ') === 'Anglaise (système fermé) | Système de Londres | Système …c5 / …g6 (Dragon accéléré) | Londres en défense', 'ordre : Anglaise, Londres (Blancs), puis …c5/…g6 et Londres en défense (Noirs)');
  await p.getByRole('tab', { name: /Archives \(3\)/ }).tap();
  const arch = await p.locator('section.opening h3').allInnerTexts();
  assert(arch.join(' | ') === 'Système …c5/…g6 contre 1.d4, 1.c4, 1.♘f3 (ancien) | Gambit Dame refusé | Défense française', 'Archives : ancien …c5/…g6 contre 1.d4, GDR, Française (consultables)');
  assert(await p.locator('section.opening').first().getByRole('button', { name: 'Partie à thème' }).count() === 0, 'Archives : leçon et répertoire, pas de partie à thème');
  await p.screenshot({ path: OUT + '/l-0-archives.png' });
  await p.getByRole('tab', { name: 'Mon répertoire' }).tap();
  await p.screenshot({ path: OUT + '/l-1-ouvertures.png' });
  await p.locator('section', { hasText: 'Anglaise (système fermé)' }).getByRole('button', { name: /1\. Leçon/ }).tap();

  // Bloc 1 : regarder
  await p.getByText(/Avance coup par coup/).waitFor();
  await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByText(/Mot nouveau — centre/).waitFor();
  assert(true, '1er coup : « centre » expliqué à sa 1re apparition');
  for (let i = 1; i < 6; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  assert(await p.getByRole('heading', { name: /3… g6/ }).count() === 1, 'bloc 1 regardé jusqu’à 3…g6');
  await p.screenshot({ path: OUT + '/l-2-regarder.png' });

  // Bloc 1 : rejouer avec deux erreurs
  await p.getByRole('button', { name: 'À toi : rejoue ce bloc' }).tap();
  await p.getByText('Joue le coup de la leçon.').waitFor();
  await tap('e2e4');
  await p.getByText(/la pièce à jouer est surlignée/).waitFor();
  assert(true, '1re erreur : case de départ surlignée');
  await tap('e2e3');
  await p.getByText(/Solution : 1\. c4/).waitFor();
  await p.screenshot({ path: OUT + '/l-3-solution.png' });
  assert(true, '2e erreur : solution affichée');
  await tap(uciOf(0));
  for (const k of [2, 4]) { await p.getByText('Joue le coup de la leçon.').waitFor(); await tap(uciOf(k)); }
  // Rejeu avec erreurs : le bloc est « à revoir », pas « fait ».
  await p.getByText(/Bloc à revoir \(1 erreur\)/).waitFor();
  assert(true, 'rejeu avec erreur : bloc « à revoir »');
  await p.waitForTimeout(400);
  const introduced = await p.evaluate(() => window.__db.cards.where('openingId').equals('english').filter((c) => c.due !== 'new').count());
  assert(introduced >= 3, `les coups du bloc entrent dans le drill (${introduced} cartes programmées)`);

  // Blocs suivants
  for (let blk = 1; blk < 4; blk++) {
    await p.getByRole('button', { name: 'Bloc suivant' }).tap();
    const s = blk * 6, e = Math.min(MAIN.length, s + 6);
    for (let i = s; i < e; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
    await p.getByRole('button', { name: 'À toi : rejoue ce bloc' }).tap();
    for (let k = s; k < e; k += 2) { await p.getByText('Joue le coup de la leçon.').waitFor(); await tap(uciOf(k)); }
    await p.getByText('Bloc réussi', { exact: true }).waitFor();
  }
  assert(true, 'les 4 blocs regardés et rejoués');

  // Plan et partie type
  await p.getByRole('button', { name: 'Le plan' }).tap();
  await p.getByRole('heading', { name: 'Le plan' }).waitFor();
  assert(await p.locator('.why').count() === 3, 'le plan en 3 phrases');
  await p.getByRole('button', { name: 'Voir une partie type' }).tap();
  await p.getByText(/jouée par Stockfish/).waitFor();
  for (let i = 0; i < MODEL_LEN; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.screenshot({ path: OUT + '/l-4-partie-type.png' });
  await p.getByRole('button', { name: 'Terminer la leçon' }).tap();
  await p.getByText('Leçon terminée', { exact: true }).waitFor();
  const all = await p.evaluate(() => window.__db.cards.where('openingId').equals('english').filter((c) => c.due !== 'new').count());
  assert(all >= 10, `leçon terminée : ${all} cartes de drill programmées (ligne principale)`);
  await p.goto(URL); await p.goto(URL + '#/openings');
  await p.locator('section', { hasText: 'Anglaise (système fermé)' }).getByRole('button', { name: '1. Leçon terminée' }).waitFor();
  assert(true, 'écran Ouvertures : « 1. Leçon » cochée (terminée)');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
