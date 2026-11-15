// Onglet « Mats élémentaires » sur iPad émulé : leçon, exercices (mon camp joué par Stockfish via le plateau),
// validation du niveau 1 → déblocage du niveau 2, exercice raté → carte → révision.
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
  const runs = () => p.evaluate(() => window.__db.mateRuns.toArray());

  /** Joue l'exercice affiché : `pick(fen)` choisit mon coup ; renvoie la ligne enregistrée. */
  async function playExercise(pick) {
    await p.getByText(/Coups : /).waitFor({ timeout: 120000 });
    const n0 = (await runs()).length;
    for (let k = 0; k < 120; k++) {
      if ((await runs()).length > n0) break;
      await p.getByText('À toi : mate le roi noir.').waitFor({ timeout: 30000 }).catch(() => {});
      if ((await runs()).length > n0) break;
      const moves = await p.locator('.moves').innerText();
      const fen0 = await p.locator('[data-start-fen]').getAttribute('data-start-fen');
      const c = new Chess(fen0);
      if (!moves.includes('Aucun')) for (const t of moves.split(/\s+/)) if (!/^\d+\.$/.test(t)) c.move(t);
      if (c.turn() !== 'w' || c.isGameOver()) { await p.waitForTimeout(150); continue; }
      const u = await pick(c.fen(), c);
      await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap();
      await p.waitForTimeout(150);
    }
    const all = await runs();
    return all[all.length - 1];
  }
  const sfPick = (fen) => p.evaluate((f) => window.__sfBest(f, 300), fen);

  await p.goto(URL);
  await p.getByRole('button', { name: /Mats élémentaires/ }).tap();
  await p.getByRole('heading', { name: /1\. Dame \+ roi/ }).waitFor();
  const locked = await p.locator('section.locked').count();
  assert(locked === 4, 'au départ, seul le niveau 1 est ouvert (4 verrouillés dont « plus tard »)');
  await p.screenshot({ path: OUT + '/m-1-niveaux.png' });

  // Leçon
  await p.locator('section', { hasText: 'Dame + roi' }).getByRole('button', { name: 'Leçon' }).tap();
  for (let i = 0; i < 15; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByText(/échec et mat/).waitFor();
  await p.screenshot({ path: OUT + '/m-2-lecon.png' });
  assert(true, 'leçon D+R rejouée coup par coup jusqu’au mat');

  // 3 exercices réussis (Stockfish joue mon camp à travers le plateau)
  for (let i = 0; i < 3; i++) {
    await p.goto(URL + (i === 0 ? '#/mates/kq/play' : '#/mates'));
    if (i > 0) { await p.goto(URL + '#/mates/kq/play'); }
    const r = await playExercise(sfPick);
    assert(r.outcome === 'mate' && r.myMoves <= r.minMoves + 10, `exercice ${i + 1} : mat en ${r.myMoves} (minimum ${r.minMoves})`);
    if (i === 0) await p.screenshot({ path: OUT + '/m-3-exercice.png' });
  }
  await p.goto(URL); await p.goto(URL + '#/mates');
  await p.getByText('✓ Validé').waitFor();
  assert(await p.locator('section.locked').count() === 3, 'niveau 1 validé → niveau 2 (échelle) débloqué');

  // Exercice raté : la dame se met à côté du roi noir sans protection
  await p.goto(URL); await p.goto(URL + '#/mates/kq/play');
  const failed = await playExercise(async (fen, c) => {
    const bk = c.board().flat().find((x) => x && x.type === 'k' && x.color === 'b').square;
    const qMoves = c.moves({ verbose: true }).filter((m) => m.piece === 'q');
    const hang = qMoves.find((m) => { const d = new Chess(fen); d.move(m); return d.moves({ verbose: true }).some((x) => x.captured === 'q'); }) ?? qMoves[0];
    void bk;
    return hang.from + hang.to;
  });
  assert(failed.outcome === 'piece-lost', 'dame laissée en prise → échec « pièce perdue »');
  await p.getByText(/Pièce sans protection/).waitFor();
  await p.screenshot({ path: OUT + '/m-4-echec.png' });
  assert(true, 'alerte « pièce sans protection » affichée après l’exercice');
  const card = await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'mate').first());
  assert(card && card.fen === failed.fen, 'position ratée ajoutée au paquet de révision');

  // Révision de la position ratée
  await p.evaluate((id) => window.__db.cards.update(id, { due: '2000-01-01' }), card.id);
  await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'mate').modify({ due: '2099-01-01' }));
  await p.goto(URL); await p.goto(URL + '#/revise');
  await p.getByText(/Révision : position de mat ratée/).waitFor();
  const rr = await playExercise(sfPick);
  const card2 = await p.evaluate((id) => window.__db.cards.get(id), card.id);
  assert(rr.review && rr.outcome === 'mate' && card2.attempts[0].ok, `révision : mat en ${rr.myMoves}, carte reprogrammée au ${card2.due}`);
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
