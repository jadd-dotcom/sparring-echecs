// Captures pour vérification visuelle : iPad portrait (820×1180) et iPhone (390×844), 19 écrans, avec relevé
// automatique des défauts d'affichage (défilement horizontal, élément qui déborde de l'écran, texte coupé).
// Usage : node tests/captures.cjs <dossier, ex. docs/captures> [url]  → <dossier>/<appareil>/NN-ecran.jpg + defauts.json
const { chromium } = require('playwright');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || 'docs/captures';
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const DEVICES = [
  { id: 'ipad-portrait', label: 'iPad portrait 820×1180', viewport: { width: 820, height: 1180 }, isMobile: true },
  { id: 'iphone', label: 'iPhone 390×844', viewport: { width: 390, height: 844 }, isMobile: true },
];
const uciOf = (sans) => { const c = new Chess(); return sans.split(' ').map((s) => { const m = c.move(s); return m.from + m.to + (m.promotion ?? ''); }); };

/** Défauts visibles dans la page (exécuté dans le navigateur). */
function findDefects() {
  const W = innerWidth;
  const out = [];
  const desc = (el) => {
    const id = el.getAttribute('data-testid');
    const cls = typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '';
    const txt = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
    return `<${el.tagName.toLowerCase()}${id ? ` data-testid=${id}` : ''}${cls ? ` .${cls}` : ''}>${txt ? ` « ${txt} »` : ''}`;
  };
  const se = document.scrollingElement;
  if (se.scrollWidth > se.clientWidth + 1) out.push(`défilement horizontal de la page (${se.scrollWidth} px de contenu pour ${se.clientWidth} px)`);
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (el.classList.contains('sr-only') || (r.width <= 1 && r.height <= 1)) continue;   // texte réservé aux lecteurs d'écran
    // Déborde de l'écran à droite (seulement l'élément le plus haut qui déborde).
    if (r.right > W + 1 && cs.position !== 'fixed') {
      const p = el.parentElement;
      if (!p || p.getBoundingClientRect().right <= W + 1) out.push(`déborde de l’écran à droite de ${Math.round(r.right - W)} px : ${desc(el)}`);
    }
    // Texte coupé : contenu plus large que la boîte, et débordement masqué ou points de suspension.
    const clipped = (['hidden', 'clip'].includes(cs.overflowX) || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1;
    if (clipped && (el.innerText || '').trim() && el.children.length < 3) out.push(`texte coupé : ${desc(el)}`);
  }
  // Textes qui se chevauchent : éléments de texte « feuilles » dont les boîtes se recouvrent nettement.
  const leaves = [...document.querySelectorAll('label, button, a, h1, h2, h3, h4, p, span, b, li')].filter((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (!r.width || !r.height || cs.visibility === 'hidden' || el.classList.contains('sr-only') || r.bottom < 0 || r.top > innerHeight) return false;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    return own;
  });
  // Barre fixe ou collante (onglets, barre d'entraînement) : le contenu qui défile dessous n'est pas un défaut ; un
  // chevauchement à l'intérieur d'une même barre, si.
  const overlay = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const ps = getComputedStyle(e).position; if (ps === 'fixed' || ps === 'sticky') return e; } return null; };
  for (let i = 0; i < leaves.length; i++) for (let j = i + 1; j < leaves.length; j++) {
    const a = leaves[i], c = leaves[j];
    if (a.contains(c) || c.contains(a) || overlay(a) !== overlay(c)) continue;
    // Boîtes ligne par ligne (un texte en ligne qui passe à la ligne n'est pas un chevauchement).
    const hit = [...a.getClientRects()].some((ra) => [...c.getClientRects()].some((rc) => {
      const w = Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left), h = Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top);
      return w > 0 && h > 0 && w * h > 0.3 * Math.min(ra.width * ra.height, rc.width * rc.height);
    }));
    if (hit) out.push(`textes qui se chevauchent : ${desc(a)} et ${desc(c)}`);
  }
  return [...new Set(out)].slice(0, 20);
}

async function seed(p) {
  await p.evaluate(async ({ START, cur, review }) => {
    const db = window.__db;
    const day = (k) => Date.now() - k * 86400000;
    const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
    // Parties importées (Rapid) pour les courbes, et une partie à revoir.
    const bl = (motif) => ({ ply: 0, san: 'a3', uci: 'a2a3', bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 10, drop: 40, severity: 'blunder', detail: { v: 3, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: [motif], motif } });
    for (let i = 0; i < 8; i++) {
      await db.games.add({ source: 'chesscom', date: day(20 - i), myColor: i % 2 ? 'b' : 'w', startFen: START, uci: [], san: [], result: '1-0', score: i % 2, termination: 'Abandon',
        analysis: Array.from({ length: (i * 7) % 3 }, () => bl(i % 2 ? 'piece-en-prise' : 'menace-ignoree')),
        ext: { site: 'chess.com', timeClass: 'rapid', me: { name: 'moi', rating: 580 + 9 * i }, opp: { name: 'Adversaire' + i, rating: 600 } } });
    }
    const reviewId = await db.games.add({ source: 'app', date: day(1), myColor: 'w', startFen: START, uci: review.uci, san: review.san, result: '0-1', score: 0, termination: 'Abandon', ratingBefore: 900, ratingAfter: 870, botElo: 950 });
    // Carte de révision due aujourd'hui (4.Ke2 ? au lieu de 4.Kxf2).
    await db.cards.add({ kind: 'mistake', gameId: reviewId, source: 'app', fen: review.cardFen, myColor: 'w', playedUci: 'e1e2', playedSan: 'Ke2', bestUci: 'e1f2', bestSan: 'Kxf2',
      wpBefore: 60, drop: 40, severity: 'blunder', step: 0, due: today, createdAt: Date.now(),
      attempts: [{ date: day(3), uci: 'e1f2', ok: true, hints: 0 }, { date: day(2), uci: 'e1e2', ok: false, hints: 1 }] });
    // Partie en cours avec du matériel pris des deux côtés.
    await db.meta.put({ key: 'current', value: { myColor: 'w', startFen: START, uci: cur, rating: 900, botElo: 950, maiaMs: cur.map(() => 400).slice(0, Math.floor(cur.length / 2)), startedAt: Date.now() } });
    window.__reviewId = reviewId;
  }, { START, cur: uciOf('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6'), review: (() => {
    const san = ['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+', 'Ke2', 'Bb6'];
    const c = new Chess(); const uci = []; let cardFen = '';
    san.forEach((s, i) => { if (i === 6) cardFen = c.fen(); const m = c.move(s); uci.push(m.from + m.to); });
    return { uci, san, cardFen };
  })() });
  return p.evaluate(() => window.__reviewId);
}

(async () => {
  const b = await chromium.launch();
  const index = [];
  for (const dev of DEVICES) {
    const dir = path.join(OUT, dev.id);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await b.newContext({ viewport: dev.viewport, deviceScaleFactor: 2, isMobile: dev.isMobile, hasTouch: true, colorScheme: 'dark' });
    await ctx.route('**/api.chess.com/**', (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto(URL);
    await p.getByTestId('session').waitFor({ timeout: 60000 });
    const reviewId = await seed(p);
    let n = 0;
    const shot = async (name, title, ready) => {
      n++;
      if (ready) await ready();
      await p.waitForTimeout(700);
      const file = `${String(n).padStart(2, '0')}-${name}.jpg`;
      await p.screenshot({ path: path.join(dir, file), type: 'jpeg', quality: 70 });
      const defects = await p.evaluate(findDefects);
      index.push({ device: dev.id, label: dev.label, file: `${dev.id}/${file}`, title, defects });
      console.log(`${dev.id} · ${title} : ${defects.length} défaut(s)`);
    };
    const go = async (hash) => { await p.goto(URL + hash); };

    await go('#/'); await shot('aujourdhui', 'Aujourd’hui', () => p.getByTestId('session').waitFor());
    await go('#/play'); await shot('partie-en-cours', 'Partie en cours (matériel)', () => p.getByText('à toi de jouer').waitFor({ timeout: 180000 }));
    await go('#/openings'); await shot('ouvertures', 'Ouvertures', () => p.locator('section.opening').first().waitFor());
    for (const [tab, label] of [['lecon', 'Leçon'], ['lignes', 'Lignes'], ['carrefours', 'Carrefours'], ['pieges', 'Pièges']]) {
      await go(`#/opening/english/${tab}`); await shot(`ouverture-${tab}`, `Page d’une ouverture : onglet ${label}`, () => p.getByTestId(`otab-${tab}`).waitFor());
    }
    await go('#/lesson/english/main:0'); await shot('bloc-lecon', 'Bloc de leçon', () => p.locator('.lesson-play').waitFor());
    await go('#/lines/london'); await shot('jouer-lignes', 'Jouer les lignes', () => p.getByTestId('lines-prompt').waitFor({ timeout: 15000 }));
    await go('#/exam/english'); await shot('examen', 'Examen', () => p.getByTestId('exam').waitFor());
    await go('#/crossroads/english'); await shot('carte-carrefours', 'Carte Carrefours', () => p.getByTestId('cross-ex').waitFor());
    await go('#/traps'); await shot('pieges', 'Pièges', () => p.locator('main').waitFor());
    await go('#/mates'); await shot('mats', 'Mats', () => p.locator('main').waitFor());
    await go('#/board'); await shot('echiquier', 'Échiquier (maîtrise)', () => p.locator('main').waitFor());
    await go('#/revise'); await shot('carte-revision', 'Carte de révision', () => p.getByTestId('instruction').waitFor({ timeout: 30000 }));
    await go(`#/review/${reviewId}`); await shot('revue', 'Revue de partie', () => p.locator('table.classes').waitFor({ timeout: 240000 }));
    await shot('explorer', 'Explorer', async () => { await p.getByTestId('explore-btn').tap(); await p.waitForTimeout(500); });
    await go('#/progress'); await shot('progres', 'Progrès (courbes)', () => p.getByTestId('chart-rapid').waitFor());
    await go('#/settings'); await shot('reglages', 'Réglages', () => p.getByTestId('last-backup').waitFor());
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'defauts.json'), JSON.stringify(index, null, 1));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
