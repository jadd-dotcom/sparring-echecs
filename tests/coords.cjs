// Coordonnées (a-h, 1-8) et pièces ne se chevauchent jamais : pour chacune des 16 coordonnées et chacune des 12 pièces
// du jeu (qu'elle soit sur la case ou non), on dessine la pièce dans un canvas à sa place dans la case et on compte ses
// pixels opaques sous le texte (boîte de la ligne de texte, plus large que les glyphes).
// 3 jeux de pièces × 5 écrans (iPhone SE, iPhone 13 portrait et paysage, iPad paysage et portrait) × côté Blancs et Noirs.
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };

async function overlaps(p, set) {
  return p.evaluate(async (set) => {
    // Géométrie d'une pièce dans sa case (identique pour toutes les cases).
    const ref = document.querySelector('img.piece-img');
    const sqRef = ref.closest('[data-square]').getBoundingClientRect();
    const r0 = ref.getBoundingClientRect();
    const rel = { x: r0.left - sqRef.left, y: r0.top - sqRef.top, w: r0.width, h: r0.height };
    const k = 3;
    const base = ref.src.replace(/[wb][KQRBNP]\.svg$/, '');
    const codes = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    const canv = {};
    for (const code of codes) {
      const img = new Image(); img.src = base + code + '.svg'; await img.decode();
      const c = document.createElement('canvas'); c.width = Math.round(rel.w * k); c.height = Math.round(rel.h * k);
      const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0, c.width, c.height);
      canv[code] = ctx;
    }
    const out = [];
    let checked = 0;
    for (const sq of document.querySelectorAll('[data-square]')) {
      const labels = [...sq.querySelectorAll('span')].filter((s) => s.children.length === 0 && /^[a-h1-8]$/.test(s.textContent));
      if (!labels.length) continue;
      const sr = sq.getBoundingClientRect();
      const ir = { left: sr.left + rel.x, top: sr.top + rel.y, right: sr.left + rel.x + rel.w, bottom: sr.top + rel.y + rel.h };
      for (const l of labels) {
        const range = document.createRange(); range.selectNodeContents(l);
        const lr = range.getBoundingClientRect();
        const x0 = Math.max(lr.left, ir.left), x1 = Math.min(lr.right, ir.right);
        const y0 = Math.max(lr.top, ir.top), y1 = Math.min(lr.bottom, ir.bottom);
        for (const code of codes) {
          checked++;
          if (x1 <= x0 || y1 <= y0) continue;
          const d = canv[code].getImageData(Math.floor((x0 - ir.left) * k), Math.floor((y0 - ir.top) * k), Math.max(1, Math.ceil((x1 - x0) * k)), Math.max(1, Math.ceil((y1 - y0) * k))).data;
          let n = 0;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 24) n++;
          if (n) out.push(`${code} en ${sq.dataset.square} sur « ${l.textContent} » (${n} px)`);
        }
      }
    }
    return { checked, out, set: base.includes('/' + set + '/'), pct: Math.round((100 * rel.w) / sqRef.width) };
  }, set);
}

(async () => {
  const b = await chromium.launch();
  const errors = [];
  const DEVS = [['iPhone SE', devices['iPhone SE']], ['iPhone 13', devices['iPhone 13']], ['iPhone 13 paysage', devices['iPhone 13 landscape']],
    ['iPad paysage', devices['iPad (gen 7) landscape']], ['iPad portrait', devices['iPad (gen 7)']]];
  for (const [dname, dev] of DEVS) {
    const ctx = await b.newContext({ ...dev, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(URL);
    await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
    for (const set of ['celtic', 'merida', 'cburnett']) {
      await p.evaluate((s) => window.__db.meta.put({ key: 'pieces', value: s }), set);
      await p.reload();   // le jeu de pièces est lu au démarrage
      await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor().catch(() => {});
      // Drill Anglaise (côté Blancs, position de départ) puis système …c5/…g6 (côté Noirs, après 1.e4)
      for (const [route, side] of [['#/revise/english', 'Blancs'], ['#/revise/g6-system', 'Noirs']]) {
        await p.goto(URL + '#/stats'); await p.goto(URL + route);
        await p.getByText(/Joue le coup de ton répertoire/).waitFor({ timeout: 60000 });
        await p.waitForFunction((s) => [...document.querySelectorAll('img.piece-img')].some((i) => i.src.includes(`/pieces/${s}/`)), set);
        const r = await overlaps(p, set);
        assert(r.set && r.checked === 16 * 12 && r.out.length === 0, `${dname}, ${set}, côté ${side} : pièces à ${r.pct} % de la case, 12 pièces × 16 coordonnées, aucun chevauchement ${r.out.slice(0, 6).join(', ')}`);
        if (dname === 'iPad paysage' && side === 'Blancs') {
          const box = await p.locator('[data-square="a1"]').boundingBox();
          await p.screenshot({ path: `${OUT}/coords-${set}.png`, clip: { x: box.x, y: box.y - 3 * box.height, width: 4 * box.width, height: 4 * box.height } });
        }
      }
    }
    await ctx.close();
  }
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
