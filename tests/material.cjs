// Matériel pendant la partie (iPhone émulé) : pièces prises à côté du nom de chaque joueur (icônes du jeu de pièces
// choisi, groupées), « +N » du camp qui a plus, pulsation quand son coup me coûte au moins 2 points, aria-label ;
// partie contre Maia (suit le coup affiché), revue, Explorer ; l'échiquier ne bouge pas.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const uciOf = (sans) => { const c = new Chess(); return sans.split(' ').map((s) => { const m = c.move(s); return m.from + m.to; }); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/api.chess.com/**', (r) => r.abort());
  const box = async () => { const r = await p.locator('.board-wrap').first().boundingBox(); return `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)}`; };
  const mat = async (who) => {
    const el = p.getByTestId(`mat-${who}`);
    return { caps: await el.getAttribute('data-caps'), adv: Number(await el.getAttribute('data-adv')), imgs: await el.locator('img').count() };
  };
  const setGame = (uci) => p.evaluate(({ uci, START }) => window.__db.meta.put({ key: 'current', value: {
    myColor: 'w', startFen: START, uci, rating: 800, botElo: 850, maiaMs: [], startedAt: Date.now(), unrated: true,
  } }), { uci, START });

  await p.goto(URL);
  await p.getByTestId('session').waitFor();

  // ---------- Partie contre Maia : rien de pris au départ
  await setGame([]);
  await p.goto(URL + '#/play');
  await p.getByText('à toi de jouer').waitFor({ timeout: 180000 });
  const box0 = await box();
  if (OUT) await p.screenshot({ path: `${OUT}/mat-0-depart.png` });
  let o = await mat('opp'), me = await mat('me');
  assert(o.caps === '' && o.adv === 0 && me.caps === '' && me.adv === 0, 'départ : aucune pièce prise, égalité → pas de +N');

  // 1.e4 e5 2.Bc4 Nf6 3.Bxf7+? Kxf7 : j'ai pris un pion, il a pris mon fou → il a +2, et son « +2 » pulse.
  await setGame(uciOf('e4 e5 Bc4 Nf6 Bxf7+ Kxf7'));
  await p.goto(URL + '#/stats');
  await p.goto(URL + '#/play');
  await p.getByText('à toi de jouer').waitFor({ timeout: 180000 });
  o = await mat('opp'); me = await mat('me');
  assert(o.caps === 'b' && o.adv === 2 && o.imgs === 1, 'adversaire (en haut) : mon fou pris, « +2 »');
  assert(me.caps === 'p' && me.adv === 0 && me.imgs === 1, 'moi (en bas) : un pion pris, pas de +N');
  const adv = p.getByTestId('mat-opp').locator('.mat-adv');
  assert(await adv.getAttribute('aria-label') === 'Les Noirs ont 2 points de plus', 'aria-label « Les Noirs ont 2 points de plus »');
  assert(await adv.innerText() === '+2', 'texte « +2 »');
  const src = await p.getByTestId('mat-opp').locator('img').first().getAttribute('src');
  assert(/pieces\/relief\/wB\.svg$/.test(src), 'icône du jeu de pièces choisi (Relief) : ' + src);
  assert(await p.getByTestId('mat-pulse').count() === 1, 'son coup m’a coûté 3 points : son « +2 » pulse');
  const anim = await p.getByTestId('mat-pulse').evaluate((e) => getComputedStyle(e).animationDuration + ' ' + getComputedStyle(e).animationIterationCount);
  assert(anim === '1s 1', 'pulsation : 1 seconde, une fois (' + anim + ')');
  const box1 = await box();
  assert(box1 === box0, 'l’échiquier n’a ni grandi ni bougé (' + box0 + ' / ' + box1 + ')');
  if (OUT) await p.screenshot({ path: `${OUT}/mat-1-partie.png` });

  // Le matériel suit le coup affiché (navigation) : avant 3…Kxf7, j'ai +1.
  await p.getByRole('button', { name: 'Coup précédent' }).tap();
  await p.getByText(/Tu revois le coup 3/).waitFor();
  o = await mat('opp'); me = await mat('me');
  assert(o.caps === '' && me.caps === 'p' && me.adv === 1 && o.adv === 0, 'navigation (coup 3.Bxf7+) : moi +1, rien pour lui');
  assert(await p.getByTestId('mat-pulse').count() === 0, 'mon coup : pas de pulsation');
  await p.evaluate(() => window.__db.meta.delete('current'));

  // ---------- Revue : 1.e4 d5 2.Qg4?? Bxg4 (le matériel suit le coup affiché)
  const id = await p.evaluate((START) => window.__db.games.add({
    source: 'app', date: Date.now(), myColor: 'w', startFen: START,
    uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
    ratingBefore: 900, ratingAfter: 870, botElo: 950,
  }), START);
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  await p.locator('.moves .mv').nth(1).tap();
  const boxR = await box();
  o = await mat('opp');
  assert(o.caps === '' && o.adv === 0, 'revue, coup 1…d5 : rien de pris');
  await p.locator('.moves .mv').nth(3).tap();
  o = await mat('opp'); me = await mat('me');
  assert(o.caps === 'q' && o.adv === 9 && me.adv === 0, 'revue, coup 2…Bxg4 : ma dame prise, « +9 » pour lui');
  assert(await p.getByTestId('mat-pulse').count() === 1, 'revue : son « +9 » pulse sur son coup');
  assert(await p.getByTestId('mat-opp').locator('.mat-adv').getAttribute('aria-label') === 'Les Noirs ont 9 points de plus', 'revue : aria-label');
  assert(await box() === boxR, 'revue : l’échiquier ne bouge pas d’un coup à l’autre');
  if (OUT) await p.screenshot({ path: `${OUT}/mat-2-revue.png` });

  // ---------- Explorer depuis cette position : même matériel (lu dans la partie), puis il suit mes coups
  await p.getByTestId('explore-btn').tap();
  await p.getByTestId('explorer').waitFor();
  o = await mat('opp');
  assert(o.caps === 'q' && o.adv === 9, 'Explorer : la dame prise dans la partie est affichée, « +9 »');
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  await sq('f1').tap(); await sq('b5').tap();     // 3.Bb5+
  await sq('c7').tap(); await sq('c6').tap();     // 3…c6
  await sq('b5').tap(); await sq('c6').tap();     // 4.Bxc6+
  await p.waitForFunction(() => document.querySelector('[data-testid="explorer"]').dataset.fen.startsWith('rn1qkbnr/pp2pppp/2B5'));
  me = await mat('me'); o = await mat('opp');
  assert(me.caps === 'p' && o.adv === 8, 'Explorer : je prends un pion → moi 1 pion, lui « +8 »');
  if (OUT) await p.screenshot({ path: `${OUT}/mat-3-explorer.png` });
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
