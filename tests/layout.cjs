// Mise en page : sur iPhone portrait, iPad portrait et iPad paysage, chaque écran avec un échiquier tient dans l'écran
// (aucun défilement de la page), l'échiquier est entier et aucune rangée n'est coupée ni cachée en haut ; la zone de
// texte reste visible (elle défile seule).
const { chromium, devices } = require('playwright');
const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:4173/sparring-echecs/';
const assert = (c, m) => { if (!c) throw new Error('ÉCHEC: ' + m); console.log('ok -', m); };
const DEVS = [['iPhone portrait', devices['iPhone 13']], ['iPad portrait', devices['iPad (gen 7)']], ['iPad paysage', devices['iPad (gen 7) landscape']]];

(async () => {
  const b = await chromium.launch();
  const errors = [];
  for (const [dname, dev] of DEVS) {
    const ctx = await b.newContext({ ...dev, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(URL);
    await p.getByRole('heading', { name: 'Sparring Échecs' }).waitFor();
    // Une partie analysée (avec une gaffe) : revue, carte de révision, commentaire.
    const id = await p.evaluate(() => window.__db.games.add({
      source: 'app', date: Date.now(), myColor: 'w', startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      uci: ['e2e4', 'd7d5', 'd1g4', 'c8g4'], san: ['e4', 'd5', 'Qg4', 'Bxg4'], result: '0-1', score: 0, termination: 'Abandon',
      ratingBefore: 900, ratingAfter: 870, botElo: 950,
    }));
    await p.goto(URL + '#/review/' + id);
    await p.locator('table.classes').waitFor({ timeout: 180000 });
    await p.evaluate(() => window.__db.cards.filter((c) => c.kind !== 'drill').modify({ due: '2000-01-01' }));
    // Maîtrise : niveaux 1a à 1d validés (le 1e, au clavier, est alors ouvert).
    await p.evaluate(async () => {
      const m = await window.__db.meta.get('boardProgress');
      const prog = m?.value ?? { levels: {}, chapters: {} };
      for (const id of ['1a', '1b', '1c', '1d']) prog.levels[id] = { passes: 3, attempts: 3, validated: true, best: 'test' };
      await window.__db.meta.put({ key: 'boardProgress', value: prog });
    });

    const pages = [
      ['leçon', '#/lesson/english', '.board-wrap'],
      ['leçon (bloc f7)', '#/lesson/g6-system/f7', '.board-wrap'],
      ['partie', '#/play', '.board-wrap'],
      ['revue', '#/review/' + id, '.board-wrap'],
      ['révision (erreur)', '#/revise', '.board-wrap'],
      ['drill', '#/revise/english', '.board-wrap'],
      ['commentaire', '#/comment', '.board-wrap'],
      ['Mats (exercice)', '#/mates/kq/play', '.board-wrap'],
      ['Mats (leçon)', '#/mates/kq/lesson', '.board-wrap'],
      ['Maîtrise (cases)', '#/board/ex/1a/practice', '.tapboard'],
      ['Maîtrise (clavier)', '#/board/ex/1e/practice', '.tapboard'],
      ['répertoire', '#/repertoire/english', '.board-wrap'],
    ];
    for (const [name, hash, sel] of pages) {
      await p.goto(URL + '#/stats'); await p.goto(URL + hash);
      await p.locator(sel).first().waitFor({ timeout: 60000 });
      await p.waitForTimeout(700);
      const r = await p.evaluate((sel) => {
        const se = document.scrollingElement;
        const board = document.querySelector(sel).getBoundingClientRect();
        const sqs = [...document.querySelector(sel).querySelectorAll('[data-square]')].map((e) => ({ e, r: e.getBoundingClientRect() }));
        const top = Math.min(...sqs.map((x) => x.r.top));
        const row = sqs.filter((x) => Math.abs(x.r.top - top) < 2);
        const covered = row.filter((x) => {
          const hit = document.elementFromPoint(x.r.left + x.r.width / 2, x.r.top + Math.min(6, x.r.height / 4));
          return !hit || !hit.closest(sel);
        }).length;
        const side = document.querySelector('.side-col, .board-ex > .prompt');
        const sr = side?.getBoundingClientRect();
        return {
          over: se.scrollHeight - innerHeight, h: innerHeight, w: innerWidth,
          top: board.top, bottom: board.bottom, left: board.left, right: board.right, size: Math.round(board.width),
          rowN: row.length, covered, sideTop: sr ? Math.round(sr.top) : null, sideH: sr ? Math.round(sr.height) : null,
        };
      }, sel);
      assert(r.over <= 1 && r.top >= 0 && r.bottom <= r.h + 0.5 && r.left >= -0.5 && r.right <= r.w + 0.5 && r.rowN === 8 && r.covered === 0
        && (r.sideTop === null || r.sideTop < r.h - 40),
        `${dname} · ${name} : tient dans l’écran (dépassement ${r.over} px), échiquier ${r.size} px entier (haut ${Math.round(r.top)}, bas ${Math.round(r.bottom)}/${r.h}), rangée du haut visible (${r.rowN - r.covered}/8)${r.sideTop !== null ? `, texte visible dès ${r.sideTop} px` : ''}`);
      if (name === 'leçon' || name === 'partie' || name === 'revue') await p.screenshot({ path: `${OUT}/layout-${dname.replace(/ /g, '-')}-${name}.png` });
    }
    await ctx.close();
  }
  assert(errors.length === 0, 'aucune erreur JS ' + errors.join(' | '));
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
