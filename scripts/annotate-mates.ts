// Ajoute la distance exacte au mat (analyse rétrograde, scripts/dtm.ts) aux positions précalculées par Stockfish.
// Usage : node scripts/.annotate.mjs <dossier des pre-<niveau>.json>   → src/data/matePositions.json
import { readFileSync, writeFileSync } from 'node:fs';
import { dtmOf, solve, type Table } from './dtm';

const dir = process.argv[2];
const kr = solve(['R']);
const tables: Record<string, Table> = { kq: solve(['Q']), kr, krr: solve(['R', 'R'], kr), kbb: solve(['B', 'B']) };
const levels: Record<string, { fen: string; mate: number; sf: number }[]> = {};
for (const id of ['kq', 'krr', 'kr', 'kbb']) {
  const list = JSON.parse(readFileSync(`${dir}/pre-${id}.json`, 'utf8')) as { fen: string; mate: number }[];
  let over = 0, eq = 0, tooEasy = 0;
  levels[id] = [];
  for (const p of list) {
    const exact = dtmOf(tables[id], p.fen);
    if (exact < 0 || exact > p.mate) throw new Error(`incohérence ${id} ${p.fen} : exact ${exact}, Stockfish ${p.mate}`);
    if (exact === p.mate) eq++; else over++;
    if (exact <= 2) { tooEasy++; continue; }
    levels[id].push({ fen: p.fen, mate: exact, sf: p.mate });
  }
  const m = levels[id].map((p) => p.mate);
  console.log(`${id} : ${levels[id].length} gardées (${tooEasy} trop faciles), Stockfish exact ${eq}, surestimé ${over} ; mat exact ${Math.min(...m)}–${Math.max(...m)}`);
}
writeFileSync('src/data/matePositions.json', JSON.stringify({
  engine: 'Stockfish 16 (natif, 1 thread, hash 128 Mo)',
  movetimeMs: 5000,
  exact: 'analyse rétrograde (scripts/dtm.ts)',
  generatedAt: new Date().toISOString().slice(0, 10),
  note: '« mate » = distance exacte au mat (utilisée par l’appli) ; « sf » = mat en N trouvé par Stockfish en 5 s. L’appli applique au hasard une des 8 symétries.',
  levels,
}).replace(/\},\{/g, '},\n{').replace(/\],"/g, '],\n"'));
