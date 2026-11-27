// Mode Carrefours et « Les deux camps » (Londres en défense, iPhone émulé) : liste des cartes et phrases-panneaux,
// Q1 « Sur quelle ligne es-tu ? », Q2 mon coup, indices (pièce qui a bougé, phrase-panneau), répétition espacée,
// progression sur la page ; « Les deux camps » : je joue aussi ses coups, erreurs comptées des deux côtés.
const { chromium, devices } = require('playwright');
const { Chess } = require('chess.js');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route('**/api.chess.com/**', (r) => r.abort());
  const sq = (s) => p.locator(`[data-square="${s}"]`);
  const tapSan = async (fen, san) => { const m = new Chess(fen).move(san); await sq(m.from).tap(); await sq(m.to).tap(); };
  await p.goto(URL);
  await p.getByTestId('session').waitFor();

  // ---------- Onglet Carrefours : cartes, états, phrases-panneaux
  await p.goto(URL + '#/opening/london-def/carrefours');
  await p.getByTestId('cross-train').waitFor();
  const nCards = await p.getByTestId('cross-card').count();
  assert(nCards === 24, 'une carte par coup-panneau (24)');
  assert(/Il attaque ton pion d5 → tu le soutiens : …c6/.test(await p.locator('.cross-list').innerText()), 'phrase-panneau : « Il attaque ton pion d5 → tu le soutiens : …c6 »');
  assert(/0 à revoir · 8 nouvelles/.test(await p.getByTestId('cross-train').innerText()), 'bouton : 0 à revoir · 8 nouvelles');
  await p.getByTestId('cross-train').tap();

  // ---------- Carte 1 : bonne ligne, bon coup → réussie
  await p.locator('[data-testid="cross-ex"][data-q="1"]').waitFor();
  const ex = p.getByTestId('cross-ex');
  const id1 = await ex.getAttribute('data-card');
  const his1 = id1.split(' ').pop();
  assert(/Il vient de jouer : /.test(await p.getByTestId('cross-last').innerText()), 'son coup en mots, dernier coup surligné');
  assert(await p.getByTestId('cross-choice').count() >= 2, 'Q1 : choix parmi les lignes du carrefour');
  await p.locator(`[data-testid="cross-choice"][data-his="${his1}"]`).tap();
  await p.locator('[data-testid="cross-ex"][data-q="2"]').waitFor();
  assert(/Ligne :/.test(await p.getByTestId('cross-q1').innerText()) && await p.getByTestId('cross-q1').evaluate((e) => e.classList.contains('good-text')), 'Q1 juste');
  await tapSan(await ex.getAttribute('data-fen'), await ex.getAttribute('data-mine'));
  await p.getByTestId('cross-result').waitFor();
  assert(/Réussi/.test(await p.getByTestId('cross-result').innerText()) && /Panneau :/.test(await p.getByTestId('cross-sentence').innerText()), 'Q2 juste : réussi, phrase-panneau affichée');
  await p.screenshot({ path: OUT + '/cx-1-reussi.png' });
  await p.getByTestId('cross-next').tap();

  // ---------- Carte 2 : mauvaise ligne, mauvais coup, indices → revient demain
  await p.locator('[data-testid="cross-ex"][data-q="1"]').waitFor();
  const id2 = await ex.getAttribute('data-card');
  const his2 = id2.split(' ').pop();
  await p.locator(`[data-testid="cross-choice"]:not([data-his="${his2}"])`).first().tap();
  await p.locator('[data-testid="cross-ex"][data-q="2"]').waitFor();
  assert(await p.getByTestId('cross-q1').evaluate((e) => e.classList.contains('bad-text')), 'Q1 fausse : la bonne ligne est montrée');
  const fen2 = await ex.getAttribute('data-fen');
  const mine2 = await ex.getAttribute('data-mine');
  const wrong = new Chess(fen2).moves({ verbose: true }).find((m) => m.san !== mine2 && !/[+#]/.test(m.san) && m.piece !== 'k');
  await sq(wrong.from).tap(); await sq(wrong.to).tap();
  await p.getByTestId('cross-msg').waitFor();
  await p.getByRole('button', { name: /^Indice/ }).tap();
  assert(/que vise-t-elle/.test(await p.getByTestId('cross-hint').innerText()), 'indice 1 : la pièce qui a bougé + « Que vise-t-elle ? »');
  await p.getByRole('button', { name: /^Indice/ }).tap();
  assert(/→/.test(await p.getByTestId('cross-hint2').innerText()), 'indice 2 : la phrase-panneau');
  await tapSan(fen2, mine2);
  await p.getByTestId('cross-result').waitFor();
  assert(/revient demain/.test(await p.getByTestId('cross-result').innerText()), 'ratée : la carte revient demain');
  await p.getByTestId('cross-redo').tap();
  assert(await ex.getAttribute('data-q') === '1', '« Refaire » : la carte recommence');
  const prog = await p.evaluate(() => window.__db.meta.get('crossroads:london-def').then((m) => m.value));
  const t = new Date(); const tom = new Date(t); tom.setDate(t.getDate() + 1); const j3 = new Date(t); j3.setDate(t.getDate() + 3);
  assert(prog[id1].step === 1 && prog[id1].due === dayKey(j3) && prog[id2].step === 0 && prog[id2].due === dayKey(tom), 'répétition espacée par carte : réussie J+3, ratée demain');
  await p.getByTestId('back').tap();
  await p.getByTestId('cross-train').waitFor();
  assert(await p.locator('[data-testid="cross-card"]:not([data-state="nouvelle"])').count() === 2, 'progression sur la page de l’ouverture');

  // ---------- « Les deux camps » : je joue aussi ses coups, depuis le 1er coup ; une erreur de son côté
  await p.getByTestId('otab-lignes').tap();
  await p.getByTestId('train-bar').waitFor();
  const row = p.locator('[data-testid="line-row"]').first();
  await row.locator('input[type="checkbox"]').check();
  await p.getByRole('radio', { name: 'Au 1er coup' }).tap();
  await p.getByTestId('both-toggle').check();
  await p.getByTestId('train-sel').tap();
  await p.locator('.play-lines').waitFor();
  assert(/Les deux camps/.test(await p.getByTestId('lines-banner').innerText()), 'bandeau « Les deux camps »');
  assert(/joue aussi son coup/.test(await p.getByTestId('lines-prompt').innerText()), 'au 1er coup, c’est à moi de jouer SON coup');
  const el = p.locator('.play-lines');
  // Erreur sur son coup
  const f0 = await el.getAttribute('data-fen');
  const e0 = await el.getAttribute('data-expected');
  const bad = new Chess(f0).moves({ verbose: true }).find((m) => m.san !== e0 && !['d4', 'c4', 'Nf3'].includes(m.san));
  await sq(bad.from).tap(); await sq(bad.to).tap();
  await p.getByTestId('lines-msg').waitFor();
  assert(/Pas le coup de la ligne pour son camp/.test(await p.getByTestId('lines-msg').innerText()), 'erreur sur son coup, comptée');
  for (let i = 0; i < 60 && !(await p.getByTestId('lines-done').count()); i++) {
    const exp = await el.getAttribute('data-expected');
    if (exp) await tapSan(await el.getAttribute('data-fen'), exp); else await p.waitForTimeout(300);
  }
  await p.getByTestId('lines-done').waitFor();
  assert(/Erreurs : 0 de ton côté, 1 du sien/.test(await p.getByTestId('lines-errors').innerText()), 'fin : erreurs comptées des deux côtés');
  await p.screenshot({ path: OUT + '/cx-2-deux-camps.png' });
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
