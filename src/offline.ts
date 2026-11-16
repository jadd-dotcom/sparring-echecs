// Attente de l'installation du service worker (précache complet) avant de charger Maia,
// pour ne télécharger le modèle et le runtime qu'une seule fois au 1er lancement.

/** Taille approximative du précache (modèle + runtime ONNX + Stockfish + appli). */
export const OFFLINE_TOTAL_BYTES = 39.9e6;

const sizes = new Map<string, number>();

async function cachedBytes(): Promise<number> {
  let total = 0;
  for (const name of await caches.keys()) {
    if (!name.includes('precache')) continue;
    const c = await caches.open(name);
    for (const req of await c.keys()) {
      if (!sizes.has(req.url)) {
        const r = await c.match(req);
        sizes.set(req.url, r ? (await r.blob()).size : 0);
      }
      total += sizes.get(req.url)!;
    }
  }
  return total;
}

let readyPromise: Promise<boolean> | null = null;

/**
 * Résout `true` quand l'appli est disponible hors ligne, `false` si le service
 * worker est absent ou a échoué (on charge alors directement depuis le réseau).
 */
export function waitOfflineReady(onProgress?: (bytes: number, total: number) => void): Promise<boolean> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return Promise.resolve(false);
  if (navigator.serviceWorker.controller) return Promise.resolve(true);
  readyPromise ??= (async () => {
    let reg: ServiceWorkerRegistration | undefined;
    for (let i = 0; i < 40 && !reg; i++) {
      reg = await navigator.serviceWorker.getRegistration();
      if (!reg) await new Promise((r) => setTimeout(r, 250));
    }
    if (!reg) return false;
    if (reg.active && !reg.installing && !reg.waiting) return true;
    return await new Promise<boolean>((resolve) => {
      const started = Date.now();
      const timer = setInterval(async () => {
        try { onProgressRef?.(await cachedBytes(), OFFLINE_TOTAL_BYTES); } catch { /* ignore */ }
        const sw = reg!.installing ?? reg!.waiting;
        if (reg!.active && !sw) { clearInterval(timer); resolve(true); }
        else if (!sw && !reg!.active) { clearInterval(timer); resolve(false); }
        else if (Date.now() - started > 10 * 60_000) { clearInterval(timer); resolve(false); }
      }, 400);
    });
  })();
  onProgressRef = onProgress ?? onProgressRef;
  return readyPromise;
}
let onProgressRef: ((bytes: number, total: number) => void) | undefined;

export const isOfflineReady = () => 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
