// Questions du mode « Maîtrise de l'échiquier » : génération (cases faibles plus souvent) et correction exacte.
import { Chess, type Square } from 'chess.js';
import { between, bishopAttacks, colorName, FILES, fileNo, isDark, knightDistance, knightMoves, rankNo, sameDiagonal, sq, SQUARES } from './geometry';
import type { Level } from './levels';
import { pickSquare, type Rng, type SquareStats } from './stats';
import { OPENING_LINES } from '../../data/boardGames';
import { fig, FIGURINES } from '../notation';

export type InputKind = 'board-file' | 'board-rank' | 'board-square' | 'keypad' | 'choice' | 'multi';

export interface Question {
  level: string;
  prompt: string;
  input: InputKind;
  /** Réponse attendue : une valeur (case, colonne, rangée, choix) ou une liste de cases (ordre indifférent). */
  expected: string | string[];
  choices?: { value: string; label: string }[];
  highlight?: string;          // case surlignée (nommer une case)
  square?: string;             // case comptée dans les statistiques
  moves?: string[];            // ch. 6 : la suite affichée (SAN)
  units: number;               // nombre d'éléments à donner (temps par élément pour le temps médian)
  explain: string;             // correction (affichée après une erreur)
}

const PIECE_NAME: Record<string, string> = { k: 'roi', q: 'dame', r: 'tour', b: 'fou', n: 'cavalier', p: 'pion' };
const PIECE_FEM: Record<string, boolean> = { k: false, q: true, r: true, b: false, n: false, p: false };
const pieceLabel = (code: string) => {
  if (code === 'none') return 'Aucune';
  const t = code[1].toLowerCase();
  const name = PIECE_NAME[t];
  const adj = code[0] === 'w' ? (PIECE_FEM[t] ? 'blanche' : 'blanc') : (PIECE_FEM[t] ? 'noire' : 'noir');
  return `${name[0].toUpperCase()}${name.slice(1)} ${adj}`;
};
export const PIECE_CHOICES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP', 'none'].map((v) => ({ value: v, label: pieceLabel(v) }));
const YES_NO = [{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }];

const pick = <T,>(rng: Rng, xs: T[]): T => xs[Math.floor(rng() * xs.length)];
const sideWord = (side: 'w' | 'b') => (side === 'w' ? 'des Blancs' : 'des Noirs');

/** Suite de coups pour la visualisation : un début courant (parfois terminé par des coups au hasard). */
export function visuSequence(rng: Rng, plies: number, lines: string[][] = OPENING_LINES): string[] {
  for (;;) {
    const base = pick(rng, lines);
    const c = new Chess();
    const out: string[] = [];
    // Les derniers demi-coups sont parfois tirés au hasard (pour ne pas réciter un début par cœur).
    const randomTail = rng() < 0.5 ? Math.min(2, plies - 1) : 0;
    for (let i = 0; i < plies; i++) {
      let san = i < plies - randomTail ? base[i] : undefined;
      if (!san) san = pick(rng, c.moves());
      try { out.push(c.move(san).san); } catch { break; }
    }
    if (out.length === plies) return out;
  }
}

/** Question suivante d'un niveau ; `prev` évite de reposer la même case. */
export function makeQuestion(level: Level, rng: Rng, stats: SquareStats, prev?: Question): Question {
  const side = level.side;
  switch (level.kind) {
    case 'file': {
      const f = pick(rng, [...FILES].filter((x) => x !== prev?.expected));
      return { level: level.id, prompt: `Touche la colonne ${f}`, input: 'board-file', expected: f, units: 1,
        explain: `La colonne ${f} est la ${fileNo(f + '1')}e en partant de la gauche, vu ${sideWord('w')}.` };
    }
    case 'rank': {
      const r = pick(rng, ['1', '2', '3', '4', '5', '6', '7', '8'].filter((x) => x !== prev?.expected));
      return { level: level.id, prompt: `Touche la rangée ${r}`, input: 'board-rank', expected: r, units: 1,
        explain: `La rangée ${r} est la ${r}e en partant du bas, vu ${sideWord('w')} (la rangée 1 est celle des pièces blanches).` };
    }
    case 'find': {
      const s = pickSquare(rng, stats, SQUARES, prev?.square);
      return { level: level.id, prompt: `Touche la case ${s}`, input: 'board-square', expected: s, square: s, units: 1,
        explain: `${s} : colonne ${s[0]} (${fileNo(s)}e ${side === 'w' ? 'depuis la gauche' : 'depuis la droite'}), rangée ${s[1]} (${side === 'w' ? 'depuis le bas' : 'depuis le haut'}).` };
    }
    case 'name': {
      const s = pickSquare(rng, stats, SQUARES, prev?.square);
      return { level: level.id, prompt: 'Quelle est cette case ?', input: 'keypad', expected: s, highlight: s, square: s, units: 1,
        explain: `C’était ${s} : colonne ${s[0]}, rangée ${s[1]}.` };
    }
    case 'color': {
      const s = pickSquare(rng, stats, SQUARES, prev?.square);
      const sum = fileNo(s) + rankNo(s);
      return { level: level.id, prompt: `${s} : claire ou foncée ?`, input: 'choice', expected: colorName(s), square: s, units: 1,
        choices: [{ value: 'claire', label: 'Claire' }, { value: 'foncée', label: 'Foncée' }],
        explain: `${s[0]} = ${fileNo(s)}, ${fileNo(s)} + ${rankNo(s)} = ${sum} : ${sum % 2 ? 'impaire → claire' : 'paire → foncée'}.` };
    }
    case 'diag': return diagQuestion(level, rng, stats, prev);
    case 'piece': return pieceQuestion(level, rng, stats, prev);
    case 'visu': return visuQuestion(level, rng);
    default: throw new Error('niveau sans questions : ' + level.id);
  }
}

function diagQuestion(level: Level, rng: Rng, stats: SquareStats, prev?: Question): Question {
  const a = pickSquare(rng, stats, SQUARES, prev?.square);
  const diag = SQUARES.filter((t) => sameDiagonal(a, t));
  if (rng() < 0.5) {
    // Même diagonale ? Oui une fois sur deux ; sinon une case « presque » sur la diagonale.
    const yes = rng() < 0.5;
    const near = SQUARES.filter((t) => t !== a && !sameDiagonal(a, t)
      && Math.abs(Math.abs(fileNo(t) - fileNo(a)) - Math.abs(rankNo(t) - rankNo(a))) === 1);
    const b = pick(rng, yes ? diag : near);
    const df = Math.abs(fileNo(a) - fileNo(b)), dr = Math.abs(rankNo(a) - rankNo(b));
    const [x, y] = rng() < 0.5 ? [a, b] : [b, a];
    return { level: level.id, prompt: `${x} et ${y} sont-elles sur la même diagonale ?`, input: 'choice', choices: YES_NO,
      expected: df === dr ? 'oui' : 'non', square: a, units: 1,
      explain: `Écart de colonnes ${df}, écart de rangées ${dr} : ${df === dr ? 'égaux → même diagonale' : 'différents → pas la même diagonale'}.` };
  }
  // Cases entre deux cases d'une diagonale (1 à 4 cases).
  const far = diag.filter((t) => { const d = Math.abs(fileNo(t) - fileNo(a)); return d >= 2 && d <= 5; });
  if (!far.length) return diagQuestion(level, rng, stats, { ...(prev ?? {} as Question), square: a });
  const b = pick(rng, far);
  const mid = between(a, b);
  return { level: level.id, prompt: `Cite les cases entre ${a} et ${b}`, input: 'multi', expected: mid, square: a, units: mid.length,
    explain: `Entre ${a} et ${b} : ${mid.join(', ')} (une colonne et une rangée de plus à chaque pas).` };
}

function pieceQuestion(level: Level, rng: Rng, stats: SquareStats, prev?: Question): Question {
  const a = pickSquare(rng, stats, SQUARES, prev?.square);
  const r = rng();
  if (r < 1 / 3) {
    const ms = knightMoves(a);
    return { level: level.id, prompt: `${FIGURINES.N} en ${a} : toutes ses cases ?`, input: 'multi', expected: ms, square: a, units: ms.length,
      explain: `Cavalier en ${a} : ${ms.join(', ')} (${ms.length} case${ms.length > 1 ? 's' : ''} ; il change toujours de couleur de case).` };
  }
  if (r < 2 / 3) {
    const yes = rng() < 0.5;
    const pool = SQUARES.filter((t) => t !== a && (yes ? bishopAttacks(a, t) : !bishopAttacks(a, t) && isDark(t) === isDark(a)));
    const b = pick(rng, pool.length ? pool : SQUARES.filter((t) => t !== a));
    const att = bishopAttacks(a, b);
    return { level: level.id, prompt: `${FIGURINES.B} en ${a} : attaque-t-il ${b} ? (échiquier vide)`, input: 'choice', choices: YES_NO,
      expected: att ? 'oui' : 'non', square: a, units: 1,
      explain: att ? `${a} et ${b} sont sur la même diagonale : oui.`
        : `${isDark(a) === isDark(b) ? 'Même couleur de case, mais pas la même diagonale' : 'Pas la même couleur de case : un fou ne change jamais de couleur'} : non.` };
  }
  const targets = SQUARES.filter((t) => { const d = knightDistance(a, t); return d >= 2 && d <= 4; });
  const b = pick(rng, targets);
  const d = knightDistance(a, b);
  return { level: level.id, prompt: `${FIGURINES.N} de ${a} à ${b} : combien de coups minimum ?`, input: 'choice', expected: String(d), square: a, units: 1,
    choices: ['1', '2', '3', '4', '5', '6'].map((v) => ({ value: v, label: v })),
    explain: `${d} coups au minimum (le cavalier change de couleur à chaque coup : même couleur → nombre pair, couleur différente → impair).` };
}

/** Pièce sur une case, au format « wN », ou « none ». */
function pieceCode(c: Chess, s: string): string {
  const p = c.get(s as Square);
  return p ? p.color + p.type.toUpperCase() : 'none';
}

function visuQuestion(level: Level, rng: Rng): Question {
  const plies = level.plies ?? 2;
  const moves = visuSequence(rng, plies);
  const c = new Chess();
  const touched: { from: string; to: string }[] = [];
  for (const m of moves) { const mv = c.move(m); touched.push({ from: mv.from, to: mv.to }); }
  const label = fig(moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}.${m}` : m)).join(' '));
  if (rng() < 0.6) {
    // Quelle pièce est en X ?
    const r = rng();
    const s = r < 0.6 ? pick(rng, touched).to : r < 0.85 ? pick(rng, touched).from : pick(rng, SQUARES.filter((t) => [1, 2, 7, 8].includes(rankNo(t))));
    const code = pieceCode(c, s);
    return { level: level.id, prompt: `Après ${label} : quelle pièce est en ${s} ?`, input: 'choice', choices: PIECE_CHOICES,
      expected: code, square: s, moves, units: 1,
      explain: `En ${s} : ${code === 'none' ? 'aucune pièce' : pieceLabel(code).toLowerCase()}.` };
  }
  // La pièce en X est-elle défendue ?
  const occupied = SQUARES.filter((t) => { const p = c.get(t as Square); return p && p.type !== 'k'; });
  const moved = touched.map((t) => t.to).filter((t) => occupied.includes(t));
  const s = moved.length && rng() < 0.75 ? pick(rng, moved) : pick(rng, occupied);
  const p = c.get(s as Square)!;
  const defended = c.isAttacked(s as Square, p.color);
  const name = pieceLabel(p.color + p.type.toUpperCase()).toLowerCase();
  return { level: level.id, prompt: `Après ${label} : ${PIECE_FEM[p.type] ? 'la' : 'le'} ${name} en ${s} est-${PIECE_FEM[p.type] ? 'elle' : 'il'} défendu${PIECE_FEM[p.type] ? 'e' : ''} ?`,
    input: 'choice', choices: YES_NO, expected: defended ? 'oui' : 'non', square: s, moves, units: 1,
    explain: defended ? `Oui : au moins une pièce ${p.color === 'w' ? 'blanche' : 'noire'} protège ${s}.` : `Non : aucune pièce ${p.color === 'w' ? 'blanche' : 'noire'} ne protège ${s}.` };
}

/** Correction exacte. `given` : case touchée / tapée, choix, ou liste de cases. */
export function checkAnswer(q: Question, given: string | string[]): boolean {
  if (q.input === 'board-file') return typeof given === 'string' && given[0] === q.expected;
  if (q.input === 'board-rank') return typeof given === 'string' && given[1] === q.expected;
  if (q.input === 'multi') {
    const g = [...new Set(Array.isArray(given) ? given : [given])].sort();
    const e = [...(q.expected as string[])].sort();
    return g.length === e.length && g.every((x, i) => x === e[i]);
  }
  return given === q.expected;
}

/** Libellé d'une réponse attendue (correction). */
export function expectedLabel(q: Question): string {
  if (Array.isArray(q.expected)) return q.expected.join(', ');
  return q.choices?.find((c) => c.value === q.expected)?.label ?? String(q.expected);
}

export { sq };
