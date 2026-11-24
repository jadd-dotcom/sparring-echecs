// Vérifie le répertoire pré-chargé avec Stockfish 19 lite (Node) :
// pour chacun de MES coups, perte = éval(meilleur coup) − éval(mon coup), même position,
// même profondeur (UCI « searchmoves »). Seuil : 50 centipions (0,5 pion).
// Sorties : docs/REPERTOIRE.md et src/data/repertoire-checks.json
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Chess } from 'chess.js';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { fenKey, formatLine, lines, myMoves, parsePgn, turnOf } from '../src/lib/repertoire';

const require = createRequire(import.meta.url);
const DEPTH = Number(process.env.DEPTH ?? 20);
const MAX_LOSS = 50;

type Score = { cp?: number; mate?: number };
const toCp = (s: Score) => (s.mate !== undefined ? (s.mate > 0 ? 10000 - s.mate * 10 : -10000 - s.mate * 10) : s.cp!);

let onLine: (l: string) => void = () => {};
const sf = require('stockfish')('lite-single', (l: string) => onLine(l));
const send = (c: string) => sf.processCommand(c);

function search(fen: string, searchmoves?: string): Promise<{ score: Score; best: string }> {
  return new Promise((resolve) => {
    let score: Score = { cp: 0 };
    onLine = (l) => {
      if (l.startsWith('info') && / depth \d+/.test(l) && !/bound/.test(l)) {
        const m = l.match(/ score (cp|mate) (-?\d+)/);
        if (m) score = m[1] === 'cp' ? { cp: +m[2] } : { mate: +m[2] };
      }
      if (l.startsWith('bestmove')) resolve({ score, best: l.split(' ')[1] });
    };
    send('position fen ' + fen);
    send(`go depth ${DEPTH}${searchmoves ? ' searchmoves ' + searchmoves : ''}`);
  });
}

const san = (fen: string, uci: string) => new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san;

async function main() {
  send('uci'); send('setoption name Hash value 64'); send('isready');
  type Checks = Record<string, Record<string, { loss: number; best: string; bestSan: string; depth: number }>>;
  // Les ouvertures archivées gardent leur vérification précédente (ARCHIVES=1 pour les recalculer).
  const previous: Checks = JSON.parse(readFileSync('src/data/repertoire-checks.json', 'utf8'));
  const previousMd = readFileSync('docs/REPERTOIRE.md', 'utf8');
  const checks: Checks = {};
  const archivedMd: string[] = [];
  let md = `# Répertoire pré-chargé et vérification Stockfish\n\nStockfish 19 lite (single-thread), profondeur ${DEPTH}, en Node.\n` +
    `Perte d'un de mes coups = éval du meilleur coup − éval de mon coup (même position, \`searchmoves\`). Seuil : ${MAX_LOSS} cp (0,5 pion).\n\n`;
  let allOk = true;
  for (const o of BUILTIN_OPENINGS) {
    const only = process.env.ONLY?.split(',');
    if (only && !only.includes(o.id) && previous[o.id]) {
      // Ouverture non recalculée : on garde sa vérification et sa section du document.
      checks[o.id] = previous[o.id];
      if (!o.archived) {
        const head = `## ${o.name} (`;
        const i = previousMd.indexOf(head);
        if (i >= 0) { const j = previousMd.indexOf('\n## ', i + 1); md += previousMd.slice(i, j < 0 ? undefined : j + 1).replace(/\*\*(Toutes|Certaines) les lignes[^\n]*\n/, ''); }
      }
      continue;
    }
    if (o.archived && !process.env.ARCHIVES && previous[o.id]) {
      checks[o.id] = previous[o.id];
      const worst = Math.max(0, ...Object.values(previous[o.id]).map((v) => v.loss));
      archivedMd.push(`- ${o.name} (${o.color === 'w' ? 'Blancs' : 'Noirs'}) : ${Object.keys(previous[o.id]).length} coups vérifiés en V2, perte max ${worst} cp.`);
      continue;
    }
    const { root } = parsePgn(o.pgn);
    const res: (typeof checks)[string] = {};
    const t0 = Date.now();
    send('ucinewgame');
    for (const m of myMoves(root, o.color)) {
      const best = await search(m.fen);
      let loss = 0;
      if (best.best !== m.uci) {
        const mine = await search(m.fen, m.uci);
        loss = Math.max(0, toCp(best.score) - toCp(mine.score));
      }
      res[fenKey(m.fen) + ' ' + m.uci] = { loss, best: best.best, bestSan: san(m.fen, best.best), depth: DEPTH };
    }
    checks[o.id] = res;
    const ls = lines(root);
    md += `## ${o.name} (${o.color === 'w' ? 'Blancs' : 'Noirs'})\n\n`;
    md += `Coups adverses imposés : ${o.forced.length ? o.forced.join(', ') : 'aucun'} · ${ls.length} lignes · ${Object.keys(res).length} coups vérifiés · ${((Date.now() - t0) / 1000).toFixed(0)} s\n\n`;
    md += '```pgn\n' + o.pgn.trim() + '\n```\n\n';
    md += '| # | Ligne | Perte max (cp) | Résultat |\n|---|---|---|---|\n';
    ls.forEach((l, i) => {
      const c = new Chess();
      const detail: string[] = [];
      let max = 0;
      for (let k = 0; k < l.length; k++) {
        const fen = c.fen();
        const mv = c.move(l[k]);
        if (turnOf(fen) !== o.color) continue;
        const r = res[fenKey(fen) + ' ' + mv.from + mv.to + (mv.promotion ?? '')];
        max = Math.max(max, r.loss);
        if (r.loss > MAX_LOSS) detail.push(`${mv.san} −${r.loss} (SF : ${r.bestSan})`);
      }
      if (max > MAX_LOSS) allOk = false;
      md += `| ${i + 1} | ${formatLine(l)} | ${max} | ${max > MAX_LOSS ? '❌ ' + detail.join(' ; ') : '✅'} |\n`;
    });
    const worst = Object.entries(res).sort((a, b) => b[1].loss - a[1].loss).slice(0, 3);
    md += `\nCoups les plus coûteux : ${worst.map(([k, v]) => `${san(k.split(' ').slice(0, 4).join(' ') + ' 0 1', k.split(' ')[4])} (${v.loss} cp, SF préfère ${v.bestSan})`).join(', ')}\n\n`;
    console.log(o.name, 'ok', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  md += allOk ? '**Toutes les lignes passent le seuil.**\n' : '**Certaines lignes dépassent le seuil (voir ❌).**\n';
  if (archivedMd.length) md += `\n## Archives (ancien répertoire)\n\nConsultables dans l’onglet « Archives » de l’écran Ouvertures ; vérification conservée :\n\n${archivedMd.join('\n')}\n`;
  writeFileSync('docs/REPERTOIRE.md', md);
  writeFileSync('src/data/repertoire-checks.json', JSON.stringify(checks, null, 1) + '\n');
  console.log(allOk ? 'TOUT OK' : 'ÉCHECS DÉTECTÉS');
  sf.terminate?.();
  process.exit(0);
}
main();
