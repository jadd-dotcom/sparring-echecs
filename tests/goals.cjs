// « Mon objectif » : marque « Règle de l'objectif » dans la revue, carte de l'accueil (règle, X/10, pastilles, point
// de départ, À surveiller), puis maîtrise (7/10) → message et objectif suivant (iPhone émulé).
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const DAY = 86400000;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/api.chess.com/**', (r) => r.abort());
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  await p.getByTestId('goal-card').waitFor();
  assert(await p.getByTestId('goal-name').innerText() === 'Ne rien donner', 'premier objectif actif : « Ne rien donner »');
  const since = Date.now() - 5 * DAY;
  await p.evaluate((since) => window.__db.meta.put({ key: 'goals', value: { active: 0, since, mastered: {}, messages: [] } }), since);

  // ---------- Revue : la gaffe « pièce laissée en prise » (2.Qg4??) est marquée « Règle de l'objectif »
  const id = await p.evaluate(() => window.__db.games.add({
    source: 'app', date: Date.now() - 20 * 86400000, myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
    ratingBefore: 900, ratingAfter: 870, botElo: 950,
  }));
  await p.goto(URL + '#/review/' + id);
  await p.locator('table.classes').waitFor({ timeout: 180000 });
  await p.locator('.moves .mv').nth(2).tap();
  await p.getByRole('button', { name: 'Je n’ai pas vu la menace' }).tap();
  await p.getByTestId('goal-mark').waitFor();
  assert(/Règle de l’objectif « Ne rien donner » : Avant de lâcher la pièce/.test(await p.getByTestId('goal-mark').innerText()), 'revue : gaffe marquée « Règle de l’objectif »');
  assert(await p.getByTestId('goal-move').count() === 1, 'revue : le coup est marqué dans la liste');
  await p.locator('.moves .mv').nth(0).tap();
  assert(await p.getByTestId('goal-mark').count() === 0, 'les autres coups ne sont pas marqués');

  // ---------- Accueil : 10 parties avant le début (4 propres), 6 après (4 propres), gaffes « Gain raté » à surveiller
  const add = (games) => p.evaluate((gs) => window.__db.games.bulkAdd(gs.map(([daysAgo, motifs]) => ({
    source: 'chesscom', date: Date.now() - daysAgo * 86400000, myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    // 12 coups à moi (les cavaliers vont et viennent) : partie mesurée.
    uci: Array.from({ length: 24 }, (_, i) => ['g1f3', 'g8f6', 'f3g1', 'f6g8'][i % 4]),
    san: Array.from({ length: 24 }, (_, i) => ['Nf3', 'Nf6', 'Ng1', 'Ng8'][i % 4]),
    result: '1-0', score: 1, termination: 'Abandon', ext: { site: 'chess.com', me: { name: 'moi' }, opp: { name: 'X' } },
    analysis: Array.from({ length: 12 }, (_, i) => ({ ply: 2 * i, san: i % 2 ? 'Ng1' : 'Nf3', uci: i % 2 ? 'f3g1' : 'g1f3', bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 50, drop: 0, severity: 'ok',
      ...(motifs[i] ? { severity: 'blunder', drop: 40, detail: { v: 3, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: [motifs[i]], motif: motifs[i] } } : {}) })),
  }))), games);
  await add([[20, []], [19, ['piece-en-prise']], [18, []], [17, ['menace-ignoree']], [16, []], [15, ['piece-en-prise']], [14, []], [13, ['piece-en-prise']], [12, ['piece-en-prise']], [11, ['menace-ignoree']]]);
  await add([[4.5, []], [4, ['piece-en-prise']], [3.5, ['gain-rate']], [3, []], [2, ['menace-ignoree', 'gain-rate']], [1, []]]);
  await p.goto(URL);
  await p.getByTestId('goal-card').waitFor();
  assert(/Avant de lâcher la pièce : après mon coup, quels sont SES échecs, SES prises, SES attaques/.test(await p.getByTestId('goal-rule').innerText()), 'carte : la règle en gros');
  const score = await p.getByTestId('goal-score').innerText();
  assert(/^4 parties propres sur les 10 dernières/.test(score) && /6 jouées depuis le/.test(score), 'carte : « 4 parties propres sur les 10 dernières » (6 jouées) : ' + score);
  assert(await p.locator('.goal-dot.ok').count() === 4 && await p.locator('.goal-dot.ko').count() === 2 && await p.locator('.goal-dot.empty').count() === 4, 'une pastille par partie (4 propres, 2 non, 4 à venir)');
  assert(/Point de départ : 4 propres sur les 10 parties d’avant le/.test(await p.getByTestId('goal-baseline').innerText()), 'point de départ : 4/10 avant le début');
  const watch = await p.getByTestId('goal-watch').innerText();
  assert(/À surveiller/.test(watch) && /Gain raté ×2/.test(watch) && !/Pièce laissée en prise/.test(watch), 'À surveiller : autres motifs (' + watch + ')');
  await p.screenshot({ path: OUT + '/goal-1-carte.png' });

  // ---------- 4 parties propres de plus : 8/10 → maîtrisé, message, objectif suivant
  await add([[0.8, []], [0.6, []], [0.4, ['gain-rate']], [0.2, []]]);
  await p.goto(URL + '#/stats'); await p.goto(URL);
  await p.getByTestId('goal-msg').waitFor();
  const msg = await p.getByTestId('goal-msg').innerText();
  assert(/Objectif maîtrisé : « Ne rien donner » \(8\/10 parties propres\)\. Nouvel objectif : « Ne rien laisser passer »/.test(msg), 'maîtrisé : message (' + msg.replace(/\s+/g, ' ') + ')');
  assert(await p.getByTestId('goal-name').innerText() === 'Ne rien laisser passer', 'l’objectif suivant devient actif');
  assert(/MES échecs, MES prises, MES attaques/.test(await p.getByTestId('goal-rule').innerText()), 'nouvelle règle');
  assert(/^0 partie propre sur les 10 dernières/.test(await p.getByTestId('goal-score').innerText()), 'nouvel objectif : mesure depuis maintenant');
  await p.screenshot({ path: OUT + '/goal-2-maitrise.png' });
  await p.getByRole('button', { name: 'D’accord' }).tap();
  assert(await p.getByTestId('goal-msg').count() === 0, 'message lu : il disparaît');
  for (let i = 0; i < 50 && !(await p.evaluate(() => window.__db.meta.get('goals').then((m) => m.value.messages.length === 0))); i++) await p.waitForTimeout(200);
  const st = await p.evaluate(() => window.__db.meta.get('goals').then((m) => m.value));
  assert(st.active === 1 && st.mastered['rien-donner'] && st.messages.length === 0, 'état enregistré (objectif 2 actif, objectif 1 maîtrisé)');

  // ---------- Rapport pour Claude : section « Objectif » en tête
  await p.goto(URL + '#/report');
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 300000 });
  const md = await p.locator('.md-preview').innerText();
  assert(/## Objectif en cours/.test(md) && md.indexOf('## Objectif en cours') < md.indexOf('## Définitions') && /Ne rien laisser passer/.test(md) && /Objectifs maîtrisés : Ne rien donner/.test(md), 'rapport : section « Objectif » en tête');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
