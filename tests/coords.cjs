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
    const ref = [...document.querySelectorAll('img.piece-img')].find((i) => !['a8', 'h1'].includes(i.closest('[data-square]').dataset.square));
    const sqRef = ref.closest('[data-square]').getBoundingClientRect();
    const r0 = ref.getBoundingClientRect();
    const rel = { x: r0.left - sqRef.left, y: r0.top - sqRef.top, w: r0.width, h: r0.height };
    const k = 3;
    const base = ref.src.replace(/[wb][KQRBNP]\.svg$/, '');
    const codes = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    const imgs = {};
    for (const code of codes) { const img = new Image(); img.src = base + code + '.svg'; await img.decode(); imgs[code] = img; }
    const cache = {};
    const canvFor = (code, w) => {
      const key = code + '@' + w.toFixed(2);
      if (!cache[key]) {
        const c = document.createElement('canvas'); c.width = c.height = Math.round(w * k);
        const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(imgs[code], 0, 0, c.width, c.height);
        cache[key] = ctx;
      }
      return cache[key];
    };
    const out = [];
    let checked = 0;
    // Aucune coordonnée rognée par les coins arrondis de l'échiquier.
    let boardEl = document.querySelector('[data-square]');
    while (boardEl && parseFloat(getComputedStyle(boardEl).borderTopLeftRadius) === 0) boardEl = boardEl.parentElement;
    const br = boardEl.getBoundingClientRect();
    const rad = parseFloat(getComputedStyle(boardEl).borderTopLeftRadius) || 0;
    const inside = (x, y) => {
      const dx = Math.min(x - br.left, br.right - x), dy = Math.min(y - br.top, br.bottom - y);
      return dx >= rad || dy >= rad || (rad - dx) ** 2 + (rad - dy) ** 2 <= rad ** 2;
    };
    const clipped = [];
    for (const sq of document.querySelectorAll('[data-square]')) {
      const labels = [...sq.querySelectorAll('span')].filter((s) => s.children.length === 0 && /^[a-h1-8]$/.test(s.textContent));
      if (!labels.length) continue;
      const sr = sq.getBoundingClientRect();
      // Géométrie de la pièce dans cette case (les cases d'angle a8 et h1 ont une marge un peu plus grande).
      const own = sq.querySelector('img.piece-img');
      const g = own ? (() => { const o = own.getBoundingClientRect(); return { x: o.left - sr.left, y: o.top - sr.top, w: o.width, h: o.height }; })()
        : ['a8', 'h1'].includes(sq.dataset.square) ? null : rel;
      if (!g) continue;   // case d'angle vide : sa géométrie est vérifiée quand une pièce s'y trouve (position de départ)
      const ir = { left: sr.left + g.x, top: sr.top + g.y, right: sr.left + g.x + g.w, bottom: sr.top + g.y + g.h };
      for (const l of labels) {
        const range = document.createRange(); range.selectNodeContents(l);
        const lr = range.getBoundingClientRect();
        if (![[lr.left, lr.top], [lr.right, lr.top], [lr.left, lr.bottom], [lr.right, lr.bottom]].every(([x, y]) => inside(x, y))) clipped.push(sq.dataset.square + ':' + l.textContent);
        const x0 = Math.max(lr.left, ir.left), x1 = Math.min(lr.right, ir.right);
        const y0 = Math.max(lr.top, ir.top), y1 = Math.min(lr.bottom, ir.bottom);
        for (const code of codes) {
          checked++;
          if (x1 <= x0 || y1 <= y0) continue;
          const d = canvFor(code, g.w).getImageData(Math.floor((x0 - ir.left) * k), Math.floor((y0 - ir.top) * k), Math.max(1, Math.ceil((x1 - x0) * k)), Math.max(1, Math.ceil((y1 - y0) * k))).data;
          let n = 0;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 24) n++;
          if (n) out.push(`${code} en ${sq.dataset.square} sur « ${l.textContent} » (${n} px)`);
        }
      }
    }
    return { checked, out, clipped, rad, set: base.includes('/' + set + '/'), pct: Math.round((100 * rel.w) / sqRef.width) };
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
    for (const set of ['relief', 'merida', 'maestro']) {
      await p.evaluate((s) => window.__db.meta.put({ key: 'pieces', value: s }), set);
      await p.reload();   // le jeu de pièces est lu au démarrage
      await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor().catch(() => {});
      // Drill Anglaise (côté Blancs, position de départ) puis système …c5/…g6 (côté Noirs, après 1.e4)
      for (const [route, side] of [['#/revise/english', 'Blancs'], ['#/revise/g6-system', 'Noirs']]) {
        await p.goto(URL + '#/stats'); await p.goto(URL + route);
        await p.getByText(/Joue le coup de ton répertoire/).waitFor({ timeout: 60000 });
        await p.waitForFunction((s) => [...document.querySelectorAll('img.piece-img')].some((i) => i.src.includes(`/pieces/${s}/`)), set);
        const off = await p.evaluate(() => Math.max(...[...document.querySelectorAll('img.piece-img')].map((i) => {
          const a = i.getBoundingClientRect(); const q = i.closest('[data-square]').getBoundingClientRect();
          return Math.max(Math.abs(a.left + a.width / 2 - (q.left + q.width / 2)), Math.abs(a.top + a.height / 2 - (q.top + q.height / 2)));
        })));
        assert(off < 0.5, `${dname}, ${set}, côté ${side} : pièces centrées dans leur case (écart max ${off.toFixed(2)} px)`);
        const r = await overlaps(p, set);
        assert(r.set && r.checked === 16 * 12 && r.out.length === 0 && r.clipped.length === 0 && r.rad > 0,
          `${dname}, ${set}, côté ${side} : pièces à ${r.pct} % de la case, 12 pièces × 16 coordonnées, aucun chevauchement, aucune coordonnée rognée par l’arrondi (${r.rad} px) ${r.out.slice(0, 6).join(', ')} ${r.clipped.join(', ')}`);
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
