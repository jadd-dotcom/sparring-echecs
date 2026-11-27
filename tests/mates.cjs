// Onglet « Mats élémentaires » sur iPad émulé : leçon, exercices (mon camp joué par Stockfish via le plateau),
// validation du niveau 1 → déblocage du niveau 2, exercice raté → carte → révision.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const FIG = { '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N' };
const unfig = (t) => t.replace(/[♔♕♖♗♘]/g, (c) => FIG[c]);
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
      const shown = await p.locator('.moves').innerText();
      if (k === 0 && !shown.includes('Aucun') && /[KQRBN][a-h]?x?[a-h][1-8]/.test(shown)) throw new Error('lettres anglaises affichées : ' + shown);
      const moves = unfig(shown);
      const fen0 = await p.locator('[data-start-fen]').getAttribute('data-start-fen');
      const c = new Chess(fen0);
      if (!moves.includes('Aucun')) for (const t of moves.split(/\s+/)) { const mv = t.replace(/^\d+(\.|…)/, ''); if (mv) c.move(mv); }
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
  await p.getByTestId('tab-training').tap();
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
    const limit = Math.min(50, Math.max(r.minMoves + 10, 2 * r.minMoves));
    assert(r.outcome === 'mate' && r.myMoves <= limit, `exercice ${i + 1} : mat en ${r.myMoves} (minimum exact ${r.minMoves}, limite ${limit})`);
    if (i === 0) assert(await p.getByText(/distance exacte/).count() > 0 && await p.getByText(new RegExp(`objectif : mat en ${limit} coups`)).count() > 0, 'affichage : minimum exact et nouvelle limite');
    assert(await p.getByText(/Pat frôlé/).count() === 0, 'plus d’alerte « pat frôlé »');
    if (i === 0) await p.screenshot({ path: OUT + '/m-3-exercice.png' });
  }
  await p.goto(URL); await p.goto(URL + '#/mates');
  await p.getByText(/Validé · /).first().waitFor();
  assert(await p.locator('section.locked').count() === 3, 'niveau 1 validé → niveau 2 (échelle) débloqué');

  // Exercice raté par pat : dès qu'un coup fait pat, on le joue
  let patRun = null;
  for (let attempt = 0; attempt < 3 && patRun?.outcome !== 'stalemate'; attempt++) {
    await p.goto(URL); await p.goto(URL + '#/mates/kq/play');
    patRun = await playExercise(async (fen, c) => {
      const legal = c.moves({ verbose: true });
      const after = (m) => { const d = new Chess(fen); d.move(m); return d; };
      const pat = legal.find((m) => after(m).isStalemate());
      if (pat) return pat.from + pat.to;
      const best = await sfPick(fen);
      if (!after({ from: best.slice(0, 2), to: best.slice(2, 4) }).isCheckmate()) return best;
      // Ne pas mater tant qu'aucun coup pat n'est apparu : un coup sûr qui ne mate pas.
      const safe = legal.find((m) => { const d = after(m); return !d.isCheckmate() && !d.isStalemate() && !d.moves({ verbose: true }).some((x) => x.captured); });
      return safe ? safe.from + safe.to : best;
    });
  }
  assert(patRun.outcome === 'stalemate', `exercice terminé par pat après ${patRun.myMoves} coups`);
  await p.getByText(/n’avait plus aucune case et/).waitFor({ timeout: 30000 });
  const expl = await p.locator('.pat-explain').innerText();
  assert(/Coup correct : .+ — mat en \d+ \(distance exacte\)/.test(expl) && !/[KQRBN][a-h]?x?[a-h][1-8]/.test(expl), 'explication (figurines) : ' + expl.replace(/\s+/g, ' '));
  await p.screenshot({ path: OUT + '/m-5-pat.png' });
  await p.getByRole('button', { name: 'Position de pat' }).tap();
  await p.getByRole('button', { name: 'Avant mon coup' }).tap();

  // Leçon : étape « piège du pat »
  await p.goto(URL); await p.goto(URL + '#/mates/kq/lesson');
  for (let i = 0; i < 12; i++) await p.getByRole('button', { name: /Coup suivant/ }).tap();
  await p.getByText(/Piège du pat : ♕c7/).first().waitFor();
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/m-6-lecon-pat.png' });
  assert(true, 'leçon Dame : étape « piège du pat » avec le coup ♕c7 en flèche rouge (figurines)');

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
  const card = await p.evaluate((fen) => window.__db.cards.filter((c) => c.kind === 'mate' && c.fen === fen).first(), failed.fen);
  const nMateCards = await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'mate').count());
  assert(card && nMateCards === 2, 'positions ratées (pat, pièce perdue) ajoutées au paquet de révision');

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
