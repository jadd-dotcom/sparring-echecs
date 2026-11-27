// Navigation par onglets et « Aujourd'hui » : chip niveau, Réglages (roue dentée), objectif compact, séance du jour
// (5 étapes, « Continuer », étape cochée au retour), retour = écran parent, onglets Jouer / Entraînement / Progrès,
// révision plafonnée, bouton principal #4a9a33 (texte blanc gras ≥ 18 px), cibles ≥ 44 px (iPhone émulé).
const { chromium, devices } = require('playwright');
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
  const move = async (u) => { await sq(u.slice(0, 2)).tap(); await sq(u.slice(2, 4)).tap(); };
  const back = async (label) => {
    await p.getByTestId('back').filter({ hasText: label }).waitFor({ timeout: 5000 }).catch(() => {});
    const t = await p.getByTestId('back').innerText();
    assert(t.includes(label), `retour vers « ${label} » (${t.trim()})`);
    await p.getByTestId('back').tap();
  };
  await p.goto(URL);
  await p.getByTestId('session').waitFor();

  // ---------- Aujourd'hui
  assert((await p.getByTestId('level-chip').innerText()).trim() === '900 · Maia 950', 'chip niveau « 900 · Maia 950 »');
  assert(await p.getByTestId('goal-card').count() === 1 && /Ne rien donner/.test(await p.getByTestId('goal-card').innerText()), 'carte Objectif compacte');
  const steps = await p.locator('.session-step').allInnerTexts();
  assert(steps.length === 5 && /Échauffement échiquier/.test(steps[0]) && /piège/.test(steps[1]) && /Lis la menace/.test(steps[2]) && /Révision/.test(steps[3]) && /partie contre Maia/.test(steps[4]), 'séance du jour en 5 étapes');
  assert(steps.every((s) => /\d+ min/.test(s)), 'chaque étape avec sa durée');
  assert(/^Continuer : Échauffement échiquier/.test((await p.getByTestId('continue').innerText()).trim()), '« Continuer : Échauffement échiquier »');
  const st = await p.getByTestId('continue').evaluate((e) => { const s = getComputedStyle(e); return { bg: s.backgroundColor, color: s.color, size: parseFloat(s.fontSize), weight: Number(s.fontWeight) }; });
  assert(st.bg === 'rgb(74, 154, 51)' && st.color === 'rgb(255, 255, 255)' && st.size >= 18 && st.weight >= 700, `bouton principal #4a9a33, texte blanc gras ≥ 18 px (${JSON.stringify(st)})`);
  const small = await p.evaluate(() => [...document.querySelectorAll('button, a.tab')].filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44).map((e) => e.textContent.trim()));
  assert(small.length === 0, 'cibles ≥ 44 px ' + small.join(' | '));
  const tabs = await p.locator('.tabbar .tab').allInnerTexts();
  assert(tabs.map((t) => t.replace(/\d+/g, '').trim()).join(' · ') === 'Aujourd’hui · Jouer · Ouvertures · Entraînement · Progrès', 'barre d’onglets : ' + tabs.join(' · '));
  assert(await p.locator('.tab-badge').count() >= 1, 'pastilles de nombre sur les onglets');
  await p.screenshot({ path: OUT + '/today-1.png' });

  // ---------- Réglages (roue dentée) et retour
  await p.getByRole('button', { name: 'Réglages' }).tap();
  await p.getByRole('heading', { name: 'Réglages' }).waitFor();
  await back('Aujourd’hui');
  await p.getByTestId('session').waitFor();

  // ---------- Retour = écran parent : Entraînement › Pièges › un piège › exercice
  await p.getByTestId('tab-training').tap();
  await p.getByRole('heading', { name: 'Entraînement' }).waitFor();
  assert(await p.getByTestId('back').count() === 0, 'racine d’onglet : pas de bouton retour');
  await p.getByRole('button', { name: /Pièges d’ouverture/ }).tap();
  await p.getByTestId('trap-berger-h5').tap();
  await p.getByTestId('trap-defend').tap();
  await p.locator('[data-testid="trap-ex"]').waitFor();
  await back('Mat du berger (dame en h5)');
  await p.getByTestId('trap-lesson').waitFor();
  await back('Pièges d’ouverture');
  await back('Entraînement');
  await p.getByRole('heading', { name: 'Entraînement' }).waitFor();

  // ---------- Séance : échauffement fait → « Continuer : Un piège » → piège défendu et puni → retour, étape cochée
  await p.evaluate(() => { const d = new Date(); return window.__db.meta.put({ key: 'warmupDay', value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }); });
  await p.getByTestId('tab-today').tap();
  await p.locator('[data-testid="step-warmup"][data-done="true"]').waitFor();
  assert(/^Continuer : Un piège d’ouverture/.test((await p.getByTestId('continue').innerText()).trim()), 'échauffement coché → « Continuer : Un piège d’ouverture »');
  assert(/Gambit Englund/.test(await p.getByTestId('step-trap').innerText()), 'piège du jour : mes ouvertures d’abord (Englund)');
  await p.getByTestId('continue').tap();
  await p.locator('[data-testid="trap-ex"][data-mode="defend"]').waitFor();
  await move('b1c3');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  await p.getByRole('button', { name: 'Punis-le' }).tap();
  await p.locator('[data-testid="trap-ex"][data-mode="punish"]').waitFor();
  await move('f8b4');
  await p.locator('[data-testid="trap-ex"][data-phase="won"]').waitFor({ timeout: 30000 });
  await p.getByTestId('session-back').tap();
  await p.locator('[data-testid="step-trap"][data-done="true"]').waitFor();
  assert(true, 'fin d’étape : retour sur Aujourd’hui, l’étape est cochée');
  assert(/^Continuer : Révision/.test((await p.getByTestId('continue').innerText()).trim()), 'étape suivante : Révision (rien à lire aujourd’hui)');
  await p.screenshot({ path: OUT + '/today-2-coche.png' });

  // ---------- Révision plafonnée (15 par défaut, réglable) : le reste attend
  await p.evaluate(() => window.__db.cards.filter((c) => c.kind === 'drill').modify({ due: '2000-01-01' }));
  await p.getByTestId('tab-training').tap();
  const rv = await p.getByTestId('nav-revise').innerText();
  assert(/15 cartes aujourd’hui · \d+ en attente/.test(rv), 'Entraînement : révision plafonnée à 15, compteur en attente (' + rv.replace(/\s+/g, ' ') + ')');
  await p.getByTestId('tab-today').tap();
  await p.getByRole('button', { name: 'Réglages' }).tap();
  await p.getByText('Sans limite').waitFor();
  await p.locator('label.radio', { hasText: /^\s*10\s*$/ }).tap();
  await p.getByTestId('back').tap();
  await p.getByTestId('tab-training').tap();
  assert(/^Révision10 cartes aujourd’hui/.test((await p.getByTestId('nav-revise').innerText()).replace(/\s+/g, '')) || /10 cartes aujourd’hui/.test(await p.getByTestId('nav-revise').innerText()), 'réglage : 10 par jour');

  // ---------- Jouer : couleur, comptée / non comptée, raccourcis
  await p.getByTestId('tab-jouer').tap();
  await p.getByRole('heading', { name: 'Jouer contre Maia' }).waitFor();
  assert(await p.getByRole('radio', { name: 'Partie comptée' }).getAttribute('aria-checked') === 'true', 'partie comptée par défaut');
  await p.getByRole('radio', { name: 'Partie non comptée' }).tap();
  assert(await p.getByRole('radio', { name: 'Partie non comptée' }).getAttribute('aria-checked') === 'true', 'interrupteur « Partie non comptée »');
  assert(await p.getByRole('button', { name: 'Jouer les lignes' }).count() >= 4 && await p.getByRole('button', { name: 'Partie à thème' }).count() >= 4, 'raccourcis lignes et partie à thème');
  assert(await p.locator('button.primary').count() === 1, 'une seule action principale');

  // ---------- Progrès
  await p.getByTestId('tab-progress').tap();
  await p.getByRole('heading', { name: 'Progrès' }).waitFor();
  for (const t of ['Objectif en détail', 'Statistiques et parties', 'Rapport pour Claude']) assert(await p.getByRole('button', { name: new RegExp(t) }).count() === 1, `Progrès : ${t}`);
  await p.getByRole('button', { name: /Objectif en détail/ }).tap();
  await p.getByTestId('goal-ne-rien-donner').waitFor().catch(() => {});
  assert(await p.locator('.goal-list li').count() === 3, 'objectif en détail : les 3 objectifs');
  await back('Progrès');
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
