// « Pourquoi » d'un coup d'ouverture, en une phrase, calculé sur la position (règles simples, sans moteur) : roque,
// prise / reprise, échec, clouage, attaque, pion qui prend le centre / prépare un fianchetto / ouvre une diagonale /
// soutient / chasse, développement (cases du centre surveillées), grande diagonale, colonne ouverte, avant-poste…
// Sert aux lignes du répertoire qui n'avaient pas encore d'explication (leçons complètes), relues dans
// docs/LECONS-OUVERTURES.md.
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import { pieceWords, VALUE } from './words';

const CENTER: Square[] = ['d4', 'd5', 'e4', 'e5'];
const WIDE_CENTER = new Set(['c4', 'c5', 'd4', 'd5', 'e4', 'e5', 'f4', 'f5']);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} et ${xs[xs.length - 1]}`);

/** Cases attaquées par la pièce en `sq` (position `c`, son camp `by`). */
function attackedBy(c: Chess, sq: Square, by: Color): Square[] {
  const out: Square[] = [];
  for (const f of 'abcdefgh') for (const r of '12345678') {
    const s = (f + r) as Square;
    if (c.attackers(s, by).includes(sq)) out.push(s);
  }
  return out;
}

/** Clouage : la pièce arrivée en `sq` vise une pièce adverse derrière laquelle se trouve sa dame ou son roi. */
function pinOf(c: Chess, sq: Square, piece: PieceSymbol, by: Color): { pinned: Square; type: PieceSymbol; behind: PieceSymbol } | null {
  const dirs = piece === 'b' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : piece === 'r' ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
    : piece === 'q' ? [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]] : [];
  const f0 = sq.charCodeAt(0) - 97, r0 = Number(sq[1]) - 1;
  for (const [df, dr] of dirs) {
    let f = f0 + df, r = r0 + dr;
    let first: { sq: Square; type: PieceSymbol } | null = null;
    while (f >= 0 && f < 8 && r >= 0 && r < 8) {
      const s = (String.fromCharCode(97 + f) + (r + 1)) as Square;
      const p = c.get(s);
      if (p) {
        if (p.color === by) break;
        if (!first) first = { sq: s, type: p.type };
        else {
          // Contre le roi : toujours ; contre la dame : par une pièce moins forte, sur une pièce (pas un pion).
          if (p.type === 'k' || (p.type === 'q' && piece !== 'q' && first.type !== 'p' && first.type !== 'q')) return { pinned: first.sq, type: first.type, behind: p.type };
          break;
        }
      }
      f += df; r += dr;
    }
  }
  return null;
}

/** Une phrase : pourquoi ce coup (du point de vue de `me` : « ton » / « son »). */
export function moveWhy(fenBefore: string, san: string, me: Color, prevMove?: { to: string; captured?: string }): string {
  const c = new Chess(fenBefore);
  const m: Move = c.move(san);
  const by = m.color;
  const mine = by === me;
  const opp: Color = by === 'w' ? 'b' : 'w';
  const P = (t: PieceSymbol, col: Color) => pieceWords(t, col, me);
  const subj = cap(P(m.piece, by));
  const homeRank = by === 'w' ? '1' : '8';
  const check = c.inCheck();
  const chk = check ? ', avec échec' : '';

  // Roques
  if (m.isKingsideCastle() || m.isQueensideCastle()) {
    const what = m.isKingsideCastle() ? 'Petit roque' : 'Grand roque';
    return mine ? `${what} : ton roi se met à l’abri et ta tour se rapproche du centre.` : `${what} : son roi se met à l’abri.`;
  }
  // Prises
  if (m.captured) {
    const victim = P(m.captured as PieceSymbol, opp);
    if (prevMove && prevMove.to === m.to && prevMove.captured) return `${subj} reprend en ${m.to}${chk} : le matériel reste égal.`;
    if (m.piece === 'p' && m.captured === 'p') {
      const file = m.from[0];
      const ownLeft = c.board().flat().some((p) => p && p.type === 'p' && p.color === by && p.square[0] === file);
      return `${subj} prend ${victim} ${m.to}${chk}${ownLeft ? '' : ` : la colonne ${file} s’ouvre pour ${mine ? 'tes' : 'ses'} tours`}.`;
    }
    return `${subj} prend ${victim} ${m.to}${chk}.`;
  }
  // Clouage
  if (m.piece === 'b' || m.piece === 'r' || m.piece === 'q') {
    const pin = pinOf(c, m.to as Square, m.piece, by);
    if (pin) return `${subj} cloue ${P(pin.type, opp)} ${pin.pinned} sur ${pin.behind === 'k' ? (mine ? 'son roi' : 'ton roi') : (mine ? 'sa dame' : 'ta dame')}.`;
  }
  if (check) return `${subj} va en ${m.to} avec échec.`;
  // Déclouage : une de ses pièces était clouée (sur la dame ou le roi) et ne l'est plus.
  const pinsOn = (pos: Chess) => pos.board().flat().filter((p) => p && p.color === opp && 'brq'.includes(p.type))
    .map((p) => pinOf(pos, p!.square, p!.type, opp)).filter((x) => x).map((x) => x!.pinned);
  const wasPinned = pinsOn(new Chess(fenBefore)).filter((sq) => sq !== m.from);
  const freed = wasPinned.find((sq) => !pinsOn(c).includes(sq));
  if (freed && c.get(freed as Square)) return `${subj} va en ${m.to} : ${P(c.get(freed as Square)!.type, by)} ${freed} n’est plus cloué${c.get(freed as Square)!.type === 'q' || c.get(freed as Square)!.type === 'r' ? 'e' : ''}.`;
  const attacked = attackedBy(c, m.to as Square, by);
  // Cibles : une pièce plus précieuse ou non défendue, ou le pion f7 / f2 (roque pas encore fait).
  const targets = attacked.map((s) => ({ s, p: c.get(s) })).filter((x) => x.p && x.p.color === opp && x.p.type !== 'k')
    .filter((x) => VALUE[x.p!.type] > VALUE[m.piece] || c.attackers(x.s, opp).length === 0)
    .sort((a, b) => VALUE[b.p!.type] - VALUE[a.p!.type]);

  if (m.piece === 'p') {
    const t = targets[0];
    if (t) return `Le pion ${m.to} ${t.p!.type === 'p' ? 'attaque' : 'chasse'} ${P(t.p!.type, opp)} ${t.s}.`;
    if (['g3', 'b3', 'g6', 'b6'].includes(m.to)) return `Le pion ${m.to} prépare le fianchetto ${mine ? 'de ton' : 'de son'} fou en ${m.to[0]}${by === 'w' ? '2' : '7'}.`;
    if ((m.to === 'h3' || m.to === 'h6' || m.to === 'a3' || m.to === 'a6')) {
      const g = (m.to[0] === 'h' ? 'g' : 'b') + (by === 'w' ? '4' : '5');
      const king = c.board().flat().find((p) => p && p.type === 'k' && p.color === by)!;
      const luft = m.to[0] === 'h' ? king.square[0] === 'g' || king.square[0] === 'h' : king.square[0] === 'b' || king.square[0] === 'c';
      return `Le pion ${m.to} contrôle ${g} : ni ${mine ? 'son' : 'ton'} fou ni ${mine ? 'son' : 'ton'} cavalier ne pourront s’y installer${luft ? `, et ${mine ? 'ton' : 'son'} roi a une case de fuite` : ''}.`;
    }
    const supports = attacked.filter((s) => { const p = c.get(s); return p && p.color === by; }).map((s) => ({ ...c.get(s)!, square: s }));
    const centerHits = attacked.filter((s) => CENTER.includes(s));
    if (WIDE_CENTER.has(m.to) && Math.abs(Number(m.to[1]) - Number(m.from[1])) === 2) {
      return `Le pion ${m.to} prend de l’espace au centre${centerHits.length ? ` et surveille ${list(centerHits)}` : ''}.`;
    }
    if (supports.length) return `Le pion ${m.to} soutient ${P(supports[0].type, by)} ${supports[0].square}.`;
    // c3 / c6 avant d4 / …d5 : prépare la poussée centrale.
    const dHome = (by === 'w' ? 'd2' : 'd7') as Square, dGoal = (by === 'w' ? 'd4' : 'd5') as Square;
    if ((m.to === 'c3' || m.to === 'c6') && c.get(dHome)?.type === 'p' && !c.get(dGoal)) return `Le pion ${m.to} prépare ${by === 'w' ? 'd4' : '…d5'} : ${mine ? 'tu pourras' : 'il pourra'} occuper tout le centre.`;
    if (CENTER.includes(m.to as Square)) return `Le pion ${m.to} occupe le centre${centerHits.length ? ` et surveille ${list(centerHits)}` : ''}.`;
    // Diagonale ouverte pour un fou
    const before = new Chess(fenBefore);
    const bishops = c.board().flat().filter((p) => p && p.type === 'b' && p.color === by && p.square[1] === homeRank);
    for (const b of bishops) {
      if (attackedBy(c, b!.square, by).length > attackedBy(before, b!.square, by).length) return `Le pion ${m.to} ouvre la diagonale ${mine ? 'de ton' : 'de son'} fou ${b!.square}.`;
    }
    if (centerHits.length) return `Le pion ${m.to} surveille ${list(centerHits)}, au centre.`;
    const wing = 'abc'.includes(m.to[0]) ? 'à l’aile dame' : 'fgh'.includes(m.to[0]) ? 'à l’aile roi' : 'au centre';
    return `Le pion ${m.to} gagne de l’espace ${wing}.`;
  }
  if (targets[0]) {
    const t = targets[0];
    return `${subj} va en ${m.to} et attaque ${P(t.p!.type, opp)} ${t.s}.`;
  }
  // Fou qui vise un cavalier (défendu) : il menace de l'échanger.
  if (m.piece === 'b') {
    const n = attacked.find((s) => c.get(s)?.type === 'n' && c.get(s)?.color === opp && s[1] !== '1' && s[1] !== '8');
    if (n) return `${subj} ${m.from[1] === homeRank ? 'se développe' : 'va'} en ${m.to} et vise ${P('n', opp)} ${n}.`;
  }
  // Fou sur la grande diagonale
  if (m.piece === 'b' && ['g2', 'b2', 'g7', 'b7'].includes(m.to)) return `${subj} se place sur la grande diagonale, d’où il vise le centre et l’autre aile.`;
  // Tour sur une colonne ouverte / semi-ouverte
  if (m.piece === 'r') {
    const file = m.to[0];
    const own = c.board().flat().some((p) => p && p.type === 'p' && p.color === by && p.square[0] === file);
    const theirs = c.board().flat().some((p) => p && p.type === 'p' && p.color === opp && p.square[0] === file);
    if (!own) return `${subj} vient sur la colonne ${file}, ${theirs ? 'semi-ouverte' : 'ouverte'}.`;
    const backed = attacked.find((s) => s[0] === file && c.get(s)?.color === by && c.get(s)?.type === 'p');
    if (backed) return `${subj} vient en ${m.to} et soutient ${P('p', by)} ${backed}.`;
    return `${subj} vient en ${m.to}, prête si la colonne ${file} s’ouvre.`;
  }
  // Avant-poste : cavalier protégé par un pion, au-delà de la 4e rangée
  if (m.piece === 'n') {
    const adv = by === 'w' ? Number(m.to[1]) >= 5 : Number(m.to[1]) <= 4;
    const pawnGuard = c.attackers(m.to as Square, by).some((s) => c.get(s)?.type === 'p');
    if (adv && pawnGuard) return `${subj} s’installe en ${m.to}, un [[avant-poste]] protégé par ${mine ? 'ton' : 'son'} pion.`;
  }
  const centerHits = attacked.filter((s) => CENTER.includes(s));
  const developing = m.from[1] === homeRank && m.piece !== 'k';
  // Dame en d2 / d7 avec le fou en e3 / e6 contre un fianchetto : prépare l'échange du fou g7 / g2 par Bh6 / …Bh3.
  if (m.piece === 'q' && m.to === (by === 'w' ? 'd2' : 'd7')) {
    const bSq = by === 'w' ? 'e3' : 'e6', hSq = by === 'w' ? 'h6' : 'h3', fSq = by === 'w' ? 'g7' : 'g2';
    const b = c.get(bSq as Square), f = c.get(fSq as Square);
    if (b?.type === 'b' && b.color === by && f?.type === 'b' && f.color === opp) {
      return `${subj} sort en ${m.to} : avec ${mine ? 'ton' : 'son'} fou ${bSq}, ${by === 'w' ? '' : '…'}B${hSq} échangera ${mine ? 'son' : 'ton'} fou ${fSq}, le meilleur défenseur de ${mine ? 'son' : 'ton'} roi.`;
    }
  }
  if (m.piece === 'k') return `${subj} va en ${m.to}, un peu plus à l’abri.`;
  if (developing) {
    if (centerHits.length) return `${subj} ${m.piece === 'q' ? 'sort' : 'se développe'} en ${m.to} et surveille ${list(centerHits)}.`;
    return `${subj} se développe en ${m.to}.`;
  }
  // Retraite / regroupement
  const wasAttacked = new Chess(fenBefore).attackers(m.from as Square, opp).length > 0;
  if (wasAttacked) return `${subj} se met à l’abri en ${m.to}${centerHits.length ? ` et surveille ${list(centerHits)}` : ''}.`;
  if (centerHits.length) return `${subj} va en ${m.to} et vise ${list(centerHits)}.`;
  return `${subj} se replace en ${m.to}.`;
}
