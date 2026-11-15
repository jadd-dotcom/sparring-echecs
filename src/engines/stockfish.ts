// Client UCI minimal pour Stockfish.js 19 « lite single-threaded ».
import type { Eval } from '../lib/winpct';

export interface SearchResult {
  /** Éval du point de vue du camp au trait. */
  eval: Eval;
  bestMove: string | null;
  depth: number;
}

class StockfishClient {
  private worker: Worker | null = null;
  private listeners = new Set<(line: string) => void>();
  private queue: Promise<unknown> = Promise.resolve();
  private ready: Promise<void> | null = null;

  private get w(): Worker {
    if (!this.worker) {
      this.worker = new Worker(import.meta.env.BASE_URL + 'vendor/stockfish-19-lite-single.js');
      this.worker.onmessage = (ev) => {
        const line = typeof ev.data === 'string' ? ev.data : String(ev.data);
        for (const l of [...this.listeners]) l(line);
      };
    }
    return this.worker;
  }

  private send(cmd: string) { this.w.postMessage(cmd); }

  private waitFor(pred: (line: string) => boolean, onLine?: (l: string) => void): Promise<string> {
    return new Promise((resolve) => {
      const fn = (l: string) => {
        onLine?.(l);
        if (pred(l)) { this.listeners.delete(fn); resolve(l); }
      };
      this.listeners.add(fn);
    });
  }

  init(): Promise<void> {
    if (!this.ready) {
      this.ready = (async () => {
        const ok = this.waitFor((l) => l === 'uciok');
        this.send('uci');
        await ok;
        this.send('setoption name Hash value 32');
        const rd = this.waitFor((l) => l === 'readyok');
        this.send('isready');
        await rd;
      })();
    }
    return this.ready;
  }

  /** Analyse une position (FEN) pendant `ms` millisecondes. Appels sérialisés. */
  analyse(fen: string, ms = 500): Promise<SearchResult> {
    const run = async (): Promise<SearchResult> => {
      await this.init();
      let ev: Eval = { cp: 0 };
      let depth = 0;
      const done = this.waitFor(
        (l) => l.startsWith('bestmove'),
        (l) => {
          if (!l.startsWith('info') || l.includes(' lowerbound') || l.includes(' upperbound')) return;
          if (/ multipv (?!1 )/.test(l)) return;
          const m = l.match(/ score (cp|mate) (-?\d+)/);
          const d = l.match(/ depth (\d+)/);
          if (m) {
            ev = m[1] === 'cp' ? { cp: Number(m[2]) } : { mate: Number(m[2]) };
            if (d) depth = Number(d[1]);
          }
        },
      );
      this.send('position fen ' + fen);
      this.send('go movetime ' + ms);
      const line = await done;
      const bm = line.split(' ')[1];
      return { eval: ev, bestMove: bm && bm !== '(none)' ? bm : null, depth };
    };
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => undefined);
    return p;
  }

  newGame() { this.queue = this.queue.then(() => { this.send('ucinewgame'); }); }
}

export const stockfish = new StockfishClient();
