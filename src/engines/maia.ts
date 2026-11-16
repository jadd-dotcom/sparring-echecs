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

class MaiaClient {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, Pending>();
  private progressCb: ((loaded: number, total: number) => void) | null = null;
  private loaded: Promise<void> | null = null;

  private get w(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./maia.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (ev) => {
        const d = ev.data;
        if (d.type === 'progress') { this.progressCb?.(d.loaded, d.total); return; }
        const p = this.pending.get(d.id);
        if (!p) return;
        this.pending.delete(d.id);
        if (d.ok) p.resolve(d); else p.reject(new Error(d.error));
      };
    }
    return this.worker;
  }

  private call(msg: object): Promise<WorkerReply> {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.w.postMessage({ ...msg, id });
    });
  }

  onProgress(cb: ((loaded: number, total: number) => void) | null) { this.progressCb = cb; }

  load(): Promise<void> {
    if (!this.loaded) this.loaded = this.call({ type: 'load' }).then(() => undefined).catch((e) => { this.loaded = null; throw e; });
    return this.loaded;
  }

  async predict(fen: string, priorMoves: string[], selfElo: number, oppoElo: number): Promise<MaiaPrediction> {
    const r = await this.call({ type: 'predict', fen, priorMoves, selfElo, oppoElo });
    return { moves: r.moves, winProbability: r.winProbability, ms: r.ms };
  }

  /** Coup joué par Maia : tirage pondéré, coups < 3 % ignorés. */
  async chooseMove(fen: string, priorMoves: string[], selfElo: number, oppoElo: number) {
    const p = await this.predict(fen, priorMoves, selfElo, oppoElo);
    return { uci: pickMove(p.moves), prediction: p };
  }
}

export const maia = new MaiaClient();
