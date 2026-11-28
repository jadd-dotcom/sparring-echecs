// Garde-fou des explications : vérifie sur l'échiquier ce qu'une phrase « pourquoi » ou une phrase-panneau affirme.
// Utilisé par src/lib/whyGuard.test.ts (CI) sur tous les « pourquoi » calculés et toutes les phrases-panneaux.
import { Chess, type Color, type Move, type Square } from 'chess.js';
import { VALUE } from './words';
import { flipTurn } from './report/facts';
import { materialEqual } from './moveWhy';
import type { SignpostThreat } from './signposts';

export const fenKeyOf = (fen: string) => fen.split(' ').slice(0, 4).join(' ');

/** Menaces « s'il rejouait » précalculées, par position (fenKey) après un coup. */
export type ThreatCache = Record<string, SignpostThreat | null | undefined>;

/** Vocabulaire d'une réponse qui dit ce qu'elle fait contre une menace ou une attaque. */
/** « mat », « mater » comme mots entiers (pas « matériel ») ; \b de JavaScript ignore les lettres accentuées. */
const MAT = /(?<![\p{L}])(mat|mater|mate)(?![\p{L}])/u;

const PARRY_WORDS = /menace|attaqu|protège|défend|s’écarte|bouche|pare|garde|fourchette|n’est plus|ne vise plus|à l’abri|prend .* qui|reprend|contre-attaque|au lieu de/;

function threatStillWorks(after: Chess, t: SignpostThreat): boolean {
  try {
    const c = new Chess(flipTurn(after.fen()));
    const m = c.move(t.san);
    return !!m && (!t.captured || (m.to === t.captured.sq && !!m.captured));
  } catch { return false; }
}

/** Pièce mal défendue (même règle que moveWhy) : attaquée sans défense, par moins cher, ou plus d'attaquants que de défenseurs. */
function underDefended(pos: Chess, sq: Square, owner: Color): boolean {
  const p = pos.get(sq);
  if (!p || p.color !== owner) return false;
  const att = pos.attackers(sq, owner === 'w' ? 'b' : 'w');
  if (!att.length) return false;
  const def = pos.attackers(sq, owner).length;
  return def === 0 || Math.min(...att.map((a) => VALUE[pos.get(a)!.type])) < VALUE[p.type] || att.length > def;
}

/** Mes pièces attaquées par la pièce qu'il vient de jouer, et mal défendues. */
function weakTargets(pos: Chess, his: Move, me: Color): Square[] {
  const out: Square[] = [];
  for (const p of pos.board().flat()) {
    if (!p || p.color !== me || p.type === 'k') continue;
    if (pos.attackers(p.square, his.color).includes(his.to as Square) && underDefended(pos, p.square, me)) out.push(p.square);
  }
  return out;
}

/**
 * Problèmes d'une phrase « pourquoi » pour le coup `san` joué depuis `fenBefore` (`prev` : le coup d'avant, de l'autre
 * camp). Liste vide : la phrase est conforme.
 */
export function checkWhy(text: string, fenBefore: string, san: string, threats: ThreatCache, prev?: { fen: string; san: string }): string[] {
  const issues: string[] = [];
  const before = new Chess(fenBefore);
  const after = new Chess(fenBefore);
  const m = after.move(san);
  const by = m.color;
  const myThreat = threats[fenKeyOf(after.fen())] ?? null;
  const hisThreat = threats[fenKeyOf(fenBefore)] ?? null;
  const prevMove = prev ? new Chess(prev.fen).move(prev.san) : null;
  const threatBefore = prev ? threats[fenKeyOf(prev.fen)] ?? null : null;

  // 1. Le coup crée une menace calculée et c'est la pièce jouée qui menace : la phrase le dit.
  if (myThreat && threatBefore?.san !== myThreat.san) {
    try {
      const tm = new Chess(flipTurn(after.fen())).move(myThreat.san);
      if (tm.from === m.to && (myThreat.mate || tm.captured)) {
        const named = text.includes('menace') || (tm.captured && text.includes(tm.to)) || text.includes('mat');
        if (!named) issues.push(`menace créée non dite (${myThreat.san})`);
      }
    } catch { /* menace plus jouable */ }
  }
  // 2. Le coup pare sa menace calculée ou une de mes pièces mal défendue : la phrase le dit.
  if (prevMove) {
    const parried: string[] = [];
    if (hisThreat && threatStillWorks(before, hisThreat) && !threatStillWorks(after, hisThreat)) parried.push(`sa menace ${hisThreat.san}`);
    for (const sq of weakTargets(before, prevMove, by)) {
      if (!underDefended(after, m.from === sq ? (m.to as Square) : sq, by)) parried.push(`la pièce ${sq}`);
    }
    if (parried.length && !before.inCheck() && !PARRY_WORDS.test(text)) issues.push(`réponse qui pare ${parried.join(', ')} sans le dire`);
  }
  // 3. « mat » : une menace de mat calculée (la sienne parée ou la mienne créée) ou un vrai mat.
  if (MAT.test(text) && !after.isCheckmate() && !myThreat?.mate && !hisThreat?.mate && !threatBefore?.mate) {
    issues.push('« mat » sans mat ni menace de mat calculée');
  }
  issues.push(...checkStatements(text, before, after, m));
  return issues;
}

/** Vérifications communes : « attaqué par » (tous les attaquants), « ouverte » / « semi-ouverte », « matériel égal ». */
export function checkStatements(text: string, before: Chess, after: Chess, m: Move): string[] {
  const issues: string[] = [];
  // « X c4, attaqué par son fou et son cavalier » : autant d'attaquants nommés que d'attaquants réels (avant le coup).
  for (const g of text.matchAll(/([a-h][1-8]), attaquée? par ([^.,;:]+)/g)) {
    const sq = g[1] as Square;
    const p = before.get(sq);
    if (!p) continue;
    const real = before.attackers(sq, p.color === 'w' ? 'b' : 'w').length;
    const words = g[2].split(/,| et /).filter((x) => x.trim());
    const named = words.reduce((n, w) => n + (/\bdeux\b/.test(w) ? 2 : /\btrois\b/.test(w) ? 3 : 1), 0);
    if (real && named !== real) issues.push(`« attaqué par » nomme ${named} attaquant(s) sur ${real} en ${sq}`);
  }
  for (const g of text.matchAll(/la colonne ([a-h]) (s’ouvre|devient semi-ouverte)/g)) {
    const pawns = after.board().flat().filter((x) => x && x.type === 'p' && x.square[0] === g[1]);
    if (g[2] === 's’ouvre' && pawns.length) issues.push(`colonne ${g[1]} dite ouverte avec ${pawns.length} pion(s)`);
    if (g[2] !== 's’ouvre' && (!pawns.length || pawns.some((x) => x!.color === m.color))) issues.push(`colonne ${g[1]} dite semi-ouverte à tort`);
  }
  if (/colonne ([a-h]), ouverte/.test(text)) {
    const f = text.match(/colonne ([a-h]), ouverte/)![1];
    if (after.board().flat().some((x) => x && x.type === 'p' && x.square[0] === f)) issues.push(`colonne ${f} dite ouverte avec des pions`);
  }
  if (text.includes('matériel reste égal') && !materialEqual(after)) issues.push('« matériel égal » faux');
  return issues;
}

/**
 * Problèmes d'une phrase-panneau (« Il … → tu … (coup) ») : `fenCross` = position du carrefour, `his` = son coup,
 * `threat` = sa menace précalculée (ou null).
 */
export function checkSignpost(text: string, fenCross: string, his: string, mine: string | null, threat: SignpostThreat | null): string[] {
  const issues: string[] = [];
  const pos = new Chess(fenCross);
  const hm = pos.move(his);
  const [left, right = ''] = text.split(' → ');
  if (threat && !/^Il menace/.test(left)) issues.push(`menace ${threat.san} non dite`);
  if (MAT.test(left) && !threat?.mate) issues.push('« mat » sans menace de mat calculée');
  const att = left.match(/^Il attaque (?:ton|ta) \S+ ([a-h][1-8])$/);
  if (att && !pos.attackers(att[1] as Square, hm.color).includes(hm.to as Square)) issues.push(`« il attaque ${att[1]} » faux`);
  issues.push(...checkStatements(left, new Chess(fenCross), pos, hm));
  if (mine) {
    const after = new Chess(pos.fen());
    const mm = after.move(mine);
    issues.push(...checkStatements(right, pos, after, mm));
  }
  return issues;
}
