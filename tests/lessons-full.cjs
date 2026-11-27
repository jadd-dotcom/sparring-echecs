// Leçons complètes (Anglaise, iPhone émulé) : le sommaire range les autres lignes par carrefour ; une ligne générée se
// regarde coup par coup (un « pourquoi » à chaque coup, les deux camps), finit par sa phrase de plan, puis se rejoue.
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
  await p.goto(URL);
  await p.getByTestId('session').waitFor();

  await p.getByTestId('tab-openings').tap();
  await p.getByTestId('open-english').tap();
  await p.getByTestId('opening-head').waitFor();
  const groups = await p.locator('.toc-group').allInnerTexts();
  const cx = groups.filter((t) => /^Carrefour /.test(t));
  assert(cx.length >= 10, `sommaire : ${cx.length} groupes « Carrefour … » (ex. ${cx[0]})`);
  const n = await p.locator('[data-testid^="toc-extra:cx-english-"]').count();
  assert(n === 14, `14 lignes complétées dans le sommaire (${n})`);

  // Regarder la 1re ligne du 1er carrefour : un pourquoi à chaque coup, puis le plan.
  await p.locator('[data-testid="toc-extra:cx-english-1:0"]').getByRole('button', { name: 'Regarder' }).tap();
  await p.locator('.lesson-play[data-stage="watch"]').waitFor();
  assert(/^Carrefour après 1\.c4/.test(await p.getByTestId('extra-title').innerText()), 'titre du bloc : le carrefour');
  const whys = [];
  for (let i = 0; i < 30 && !(await p.getByTestId('line-plan').count()); i++) {
    await p.getByRole('button', { name: 'Coup suivant' }).tap();
    const t = (await p.locator('.side-col .why').first().innerText()).trim();
    whys.push(t);
  }
  assert(whys.length === 9 && whys.every((t) => t.length > 10 && t.endsWith('.')), `9 coups, une phrase chacun (${whys[0]} … ${whys[8]})`);
  assert(whys.some((t) => /^(Son|Sa|Le pion f5)/.test(t)) && whys.some((t) => /^(Ton|Ta|Petit roque : ton)/.test(t)), 'les deux camps sont expliqués');
  const plan = await p.getByTestId('line-plan').innerText();
  assert(/Le plan/.test(plan) && /h3/.test(plan), 'phrase de plan à la fin de la ligne : ' + plan.replace(/\s+/g, ' '));
  if (OUT) await p.screenshot({ path: `${OUT}/lecon-carrefour.png` });

  // Rejouer la ligne : mes coups, puis « Ligne réussie » avec le plan.
  await p.getByRole('button', { name: /rejoue ce bloc/ }).tap();
  await p.locator('.lesson-play[data-stage="replay"]').waitFor();
  for (let i = 0; i < 20 && !/Ligne réussie/.test(await p.locator('.side-col').innerText()); i++) {
    const el = p.locator('.lesson-play');
    const exp = await el.getAttribute('data-expected');
    if (exp) { await tapMove(await el.getAttribute('data-fen'), exp); await p.waitForTimeout(150); } else await p.waitForTimeout(400);
  }
  assert(/Ligne réussie/.test(await p.locator('.side-col').innerText()), 'ligne rejouée sans erreur');
  assert(/h3/.test(await p.getByTestId('line-plan-done').innerText()), 'le plan est rappelé en fin de ligne');
  await p.getByTestId('back').tap();
  await p.locator('[data-testid="toc-extra:cx-english-1:0"][data-status="done"]').waitFor({ timeout: 5000 }).catch(() => {});
  assert(await p.locator('[data-testid="toc-extra:cx-english-1:0"]').getAttribute('data-status') === 'done', 'sommaire : ligne ✓');
  assert(errors.length === 0, 'aucune erreur JavaScript' + (errors.length ? ' : ' + errors.join(' | ') : ''));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
