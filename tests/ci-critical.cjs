// 5 parcours critiques, lancés en CI (iPad émulé, sans réseau) : séance Aujourd'hui, 10 coups contre Maia, un bloc de
// leçon, une ligne jouée, une carte de révision. Usage : node tests/ci-critical.cjs <dossier> [url]
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2] || '/tmp';
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const LONDON = ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e6', 'Ngf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'b6', 'Ne5', 'Bb7', 'f4'];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const tapUci = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  const tapSan = async (fen, san) => { const m = new Chess(fen).move(san); await tapUci(m.from + m.to); };

  // 1. Séance Aujourd'hui : 5 étapes, « Continuer » ouvre la première (échauffement).
  await p.goto(URL);
  await p.getByTestId('session').waitFor({ timeout: 60000 });
  assert(await p.locator('[data-testid^="step-"]').count() === 5, 'Aujourd’hui : 5 étapes');
  await p.getByTestId('continue').tap();
  await p.waitForURL(/#\/board\/warmup/);
  assert(true, '« Continuer » ouvre l’échauffement');

  // 2. 10 coups contre Maia (partie comptée).
  await p.goto(URL + '#/play');
  await p.getByText('à toi de jouer').waitFor({ timeout: 180000 });
  const cur = () => p.evaluate(() => window.__db.meta.get('current').then((m) => m?.value ?? null));
  for (let i = 0; i < 10; i++) {
    let g = await cur();
    for (let t = 0; t < 300 && g && g.uci.length !== 2 * i; t++) { await p.waitForTimeout(100); g = await cur(); }
    assert(g && g.uci.length === 2 * i, `coup ${i + 1} : à moi de jouer`);
    const c = new Chess(); for (const u of g.uci) c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    if (c.isGameOver()) break;
    const ms = c.moves({ verbose: true }).filter((x) => !x.promotion && !x.captured);
    const m = ms[i % ms.length] ?? c.moves({ verbose: true })[0];
    await tapUci(m.from + m.to);
  }
  {
    let g = await cur();
    for (let t = 0; t < 300 && g && g.uci.length < 20; t++) { await p.waitForTimeout(100); g = await cur(); }
    assert(!g || g.uci.length >= 20, '10 coups joués, Maia a répondu à chacun');
  }

  // 3. Un bloc de leçon (Anglaise, bloc 1) rejoué sans erreur.
  await p.goto(URL + '#/lesson/english/main:0/replay');
  await p.locator('.lesson-play[data-stage="replay"]').waitFor({ timeout: 30000 });
  for (let k = 0; k < 20; k++) {
    if (await p.getByTestId('block-result').count()) break;
    const el = p.locator('.lesson-play');
    const exp = await el.getAttribute('data-expected');
    if (!exp) { await p.waitForTimeout(150); continue; }
    await tapSan(await el.getAttribute('data-fen'), exp);
    await p.waitForTimeout(150);
  }
  assert(await p.locator('[data-testid="block-result"][data-clean="true"]').count() === 1, 'bloc de leçon rejoué sans erreur : « Bloc réussi »');

  // 4. Une ligne jouée (Londres, ligne principale).
  await p.goto(URL + '#/lines/london');
  const c4 = new Chess();
  for (let k = 0; k < LONDON.length; k++) {
    await p.locator(`.play-lines[data-ply="${k}"]`).waitFor({ timeout: 15000 });
    if (k % 2 === 0) { await p.getByTestId('lines-prompt').waitFor({ timeout: 15000 }); await tapSan(c4.fen(), LONDON[k]); }
    c4.move(LONDON[k]);
  }
  await p.getByTestId('line-ok').waitFor({ timeout: 15000 });
  assert(true, 'ligne du Londres jouée jusqu’au bout, sans erreur');

  // 5. Une carte de révision (erreur d'une partie) : le meilleur coup la réussit.
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const moves = ['e2e4', 'e7e5', 'g1f3', 'f8c5', 'b1c3', 'c5f2'];
  const c5 = new Chess(); for (const u of moves) c5.move({ from: u.slice(0, 2), to: u.slice(2, 4) });
  const today = await p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  await p.evaluate(async ([fen, today]) => {
    const gameId = await window.__db.games.add({ source: 'app', date: Date.now() - 86400000, myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci: ['e2e4', 'e7e5', 'g1f3', 'f8c5', 'b1c3', 'c5f2', 'e1e2'], san: ['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+', 'Ke2'], result: '0-1', score: 0, termination: 'Abandon' });
    await window.__db.cards.add({ kind: 'mistake', gameId, source: 'app', fen, myColor: 'w', playedUci: 'e1e2', playedSan: 'Ke2', bestUci: 'e1f2', bestSan: 'Kxf2',
      wpBefore: 60, drop: 40, severity: 'blunder', step: 0, due: today, createdAt: Date.now(), attempts: [] });
  }, [c5.fen(), today]);
  void START;
  await p.goto(URL + '#/revise');
  await p.getByTestId('instruction').waitFor({ timeout: 30000 });
  await tapUci('e1f2');
  await p.getByTestId('revise-result').waitFor({ timeout: 30000 });
  assert(/Réussie du premier coup/.test(await p.getByTestId('revise-result').innerText()), 'carte de révision réussie du premier coup');

  await p.screenshot({ path: OUT + '/ci-critical-end.png' });
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
