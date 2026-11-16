// Distance exacte au mat (DTM) par analyse rétrograde, pour roi + 1 ou 2 pièces contre roi seul (sans pions).
// Même principe que les tables de finales : on part des positions de mat et on remonte coup par coup.
// wRes[i] = nombre de coups blancs pour mater, trait aux Blancs (-1 = pas de gain).

export type PieceType = 'Q' | 'R' | 'B';

const DIRS: Record<PieceType, [number, number][]> = {
  R: [[1, 0], [-1, 0], [0, 1], [0, -1]],
  B: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
  Q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};

const RAYS: Record<PieceType, number[][][]> = { Q: [], R: [], B: [] };
const KING_N: number[][] = [];
for (let s = 0; s < 64; s++) {
  const f = s & 7, r = s >> 3;
  KING_N[s] = [];
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
    if (!df && !dr) continue;
    const nf = f + df, nr = r + dr;
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) KING_N[s].push(nr * 8 + nf);
  }
  for (const t of ['Q', 'R', 'B'] as PieceType[]) {
    RAYS[t][s] = DIRS[t].map(([df, dr]) => {
      const ray: number[] = [];
      for (let nf = f + df, nr = r + dr; nf >= 0 && nf < 8 && nr >= 0 && nr < 8; nf += df, nr += dr) ray.push(nr * 8 + nf);
      return ray;
    });
  }
}
const adj = (a: number, b: number) => Math.abs((a & 7) - (b & 7)) <= 1 && Math.abs((a >> 3) - (b >> 3)) <= 1;

export interface Table { types: PieceType[]; wRes: Int8Array }

/**
 * Résout la finale roi + `types` contre roi. `sub` donne la table de la finale après la prise d'une pièce
 * (ex. KRRK → KRK) ; sans table, une prise est une nulle (le roi noir s'échappe).
 */
export function solve(types: PieceType[], sub?: Table): Table {
  const n = types.length;
  const size = 1 << (12 + 6 * n);
  const wRes = new Int8Array(size).fill(-1);
  const bRes = new Int8Array(size).fill(-1);   // -1 inconnu, -2 jamais perdu (nulle), sinon mat en n
  const bCnt = new Uint8Array(size);
  const ps = new Int32Array(2);
  const buckets: number[][] = [];

  const decode = (i: number) => { ps[0] = (i >> 12) & 63; if (n === 2) ps[1] = (i >> 18) & 63; return [i & 63, (i >> 6) & 63] as const; };
  const encode = (wk: number, bk: number, a: number, b: number) => wk | (bk << 6) | (a << 12) | (n === 2 ? b << 18 : 0);

  /** Case attaquée par les Blancs ; `skip` = pièce prise (ignorée) ; `bk` = roi noir (bloqueur, -1 si absent). */
  function attacked(sq: number, wk: number, bk: number, skip: number): boolean {
    if (adj(wk, sq)) return true;
    for (let k = 0; k < n; k++) {
      if (k === skip) continue;
      const from = ps[k];
      for (const ray of RAYS[types[k]][from]) {
        for (const s of ray) {
          if (s === sq) return true;
          if (s === wk || s === bk || (n === 2 && s === ps[1 - k] && skip !== 1 - k)) break;
        }
      }
    }
    return false;
  }

  function valid(wk: number, bk: number): boolean {
    if (wk === bk || adj(wk, bk)) return false;
    for (let k = 0; k < n; k++) if (ps[k] === wk || ps[k] === bk) return false;
    if (n === 2 && ps[0] === ps[1]) return false;
    return true;
  }

  // 1. Positions trait aux Noirs : coups légaux, mats, pats, prises.
  let frontier: number[] = [];
  for (let i = 0; i < size; i++) {
    const [wk, bk] = decode(i);
    if (!valid(wk, bk)) continue;
    let cnt = 0;
    let escape = false;
    for (const t of KING_N[bk]) {
      if (adj(t, wk)) continue;
      const cap = ps[0] === t ? 0 : n === 2 && ps[1] === t ? 1 : -1;
      if (cap >= 0) {
        if (attacked(t, wk, -1, cap)) continue;
        // Prise : finale réduite, trait aux Blancs.
        const left = n === 2 ? ps[1 - cap] : -1;
        const d = sub && left >= 0 ? sub.wRes[wk | (t << 6) | (left << 12)] : -1;
        if (d < 0) { escape = true; break; }
        cnt++;
        (buckets[d] ??= []).push(i);
      } else if (!attacked(t, wk, -1, -1)) cnt++;
    }
    if (escape) { bRes[i] = -2; continue; }
    if (cnt === 0) {
      if (attacked(bk, wk, bk, -1)) { bRes[i] = 0; frontier.push(i); } else bRes[i] = -2; // mat / pat
      continue;
    }
    bCnt[i] = cnt;
  }

  // 2. Remontée : niveau par niveau.
  for (let level = 0; frontier.length || buckets.slice(level + 1).some((b) => b?.length); level++) {
    // a) Positions trait aux Blancs gagnées en level+1 : un coup blanc mène à un mat en `level`.
    const newW: number[] = [];
    for (const bi of frontier) {
      const [wk, bk] = decode(bi);
      const occ = (s: number) => s === wk || s === bk || s === ps[0] || (n === 2 && s === ps[1]);
      // coups du roi blanc (à rebours)
      for (const f of KING_N[wk]) {
        if (occ(f) || adj(f, bk)) continue;
        const wi = encode(f, bk, ps[0], ps[1]);
        if (wRes[wi] >= 0) continue;
        if (attacked(bk, f, bk, -1)) continue; // trait aux Blancs : le roi noir ne peut pas être en échec
        wRes[wi] = level + 1; newW.push(wi);
      }
      // coups des pièces (à rebours = mêmes trajectoires, cases vides)
      for (let k = 0; k < n; k++) {
        const from = ps[k];
        for (const ray of RAYS[types[k]][from]) {
          for (const f of ray) {
            if (occ(f)) break;
            ps[k] = f;
            const wi = encode(wk, bk, ps[0], ps[1]);
            if (wRes[wi] < 0 && !attacked(bk, wk, bk, -1)) { wRes[wi] = level + 1; newW.push(wi); }
            ps[k] = from;
          }
        }
      }
    }
    // b) Positions trait aux Noirs perdues en level+1 : tous leurs coups mènent à un gain blanc.
    const next: number[] = [];
    const dec = (bi: number) => {
      if (bRes[bi] !== -1) return;
      if (--bCnt[bi] === 0) { bRes[bi] = level + 1; next.push(bi); }
    };
    for (const wi of newW) {
      const [wk, bk] = decode(wi);
      for (const t of KING_N[bk]) {
        if (t === wk || adj(t, wk) || t === ps[0] || (n === 2 && t === ps[1])) continue;
        dec(encode(wk, t, ps[0], ps[1]));
      }
    }
    for (const bi of buckets[level + 1] ?? []) dec(bi);
    frontier = next;
  }
  return { types, wRes };
}

/** DTM exacte d'une position (trait aux Blancs) ; -1 si pas de gain. */
export function dtmOf(table: Table, fen: string): number {
  const sq = (f: number, r: number) => r * 8 + f;
  let wk = -1, bk = -1;
  const pieces: Record<string, number[]> = {};
  fen.split(' ')[0].split('/').forEach((row, i) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { f += Number(ch); continue; }
      const s = sq(f, 7 - i);
      if (ch === 'K') wk = s; else if (ch === 'k') bk = s; else (pieces[ch] ??= []).push(s);
      f++;
    }
  });
  const order: number[] = [];
  const pool = Object.fromEntries(Object.entries(pieces).map(([k, v]) => [k, [...v]]));
  for (const t of table.types) order.push(pool[t].shift()!);
  return table.wRes[wk | (bk << 6) | (order[0] << 12) | (order.length === 2 ? order[1] << 18 : 0)];
}
