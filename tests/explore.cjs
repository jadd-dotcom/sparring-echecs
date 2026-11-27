// Explorer, « Voir la suite », « Qu'est-ce qu'il menace ? » et une carte « Lis la menace » (iPad émulé).
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

  // ---------------- « Qu'est-ce qu'il menace ? » dans la revue
  // Après 2.Qg4?? (à lui de jouer) : son fou prend ma dame ; après 1.e4 : rien de sérieux.
  await p.getByTestId('threat-btn').tap();
  await p.locator('[data-testid="threat-text"][data-status="threat"]').waitFor({ timeout: 30000 });
  const tt = (await p.getByTestId('threat-text').innerText()).replace(/\s+/g, ' ');
  assert(/^Il menace ceci : son fou prend ta dame g4/.test(tt), 'revue : sa menace en mots : ' + tt);
  assert(await strokes(p, RED) >= 1, 'revue : sa menace en flèche rouge');
  await p.getByTestId('threat-suite').tap();
  assert(/^Son fou prend ta dame g4/.test(await p.getByTestId('suite-caption').innerText()), '« Voir la suite » de sa menace');
  await p.getByTestId('suite').getByRole('button', { name: 'Fermer' }).tap();
  await p.locator('.moves .mv').nth(0).tap();
  await p.getByTestId('threat-btn').tap();
  await p.getByTestId('threat-text').waitFor({ timeout: 30000 });
  assert(await p.getByTestId('threat-text').innerText() === 'Pas de menace sérieuse.', 'revue après 1.e4 : « Pas de menace sérieuse »');

  // ---------------- dans Explorer : je joue Qg4?? pour moi, puis « Qu'est-ce qu'il menace ? »
  await p.locator('.moves .mv').nth(1).tap();
  await p.getByTestId('explore-btn').tap();
  await p.getByTestId('explorer').waitFor();
  await sq('d1').tap(); await sq('g4').tap();
  await p.getByTestId('explorer-best').filter({ hasText: 'Sa meilleure réponse' }).waitFor({ timeout: 30000 });
  await p.getByTestId('threat-btn').tap();
  await p.locator('[data-testid="threat-text"][data-status="threat"]').waitFor({ timeout: 30000 });
  assert(/son fou prend ta dame g4/.test(await p.getByTestId('threat-text').innerText()), 'Explorer : « Qu’est-ce qu’il menace ? »');
  await p.screenshot({ path: OUT + '/ex-3-menace-explorer.png' });
  await p.getByRole('button', { name: 'Quitter' }).tap();
  await p.locator('table.classes').waitFor();

  // ---------------- Carte « Lis la menace » : 1.e4 e5 2.d4 exd4 3.Qxd4 Nc6 4.a3?? (menace ignorée : …Nxd4)
  const tid = await p.evaluate(() => {
    const sans = ['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6', 'a3', 'Nxd4'];
    const uci = ['e2e4', 'e7e5', 'd2d4', 'e5d4', 'd1d4', 'b8c6', 'a2a3', 'c6d4'];
    const an = (ply, extra = {}) => ({ ply, san: sans[ply], uci: uci[ply], bestUci: null, bestSan: null, wpBefore: 55, wpAfter: 55, drop: 0, severity: 'ok', ...extra });
    return window.__db.games.add({
      source: 'chesscom', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci, san: sans, result: '0-1', score: 0, termination: 'Abandon', ratingBefore: 900, ratingAfter: 900, botElo: 0,
      ext: { site: 'chess.com', me: { name: 'moi', rating: 450 }, opp: { name: 'Menaceur', rating: 500 }, timeClass: 'rapid' },
      analysis: [an(0), an(2), an(4), an(6, { bestUci: 'd4e3', bestSan: 'Qe3', wpAfter: 5, drop: 50, severity: 'blunder',
        detail: { v: 3, depth: 12, bestLine: '4. Qe3 Nf6', bestMaterial: 0, refutation: '4… Nxd4', refutationMaterial: -9, threatLine: '4… Nxd4', motifs: ['menace-ignoree'], motif: 'menace-ignoree' } })],
    });
  });
  // File vide (positions du répertoire repoussées) : la recherche des cartes « Lis la menace » se lance.
  await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'threat').modify({ due: '2999-01-01' }));
  await p.goto(URL + '#/revise');
  await p.locator('[data-phase="read"]').waitFor({ timeout: 120000 });
  const tcard = await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'threat').toArray());
  assert(tcard.length >= 1 && tcard[0].gameId === tid && tcard[0].ignored && tcard[0].threatUci === 'c6d4', 'carte créée : menace ignorée d’abord (…Nxd4), trouvée par coup nul');
  assert(tcard.length <= 5, 'au plus 5 nouvelles cartes par jour');
  const ins = await p.getByTestId('instruction').innerText();
  assert(/^Il vient de jouer : son cavalier va en c6/.test(ins), 'consigne : son dernier coup en mots : ' + ins);
  assert(await strokes(p, /240,\s*138,\s*64/) === 1, 'son dernier coup en flèche');
  await p.getByRole('button', { name: /^Indice/ }).tap();
  assert(/pièce qui vient de bouger/.test(await p.getByTestId('hint').innerText()), 'indice 1 : la pièce qui vient de bouger');
  await sq('a7').tap(); await sq('a6').tap();                    // je bouge un pion à lui : pas sa menace
  await p.getByTestId('try-msg').waitFor({ timeout: 30000 });
  assert(/ce n’est pas sa menace/.test(await p.getByTestId('try-msg').innerText()), 'Q1 : mauvais coup refusé');
  await sq('c6').tap(); await sq('d4').tap();                    // sa menace : Nxd4
  await p.locator('[data-phase="parry"]').waitFor({ timeout: 30000 });
  assert(/Il menace ceci : son cavalier prend ta dame d4/.test(await p.getByTestId('threat-read').innerText()), 'Q1 réussie : sa menace en mots');
  assert(/Maintenant pare-la/.test(await p.getByTestId('instruction').innerText()), 'Q2 : « Maintenant pare-la »');
  await p.screenshot({ path: OUT + '/ex-4-lis-la-menace.png' });
  const best = await p.locator('[data-phase="parry"]').getAttribute('data-best');
  await sq(best.slice(0, 2)).tap(); await sq(best.slice(2, 4)).tap();
  await p.getByTestId('revise-result').waitFor({ timeout: 30000 });
  const tres = (await p.getByTestId('why').innerText()).replace(/\s+/g, ' ');
  assert(/Sa menace : son cavalier prend ta dame d4/.test(tres) && /Pour la parer : ta dame/.test(tres), 'explication en mots : ' + tres);
  assert(/tu ne l’as pas vue : tu as joué ♙?a3/.test(tres), 'rappel : menace ignorée dans la partie');
  await p.getByTestId('suite-threat').tap();
  assert(/^Son cavalier prend ta dame d4/.test(await p.getByTestId('suite-caption').innerText()), 'Voir sa menace : légende en mots');
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/ex-5-lis-la-menace-fin.png' });
  const after = await p.evaluate((id) => window.__db.cards.get(id), tcard[0].id);
  assert(after.attempts.filter((t) => t.q === 1).map((t) => t.ok).join() === 'false,true' && after.attempts.some((t) => t.q === 2 && t.ok), 'tentatives enregistrées (Q1 : raté puis réussi ; Q2 : réussi)');
  assert(after.step === 0 && after.due > tcard[0].due, 'un essai raté : la carte revient demain');

  // ---------------- Rapport pour Claude : section « Lecture des menaces »
  await p.goto(URL + '#/report');
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 120000 });
  const md = await p.locator('.md-preview').innerText();
  assert(/## 7\. Lecture des menaces/.test(md) && /\| Q1 — lire sa menace \| 1 \| 1 \|/.test(md) && /\| Nxd4 \| a6 \|/.test(md), 'rapport : section « Lecture des menaces » (réussies / ratées, dernières ratées)');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
