// Génère (une fois) les tables de distance exacte au mat pour le navigateur : public/dtm/<niveau>.dtm
// (gzip d'un Int8Array réduit par symétrie, roi blanc dans le triangle a1-d1-d4).
import { mkdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { solve, type Table } from './dtm';
import { TRIANGLE } from '../src/lib/dtmLookup';

function reduce(t: Table): Buffer {
  const n = t.types.length;
  const block = 1 << (6 + 6 * n);
  const out = Buffer.alloc(10 * block);
  for (let k = 0; k < 10; k++) for (let rest = 0; rest < block; rest++) out[k * block + rest] = t.wRes[TRIANGLE[k] | (rest << 6)] & 0xff;
  return out;
}
mkdirSync('public/dtm', { recursive: true });
const kr = solve(['R']);
const tables: Record<string, Table> = { kq: solve(['Q']), kr, krr: solve(['R', 'R'], kr), kbb: solve(['B', 'B']) };
for (const [id, t] of Object.entries(tables)) {
  const gz = gzipSync(reduce(t), { level: 9 });
  writeFileSync(`public/dtm/${id}.dtm`, gz);
  console.log(`public/dtm/${id}.dtm : ${(gz.length / 1024).toFixed(0)} Ko`);
}
