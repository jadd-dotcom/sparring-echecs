// Répertoire d'ouvertures : arbre de coups, lecture/écriture PGN avec variantes,
// index par position, coups forcés, détection de sortie, positions de drill.
import { Chess } from 'chess.js';

export type Color = 'w' | 'b';
export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export interface RepNode {
  san: string;        // coup qui mène à ce nœud ('' pour la racine)
  uci: string;
  fen: string;        // position après le coup
  children: RepNode[];
}

/** Clé de position (sans compteurs de coups) : gère les transpositions. */
export const fenKey = (fen: string) => fen.split(' ').slice(0, 4).join(' ');
export const turnOf = (fen: string) => fen.split(' ')[1] as Color;

export const newRoot = (fen = START_FEN): RepNode => ({ san: '', uci: '', fen, children: [] });

/** Ajoute (ou retrouve) le coup `san` sous `node`. Lève une erreur si illégal. */
export function addChild(node: RepNode, san: string): RepNode {
  const c = new Chess(node.fen);
  let m;
  try { m = c.move(san); } catch { m = null; }
  if (!m) throw new Error(`coup illégal « ${san} »`);
  const uci = m.from + m.to + (m.promotion ?? '');
  let child = node.children.find((x) => x.uci === uci);
  if (!child) {
    child = { san: m.san, uci, fen: c.fen(), children: [] };
    node.children.push(child);
  }
  return child;
}

// ---------------------------------------------------------------- PGN → arbre

export interface PgnParseResult {
  root: RepNode;
  games: number;
  skipped: string[];   // chapitres ignorés (position de départ non standard…)
}

type Tok = { t: 'move' | '(' | ')' | 'end'; v: string };

function tokenize(movetext: string): Tok[] {
  const out: Tok[] = [];
  const s = movetext.replace(/\{[^}]*\}/g, ' ').replace(/;[^\n]*/g, ' ');
  const re = /\(|\)|\$\d+|\d+\.(\.\.)?|1-0|0-1|1\/2-1\/2|\*|[^\s()]+/g;
  for (const m of s.matchAll(re)) {
    const v = m[0];
    if (v === '(' || v === ')') out.push({ t: v, v });
    else if (v === '1-0' || v === '0-1' || v === '1/2-1/2' || v === '*') out.push({ t: 'end', v });
    else if (/^\$\d+$/.test(v) || /^\d+\.+$/.test(v)) continue;
    else {
      const san = v.replace(/^\d+\.+/, '').replace(/[!?]+$/, '');
      if (san) out.push({ t: 'move', v: san });
    }
  }
  return out;
}

/** Lit un ou plusieurs PGN (ex. export d'étude Lichess) et fusionne tout dans un arbre. */
export function parsePgn(text: string, root: RepNode = newRoot()): PgnParseResult {
  const skipped: string[] = [];
  let games = 0;
  // Découpe en parties : un bloc d'en-têtes suivi d'un texte de coups.
  const chunks = text.replace(/\r/g, '').split(/\n(?=\s*\[Event )/);
  for (const chunk of chunks) {
    const headers: Record<string, string> = {};
    for (const h of chunk.matchAll(/^\s*\[(\w+)\s+"([^"]*)"\]\s*$/gm)) headers[h[1]] = h[2];
    const movetext = chunk.replace(/^\s*\[.*\]\s*$/gm, '').trim();
    if (!movetext) continue;
    const name = headers.ChapterName ?? headers.Event ?? `partie ${games + 1}`;
    if (headers.FEN && fenKey(headers.FEN) !== fenKey(root.fen)) {
      skipped.push(`${name} : position de départ non standard`);
      continue;
    }
    // Plusieurs parties sans en-têtes, séparées par un résultat.
    const toks = tokenize(movetext);
    let i = 0;
    while (i < toks.length) {
      const before = i;
      i = parseLine(toks, i, root, [], name);
      if (toks[i]?.t === 'end') i++;
      if (i > before) games++;
      else i++;
    }
  }
  return { root, games, skipped };
}

function parseLine(toks: Tok[], i: number, start: RepNode, path: string[], name: string): number {
  let cur = start;
  let prev: RepNode | null = null;
  let prevPath = path;
  let curPath = path;
  while (i < toks.length) {
    const tk = toks[i];
    if (tk.t === ')' || tk.t === 'end') return i;
    if (tk.t === '(') {
      i = parseLine(toks, i + 1, prev ?? start, prev ? prevPath : path, name);
      if (toks[i]?.t === ')') i++;
      continue;
    }
    try {
      const next = addChild(cur, tk.v);
      prev = cur; prevPath = curPath;
      cur = next; curPath = [...curPath, next.san];
    } catch (e) {
      throw new Error(`${name} : ${(e as Error).message} après ${formatLine(curPath) || 'la position initiale'}`);
    }
    i++;
  }
  return i;
}

// ---------------------------------------------------------------- arbre → PGN

function moveLabel(san: string, ply: number, force: boolean) {
  const n = Math.floor(ply / 2) + 1;
  if (ply % 2 === 0) return `${n}. ${san}`;
  return force ? `${n}... ${san}` : san;
}

function writeFrom(node: RepNode, ply: number, force: boolean): string {
  if (node.children.length === 0) return '';
  const [main, ...alts] = node.children;
  let out = moveLabel(main.san, ply, force);
  for (const a of alts) {
    const rest = writeFrom(a, ply + 1, false);
    out += ` (${moveLabel(a.san, ply, true)}${rest ? ' ' + rest : ''})`;
  }
  const rest = writeFrom(main, ply + 1, alts.length > 0);
  return rest ? `${out} ${rest}` : out;
}

export function toPgn(root: RepNode, headers: Record<string, string> = {}): string {
  const plyStart = turnOf(root.fen) === 'w' ? 0 : 1;
  const head = Object.entries(headers).map(([k, v]) => `[${k} "${v.replace(/"/g, "'")}"]`).join('\n');
  const body = writeFrom(root, plyStart, true);
  return `${head}${head ? '\n\n' : ''}${body}${body ? ' ' : ''}*\n`;
}

// ---------------------------------------------------------------- lignes

/** Toutes les lignes (racine → feuille), en SAN. */
export function lines(root: RepNode): string[][] {
  const out: string[][] = [];
  const walk = (n: RepNode, path: string[]) => {
    if (n.children.length === 0) { if (path.length) out.push(path); return; }
    for (const c of n.children) walk(c, [...path, c.san]);
  };
  walk(root, []);
  return out;
}

export function formatLine(sans: string[], startPly = 0): string {
  return sans.map((s, i) => moveLabel(s, startPly + i, i === 0)).join(' ');
}

/** Ajoute une ligne (SAN) ; renvoie le nombre de coups nouveaux. Lève une erreur si illégale. */
export function addLine(root: RepNode, sans: string[]): number {
  let cur = root;
  let added = 0;
  sans.forEach((s, i) => {
    const parent = cur;
    const before = parent.children.length;
    try { cur = addChild(parent, s); } catch (e) {
      throw new Error(`${(e as Error).message} après ${formatLine(sans.slice(0, i)) || 'la position initiale'}`);
    }
    if (parent.children.length > before) added++;
  });
  return added;
}

/** Supprime une ligne : retire la feuille et les nœuds devenus orphelins. */
export function removeLine(root: RepNode, sans: string[]): boolean {
  const path: RepNode[] = [root];
  for (const s of sans) {
    const n = path[path.length - 1].children.find((c) => c.san === s);
    if (!n) return false;
    path.push(n);
  }
  if (path[path.length - 1].children.length > 0) return false; // pas une ligne complète
  for (let i = path.length - 1; i > 0; i--) {
    const parent = path[i - 1];
    parent.children = parent.children.filter((c) => c !== path[i]);
    if (parent.children.length > 0) break;
  }
  return true;
}

export function mergeInto(target: RepNode, source: RepNode) {
  for (const l of lines(source)) addLine(target, l);
}

export function cloneTree(n: RepNode): RepNode {
  return { ...n, children: n.children.map(cloneTree) };
}

// ---------------------------------------------------------------- index et usages

export interface IndexEntry { moves: Map<string, string>; path: string[] } // uci → san ; 1er chemin rencontré

/** Index position → coups du répertoire depuis cette position (transpositions fusionnées). */
export function buildIndex(root: RepNode): Map<string, IndexEntry> {
  const idx = new Map<string, IndexEntry>();
  const walk = (n: RepNode, path: string[]) => {
    if (n.children.length) {
      const k = fenKey(n.fen);
      let e = idx.get(k);
      if (!e) { e = { moves: new Map(), path }; idx.set(k, e); }
      for (const c of n.children) e.moves.set(c.uci, c.san);
    }
    for (const c of n.children) walk(c, [...path, c.san]);
  };
  walk(root, []);
  return idx;
}

/** Coups de mon camp à vérifier : (position avant, coup). */
export function myMoves(root: RepNode, me: Color): { fen: string; uci: string; san: string; path: string[] }[] {
  const out: { fen: string; uci: string; san: string; path: string[] }[] = [];
  const seen = new Set<string>();
  const walk = (n: RepNode, path: string[]) => {
    for (const c of n.children) {
      if (turnOf(n.fen) === me) {
        const k = fenKey(n.fen) + ' ' + c.uci;
        if (!seen.has(k)) { seen.add(k); out.push({ fen: n.fen, uci: c.uci, san: c.san, path }); }
      }
      walk(c, [...path, c.san]);
    }
  };
  walk(root, []);
  return out;
}

export interface DrillPosition { key: string; fen: string; accept: string[]; acceptSan: string[]; path: string[]; order: number }

/** Chaque position du répertoire où c'est à moi de jouer (ordre de parcours des lignes). */
export function drillPositions(root: RepNode, me: Color): DrillPosition[] {
  const idx = buildIndex(root);
  const out: DrillPosition[] = [];
  const seen = new Set<string>();
  const walk = (n: RepNode) => {
    const k = fenKey(n.fen);
    if (n.children.length && turnOf(n.fen) === me && !seen.has(k)) {
      seen.add(k);
      const e = idx.get(k)!;
      out.push({ key: k, fen: n.fen, accept: [...e.moves.keys()], acceptSan: [...e.moves.values()], path: e.path, order: out.length });
    }
    for (const c of n.children) walk(c);
  };
  walk(root);
  return out;
}

// ---------------------------------------------------------------- partie à thème

/**
 * Coup adverse imposé par l'ouverture (ex. GDR : 1.d4 et 2.c4), sinon null.
 * `forced[k]` = k-ième coup de l'adversaire, en SAN. Ignoré s'il est illégal.
 */
export function forcedMove(fen: string, plyIndex: number, me: Color, forced: string[], startTurn: Color = 'w'): string | null {
  if (turnOf(fen) === me) return null;
  const oppFirstPly = startTurn === me ? 1 : 0;
  const k = (plyIndex - oppFirstPly) / 2;
  if (!Number.isInteger(k) || k < 0 || k >= forced.length) return null;
  try {
    const m = new Chess(fen).move(forced[k]);
    return m.from + m.to + (m.promotion ?? '');
  } catch { return null; }
}

export interface BookExit {
  ply: number;               // demi-coup où l'on quitte le répertoire
  by: 'me' | 'opponent' | 'end';
  playedSan: string;
  expectedSan: string[];     // coups prévus par le répertoire depuis cette position
  fenBefore: string;         // position avant le coup joué
  fenAfter: string;          // position après le coup joué
}

/** Première sortie du répertoire dans une partie (null si la partie reste dans le livre). */
export function findBookExit(idx: Map<string, IndexEntry>, startFen: string, uci: string[], me: Color): BookExit | null {
  const c = new Chess(startFen);
  for (let i = 0; i < uci.length; i++) {
    const before = c.fen();
    const u = uci[i];
    const m = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    const e = idx.get(fenKey(before));
    if (!e || e.moves.size === 0) {
      return { ply: i, by: 'end', playedSan: m.san, expectedSan: [], fenBefore: before, fenAfter: c.fen() };
    }
    if (e.moves.has(u)) continue;
    return {
      ply: i, by: turnOf(before) === me ? 'me' : 'opponent', playedSan: m.san,
      expectedSan: [...e.moves.values()], fenBefore: before, fenAfter: c.fen(),
    };
  }
  return null;
}
