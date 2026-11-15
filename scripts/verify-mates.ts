// Vérification : sur 20 positions générées par niveau, Stockfish jouant MON camp mate dans la limite
// (minimum + 10 coups), contre Stockfish en défense maximale. Résultats → docs/MATS.md
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Chess } from 'chess.js';
import { exerciseOutcome, generatePosition, isValidExercise, MATE_LEVELS, mulberry32, EXTRA_MOVES_ALLOWED } from '../src/lib/mates';

const require = createRequire(import.meta.url);
const N = Number(process.env.N ?? 20);
const MY_MS = Number(process.env.MY_MS ?? 300);
const DEF_MS = Number(process.env.DEF_MS ?? 300);

let onLine: (l: string) => void = () => {};
const sf = require('stockfish')('lite-single', (l: string) => onLine(l));
sf.processCommand('uci'); sf.processCommand('setoption name Hash value 64');
function go(fen: string, args: string): Promise<{ best: string; mate: number | null }> {
  return new Promise((resolve) => {
    let mate: number | null = null;
    onLine = (l) => {
      const m = l.match(/ score (cp|mate) (-?\d+)/);
      if (m && !/bound/.test(l)) mate = m[1] === 'mate' ? Number(m[2]) : null;
      if (l.startsWith('bestmove')) resolve({ best: l.split(' ')[1], mate });
    };
    sf.processCommand('position fen ' + fen);
    sf.processCommand('go ' + args);
  });
}
/** Même calcul que l'appli : plus court mat trouvé par « go mate 30 » et « movetime 2500 ». */
async function mateDistance(fen: string) {
  sf.processCommand('ucinewgame');
  const a = await go(fen, 'mate 30');
  const b = await go(fen, 'movetime 2500');
  const f = [a.mate, b.mate].filter((x): x is number => x !== null && x > 0);
  return f.length ? Math.min(...f) : null;
}

async function main() {
  let md = `# Mats élémentaires — vérification Stockfish\n\nPour chaque niveau, ${N} positions générées (graine fixe), toutes légales. ` +
    `Stockfish 19 lite joue mon camp (${MY_MS} ms/coup) contre Stockfish en défense maximale (${DEF_MS} ms/coup). ` +
    `Réussite = mat en au plus « minimum + ${EXTRA_MOVES_ALLOWED} » coups (minimum = mat en N calculé au départ, comme dans l'appli).\n\n`;
  let allOk = true;
  for (const level of MATE_LEVELS.filter((l) => l.available)) {
    const rand = mulberry32(1000 + MATE_LEVELS.indexOf(level));
    const rows: string[] = [];
    let ok = 0;
    const t0 = Date.now();
    for (let i = 0; i < N; i++) {
      const fen = generatePosition(level, rand);
      const legal = isValidExercise(fen, level);
      const min = await mateDistance(fen);
      const c = new Chess(fen);
      let my = 0;
      let outcome = null as string | null;
      sf.processCommand('ucinewgame');
      while (!outcome && my < 100) {
        const m = await go(c.fen(), 'movetime ' + MY_MS);
        c.move({ from: m.best.slice(0, 2), to: m.best.slice(2, 4), promotion: m.best[4] });
        my++;
        outcome = exerciseOutcome(c, level.pieces.length);
        if (outcome) break;
        const d = await go(c.fen(), 'movetime ' + DEF_MS);
        c.move({ from: d.best.slice(0, 2), to: d.best.slice(2, 4) });
        outcome = exerciseOutcome(c, level.pieces.length);
      }
      const pass = legal && outcome === 'mate' && min !== null && my <= min + EXTRA_MOVES_ALLOWED;
      if (pass) ok++; else allOk = false;
      rows.push(`| ${i + 1} | \`${fen}\` | ${legal ? 'oui' : 'NON'} | ${min ?? '?'} | ${my} | ${outcome} | ${pass ? '✅' : '❌'} |`);
    }
    md += `## ${level.name}\n\n${ok}/${N} dans la limite · ${((Date.now() - t0) / 1000).toFixed(0)} s\n\n| # | Position | Légale | Mat en (min) | Coups joués | Issue | OK |\n|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n`;
    console.log(`${level.name} : ${ok}/${N}`);
  }
  md += allOk ? '**Toutes les positions sont matées dans la limite.**\n' : '**Certaines positions ne sont pas matées dans la limite (voir ❌).**\n';
  writeFileSync('docs/MATS.md', md);
  sf.terminate?.();
  process.exit(allOk ? 0 : 1);
}
main();
