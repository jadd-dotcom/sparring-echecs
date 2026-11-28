// Client Stockfish avec un faux worker UCI : réponse normale, annulation (stop), délai maximal, plantage du worker.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STOP_GRACE_MS, StockfishClient, type EngineWorker } from './stockfish';

/** Faux moteur : répond à uci / isready ; « go » répond après `goDelay` ms (ou jamais si null) ; « stop » répond tout de suite. */
function fake(opts: { goDelay: number | null; answerStop?: boolean }) {
  const sent: string[] = [];
  const workers: EngineWorker[] = [];
  const create = (): EngineWorker => {
    const w: EngineWorker = {
      onmessage: null, onerror: null, terminate: vi.fn(),
      postMessage(msg: string) {
        sent.push(msg);
        const reply = (l: string) => queueMicrotask(() => w.onmessage?.({ data: l }));
        if (msg === 'uci') reply('uciok');
        else if (msg === 'isready') reply('readyok');
        else if (msg.startsWith('go')) {
          reply('info depth 5 score cp 30 pv e2e4 e7e5');
          if (opts.goDelay !== null) setTimeout(() => w.onmessage?.({ data: 'bestmove e2e4' }), opts.goDelay);
        } else if (msg === 'stop' && opts.answerStop !== false) reply('bestmove d2d4');
      },
    };
    workers.push(w);
    return w;
  };
  return { sent, workers, client: new StockfishClient(create) };
}

afterEach(() => { vi.useRealTimers(); });

describe('client Stockfish', () => {
  it('recherche normale : bestmove, éval et variante', async () => {
    const f = fake({ goDelay: 5 });
    const r = await f.client.analyse('fen', 100);
    expect(r).toEqual({ eval: { cp: 30 }, bestMove: 'e2e4', depth: 5, pv: ['e2e4', 'e7e5'] });
    expect(f.sent).toContain('go movetime 100');
  });
  it('annulation : stop envoyé, le meilleur coup trouvé jusque-là est renvoyé', async () => {
    const f = fake({ goDelay: null });
    const ac = new AbortController();
    const p = f.client.analyse('fen', 60_000, undefined, ac.signal);
    await new Promise((r) => setTimeout(r, 5));
    ac.abort();
    expect((await p).bestMove).toBe('d2d4');
    expect(f.sent).toContain('stop');
  });
  it('délai maximal : stop au-delà du temps demandé + marge', async () => {
    vi.useFakeTimers();
    const f = fake({ goDelay: null });
    const p = f.client.go('fen', 'infinite', { timeoutMs: 1000 });
    await vi.advanceTimersByTimeAsync(1001);
    expect((await p).bestMove).toBe('d2d4');
  });
  it('moteur bloqué (pas de réponse à stop) : erreur claire, worker remplacé au prochain appel', async () => {
    vi.useFakeTimers();
    const f = fake({ goDelay: null, answerStop: false });
    const p = f.client.go('fen', 'infinite', { timeoutMs: 1000 });
    const caught = p.catch((e) => e);
    await vi.advanceTimersByTimeAsync(1000 + STOP_GRACE_MS + 1);
    expect(String(await caught)).toMatch(/ne répond plus/);
    expect(f.workers[0].terminate).toHaveBeenCalled();
    f.client.analyse('fen', 10).catch(() => {});
    await vi.advanceTimersByTimeAsync(1);
    expect(f.workers).toHaveLength(2);
  });
  it('plantage du worker (onerror) : la recherche échoue, la suivante repart avec un nouveau worker', async () => {
    const f = fake({ goDelay: null });
    const p = f.client.analyse('fen', 60_000);
    await new Promise((r) => setTimeout(r, 5));
    f.workers[0].onerror?.(new Error('boom'));
    await expect(p).rejects.toThrow(/s’est arrêté/);
    const f2 = f.client.analyse('fen', 10);
    await new Promise((r) => setTimeout(r, 5));
    f.workers[1].onmessage?.({ data: 'bestmove g1f3' });
    expect((await f2).bestMove).toBe('g1f3');
  });
});
