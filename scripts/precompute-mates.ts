// Précalcul (une fois) des positions de mats élémentaires avec Stockfish NATIF :
// pour chaque position générée, « mat en N » obtenu en 5 s de recherche. Résultat commité en JSON.
// Usage : node scripts/.precompute.mjs <niveau> <nombre> <graine> <fichier-sortie> [moteur]
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { generatePosition, isValidExercise, MATE_LEVELS, mulberry32, type MateLevelId } from '../src/lib/mates';

const [levelId, countArg, seedArg, out, enginePath = '/usr/games/stockfish'] = process.argv.slice(2);
const level = MATE_LEVELS.find((l) => l.id === (levelId as MateLevelId));
if (!level || !out) { console.error('usage : <niveau> <nombre> <graine> <sortie> [moteur]'); process.exit(2); }
const COUNT = Number(countArg ?? 150);
const MOVETIME = Number(process.env.MOVETIME ?? 5000);

const sf = spawn(enginePath, [], { stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '';
let onLine: (l: string) => void = () => {};
sf.stdout.on('data', (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); onLine(l); }
});
const send = (c: string) => sf.stdin.write(c + '\n');
const waitFor = (pred: (l: string) => boolean) => new Promise<string>((res) => { onLine = (l) => { if (pred(l)) res(l); }; });

async function mateIn(fen: string): Promise<{ mate: number | null; depth: number }> {
  let mate: number | null = null;
  let depth = 0;
  const done = new Promise<void>((res) => {
    onLine = (l) => {
      if (l.startsWith('info') && !/bound/.test(l)) {
        const m = l.match(/ score (cp|mate) (-?\d+)/);
        const d = l.match(/ depth (\d+)/);
        if (m) { mate = m[1] === 'mate' ? Number(m[2]) : null; depth = Number(d?.[1] ?? 0); }
      }
      if (l.startsWith('bestmove')) res();
    };
  });
  send('ucinewgame');
  send('position fen ' + fen);
  send('go movetime ' + MOVETIME);
  await done;
  return { mate, depth };
}

async function main() {
  send('uci'); await waitFor((l) => l === 'uciok');
  send('setoption name Threads value 1'); send('setoption name Hash value 128');
  send('isready'); await waitFor((l) => l === 'readyok');
  const rand = mulberry32(Number(seedArg ?? 1));
  const seen = new Set<string>();
  const positions: { fen: string; mate: number; depth: number }[] = [];
  const t0 = Date.now();
  while (positions.length < COUNT) {
    const fen = generatePosition(level!, rand);
    if (seen.has(fen) || !isValidExercise(fen, level!)) continue;
    seen.add(fen);
    const r = await mateIn(fen);
    if (r.mate === null || r.mate <= 2) continue;  // pas de mat trouvé, ou trop facile
    positions.push({ fen, mate: r.mate, depth: r.depth });
    if (positions.length % 10 === 0) console.log(`${level!.id} : ${positions.length}/${COUNT} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  writeFileSync(out, JSON.stringify(positions));
  send('quit');
  console.log(`${level!.id} : terminé, ${positions.length} positions en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  process.exit(0);
}
main();
