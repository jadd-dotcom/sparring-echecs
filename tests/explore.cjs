// Explorer, « Voir la suite » et « Lis la menace » (iPad émulé).
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const strokes = (p, re) => p.evaluate((src) => [...document.querySelectorAll('.board-wrap [stroke]')].filter((e) => new RegExp(src).test(e.getAttribute('stroke'))).length, re.source);
const GREEN = /30,\s*160,\s*60/, RED = /220,\s*40,\s*40/;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  // Partie connue : 1.e4 d5 2.Qg4?? Bxg4
  const id = await p.evaluate(() => window.__db.games.add({
    source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
    ratingBefore: 900, ratingAfter: 870, botElo: 950,
  }));
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });

  // ---------------- Explorer (depuis la revue : position après 1…d5, à moi de jouer)
  await p.locator('.moves .mv').nth(1).tap();
  await p.getByTestId('explore-btn').tap();
  await p.getByTestId('explorer').waitFor();
  await p.getByTestId('explorer-best').filter({ hasText: 'Ton meilleur coup' }).waitFor({ timeout: 30000 });
  assert(await strokes(p, GREEN) === 1, 'Explorer : mon meilleur coup en flèche verte');
  assert(/^(Tu gagnes|Égal|Tu perds) \(\d+ % de chances pour toi\)/.test(await p.getByTestId('explorer-verdict').locator('h3').innerText()), 'indicateur « Tu gagnes / Égal / Tu perds »');
  assert(/matériel égal/.test(await p.getByTestId('explorer-verdict').innerText()), 'bilan matériel en mots');
  await sq('e4').tap(); await sq('d5').tap();                 // je prends d5
  await p.getByTestId('explorer-best').filter({ hasText: 'Sa meilleure réponse' }).waitFor({ timeout: 30000 });
  assert(await strokes(p, RED) === 1, 'au tour de l’adversaire : sa meilleure réponse en flèche rouge');
  const said = await p.getByTestId('explorer-best').innerText();
  assert(/Sa (dame|meilleure)|Son |prend|va en/.test(said), 'phrase en mots : ' + said.replace(/\s+/g, ' '));
  assert(/tu as 1 point de matériel en plus/.test(await p.getByTestId('explorer-verdict').innerText()), 'bilan matériel après exd5 : +1');
  await sq('d8').tap(); await sq('d5').tap();                 // je joue aussi pour lui : …Qxd5
  await p.waitForFunction(() => document.querySelector('[data-testid="explorer"]').dataset.fen.startsWith('rn1qkbnr/ppp1pppp/8/3q4') || document.querySelector('[data-testid="explorer"]').dataset.fen.includes('3q4'));
  assert(true, 'je bouge les pièces des deux camps');
  await p.screenshot({ path: OUT + '/ex-1-explorer.png' });
  await p.getByRole('button', { name: 'Annuler un coup' }).tap();
  assert((await p.getByTestId('explorer').getAttribute('data-fen')).includes('3P4'), '◀ annule un coup');
  await p.getByRole('button', { name: 'Revenir à la position' }).tap();
  assert((await p.getByTestId('explorer').getAttribute('data-fen')).startsWith('rnbqkbnr/ppp1pppp/8/3p4/4P3'), '« Revenir à la position »');
  await p.getByRole('button', { name: 'Quitter' }).tap();
  await p.locator('table.classes').waitFor();
  assert((await p.evaluate((id) => window.__db.games.get(id), id)).uci.length === 4, '« Quitter » : retour à la revue, rien n’est enregistré');

  // ---------------- « Voir la suite » (revue de 2.Qg4??) : la suite se joue sur l'échiquier, légende en mots
  await p.locator('.moves .mv').nth(2).tap();
  await p.getByRole('button', { name: 'Je ne sais pas' }).tap();
  await p.getByText('Motif :').waitFor();
  assert(await p.getByText('Réfutation :').isVisible() === false, 'la suite en notation est repliée (« Afficher la notation »)');
  await p.getByTestId('suite-mine').tap();
  await p.getByTestId('suite').waitFor();
  const cap1 = await p.getByTestId('suite-caption').innerText();
  assert(/^Son fou prend ta dame g4/.test(cap1), '1er coup de la suite en mots : ' + cap1);
  assert(await strokes(p, RED) === 1 && await strokes(p, GREEN) === 0, 'coup adverse : une flèche rouge');
  assert(/coup 1\/\d/.test(await p.getByTestId('suite').innerText()), 'compteur de coups');
  await p.getByRole('button', { name: 'Coup suivant de la suite' }).tap();
  const cap2 = await p.getByTestId('suite-caption').innerText();
  assert(cap2 !== cap1 && /^(Ton|Ta|Tu) /.test(cap2), '▶ : coup suivant, le mien, en mots : ' + cap2);
  assert(await strokes(p, GREEN) === 1 && await strokes(p, RED) === 0, 'mon coup : une flèche verte');
  await p.screenshot({ path: OUT + '/ex-2-suite.png' });
  await p.getByRole('button', { name: 'Coup précédent de la suite' }).tap();
  assert(await p.getByTestId('suite-caption').innerText() === cap1, '◀ : retour au coup précédent');
  await p.getByTestId('suite').getByRole('button', { name: 'Fermer' }).tap();
  assert(await p.getByTestId('suite').count() === 0, '« Fermer » referme la suite');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
