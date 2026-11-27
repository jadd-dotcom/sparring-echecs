// Carrefours d'un répertoire : positions où l'adversaire a au moins 2 coups dans mon arbre (son coup change ma
// réponse). Une carte par « coup-panneau » (son coup à ce carrefour). Arbre des lignes groupé par carrefours, nom de
// chaque ligne (celui de la leçon, sinon le coup-panneau, ex. « 2.♘c3 »). Fonctions pures.
import type { Color, RepNode } from './repertoire';
import { turnOf } from './repertoire';
import type { OpeningLesson } from '../data/openingLessons';

export type Line = string[];
const key = (l: Line) => l.join(' ');
const isPrefix = (a: Line, b: Line) => a.length <= b.length && a.every((m, i) => m === b[i]);

/** Numéro de coup + SAN : « 2.Nc3 », « 2…c6 ». */
export function moveLabel(ply: number, san: string): string {
  return `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}${san}`;
}

export interface Crossroad {
  /** Coups qui mènent au carrefour (l'adversaire a le trait). */
  path: Line;
  fen: string;
  /** Ses coups possibles dans mon arbre, et ma réponse prévue à chacun. */
  branches: { his: string; mine: string | null; ply: number }[];
}

/** Tous les carrefours, dans l'ordre de l'arbre (profondeur d'abord). */
export function crossroads(root: RepNode, me: Color): Crossroad[] {
  const out: Crossroad[] = [];
  const walk = (n: RepNode, path: Line) => {
    if (turnOf(n.fen) !== me && n.children.length >= 2) {
      out.push({
        path, fen: n.fen,
        branches: n.children.map((c) => ({ his: c.san, mine: c.children[0]?.san ?? null, ply: path.length })),
      });
    }
    for (const c of n.children) walk(c, [...path, c.san]);
  };
  walk(root, []);
  return out;
}

/** Carte d'un coup-panneau : le carrefour et son coup. */
export interface SignpostCard { id: string; crossroad: Crossroad; his: string; mine: string | null; ply: number }

export function signpostCards(root: RepNode, me: Color): SignpostCard[] {
  return crossroads(root, me).flatMap((c) => c.branches.map((b) => ({
    id: key([...c.path, b.his]), crossroad: c, his: b.his, mine: b.mine, ply: b.ply,
  })));
}

/** Dernier carrefour traversé par une ligne : indice (dans la ligne) de son coup-panneau, ou -1. */
export function lastCrossroadPly(l: Line, cs: Crossroad[]): number {
  let best = -1;
  for (const c of cs) if (c.path.length < l.length && isPrefix(c.path, l) && c.branches.some((b) => b.his === l[c.path.length])) best = Math.max(best, c.path.length);
  return best;
}

/** Nom d'une ligne : celui de la leçon (ligne principale ou ligne d'un bloc), sinon son dernier coup-panneau. */
export function lineName(l: Line, lesson: OpeningLesson | undefined, cs: Crossroad[], mainLine?: Line): string {
  if (mainLine && key(l) === key(mainLine)) return 'Ligne principale';
  for (const x of lesson?.extras ?? []) {
    for (const ln of x.lines) {
      const path = [...ln.start, ...ln.moves.map((m) => m.san)];
      if (isPrefix(path, l) || isPrefix(l, path)) return ln.name;
    }
  }
  const p = lastCrossroadPly(l, cs);
  return p >= 0 ? moveLabel(p, l[p]) : moveLabel(0, l[0] ?? '');
}

/** Nœud de l'arbre des lignes groupé par carrefours : « son coup → mon coup », puis la suite. */
export interface LineTreeNode {
  /** Coups jusqu'au carrefour (l'adversaire a le trait). */
  path: Line;
  his: string;
  mine: string | null;
  ply: number;
  /** Lignes qui passent par ce coup-panneau et s'arrêtent avant le carrefour suivant. */
  lines: Line[];
  children: LineTreeNode[];
}

/**
 * Arbre des lignes groupé par carrefours. Chaque ligne est rangée sous son dernier coup-panneau ; les lignes qui ne
 * traversent aucun carrefour sont à la racine (`root`).
 */
export function lineTree(all: Line[], cs: Crossroad[]): { root: Line[]; nodes: LineTreeNode[] } {
  const nodes = new Map<string, LineTreeNode>();
  const top: LineTreeNode[] = [];
  const nodeFor = (l: Line, ply: number): LineTreeNode => {
    const id = key(l.slice(0, ply + 1));
    let n = nodes.get(id);
    if (!n) {
      n = { path: l.slice(0, ply), his: l[ply], mine: l[ply + 1] ?? null, ply, lines: [], children: [] };
      nodes.set(id, n);
      const parentPly = lastCrossroadPly(l.slice(0, ply), cs);
      if (parentPly >= 0) nodeFor(l, parentPly).children.push(n);
      else top.push(n);
    }
    return n;
  };
  const root: Line[] = [];
  for (const l of all) {
    const p = lastCrossroadPly(l, cs);
    if (p < 0) root.push(l); else nodeFor(l, p).lines.push(l);
  }
  return { root, nodes: top };
}

/** Lignes d'un nœud et de ses descendants. */
export function linesUnder(n: LineTreeNode): Line[] {
  return [...n.lines, ...n.children.flatMap(linesUnder)];
}
