// « Pièges d'ouverture » : liste, mini-leçon (Voir la suite, règle), un piège défendu, un piège puni, une chute dans un
// piège (la suite se joue), indices, maîtrise (2 jours) → carte de révision, révision, rapport (iPad émulé).
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
  await p.route('**/api.chess.com/**', (r) => r.abort());
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const move = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  await p.goto(URL);
  await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
  // Hier : « Défends-toi » et « Punis-le » réussis sans indice pour le mat du berger (1er jour).
  await p.evaluate(() => {
    const y = Date.now() - 86400000;
    return window.__db.meta.put({ key: 'traps', value: { 'berger-h5': { attempts: [
      { date: y, mode: 'defend', ok: true, clean: true }, { date: y, mode: 'punish', ok: true, clean: true }] } } });
  });

  // ---------- Liste et mini-leçon
  await p.getByTestId('tab-training').tap();
  await p.getByRole('button', { name: /Pièges d’ouverture/ }).tap();
  for (const ch of ['mats', 'dame', 'mes']) await p.getByTestId(`trap-chapter-${ch}`).waitFor();
  assert(true, '3 chapitres : Mats rapides, Dame perdue, Pièges de mes ouvertures');
  assert(/Gambit Englund/.test(await p.getByTestId('trap-chapter-mes').innerText()), 'chapitre 3 : pièges de mes ouvertures, Englund compris');
  assert(/en cours · 1\/2 jours sans indice/.test(await p.getByTestId('trap-berger-h5').innerText()), 'progression : 1/2 jours');
  await p.getByTestId('trap-berger-h5').tap();
  await p.getByTestId('trap-lesson').waitFor();
  assert(/Règle : Quand sa dame et son fou visent f7/.test(await p.getByTestId('trap-rule').innerText()), 'mini-leçon : la règle en une phrase');
  await p.getByTestId('trap-lesson-suite').tap();
  assert(/^Ton pion va en e4|^Son pion va en e4/.test(await p.getByTestId('suite-caption').innerText()), 'mini-leçon : « Voir la suite » depuis le début');
  await p.screenshot({ path: OUT + '/trap-1-lecon.png' });

  // ---------- Défends-toi (mat du berger) : bon coup, sans indice
  await p.getByTestId('trap-defend').tap();
  await p.locator('[data-testid="trap-ex"][data-mode="defend"]').waitFor();
  assert(/Il tend un piège/.test(await p.getByTestId('trap-prompt').innerText()), 'Défends-toi : consigne');
  assert(/Il vient de jouer : sa dame va en h5/.test(await p.getByTestId('trap-last').innerText()), 'son dernier coup en mots');
  await move('g7g6');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  assert(/Bien défendu, sans indice/.test(await p.getByTestId('trap-result').innerText()), 'piège défendu (sans indice)');
  await p.screenshot({ path: OUT + '/trap-2-defendu.png' });

  // ---------- Punis-le : le coup gagnant → la suite se joue ; 2e jour sans indice → maîtrisé
  await p.getByRole('button', { name: 'Punis-le' }).tap();
  await p.locator('[data-testid="trap-ex"][data-mode="punish"]').waitFor();
  assert(/Il vient de jouer : ton cavalier va en f6|son cavalier va en f6/.test(await p.getByTestId('trap-last').innerText()), 'Punis-le : sa faute en mots');
  await move('h5f7');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  assert(/prend son pion f7 : échec et mat/.test(await p.getByTestId('suite-caption').innerText()), 'piège puni : mat, légende en mots');
  await p.getByTestId('trap-mastered').waitFor();
  assert(true, 'maîtrisé : les deux réussis sans indice, deux jours différents');
  const card = await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'trap').toArray());
  assert(card.length === 1 && card[0].trapId === 'berger-h5' && card[0].due > new Date().toISOString().slice(0, 10), 'carte de révision espacée créée (J+3)');
  await p.screenshot({ path: OUT + '/trap-3-puni.png' });

  // ---------- Défends-toi (Légal) : je tombe dans le piège → la suite se joue et s'explique
  await p.goto(URL + '#/traps/legal/defend');
  await p.locator('[data-testid="trap-ex"][data-mode="defend"]').waitFor();
  await move('g4d1');
  await p.locator('[data-testid="trap-ex"][data-phase="fell"]').waitFor({ timeout: 30000 });
  assert(/Tu es tombé dans le piège/.test(await p.getByTestId('trap-result').innerText()), 'chute : message');
  assert(/Le piège se referme · coup 1\/4/.test(await p.getByTestId('suite').innerText()), 'chute : la suite se joue (4 coups)');
  await p.getByRole('button', { name: 'Coup suivant de la suite' }).tap();
  assert(/^Son fou prend ton pion f7 : échec/.test(await p.getByTestId('suite-caption').innerText()), 'chute : légende en mots (échec en f7)');
  for (let i = 0; i < 2; i++) await p.getByRole('button', { name: 'Coup suivant de la suite' }).tap();
  assert(/échec et mat/.test(await p.getByTestId('suite-caption').innerText()), 'chute : jusqu’au mat');
  await p.screenshot({ path: OUT + '/trap-4-chute.png' });

  // ---------- Punis-le (Petrov) avec indices progressifs, puis le bon coup
  await p.goto(URL + '#/traps/petrov/punish');
  await p.locator('[data-testid="trap-ex"][data-mode="punish"]').waitFor();
  await p.getByRole('button', { name: /^Indice/ }).tap();
  assert(/découvrant un échec/.test(await p.getByTestId('trap-hint').innerText()), 'indice 1 : en mots');
  await p.getByRole('button', { name: /^Indice/ }).tap();
  await p.getByTestId('trap-hint2').waitFor();
  assert(await p.getByRole('button', { name: 'Solution' }).isEnabled(), 'après 2 indices : Solution possible');
  await move('e5c6');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  assert(!/sans indice/.test(await p.getByTestId('trap-result').innerText()), 'réussi avec indices (ne compte pas pour la maîtrise)');
  // La tentative est écrite en base juste après l'affichage du résultat : on l'attend (pas de lecture trop tôt).
  await p.waitForFunction(() => window.__db.meta.get('traps').then((m) => !!m?.value?.petrov?.attempts?.length));
  const tp = await p.evaluate(() => window.__db.meta.get('traps').then((m) => m.value.petrov.attempts));
  assert(tp.length === 1 && tp[0].ok && !tp[0].clean, 'tentative enregistrée : réussie, pas « sans indice »');

  // ---------- Révision espacée : la carte du piège maîtrisé
  await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'trap').modify({ due: '2999-01-01' }));
  await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'trap').modify({ due: '2000-01-01' }));
  await p.goto(URL + '#/revise');
  await p.locator('[data-testid="trap-ex"][data-mode="defend"]').waitFor({ timeout: 60000 });
  await move('g7g6');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  await p.getByRole('button', { name: 'Maintenant : Punis-le' }).tap();
  await p.locator('[data-testid="trap-ex"][data-mode="punish"]').waitFor();
  await move('h5f7');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  await p.getByRole('button', { name: 'Suivante' }).waitFor();
  const after = await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'trap').first());
  assert(after.step === 2 && after.attempts.length === 1 && after.attempts[0].ok, 'révision réussie : la carte avance (répétition espacée)');

  // ---------- Rapport : pièges maîtrisés / en cours, et chute dans une vraie partie
  await p.evaluate(() => window.__db.games.add({
    source: 'chesscom', date: Date.now() - 3600000, myColor: 'b', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    uci: ['e2e4', 'e7e5', 'f1c4', 'b8c6', 'd1h5', 'g8f6', 'h5f7'], san: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'],
    result: '1-0', score: 0, termination: 'Échec et mat', ext: { site: 'chess.com', me: { name: 'moi' }, opp: { name: 'Berger' } },
  }));
  await p.goto(URL + '#/report');
  await p.getByRole('button', { name: 'Générer le rapport' }).tap();
  await p.locator('.md-preview').waitFor({ timeout: 300000 });
  const md = await p.locator('.md-preview').innerText();
  assert(/## 8\. Pièges d’ouverture/.test(md) && /Maîtrisés : \*\*1\/13\*\*/.test(md) && /\| Mat du berger \(dame en h5\) \| Mats rapides \| maîtrisé \|/.test(md), 'rapport : pièges maîtrisés / en cours');
  assert(/Pièges où je suis tombé dans mes vraies parties \(1\)/.test(md) && /\| Mat du berger \(dame en h5\) \| n°\d+ \| .* \| Chess\.com \| 3… Nf6 \|/.test(md), 'rapport : piège où je suis tombé dans une vraie partie');

  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
