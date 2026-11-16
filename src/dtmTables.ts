// Chargement des tables exactes (public/dtm/*.dtm, gzip) dans le navigateur ; null si indisponible.
import type { DtmPiece, DtmTable } from './lib/dtmLookup';
import type { MateLevelId } from './lib/mates';

const TYPES: Partial<Record<MateLevelId, DtmPiece[]>> = { kq: ['Q'], kr: ['R'], krr: ['R', 'R'], kbb: ['B', 'B'] };
const cache = new Map<string, Promise<DtmTable | null>>();

async function fetchTable(id: MateLevelId): Promise<DtmTable | null> {
  const types = TYPES[id];
  if (!types) return null;
  const res = await fetch(import.meta.env.BASE_URL + `dtm/${id}.dtm`);
  if (!res.ok) return null;
  let buf = new Uint8Array(await res.arrayBuffer());
  if (buf[0] === 0x1f && buf[1] === 0x8b) {   // gzip (sinon déjà décompressé par le serveur)
    if (typeof DecompressionStream === 'undefined') return null;
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'));
    buf = new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return { types, data: new Int8Array(buf.buffer, buf.byteOffset, buf.byteLength) };
}

export function loadDtm(id: MateLevelId): Promise<DtmTable | null> {
  if (!cache.has(id)) cache.set(id, fetchTable(id).catch(() => null));
  return cache.get(id)!;
}

/** Table du niveau + table après la prise d'une pièce (deux tours → tour seule). */
export async function loadDtmForLevel(id: MateLevelId) {
  const [table, sub] = await Promise.all([loadDtm(id), id === 'krr' ? loadDtm('kr') : Promise.resolve(null)]);
  return { table, sub: sub ?? undefined };
}
