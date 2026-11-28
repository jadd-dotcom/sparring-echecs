// Menaces « s'il rejouait » après chaque coup du répertoire actif (les deux camps), pour les « pourquoi » calculés
// des leçons (scripts/lesson-lines.ts) : la réponse dit d'abord ce qu'elle fait contre la menace du coup d'avant.
// Cache : scripts/why-threats.json (clé : position après le coup, fenKey → menace ou null). Les positions déjà
// calculées ne sont pas refaites. Usage : npm run why-threats
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { fenKey, parsePgn, type RepNode } from '../src/lib/repertoire';
import type { SignpostThreat } from '../src/lib/signposts';
import { stopEngine, threatOf } from './threatEngine';

const FILE = 'scripts/why-threats.json';
const DEPTH = Number(process.env.DEPTH ?? 14);

(async () => {
  const cache: Record<string, SignpostThreat | null> = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
  const todo: string[] = [];
  const fens = new Map<string, string>();
  const walk = (n: RepNode) => { for (const k of n.children) { const key = fenKey(k.fen); if (!(key in cache) && !fens.has(key)) { fens.set(key, k.fen); todo.push(key); } walk(k); } };
  for (const o of BUILTIN_OPENINGS.filter((x) => !x.archived)) walk(parsePgn(o.pgn).root);
  console.log(`${todo.length} positions à calculer (${Object.keys(cache).length} déjà en cache)`);
  let i = 0;
  for (const key of todo) {
    cache[key] = await threatOf(fens.get(key)!, DEPTH);
    if (++i % 50 === 0) { writeFileSync(FILE, JSON.stringify(cache, null, 0)); console.log(`${i}/${todo.length}`); }
  }
  const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(FILE, JSON.stringify(sorted, null, 1) + '\n');
  console.log(`${FILE} : ${Object.keys(sorted).length} positions, ${Object.values(sorted).filter(Boolean).length} menaces`);
  stopEngine();
  process.exit(0);
})();
