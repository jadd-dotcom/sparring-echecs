// Moteur Stockfish 19 lite en Node, pour les tests (même interface que dans le navigateur).
import { createRequire } from 'node:module';
import type { Engine, EngineResult } from '../src/lib/report/motifs';

export function createNodeEngine(): Engine & { quit(): void } {
  const require = createRequire(import.meta.url);
  let onLine: (l: string) => void = () => {};
  const sf = require('stockfish')('lite-single', (l: string) => onLine(l));
  sf.processCommand('uci');
  sf.processCommand('setoption name Hash value 32');
  let queue: Promise<unknown> = Promise.resolve();
  const search = (fen: string, depth: number) => {
    const run = () => new Promise<EngineResult>((resolve) => {
      let res: EngineResult = { score: { cp: 0 }, pv: [] };
      onLine = (l) => {
        if (l.startsWith('info') && / pv /.test(l) && !/bound/.test(l) && !/ multipv [2-9]/.test(l)) {
          const m = l.match(/ score (cp|mate) (-?\d+)/);
          if (m) res = { score: m[1] === 'cp' ? { cp: +m[2] } : { mate: +m[2] }, pv: l.split(' pv ')[1].trim().split(' ') };
        }
        if (l.startsWith('bestmove')) resolve(res);
      };
      sf.processCommand('ucinewgame');
      sf.processCommand('position fen ' + fen);
      sf.processCommand('go depth ' + depth);
    });
    const p = queue.then(run);
    queue = p.catch(() => undefined);
    return p;
  };
  return { search, quit: () => sf.terminate?.() };
}
