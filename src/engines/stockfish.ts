// Client UCI minimal pour Stockfish.js 19 « lite single-threaded » : recherches en file, annulables (commande stop),
// avec délai maximal et gestion d'erreur du worker (le worker en faute est remplacé au prochain appel).
import type { Eval } from '../lib/winpct';

export interface SearchResult {
  /** Éval du point de vue du camp au trait. */
  eval: Eval;
  bestMove: string | null;
  depth: number;
  /** Variante principale (UCI). */
  pv: string[];
}

/** Ce dont le client a besoin d'un worker (remplaçable dans les tests). */
export interface EngineWorker {
  postMessage(msg: string): void;
  terminate(): void;
  onmessage: ((ev: { data: unknown }) => void) | null;
  onerror: ((ev: unknown) => void) | null;
}

export class EngineError extends Error {}

/** Délai maximal d'une recherche : temps demandé + marge ; profondeur fixe : 30 s. */
export const SEARCH_MARGIN_MS = 10_000;
export const DEPTH_TIMEOUT_MS = 30_000;
/** Attente de « bestmove » après « stop » avant de remplacer le worker. */
export const STOP_GRACE_MS = 2_000;

export class StockfishClient {
  private worker: EngineWorker | null = null;
  private listeners = new Set<(line: string) => void>();
  private queue: Promise<unknown> = Promise.resolve();
  private ready: Promise<void> | null = null;
  private initFail: ((e: Error) => void) | null = null;
  /** Recherche en cours : pour l'annuler, ou la rejeter si le worker plante. */
  private current: { stop: () => void; fail: (e: Error) => void } | null = null;

  private readonly create: () => EngineWorker;
  constructor(create: () => EngineWorker) { this.create = create; }

  private get w(): EngineWorker {
    if (!this.worker) {
      const w = this.create();
      w.onmessage = (ev) => {
        const line = typeof ev.data === 'string' ? ev.data : String(ev.data);
        for (const l of [...this.listeners]) l(line);
      };
      w.onerror = () => this.reset(new EngineError('Stockfish s’est arrêté (erreur du moteur).'));
      this.worker = w;
    }
    return this.worker;
  }

  /** Remplace le worker (en faute ou bloqué) : la recherche en cours échoue, le prochain appel repart de zéro. */
  private reset(err: Error) {
    try { this.worker?.terminate(); } catch { /* déjà arrêté */ }
    this.worker = null;
    this.ready = null;
    this.listeners.clear();
    this.initFail?.(err);
    this.initFail = null;
    const cur = this.current;
    this.current = null;
    cur?.fail(err);
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
      this.ready = new Promise<void>((resolve, reject) => {
        this.initFail = reject;
        (async () => {
          const ok = this.waitFor((l) => l === 'uciok');
          this.send('uci');
          await ok;
          this.send('setoption name Hash value 32');
          const rd = this.waitFor((l) => l === 'readyok');
          this.send('isready');
          await rd;
        })().then(() => { this.initFail = null; resolve(); }, reject);
      });
      this.ready.catch(() => { /* rejet traité par l'appelant */ });
    }
    return this.ready;
  }

  /** Analyse une position (FEN) pendant `ms` millisecondes. Appels sérialisés.
   *  `searchmoves` restreint la recherche à ce coup (pour mesurer sa perte). */
  analyse(fen: string, ms = 500, searchmoves?: string, signal?: AbortSignal): Promise<SearchResult> {
    return this.go(fen, 'movetime ' + ms + (searchmoves ? ' searchmoves ' + searchmoves : ''), { timeoutMs: ms + SEARCH_MARGIN_MS, signal });
  }

  /** Recherche à profondeur fixe (reproductible), avec la variante principale. */
  searchDepth(fen: string, depth: number, signal?: AbortSignal): Promise<SearchResult> {
    return this.go(fen, 'depth ' + depth, { signal });
  }

  /**
   * Recherche avec des arguments UCI « go » libres (ex. « mate 30 »). `signal` : annulation (commande stop, le meilleur
   * coup trouvé jusque-là est renvoyé) ; `timeoutMs` : au-delà, stop, puis remplacement du worker s'il ne répond plus.
   */
  go(fen: string, goArgs: string, opts: { timeoutMs?: number; signal?: AbortSignal } = {}): Promise<SearchResult> {
    const run = async (): Promise<SearchResult> => {
      if (opts.signal?.aborted) throw new EngineError('Recherche annulée.');
      await this.init();
      let ev: Eval = { cp: 0 };
      let depth = 0;
      let pv: string[] = [];
      return await new Promise<SearchResult>((resolve, reject) => {
        let stopped = false;
        let grace: ReturnType<typeof setTimeout> | undefined;
        const stop = () => {
          if (stopped) return;
          stopped = true;
          try { this.send('stop'); } catch { /* worker déjà arrêté */ }
          grace = setTimeout(() => this.reset(new EngineError('Stockfish ne répond plus.')), STOP_GRACE_MS);
        };
        const timer = setTimeout(stop, opts.timeoutMs ?? DEPTH_TIMEOUT_MS);
        const onAbort = () => stop();
        opts.signal?.addEventListener('abort', onAbort);
        const cleanup = () => { clearTimeout(timer); if (grace) clearTimeout(grace); opts.signal?.removeEventListener('abort', onAbort); this.current = null; };
        this.current = { stop, fail: (e) => { cleanup(); reject(e); } };
        this.waitFor(
          (l) => l.startsWith('bestmove'),
          (l) => {
            if (!l.startsWith('info') || l.includes(' lowerbound') || l.includes(' upperbound')) return;
            if (/ multipv (?!1 )/.test(l)) return;
            const m = l.match(/ score (cp|mate) (-?\d+)/);
            const d = l.match(/ depth (\d+)/);
            if (m) {
              ev = m[1] === 'cp' ? { cp: Number(m[2]) } : { mate: Number(m[2]) };
              if (d) depth = Number(d[1]);
              const p = l.split(' pv ')[1];
              if (p) pv = p.trim().split(' ');
            }
          },
        ).then((line) => {
          cleanup();
          const bm = line.split(' ')[1];
          resolve({ eval: ev, bestMove: bm && bm !== '(none)' ? bm : null, depth, pv });
        });
        this.send('position fen ' + fen);
        this.send('go ' + goArgs);
      });
    };
    const p = this.queue.then(run, run);
    this.queue = p.catch(() => undefined);
    return p;
  }

  /** Annule la recherche en cours (elle se termine avec le meilleur coup trouvé jusque-là). */
  stop() { this.current?.stop(); }

  newGame() { this.queue = this.queue.then(() => { this.send('ucinewgame'); }); }
}

export const stockfish = new StockfishClient(
  () => new Worker(import.meta.env.BASE_URL + 'vendor/stockfish-19-lite-single.js') as unknown as EngineWorker,
);

/** Adaptateur pour le calcul des motifs (même interface qu'en Node). */
export const browserEngine = {
  search: async (fen: string, depth: number) => {
    const r = await stockfish.searchDepth(fen, depth);
    return { score: r.eval, pv: r.pv };
  },
};
