import { pickMove } from '../lib/maiaPick';

export interface MaiaPrediction {
  moves: [string, number][];
  /** Probabilité de gain du camp au trait (selon Maia). */
  winProbability: number;
  ms: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkerReply = any;
type Pending = { resolve: (v: WorkerReply) => void; reject: (e: Error) => void };

/** Ce dont le client a besoin d'un worker (remplaçable dans les tests). */
export interface MaiaWorker {
  postMessage(msg: unknown): void;
  terminate(): void;
  onmessage: ((ev: { data: WorkerReply }) => void) | null;
  onerror: ((ev: unknown) => void) | null;
}

export class MaiaError extends Error {}

/** Délai maximal d'une prédiction (le chargement du modèle a son propre délai, plus long). */
export const PREDICT_TIMEOUT_MS = 30_000;
export const LOAD_TIMEOUT_MS = 180_000;

/**
 * Client du worker Maia. En cas d'erreur (réponse en erreur, plantage, délai dépassé), le worker est relancé une fois
 * automatiquement et l'appel est rejoué ; au second échec, message clair.
 */
export class MaiaClient {
  private worker: MaiaWorker | null = null;
  private seq = 0;
  private pending = new Map<number, Pending>();
  private progressCb: ((loaded: number, total: number) => void) | null = null;
  private loaded: Promise<void> | null = null;
  private readonly create: () => MaiaWorker;
  constructor(create: () => MaiaWorker) { this.create = create; }

  private get w(): MaiaWorker {
    if (!this.worker) {
      const w = this.create();
      w.onmessage = (ev) => {
        const d = ev.data;
        if (d.type === 'progress') { this.progressCb?.(d.loaded, d.total); return; }
        const p = this.pending.get(d.id);
        if (!p) return;
        this.pending.delete(d.id);
        if (d.ok) p.resolve(d); else p.reject(new MaiaError(d.error));
      };
      w.onerror = () => this.restart(new MaiaError('le moteur Maia s’est arrêté'));
      this.worker = w;
    }
    return this.worker;
  }

  /** Arrête le worker : les appels en attente échouent, le prochain appel recrée un worker (et recharge le modèle). */
  private restart(err: Error) {
    try { this.worker?.terminate(); } catch { /* déjà arrêté */ }
    this.worker = null;
    this.loaded = null;
    const pend = [...this.pending.values()];
    this.pending.clear();
    for (const p of pend) p.reject(err);
  }

  private callOnce(msg: object, timeoutMs: number): Promise<WorkerReply> {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); this.restart(new MaiaError('Maia ne répond pas')); reject(new MaiaError('Maia ne répond pas')); }, timeoutMs);
      this.pending.set(id, { resolve: (v) => { clearTimeout(timer); resolve(v); }, reject: (e) => { clearTimeout(timer); reject(e); } });
      this.w.postMessage({ ...msg, id });
    });
  }

  /** Un appel, avec une relance automatique du worker en cas d'échec. */
  private async call(msg: { type: string }, timeoutMs: number): Promise<WorkerReply> {
    try {
      if (msg.type !== 'load') await this.load();
      return await this.callOnce(msg, timeoutMs);
    } catch (first) {
      this.restart(first as Error);
      try {
        if (msg.type !== 'load') await this.load();
        return await this.callOnce(msg, timeoutMs);
      } catch (second) {
        throw new MaiaError(`Maia n’a pas pu répondre, même après une relance automatique (${(second as Error).message}). Recharge la page pour réessayer.`);
      }
    }
  }

  onProgress(cb: ((loaded: number, total: number) => void) | null) { this.progressCb = cb; }

  load(): Promise<void> {
    if (!this.loaded) {
      this.loaded = this.callOnce({ type: 'load' }, LOAD_TIMEOUT_MS).then(() => undefined);
      this.loaded.catch(() => { this.loaded = null; });
    }
    return this.loaded;
  }

  async predict(fen: string, priorMoves: string[], selfElo: number, oppoElo: number): Promise<MaiaPrediction> {
    const r = await this.call({ type: 'predict', fen, priorMoves, selfElo, oppoElo } as { type: string }, PREDICT_TIMEOUT_MS);
    return { moves: r.moves, winProbability: r.winProbability, ms: r.ms };
  }

  /** Coup joué par Maia : tirage pondéré, coups < 3 % ignorés. */
  async chooseMove(fen: string, priorMoves: string[], selfElo: number, oppoElo: number) {
    const p = await this.predict(fen, priorMoves, selfElo, oppoElo);
    return { uci: pickMove(p.moves), prediction: p };
  }
}

export const maia = new MaiaClient(
  () => new Worker(new URL('./maia.worker.ts', import.meta.url), { type: 'module' }) as unknown as MaiaWorker,
);
