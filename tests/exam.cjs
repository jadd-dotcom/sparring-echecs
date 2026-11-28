// Mémoire active : mode Examen (10 positions au hasard, sans indice ni ligne d'accès, score /10, ratées « à refaire »),
// option « Mélanger » des lignes, et les 3 courbes de l'onglet Progrès (iPad émulé).
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2] || '/tmp';
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const tap = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  await p.goto(URL);
  await p.getByTestId('session').waitFor({ timeout: 60000 });

  // Examen de l'Anglaise : 7 justes, 3 fausses.
  await p.goto(URL + '#/opening/english');
  await p.getByTestId('exam-start').tap();
  for (let q = 1; q <= 10; q++) {
    const ex = p.locator(`[data-testid="exam"][data-q="${q}"]`);
    await ex.waitFor({ timeout: 15000 });
    if (q === 1) {
      assert(await p.locator('.line-text').count() === 0, 'examen : la ligne qui mène à la position n’est pas affichée');
      assert(await p.getByRole('button', { name: /Indice/ }).count() === 0, 'examen : aucun indice');
    }
    const fen = await ex.getAttribute('data-fen');
    const accept = (await ex.getAttribute('data-accept')).split(' ');
    let u = accept[0];
    if (q > 7) u = new Chess(fen).moves({ verbose: true }).map((m) => m.from + m.to).find((x) => !accept.includes(x));
    await tap(u);
    await p.getByTestId('exam-feedback').waitFor();
    await p.getByTestId('exam-next').tap();
  }
  await p.getByTestId('exam-done').waitFor();
  assert(await p.getByTestId('exam-done').getAttribute('data-score') === '7', 'score de l’examen : 7/10');
  const saved = await p.evaluate(() => window.__db.meta.get('examResults').then((m) => m.value.english));
  assert(saved.length === 1 && saved[0].score === 7 && saved[0].missed.length === 3, 'résultat enregistré (3 positions ratées)');
  const today = await p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  const redo = await p.evaluate((keys) => window.__db.cards.filter((c) => c.kind === 'drill' && keys.includes(c.key)).toArray(), saved[0].missed);
  assert(redo.length === 3 && redo.every((c) => c.due === today && c.step === 0), 'positions ratées « à refaire » : dans le drill d’aujourd’hui');
  await p.screenshot({ path: OUT + '/exam-done.png' });

  // Lignes : « Mélanger » change l'ordre de la sélection.
  await p.goto(URL + '#/opening/london/lignes');
  await p.getByTestId('train-bar').waitFor();
  await p.getByRole('button', { name: 'Tout cocher' }).tap();
  const inOrder = await p.locator('[data-testid="line-row"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-line')));
  await p.getByTestId('shuffle-toggle').check();
  await p.getByTestId('train-sel').tap();
  await p.waitForURL(/#\/lines\/london/);
  const keys = await p.evaluate(() => window.__db.meta.get('lineSession').then((m) => m.value.keys));
  assert(keys.length === inOrder.length && [...keys].sort().join('|') === [...inOrder].sort().join('|'), 'Mélanger : les mêmes lignes');
  assert(keys.join('|') !== inOrder.join('|'), 'Mélanger : dans un autre ordre');

  // Progrès : les 3 courbes.
  await p.evaluate(async () => {
    const base = { myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', uci: [], san: [], result: '1-0', score: 1, termination: 'x' };
    const bl = (motif) => ({ ply: 0, san: 'a3', uci: 'a2a3', bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 10, drop: 40, severity: 'blunder', detail: { v: 3, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: [motif], motif } });
    for (let i = 0; i < 5; i++) {
      await window.__db.games.add({ ...base, source: 'chesscom', date: Date.now() - (10 - i) * 86400000, analysis: Array.from({ length: i % 3 }, () => bl('piece-en-prise')),
        ext: { site: 'chess.com', timeClass: 'rapid', me: { name: 'moi', rating: 600 + 15 * i }, opp: { name: 'x', rating: 610 } } });
    }
    // Révisions de 3 jours : une juste sans indice, une juste avec indice, une fausse.
    const day = (k) => Date.now() - k * 86400000;
    await window.__db.cards.add({ kind: 'mistake', gameId: 0, source: 'app', fen: '8/8/8/8/8/8/8/8 w - - 0 1', myColor: 'w', playedUci: 'a', playedSan: 'a', bestUci: 'b', bestSan: 'b',
      wpBefore: 50, drop: 30, severity: 'blunder', step: 0, due: '2999-01-01', createdAt: 1,
      attempts: [{ date: day(3), uci: 'b', ok: true, hints: 0 }, { date: day(2), uci: 'b', ok: true, hints: 1 }, { date: day(1), uci: 'a', ok: false, hints: 0 }] });
  });
  await p.goto(URL + '#/progress');
  await p.getByTestId('curve-given').waitFor();
  assert(Number(await p.getByTestId('chart-given').getAttribute('data-points')) >= 5, 'courbe « pièces données par partie »');
  assert(Number(await p.getByTestId('chart-unaided').getAttribute('data-points')) === 3, 'courbe « réussite sans aide en révision » (une valeur par jour de révision)');
  assert(Number(await p.getByTestId('chart-rapid').getAttribute('data-points')) === 5, 'courbe « classement Chess.com Rapid » (5 parties importées)');
  await p.screenshot({ path: OUT + '/progress-curves.png', fullPage: true });
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
