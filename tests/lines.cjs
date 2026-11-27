// « Jouer les lignes » sur une ligne du Londres (iPad émulé) : boutons 1→4 et progression, l'adversaire joue la ligne,
// refus 1 (« réessaie ») et 2 (flèche + commentaire de la leçon), ligne « à refaire » reprise en premier, ✓ et plan,
// progression enregistrée, puis « Continuer la partie » contre Maia (partie non comptée).
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const MAIN = ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e6', 'Ngf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'b6', 'Ne5', 'Bb7', 'f4'];
const E6 = ['d4', 'e6', 'Bf4', 'c5', 'e3', 'd5', 'Nf3', 'Nf6', 'c3', 'Nc6', 'Nbd2', 'Nh5', 'Bg3', 'Nxg3', 'hxg3', 'Qb6', 'Qc2', 'g6', 'Bd3', 'Bd7'];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const tap = async (from, to) => { await sq(from).tap(); await sq(to).tap(); };
  const plyIs = (k) => p.locator(`.play-lines[data-ply="${k}"]`).waitFor({ timeout: 15000 });
  const prog = () => p.evaluate(() => window.__db.meta.get('lineProgress').then((m) => m?.value?.london ?? null));

  /** Joue une ligne (la principale par défaut) depuis le demi-coup `from` ; `wrong` : coups faux essayés au coup `atPly`. */
  async function playMain({ wrong = [], atPly = -1, shots = false, line = MAIN, from = 0 } = {}) {
    const MAINL = line;
    const c = new Chess();
    MAINL.slice(0, from).forEach((m) => c.move(m));
    for (let k = from; k < MAINL.length; k++) {
      await plyIs(k);
      if (k % 2 === 1) { c.move(MAINL[k]); continue; }          // coup noir : joué tout seul
      await p.getByTestId('lines-prompt').waitFor({ timeout: 15000 });
      if (k === atPly) {
        for (const [i, w] of wrong.entries()) {
          const m = new Chess(c.fen()).move(w);
          await tap(m.from, m.to);
          if (i === 0) {
            await p.getByTestId('lines-msg').filter({ hasText: 'Pas le coup de ton répertoire, réessaie.' }).waitFor();
            assert(true, `1er refus (${w}) : « Pas le coup de ton répertoire, réessaie. »`);
            assert(await p.locator(`.play-lines[data-ply="${k}"]`).count() === 1, 'coup refusé : annulé, la position ne change pas');
          } else {
            await p.getByTestId('lines-solution').waitFor();
            const t = await p.getByTestId('lines-solution').innerText();
            assert(/Le coup de ton répertoire : ♗f4/.test(t) && /signature du Londres/.test(t) && /à refaire/.test(t), '2e refus : bon coup en flèche + commentaire de la leçon (« signature du Londres »), ligne « à refaire »');
            const arrows = await p.evaluate(() => [...document.querySelectorAll('.board-wrap [stroke]')].filter((e) => /30,\s*160,\s*60/.test(e.getAttribute('stroke'))).length);
            assert(arrows === 1, 'flèche verte sur le bon coup');
            if (shots) await p.screenshot({ path: OUT + '/lines-2-solution.png' });
          }
        }
      }
      const m = c.move(MAINL[k]);
      await tap(m.from, m.to);
    }
    await p.getByTestId('lines-done').waitFor({ timeout: 15000 });
  }

  await p.goto(URL + '#/openings');
  await p.locator('section.opening[data-opening="london"] h3').waitFor();
  assert(await p.getByText(/1\. Leçon → 2\. Drill → 3\. Jouer les lignes → 4\. Partie à thème/).count() === 1, 'texte d’aide : 1. Leçon → 2. Drill → 3. Jouer les lignes → 4. Partie à thème');
  const btns = await p.locator('section.opening[data-opening="london"] .row button').allInnerTexts();
  const i = (re) => btns.findIndex((t) => re.test(t));
  assert(i(/1\. Leçon/) < i(/2\. Drill/) && i(/2\. Drill/) < i(/3\. Jouer les lignes \(0\/13\)/) && i(/3\. Jouer/) < i(/4\. Partie à thème/), 'boutons dans l’ordre, progression « 3. Jouer les lignes (0/13) »');
  await p.getByTestId('lines-london').tap();

  // Ligne 1 = ligne principale de la leçon.
  await p.getByTestId('lines-banner').waitFor();
  const banner = (await p.getByTestId('lines-banner').innerText()).replace(/\s+/g, ' ');
  assert(/Système de Londres · Ligne 1\/13 · Coup 1\/10/.test(banner), 'bandeau : ' + banner);
  await p.screenshot({ path: OUT + '/lines-1-debut.png' });
  await playMain({ wrong: ['Nf3', 'c4'], atPly: 2, shots: true });
  let done = await p.getByTestId('lines-done').innerText();
  assert(/Ligne terminée/.test(done) && await p.getByTestId('line-ok').count() === 0 && /à refaire/.test(done), 'fin de ligne avec erreurs : « Ligne terminée », sans ✓, à refaire');
  let pr = await prog();
  const k1 = MAIN.join(' ');
  assert(pr.lines[k1].status === 'redo' && pr.errors.length === 2 && pr.errors[0].expected === 'Bf4' && pr.errors[0].played === 'Nf3' && pr.errors[1].played === 'c4', 'progression : ligne « à refaire », 2 erreurs (attendu ♗f4, joué ♘f3 puis c4)');

  // Ligne suivante : la ligne « à refaire » revient d'abord.
  await p.getByRole('button', { name: 'Ligne suivante' }).tap();
  await p.getByTestId('lines-banner').filter({ hasText: 'Ligne 1/13' }).waitFor();
  assert(true, 'ligne suivante : d’abord la ligne « à refaire » (1/13)');
  await playMain();
  done = await p.getByTestId('lines-done').innerText();
  assert(/Ligne terminée/.test(done) && await p.getByTestId('line-ok').count() === 1 && /Le plan/.test(done) && /Tes pièces vont presque toujours aux mêmes cases/.test(done), 'sans erreur : « Ligne terminée » + ✓ (icône) et le plan de la leçon');
  await p.screenshot({ path: OUT + '/lines-3-fin.png' });
  pr = await prog();
  assert(pr.lines[k1].status === 'ok' && pr.lines[k1].plays === 2, 'progression : ligne validée (✓), jouée 2 fois');

  // Ligne suivante : jamais jouée, dans l'ordre de la leçon (bloc « autres premiers coups » : 1…e6).
  await p.getByRole('button', { name: 'Ligne suivante' }).tap();
  await p.getByTestId('lines-banner').filter({ hasText: 'Ligne 2/13' }).waitFor();
  await plyIs(0);
  await tap('d2', 'd4');
  await plyIs(2);
  assert(/1\.d4 e6/.test(await p.locator('.line-text').innerText()), 'ligne 2 : 1…e6 (l’adversaire joue la ligne)');

  await playMain({ line: E6, from: 2 });
  assert(await p.getByTestId('line-ok').count() === 1 && /Contre les autres premiers coups noirs/.test(await p.getByTestId('lines-done').innerText()),
    'ligne 2 ✓, avec le bloc de la leçon qui la couvre (« Contre les autres premiers coups noirs »)');

  // « Continuer la partie » : Maia reprend depuis la fin de la ligne, partie non comptée.
  const before = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? null));
  await p.getByRole('button', { name: /Continuer la partie/ }).tap();
  await p.waitForURL(/#\/play\/london/);
  const cur = await p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  const prof = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? { rating: 900 }));
  assert(cur && cur.unrated === true && cur.uci.length === E6.length && cur.myColor === 'w' && cur.openingId === 'london' && Math.round(cur.botElo) === Math.round(prof.rating + 50),
    `partie continuée : non comptée, ${cur.uci.length} demi-coups de la ligne, Maia à ${Math.round(cur.botElo)} (R + 50)`);
  await p.getByText('Maia a joué').waitFor({ timeout: 120000 });
  assert(true, 'Maia répond depuis la position de la ligne');
  await p.getByRole('button', { name: /Abandonner/ }).tap();
  await p.locator('.modal-box').getByRole('button', { name: 'Abandonner' }).tap();
  await p.waitForURL(/#\/comment\/\d+$/);
  const g = await p.evaluate(() => window.__db.games.toArray().then((a) => a[a.length - 1]));
  const after = await p.evaluate(() => window.__db.meta.get('profile').then((m) => m?.value ?? { rating: 900 }));
  assert(g.unrated && g.uci.slice(0, E6.length).join() === cur.uci.join() && after.rating === (before?.rating ?? after.rating), 'partie enregistrée (non comptée, analysée comme les autres) ; niveau inchangé');
  await p.getByTestId('comment-analysing').or(p.locator('.comment[data-ply], [data-testid="comment-done"]')).first().waitFor({ timeout: 60000 });
  assert(true, 'fin de partie : analyse et commentaires, comme les autres parties');
  await p.goto(URL + '#/openings');
  await p.getByTestId('lines-london').filter({ hasText: '3. Jouer les lignes (2/13)' }).waitFor();
  assert(true, 'écran Ouvertures : « 3. Jouer les lignes (2/13) »');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
