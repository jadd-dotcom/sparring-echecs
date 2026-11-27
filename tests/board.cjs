// Mode « Maîtrise de l'échiquier » sur iPad émulé : chapitres et déblocage, épreuves (1a ×3, 3), entraînement
// (clavier, réponses multiples, visualisation), carte de chaleur, révisions et échauffement (réussie / ratée → « à revoir »),
// rejouer de tête (7a), partie à l'aveugle contre Maia (7b, coups d'œil comptés), section « Échiquier » du rapport.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPad (gen 7) landscape'], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  const meta = (k) => p.evaluate((key) => window.__db.meta.get(key).then((m) => m?.value ?? null), k);
  const setMeta = (k, v) => p.evaluate(([key, value]) => window.__db.meta.put({ key, value }), [k, v]);
  const today = await (async () => { await p.goto(URL); return p.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }); })();
  const ex = () => p.locator('.board-ex');
  const info = async () => ({ exp: await ex().getAttribute('data-expected'), input: await ex().getAttribute('data-input'), n: Number(await ex().getAttribute('data-answered')) });
  // Fin du chrono possible entre deux touchers : un élément disparu n'est pas une erreur.
  const soft = (loc) => loc.tap({ timeout: 3000 }).catch(() => {});
  const tapSq = (s) => soft(p.locator(`.tapboard [data-square="${s}"]`));
  const keypad = async (s) => {
    await soft(p.locator('.kp-row[aria-label="Colonnes"] button', { hasText: new RegExp(`^${s[0]}$`) }));
    await soft(p.locator('.kp-row[aria-label="Rangées"] button', { hasText: new RegExp(`^${s[1]}$`) }));
  };
  /** Répond (juste, ou faux si `wrong`) à la question affichée et attend la suivante. */
  async function answer(wrong = false) {
    if (!(await ex().count())) {
      await ex().waitFor({ timeout: 1500 }).catch(() => {});
      if (!(await ex().count()) || await p.getByTestId('board-result').count()) return;
    }
    let exp, input, n;
    try { ({ exp, input, n } = await Promise.race([info(), new Promise((_, rej) => setTimeout(() => rej(new Error('lent')), 2000))])); } catch { return; }
    const other = (x, set) => set.find((y) => y !== x);
    if (input === 'board-file') await tapSq(`${wrong ? other(exp, [...'abcdefgh']) : exp}4`);
    else if (input === 'board-rank') await tapSq(`c${wrong ? other(exp, [...'12345678']) : exp}`);
    else if (input === 'board-square') await tapSq(wrong ? (exp === 'a1' ? 'h8' : 'a1') : exp);
    else if (input === 'keypad') await keypad(wrong ? (exp === 'a1' ? 'h8' : 'a1') : exp);
    else if (input === 'choice') {
      const vals = await p.locator('.choices button').evaluateAll((bs) => bs.map((x) => x.dataset.value));
      await soft(p.locator(`.choices button[data-value="${wrong ? other(exp, vals) : exp}"]`));
    } else if (input === 'multi') {
      for (const s of wrong ? ['a1'] : exp.split(' ')) await keypad(s);
      await soft(p.getByRole('button', { name: 'Valider' }));
    }
    for (let i = 0; i < 100; i++) {
      if (await p.getByTestId('board-result').count() || await p.getByTestId('explain').count()) return;
      try {
        if ((await ex().count()) && Number(await ex().getAttribute('data-answered', { timeout: 500 })) > n
          && await ex().getAttribute('data-busy', { timeout: 500 }) === '0') return;
      } catch { return; }   // exercice terminé entre deux lectures
      await p.waitForTimeout(30);
    }
  }
  /** Épreuve : répond juste jusqu'au résultat (une erreur volontaire si `oneError`). */
  async function runTest(oneError = false) {
    const start = p.getByRole('button', { name: /Commencer l’épreuve/ });
    await Promise.race([start.waitFor({ timeout: 10000 }), p.locator('.board-ex').waitFor({ timeout: 10000 })]).catch(() => {});
    if (await start.count()) await start.tap();
    await p.locator('.board-ex').waitFor({ timeout: 10000 });
    let k = 0;
    while (!(await p.getByTestId('board-result').count())) { await answer(oneError && k === 3); k++; }
    return p.getByTestId('board-result').innerText();
  }

  // --- Accueil et écran du mode
  await p.getByTestId('tab-training').tap();
  await p.getByRole('button', { name: /Maîtrise de l’échiquier/ }).waitFor();
  assert(await p.getByRole('button', { name: /Échauffement échiquier \(3 min\)/ }).count() === 1, 'accueil : « Maîtrise de l’échiquier » et « Échauffement échiquier (3 min) »');
  await p.getByRole('button', { name: /Maîtrise de l’échiquier/ }).tap();
  await p.getByRole('heading', { name: 'Maîtrise de l’échiquier' }).waitFor();
  const status = async (n) => p.getByTestId(`status-${n}`).innerText();
  assert(await status(1) === 'En cours' && await status(2) === 'Verrouillé' && await status(7) === 'Verrouillé', 'chapitre 1 ouvert, les suivants verrouillés');
  await p.screenshot({ path: OUT + '/b-1-chapitres.png', fullPage: true });

  // --- Leçon du chapitre 1
  await p.locator('[data-chapter="1"]').getByRole('button', { name: /Ouvrir le chapitre/ }).tap();
  await p.getByText(/Une case se nomme toujours colonne puis rangée/).waitFor();
  assert(await p.getByRole('heading', { name: 'Astuce' }).count() === 1, 'leçon : méthode + astuce + exemples');
  assert(await p.locator('[data-level="1b"]').getByRole('button', { name: 'Épreuve' }).isDisabled(), '1b verrouillé tant que 1a n’est pas validé');
  assert(/au moins 20 bonnes réponses/.test(await p.locator('[data-level="1e"]').innerText()) && /au moins 25 bonnes réponses/.test(await p.locator('[data-level="1d"]').innerText()),
    'consignes : 1e à 20 bonnes réponses en 30 s, 1d à 25');
  await p.screenshot({ path: OUT + '/b-2-lecon.png', fullPage: true });

  // --- 1a : 3 épreuves de 30 s (≥ 25 bonnes, ≤ 1 erreur) ; une avec 1 erreur volontaire
  await p.locator('[data-level="1a"]').getByRole('button', { name: 'Épreuve' }).tap();
  const t0 = Date.now();
  let r = await runTest(true);
  assert(/Épreuve réussie/.test(r) && /Réussites : 1\/3/.test(r), `1a, épreuve 1 (1 erreur) en ${Math.round((Date.now() - t0) / 1000)} s : ${r.replace(/\s+/g, ' ')}`);
  const sl = await p.evaluate(() => window.__soundLog.filter((x) => x === 'bad').length);
  assert(sl >= 1, 'son d’erreur joué sur la mauvaise réponse');
  await p.screenshot({ path: OUT + '/b-3-epreuve.png' });
  for (let i = 2; i <= 3; i++) { await p.getByRole('button', { name: 'Refaire' }).tap(); r = await runTest(); }
  assert(/Niveau validé/.test(r), '1a validé après 3 réussites : ' + r.replace(/\s+/g, ' '));
  let prog = await meta('boardProgress');
  assert(prog.levels['1a'].validated && prog.levels['1a'].passes === 3 && /bonnes réponses/.test(prog.levels['1a'].best), 'progression enregistrée (meilleur score : ' + prog.levels['1a'].best + ')');

  // --- 1c en entraînement (avec erreurs) → statistiques par case
  await p.goto(URL + '#/board/ex/1c/practice');
  await p.getByText(/Niveau verrouillé/).waitFor({ timeout: 10000 });
  assert(true, '1c verrouillé (1b pas encore validé)');
  const lv = (ids) => Object.fromEntries(ids.map((id) => [id, { passes: 3, attempts: 3, validated: true, best: 'test' }]));
  prog.levels = { ...prog.levels, ...lv(['1b', '1c', '1d', '1e']) };
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/ex/1c/practice');
  for (let k = 0; k < 12; k++) {
    await answer(k % 4 === 0);
    await p.getByTestId('explain').waitFor();
    if (k === 0) { await p.screenshot({ path: OUT + '/b-4-entrainement.png' }); assert(/Réponse : [a-h][1-8]/.test(await p.getByTestId('explain').innerText()), 'entraînement : correction expliquée après une erreur'); }
    await p.getByRole('button', { name: 'Suivante' }).tap();
  }
  const stats = await meta('boardStats');
  const nAns = Object.values(stats).reduce((t, s) => t + s.n, 0);
  assert(nAns >= 12 && Object.values(stats).some((s) => s.err > 0), `statistiques par case : ${nAns} réponses, erreurs comptées`);

  // --- 1e : nommer une case au clavier
  await p.goto(URL + '#/board/ex/1e/practice');
  await answer();
  assert(/Juste/.test(await p.getByTestId('explain').innerText()), '1e : case surlignée nommée au clavier (colonne puis rangée)');
  await p.screenshot({ path: OUT + '/b-5-clavier.png' });

  // --- Chapitres 1-2 validés (injectés) → chapitre 3 : épreuve de 20 questions
  prog = await meta('boardProgress');
  prog.levels = { ...prog.levels, ...lv(['2c', '2d', '2e']) };
  prog.chapters = { 1: { validatedAt: Date.now(), step: 0, due: '2099-01-01', toReview: false }, 2: { validatedAt: Date.now(), step: 0, due: '2099-01-01', toReview: false } };
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/ex/3/test');
  r = await runTest();
  assert(/Épreuve réussie/.test(r) && /20\/20 justes, temps médian/.test(r) && /Niveau validé/.test(r), 'chapitre 3 : 20/20, temps médian ≤ 3 s → validé : ' + r.replace(/\s+/g, ' '));
  prog = await meta('boardProgress');
  assert(prog.chapters[3] && prog.chapters[3].step === 0, `chapitre 3 validé → révision le ${prog.chapters[3].due} (J+1)`);

  // --- Chapitre 4 (réponses à plusieurs cases), 5 et 6 en entraînement
  await p.goto(URL + '#/board/ex/4/practice');
  let multi = false;
  for (let k = 0; k < 12 && !multi; k++) {
    const { input } = await info();
    multi = input === 'multi';
    await answer();
    await p.getByTestId('explain').waitFor();
    if (multi) { assert(/Juste/.test(await p.getByTestId('explain').innerText()), 'ch. 4 : « cite les cases entre… » au clavier, puis Valider'); await p.screenshot({ path: OUT + '/b-6-diagonales.png' }); }
    await p.getByRole('button', { name: 'Suivante' }).tap();
  }
  assert(multi, 'question à plusieurs cases rencontrée');
  prog = await meta('boardProgress');
  prog.levels = { ...prog.levels, ...lv(['4', '5', '6-2']) };   // 6-4 se débloque après 6-2
  prog.chapters[4] = prog.chapters[5] = { validatedAt: Date.now(), step: 0, due: '2099-01-01', toReview: false };
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/ex/6-4/practice');
  await answer();
  const vtxt = await p.getByTestId('explain').innerText();
  assert(/Juste/.test(vtxt), 'ch. 6 : suite de 4 demi-coups en figurines, question répondue : ' + (await p.getByTestId('prompt').innerText()));
  await p.screenshot({ path: OUT + '/b-7-visualisation.png' });

  // --- Carte de chaleur
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board');
  const seen = Object.entries(await meta('boardStats')).find(([, s]) => s.n > 0)[0];
  await p.locator(`.heatmap [data-square="${seen}"]`).tap();
  assert(new RegExp(`^${seen} : \\d+ erreurs? sur \\d+ réponses?`).test(await p.getByTestId('heat-detail').innerText()), 'carte de chaleur : détail de ' + seen);
  await p.screenshot({ path: OUT + '/b-8-carte.png', fullPage: true });

  // --- Révisions : chapitre 1 dû aujourd'hui → échauffement (réussi), puis chapitre 3 dû et raté → « à revoir »
  prog = await meta('boardProgress');
  prog.chapters[1].due = today;
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL);
  await p.getByTestId('tab-training').tap();
  await p.getByRole('button', { name: /Échauffement échiquier \(3 min\).*1 chapitre à revoir/ }).tap();
  await p.getByText('Révisions du jour :').waitFor();
  await p.getByRole('button', { name: 'Commencer' }).tap();
  r = await runTest();
  assert(/Révision réussie/.test(r), 'échauffement : révision du chapitre 1 (épreuve de 1a) réussie');
  prog = await meta('boardProgress');
  const plus3 = await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 3); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  assert(prog.chapters[1].step === 1 && prog.chapters[1].due === plus3 && prog.chapters[1].lastLevel === '1a', `révision suivante à J+3 (${plus3})`);
  await p.getByRole('button', { name: 'Terminer' }).tap();
  await p.getByTestId('warmup-summary').waitFor();
  prog.chapters[3].due = today;
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/warmup');
  await p.getByRole('button', { name: 'Commencer' }).tap();
  await p.locator('.board-ex').waitFor();
  while (!(await p.getByTestId('board-result').count())) await answer(true);
  assert(/Révision ratée/.test(await p.getByTestId('board-result').innerText()), 'révision ratée (chapitre 3)');
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board');
  assert(await status(3) === 'À revoir', 'chapitre 3 « À revoir »');
  prog = await meta('boardProgress');
  assert(prog.chapters[3].toReview === true, 'chapitre 3 marqué à revoir, de nouveau dû demain');

  // --- 7a : rejouer de tête le mat du lion
  // Chapitre 6 : 6-2 … 6-12 injectés, puis la vraie épreuve de 16 demi-coups (8 coups complets)
  prog.levels = { ...prog.levels, ...lv(['6-2', '6-4', '6-6', '6-8', '6-12']) };
  prog.chapters[3] = { ...prog.chapters[3], toReview: false, due: '2099-01-01' };
  await setMeta('boardProgress', prog);
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/ex/6-16/test');
  await p.getByRole('button', { name: /Commencer l’épreuve/ }).tap();
  const prompt16 = await p.getByTestId('prompt').innerText();
  assert(/ 8\.\S+ \S+ :/.test(prompt16) && !/ 9\./.test(prompt16), '6-16 : suite de 8 coups complets — ' + prompt16);
  r = await runTest();
  assert(/Épreuve réussie/.test(r) && /10\/10 justes/.test(r) && /Niveau validé/.test(r), '6-16 : 10 questions justes → validé : ' + r.replace(/\s+/g, ' '));
  prog = await meta('boardProgress');
  assert(prog.chapters[6] && prog.levels['6-16'].validated, 'chapitre 6 validé (2, 4, 6, 8, 12 et 16 demi-coups)');
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/replay');
  await p.getByRole('button', { name: /Le mat du lion/ }).tap();
  for (let k = 0; k < 4; k++) {
    const e = await p.locator('.play').getAttribute('data-expected');
    await p.locator(`[data-square="${e.slice(0, 2)}"]`).first().tap(); await p.locator(`[data-square="${e.slice(2, 4)}"]`).first().tap();
    await p.waitForTimeout(150);
  }
  await p.getByTestId('board-result').waitFor();
  assert(/rejouée : 0 erreur, 0 coup d’œil/.test(await p.getByTestId('board-result').innerText()), '7a : mat du lion rejoué de tête, pièces cachées (0 erreur)');

  // --- 7b : partie à l'aveugle contre Maia 600 (mon camp : Stockfish), un coup d'œil
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/board/blind');
  await p.getByLabel('Niveau de Maia').selectOption('600');
  await p.getByRole('button', { name: 'Commencer la partie' }).tap();
  await p.getByText('À toi de jouer.').waitFor({ timeout: 180000 });
  assert(await p.locator('.piece-img').count() === 0 && await p.locator('.piece-hidden').count() === 32, 'pièces cachées (32), cases visibles');
  await p.getByRole('button', { name: /Voir les pièces \(0\)/ }).tap();
  assert(await p.locator('.piece-img').count() === 32 && await p.getByTestId('peeks').innerText() === '1', '« Voir les pièces » : position montrée, 1 coup d’œil compté');
  await p.screenshot({ path: OUT + '/b-9-coup-doeil.png' });
  await p.waitForTimeout(3300);
  assert(await p.locator('.piece-img').count() === 0, 'pièces de nouveau cachées après 3 s');
  // Coup impossible : message, pas de coup joué
  await p.locator('[data-square="e2"]').first().tap(); await p.locator('[data-square="e5"]').first().tap();
  assert(/Coup impossible : e2 → e5/.test(await p.getByTestId('blind-msg').innerText()), 'coup impossible signalé (e2 → e5)');
  let announced = false;
  for (let k = 0; k < 150 && !(await p.getByTestId('board-result').count()); k++) {
    const turn = await p.locator('.play').getAttribute('data-turn');
    if (turn !== 'me') { await p.waitForTimeout(150); continue; }
    if (k > 2 && /Maia a joué : /.test(await p.getByTestId('announce').innerText())) announced = true;
    const fen = await p.locator('.play').getAttribute('data-fen');
    const u = await p.evaluate((f) => window.__sfBest(f, 150), fen);
    await p.locator(`[data-square="${u.slice(0, 2)}"]`).first().tap(); await p.locator(`[data-square="${u.slice(2, 4)}"]`).first().tap();
    if (u.length === 5) await p.getByRole('button', { name: /Dame/ }).tap();
    for (let i = 0; i < 60 && await p.locator('.play').getAttribute('data-fen') === fen; i++) await p.waitForTimeout(50);
  }
  assert(announced, 'coup de Maia annoncé en texte (« Maia a joué : … »)');
  const res = await p.getByTestId('board-result').innerText();
  assert(/Chapitre 7 validé/.test(res), 'partie à l’aveugle finie avec 1 coup d’œil → chapitre 7 validé : ' + res.replace(/\s+/g, ' '));
  await p.screenshot({ path: OUT + '/b-10-aveugle.png' });

  // --- Rapport pour Claude : section « Échiquier »
  await p.goto(URL + '#/stats'); await p.goto(URL + '#/report');
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 120000 });
  const md = await p.locator('.md-preview').innerText();
  assert(/## 5\. Échiquier/.test(md) && /Chapitres validés : \*\*\d \/ 7\*\*/.test(md) && /### Meilleurs scores/.test(md) && /### Mes 10 cases les plus faibles/.test(md),
    'rapport : section « Échiquier » (chapitres validés, meilleurs scores, cases faibles)');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
