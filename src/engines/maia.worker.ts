/// <reference lib="webworker" />
// Maia-3 (variante 5m) exécutée hors du fil principal.
import { Maia3 } from 'maia3-js/web';

const base = import.meta.env.BASE_URL + 'vendor/';
let maia: Maia3 | null = null;
let loading: Promise<void> | null = null;

async function ensure() {
  if (maia) return;
  if (!loading) {
    loading = (async () => {
      const url = new URL(base + 'maia3_5m.onnx', self.location.href).href;
      // 1) précache du service worker (hors ligne), 2) réseau sans cache HTTP
      // (un fichier de 22 Mo lu en parallèle du précache fait échouer le cache HTTP de Chromium).
      let res: Response | undefined;
      try { res = await caches.match(url, { ignoreSearch: true }); } catch { /* pas de Cache Storage */ }
      if (!res) {
        for (let attempt = 0; attempt < 3 && !res?.ok; attempt++) {
          try { res = await fetch(url, { cache: 'no-store' }); } catch (e) { if (attempt === 2) throw e; }
        }
      }
      if (!res || !res.ok) throw new Error('modèle Maia introuvable (' + res?.status + ')');
      const total = Number(res.headers.get('content-length') ?? 0);
      const reader = res.body!.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.byteLength;
        postMessage({ type: 'progress', loaded, total });
      }
      const bytes = new Uint8Array(loaded);
      let o = 0;
      for (const c of chunks) { bytes.set(c, o); o += c.byteLength; }
      const m = new Maia3({ variant: '5m', modelBytes: bytes.buffer, numThreads: 1, topK: 0 });
      await m.load();
      maia = m;
    })();
  }
  await loading;
}

self.onmessage = async (ev: MessageEvent) => {
  const { id, type } = ev.data;
  try {
    if (type === 'load') {
      await ensure();
      postMessage({ id, ok: true });
    } else if (type === 'predict') {
      await ensure();
      const t0 = performance.now();
      const r = await maia!.predict({
        fen: ev.data.fen,
        priorMoves: ev.data.priorMoves,
        selfElo: ev.data.selfElo,
        oppoElo: ev.data.oppoElo,
        topK: 0,
      });
      postMessage({
        id, ok: true,
        moves: [...r.moves.entries()],
        winProbability: r.winProbability,
        ms: performance.now() - t0,
      });
    }
  } catch (e) {
    loading = null;
    postMessage({ id, ok: false, error: String((e as Error)?.message ?? e) });
  }
};
