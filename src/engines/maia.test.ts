// Client Maia avec un faux worker : relance automatique une fois, puis message clair.
import { describe, expect, it, vi } from 'vitest';
import { MaiaClient, type MaiaWorker } from './maia';

/** Chaque worker créé suit le scénario suivant de la liste : 'ok', 'error' (réponse en erreur) ou 'crash' (onerror). */
function fake(plan: ('ok' | 'error' | 'crash')[]) {
  const workers: MaiaWorker[] = [];
  const create = (): MaiaWorker => {
    const mode = plan[workers.length] ?? 'ok';
    const w: MaiaWorker = {
      onmessage: null, onerror: null, terminate: vi.fn(),
      postMessage(msg: unknown) {
        const m = msg as { id: number; type: string };
        queueMicrotask(() => {
          if (m.type === 'load') { w.onmessage?.({ data: { id: m.id, ok: true } }); return; }
          if (mode === 'crash') w.onerror?.(new Error('boom'));
          else if (mode === 'error') w.onmessage?.({ data: { id: m.id, ok: false, error: 'onnx' } });
          else w.onmessage?.({ data: { id: m.id, ok: true, moves: [['e2e4', 1]], winProbability: 0.5, ms: 3 } });
        });
      },
    };
    workers.push(w);
    return w;
  };
  return { workers, client: new MaiaClient(create) };
}

describe('client Maia', () => {
  it('cas normal : un seul worker', async () => {
    const f = fake(['ok']);
    expect((await f.client.chooseMove('fen', [], 950, 900)).uci).toBe('e2e4');
    expect(f.workers).toHaveLength(1);
  });
  it('erreur du worker : relancé une fois automatiquement, puis la réponse arrive', async () => {
    const f = fake(['error', 'ok']);
    expect((await f.client.predict('fen', [], 950, 900)).moves[0][0]).toBe('e2e4');
    expect(f.workers).toHaveLength(2);
    expect(f.workers[0].terminate).toHaveBeenCalled();
  });
  it('plantage puis nouvel échec : message clair après une seule relance', async () => {
    const f = fake(['crash', 'error', 'ok']);
    await expect(f.client.predict('fen', [], 950, 900)).rejects.toThrow(/même après une relance automatique.*Recharge la page/);
    expect(f.workers).toHaveLength(2);
  });
});
