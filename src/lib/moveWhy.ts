// « Pourquoi » d'un coup d'ouverture, en une phrase, calculé sur la position (règles simples ; la menace « s'il
// rejouait » vient de Stockfish, calculée à part). D'abord ce que le coup précédent de l'autre camp attaque (une pièce
// attaquée et pas assez défendue, ou sa menace d'au moins 2 points ou d'un mat) : si le coup y répond, on le dit en
// premier (protège, bouche la ligne, s'écarte, prend l'attaquant, pare l'échec, contre-attaque au lieu de défendre),
// puis ce qu'il fait d'autre. Sinon : roque, prise / reprise, échec, clouage, attaque, pion qui prend le centre /
// prépare un fianchetto / ouvre une diagonale / soutient / chasse, développement, grande diagonale, colonne ouverte,
// avant-poste… Sert aux lignes du répertoire qui n'avaient pas d'explication écrite à la main (leçons complètes),
// relues dans docs/LECONS-OUVERTURES.md.
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import { pieceWords, VALUE } from './words';
import { flipTurn } from './report/facts';
import type { SignpostThreat } from './signposts';

/** Ce qu'on sait du coup d'avant (de l'autre camp). */
export interface WhyContext {
  /** Position avant son coup, et son coup (SAN). */
  prev?: { fen: string; san: string };
  /** Sa menace « s'il rejouait » après ce coup (Stockfish : scripts/why-threats.json), ou null. */
  threat?: SignpostThreat | null;
  /** Menace de ce coup-ci (s'il rejouait après lui), et celle d'avant (après mon coup précédent) : un coup qui CRÉE
   *  une menace la nomme. */
  myThreat?: SignpostThreat | null;
  myThreatBefore?: SignpostThreat | null;
}

/** Une de mes pièces (ou une case, pour un mat) menacée par le coup d'avant ; `via` : sa menace (moteur) quand la
 *  pièce n'est pas encore attaquée (ex. fourchette …Nc2+). */
interface Danger {
  sq: Square; type: PieceSymbol | null; att: Square; attType: PieceSymbol; mate: boolean; via?: string;
  /** Tous ses attaquants (les plus chers d'abord). */
  atts?: PieceSymbol[];
  /** Fourchette vue par le moteur : la case où il la jouerait et ce qu'elle viserait. */
  fork?: { sq: Square; targets: PieceSymbol[] };
}

const PLURAL: Record<PieceSymbol, string> = { p: 'pions', n: 'cavaliers', b: 'fous', r: 'tours', q: 'dames', k: 'rois' };
/** « ta dame et ta tour », « ses deux cavaliers » (les plus chères d'abord). */
function piecesWords(types: PieceSymbol[], col: Color, me: Color): string {
  const order = [...new Set(types)].sort((a, b) => VALUE[b] - VALUE[a]);
  return list(order.map((t) => { const n = types.filter((x) => x === t).length; return n > 1 ? `${col === me ? 'tes' : 'ses'} ${n === 2 ? 'deux' : n} ${PLURAL[t]}` : pieceWords(t, col, me); }));
}

/** Pièces visées par la pièce arrivée en `sq` (roi compris) : fourchette si au moins deux. */
function forkTargets(pos: Chess, sq: Square, by: Color): { sq: Square; type: PieceSymbol }[] {
  const opp: Color = by === 'w' ? 'b' : 'w';
  const piece = pos.get(sq)!;
  return attackedBy(pos, sq, by).map((s) => ({ sq: s, p: pos.get(s) })).filter((x) => x.p && x.p.color === opp)
    .filter((x) => x.p!.type === 'k' || (VALUE[x.p!.type] >= 3 && (VALUE[x.p!.type] > VALUE[piece.type] || pos.attackers(x.sq, opp).length === 0)))
    .map((x) => ({ sq: x.sq, type: x.p!.type })).sort((a, b) => VALUE[b.type] - VALUE[a.type]);
}

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

const FEM_T: Record<PieceSymbol, boolean> = { p: false, n: false, b: false, r: true, q: true, k: false };

/** Cases strictement entre a et b (même ligne, colonne ou diagonale), sinon []. */
function between(a: string, b: string): string[] {
  const fa = a.charCodeAt(0), ra = Number(a[1]), fb = b.charCodeAt(0), rb = Number(b[1]);
  const df = Math.sign(fb - fa), dr = Math.sign(rb - ra);
  if (!(fa === fb || ra === rb || Math.abs(fb - fa) === Math.abs(rb - ra))) return [];
  const out: string[] = [];
  for (let f = fa + df, r = ra + dr; f !== fb || r !== rb; f += df, r += dr) out.push(String.fromCharCode(f) + r);
  return out;
}

/** Ma pièce (cavalier ou plus, vraiment menacée) qu'une de ses pièces à longue portée attaquait à travers `to`, et n'attaque plus. */
function blockedTarget(before: Chess, after: Chess, to: Square, by: Color): { sq: Square; type: PieceSymbol; by: PieceSymbol; line: string } | null {
  const opp: Color = by === 'w' ? 'b' : 'w';
  for (const row of after.board()) for (const p of row) {
    if (!p || p.color !== by || p.type === 'p' || p.type === 'k' || p.square === to) continue;
    for (const a of before.attackers(p.square, opp)) {
      const t = before.get(a)!.type;
      if (!'bqr'.includes(t) || !between(a, p.square).includes(to) || after.attackers(p.square, opp).includes(a)) continue;
      // Vraie menace seulement : attaquant moins cher que ma pièce, ou ma pièce sans défense.
      if (!(VALUE[t] < VALUE[p.type] || before.attackers(p.square, by).length === 0)) continue;
      const diag = a[0] !== p.square[0] && a[1] !== p.square[1];
      return { sq: p.square, type: p.type, by: t, line: diag ? 'la diagonale de' : a[0] === p.square[0] ? 'la colonne de' : 'la rangée de' };
    }
  }
  return null;
}

/** Mal défendue : sans défense, attaquée par moins cher qu'elle, ou plus d'attaquants que de défenseurs. */
function underDefended(pos: Chess, sq: Square, type: PieceSymbol, by: Color): boolean {
  const opp: Color = by === 'w' ? 'b' : 'w';
  const att = pos.attackers(sq, opp);
  if (!att.length) return false;
  const def = pos.attackers(sq, by).length;
  return def === 0 || Math.min(...att.map((a) => VALUE[pos.get(a)!.type])) < VALUE[type] || att.length > def;
}

/** Ce que le coup d'avant attaque : mes pièces nouvellement attaquées et mal défendues, puis sa menace (moteur). */
function dangersOf(fenBefore: string, by: Color, ctx: WhyContext): Danger[] {
  const now = new Chess(fenBefore);
  const opp: Color = by === 'w' ? 'b' : 'w';
  const out: Danger[] = [];
  if (ctx.prev) {
    const was = new Chess(ctx.prev.fen);
    for (const row of now.board()) for (const p of row) {
      if (!p || p.color !== by || p.type === 'k') continue;
      const fresh = now.attackers(p.square, opp).filter((a) => !was.attackers(p.square, opp).includes(a));
      if (!fresh.length || !underDefended(now, p.square, p.type, by)) continue;
      const att = fresh.sort((a, b) => VALUE[now.get(a)!.type] - VALUE[now.get(b)!.type])[0];
      out.push({ sq: p.square, type: p.type, att, attType: now.get(att)!.type, mate: false, atts: now.attackers(p.square, opp).map((a) => now.get(a)!.type) });
    }
  }
  if (ctx.threat) {
    try {
      const tm = new Chess(flipTurn(fenBefore)).move(ctx.threat.san);
      // La case visée : celle du mat, celle que son coup prend, ou une de mes pièces qu'il prend ensuite (fourchette).
      const cand = ctx.threat.mate || tm.captured ? tm.to : ctx.threat.captured?.sq;
      const piece = cand ? now.get(cand as Square) : null;
      if (cand && (ctx.threat.mate || (piece && piece.color === by))) {
        const sq = cand as Square;
        const direct = now.attackers(sq, opp).includes(tm.from as Square) || ctx.threat.mate;
        const same = out.find((d) => d.sq === sq);
        if (same) { if (ctx.threat.mate) Object.assign(same, { mate: true, att: tm.from as Square, attType: tm.piece }); }
        else {
          const played = new Chess(flipTurn(fenBefore)); played.move(ctx.threat.san);
          const ft = forkTargets(played, tm.to as Square, opp);
          out.push({ sq, type: piece && piece.color === by ? piece.type : null, att: tm.from as Square, attType: tm.piece, mate: !!ctx.threat.mate,
            ...(direct ? {} : { via: tm.san }), ...(!direct && ft.length >= 2 ? { fork: { sq: tm.to as Square, targets: ft.map((x) => x.type) } } : {}) });
        }
      }
    } catch { /* menace qui n'est plus jouable */ }
  }
  return out.sort((a, b) => Number(b.mate) - Number(a.mate) || VALUE[b.type ?? 'p'] - VALUE[a.type ?? 'p']);
}

/** Colonne libérée par une prise de pion : « s’ouvre » seulement sans aucun pion dessus, sinon « devient semi-ouverte ».
 *  Chaîne vide si un de mes pions y reste. */
function fileOpened(c: Chess, file: string, by: Color, me: Color): string {
  const pawns = c.board().flat().filter((p) => p && p.type === 'p' && p.square[0] === file);
  if (pawns.some((p) => p!.color === by)) return '';
  const who = by === me ? 'tes' : 'ses';
  return pawns.length ? `la colonne ${file} devient semi-ouverte pour ${who} tours` : `la colonne ${file} s’ouvre pour ${who} tours`;
}

/** Matériel égal sur l'échiquier (pièces et pions, rois exclus). */
export function materialEqual(c: Chess): boolean {
  let w = 0, b = 0;
  for (const p of c.board().flat()) if (p && p.type !== 'k') { if (p.color === 'w') w += VALUE[p.type]; else b += VALUE[p.type]; }
  return w === b;
}

/** Le pion arrive en g3/b3/g6/b6 et le fou de ce côté est encore sur sa case d'origine : il prépare vraiment le fianchetto. */
function fianchettoReady(c: Chess, to: string, by: Color): boolean {
  if (!['g3', 'b3', 'g6', 'b6'].includes(to)) return false;
  const home = ((to[0] === 'g' ? 'f' : 'c') + (by === 'w' ? '1' : '8')) as Square;
  const b = c.get(home);
  return !!b && b.type === 'b' && b.color === by;
}

const lineWord = (a: string, b: string) => (a[0] !== b[0] && a[1] !== b[1] ? 'la diagonale de' : a[0] === b[0] ? 'la colonne de' : 'la rangée de');

/** Une phrase : pourquoi ce coup (du point de vue de `me` : « ton » / « son »). `ctx` : le coup d'avant et sa menace,
 *  et la menace que ce coup crée (nommée). */
export function moveWhy(fenBefore: string, san: string, me: Color, ctx: WhyContext = {}): string {
  const base = describe(fenBefore, san, me, ctx);
  const t = ctx.myThreat;
  if (!t || (ctx.myThreatBefore && ctx.myThreatBefore.san === t.san)) return base;   // pas une menace nouvelle
  const c = new Chess(fenBefore);
  const m = c.move(san);
  const by = m.color;
  const opp: Color = by === 'w' ? 'b' : 'w';
  let tm: Move;
  const again = new Chess(flipTurn(c.fen()));
  try { tm = again.move(t.san); } catch { return base; }
  // Le coup y participe : c'est la pièce qui menace, elle soutient la case visée, ou elle ouvre la ligne.
  const helps = tm.from === m.to || new Chess(flipTurn(c.fen())).attackers(tm.to as Square, by).includes(m.to as Square) || between(tm.from, tm.to).includes(m.from);
  if (!helps) return base;
  const P = (x: PieceSymbol, col: Color) => pieceWords(x, col, me);
  const bare = t.san.replace(/[+#]$/, '');
  // Seulement ce qui apporte quelque chose : un mat, une fourchette, ou une prise que la phrase ne dit pas déjà
  // (« chasse son fou c5 » suffit). Une menace plus lointaine (deux coups) n'est pas nommée.
  let what: string;
  const ft = forkTargets(again, tm.to as Square, by);
  const kind = t.mate ? 'mate' : ft.length >= 2 ? 'fork' : tm.captured ? 'take' : null;
  if (!kind) return base;
  if (kind === 'take' && base.includes(tm.to)) return base;
  if (t.mate === 1) what = `${bare} mat`;
  else if (t.mate) what = `un mat en ${t.mate} coups, en commençant par ${t.san}`;
  else if (kind === 'fork') what = `${t.san}, fourchette sur ${list(ft.map((x) => (x.type === 'k' ? P('k', opp) : `${P(x.type, opp)} ${x.sq}`)))}`;
  else what = `de prendre ${P(tm.captured as PieceSymbol, opp)} ${tm.to}`;
  const reply = defense(fenBefore, new Chess(c.fen()), m, me, ctx, ctx.prev ? new Chess(ctx.prev.fen).move(ctx.prev.san) : undefined);
  const pron = m.piece === 'p' ? 'il' : FEM_T[m.piece] ? 'elle' : 'il';
  const partner = tm.from !== m.to ? `avec ${P(tm.piece, by)} ${tm.from}, ` : '';
  const subj = m.piece === 'p' ? `Le pion ${m.to}` : cap(P(m.piece, by));
  const discovers = tm.from !== m.to && between(tm.from, tm.to).includes(m.from);
  const alone = discovers
    ? `${subj}${m.piece === 'p' ? '' : ` va en ${m.to} et`} ouvre ${lineWord(tm.from, tm.to)} ${P(tm.piece, by)} ${tm.from}, qui menace ${what}.`
    : m.piece === 'p'
      ? (partner ? `${subj} : ${partner}il menace ${what}.` : `${subj} menace ${what}.`)
      : (partner ? `${subj} va en ${m.to} : ${partner}${pron} menace ${what}.` : `${subj} va en ${m.to} et menace ${what}.`);
  const stem = base.replace(/\.$/, '');
  let out: string;
  if (reply) out = `${stem} ; ${partner}${pron} menace aussi ${what}.`;
  else if (m.captured) out = /[:;]/.test(stem) ? `${stem} ; ${partner}${pron} menace aussi ${what}.` : partner ? `${stem} : ${partner}${pron} menace ${what}.` : `${stem} et menace ${what}.`;
  else out = alone;
  return out.length <= 160 ? out : alone;
}

function describe(fenBefore: string, san: string, me: Color, ctx: WhyContext): string {
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
  const prevMove = ctx.prev ? new Chess(ctx.prev.fen).move(ctx.prev.san) : undefined;
  const reply = defense(fenBefore, c, m, me, ctx, prevMove);
  if (reply) return reply;

  // Roques
  if (m.isKingsideCastle() || m.isQueensideCastle()) {
    const what = m.isKingsideCastle() ? 'Petit roque' : 'Grand roque';
    return mine ? `${what} : ton roi se met à l’abri et ta tour se rapproche du centre.` : `${what} : son roi se met à l’abri.`;
  }
  // Prises
  if (m.captured) {
    const victim = P(m.captured as PieceSymbol, opp);
    if (prevMove && prevMove.to === m.to && prevMove.captured) return `${subj} reprend en ${m.to}${chk}${materialEqual(c) ? ' : le matériel reste égal' : ''}.`;
    if (m.piece === 'p' && m.captured === 'p') {
      const opened = fileOpened(c, m.from[0], by, me);
      return `${subj} prend ${victim} ${m.to}${chk}${opened ? ` : ${opened}` : ''}.`;
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
  // Interposition : sa dame / tour / fou attaquait une de mes pièces (cavalier ou plus) à travers la case d'arrivée.
  const blocked = blockedTarget(new Chess(fenBefore), c, m.to as Square, by);
  if (blocked) return `${m.piece === 'p' ? `Le pion ${m.to}` : subj} bouche ${blocked.line} ${P(blocked.by, opp)} : ${P(blocked.type, by)} ${blocked.sq} n’est plus attaqué${FEM_T[blocked.type] ? 'e' : ''}.`;
  if (freed && c.get(freed as Square)) return `${subj} va en ${m.to} : ${P(c.get(freed as Square)!.type, by)} ${freed} n’est plus cloué${c.get(freed as Square)!.type === 'q' || c.get(freed as Square)!.type === 'r' ? 'e' : ''}.`;
  const attacked = attackedBy(c, m.to as Square, by);
  // Cibles : une pièce plus précieuse ou non défendue, ou le pion f7 / f2 (roque pas encore fait).
  const targets = attacked.map((s) => ({ s, p: c.get(s) })).filter((x) => x.p && x.p.color === opp && x.p.type !== 'k')
    .filter((x) => VALUE[x.p!.type] > VALUE[m.piece] || c.attackers(x.s, opp).length === 0)
    .sort((a, b) => VALUE[b.p!.type] - VALUE[a.p!.type]);

  if (m.piece === 'p') {
    const t = targets[0];
    if (t) return `Le pion ${m.to} ${t.p!.type === 'p' ? 'attaque' : 'chasse'} ${P(t.p!.type, opp)} ${t.s}.`;
    if (fianchettoReady(c, m.to, by)) return `Le pion ${m.to} prépare le fianchetto ${mine ? 'de ton' : 'de son'} fou en ${m.to[0]}${by === 'w' ? '2' : '7'}.`;
    if ((m.to === 'h3' || m.to === 'h6' || m.to === 'a3' || m.to === 'a6')) {
      // Un fait seulement : la case contrôlée (et la case libérée à côté du roi roqué de ce côté).
      const g = (m.to[0] === 'h' ? 'g' : 'b') + (by === 'w' ? '4' : '5');
      const freedSq = m.from as Square;
      const king = c.board().flat().find((p) => p && p.type === 'k' && p.color === by)!;
      const nextToKing = Math.abs(king.square.charCodeAt(0) - freedSq.charCodeAt(0)) <= 1 && Math.abs(Number(king.square[1]) - Number(freedSq[1])) <= 1;
      return `Le pion ${m.to} contrôle ${g}${nextToKing && !c.get(freedSq) ? ` et libère ${freedSq} pour ${mine ? 'ton' : 'son'} roi` : ''}.`;
    }
    const supports = attacked.filter((s) => { const p = c.get(s); return p && p.color === by; }).map((s) => ({ ...c.get(s)!, square: s }));
    const centerHits = attacked.filter((s) => CENTER.includes(s));
    if (WIDE_CENTER.has(m.to) && Math.abs(Number(m.to[1]) - Number(m.from[1])) === 2) {
      return `Le pion ${m.to} prend de l’espace au centre${centerHits.length ? ` et surveille ${list(centerHits)}` : ''}.`;
    }
    // Une pièce attaquée qu'il protège d'abord (la plus chère), sinon le premier soutien.
    const hit = supports.filter((x) => x.type !== 'p' && c.attackers(x.square, opp).length > 0).sort((a, b) => VALUE[b.type] - VALUE[a.type])[0];
    if (hit) {
      const a = c.attackers(hit.square, opp).map((s) => ({ s, p: c.get(s)! })).sort((x, y) => VALUE[x.p.type] - VALUE[y.p.type])[0];
      return `Le pion ${m.to} protège ${P(hit.type, by)} ${hit.square}, attaqué${FEM_T[hit.type] ? 'e' : ''} par ${P(a.p.type, opp)} ${a.s}.`;
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
    return `${subj} vient en ${m.to} et se place sur la colonne ${file}.`;
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
      return `${subj} sort en ${m.to} : avec ${mine ? 'ton' : 'son'} fou ${bSq}, elle prépare ${by === 'w' ? '' : '…'}B${hSq}, qui propose l’échange de ${mine ? 'son' : 'ton'} fou ${fSq}.`;
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

/**
 * Réponse au coup d'avant : pare l'échec, prend l'attaquant, s'écarte, bouche la ligne, protège ; sinon contre-attaque
 * au lieu de défendre. null : le coup ne répond à rien (ou c'est une reprise : « reprend », plus clair).
 */
function defense(fenBefore: string, c: Chess, m: Move, me: Color, ctx: WhyContext, prevMove?: Move): string | null {
  if (m.isKingsideCastle() || m.isQueensideCastle()) return null;
  if (prevMove && prevMove.captured && m.captured && prevMove.to === m.to) return null;      // reprise
  const before = new Chess(fenBefore);
  const by = m.color;
  const opp: Color = by === 'w' ? 'b' : 'w';
  const P = (t: PieceSymbol, col: Color) => pieceWords(t, col, me);
  const subj = m.piece === 'p' && !m.captured ? `Le pion ${m.to}` : cap(P(m.piece, by));
  const pron = FEM_T[m.piece] ? 'elle' : 'il';
  const homeRank = by === 'w' ? '1' : '8';
  const centerHits = attackedBy(c, m.to as Square, by).filter((s) => CENTER.includes(s));
  // Ce que le coup fait d'autre (ajouté si la phrase reste courte) : `and` → « , et prépare… », `also` → « ; il
  // prépare aussi… ». `skip` : la case déjà nommée (pas de « surveille aussi e5 » après « protège ton pion e5 »).
  const tail = (kind: 'and' | 'also', skip?: Square): string => {
    const join = (verb: string, rest: string) => (kind === 'and' ? `, et ${verb} ${rest}` : ` ; ${pron} ${verb} aussi ${rest}`);
    if (m.piece === 'p') {
      if (m.captured === 'p') { const opened = fileOpened(c, m.from[0], by, me); if (opened) return `, et ${opened}`; }
      if (fianchettoReady(c, m.to, by)) return join('prépare', `le fianchetto ${by === me ? 'de ton' : 'de son'} fou en ${m.to[0]}${by === 'w' ? '2' : '7'}`);
      if (WIDE_CENTER.has(m.to) && Math.abs(Number(m.to[1]) - Number(m.from[1])) === 2) return join('prend', 'de l’espace au centre');
      for (const b of c.board().flat().filter((p) => p && p.type === 'b' && p.color === by && p.square[1] === homeRank)) {
        if (attackedBy(c, b!.square, by).length > attackedBy(before, b!.square, by).length) return join('ouvre', `la diagonale ${by === me ? 'de ton' : 'de son'} fou ${b!.square}`);
      }
      return '';
    }
    const hits = centerHits.filter((x) => x !== skip);
    return hits.length ? ` ; ${pron} surveille aussi ${list(hits)}` : '';
  };
  /** Ce que la pièce fait en arrivant : clouage, puis attaque d'une pièce (plus chère ou sans défense). */
  const bonus = (): string => {
    if ('brq'.includes(m.piece)) {
      const pin = pinOf(c, m.to as Square, m.piece, by);
      if (pin) return ` et cloue ${P(pin.type, opp)} ${pin.pinned} sur ${pin.behind === 'k' ? (by === me ? 'son roi' : 'ton roi') : (by === me ? 'sa dame' : 'ta dame')}`;
    }
    const t = attackedBy(c, m.to as Square, by).map((x) => ({ x, p: c.get(x) })).filter((y) => y.p && y.p.color === opp && y.p.type !== 'k')
      .filter((y) => VALUE[y.p!.type] > VALUE[m.piece] || c.attackers(y.x, opp).length === 0).sort((a, b) => VALUE[b.p!.type] - VALUE[a.p!.type])[0];
    return t ? ` et ${m.piece === 'p' && t.p!.type !== 'p' ? 'chasse' : 'attaque'} ${P(t.p!.type, opp)} ${t.x}` : '';
  };
  // Les idées à garder d'abord : le clouage que le coup crée, ou celui qu'il défait.
  const pinNow = 'brq'.includes(m.piece) ? pinOf(c, m.to as Square, m.piece, by) : null;
  const pinsOn = (pos: Chess) => pos.board().flat().filter((p) => p && p.color === opp && 'brq'.includes(p.type))
    .map((p) => pinOf(pos, p!.square, p!.type, opp)).filter((x) => x).map((x) => x!.pinned);
  const freed = pinsOn(before).filter((sq) => sq !== m.from).find((sq) => !pinsOn(c).includes(sq) && c.get(sq as Square));
  const keep = (t: string): string => {
    if (pinNow && !t.includes('cloue')) return `, et cloue ${P(pinNow.type, opp)} ${pinNow.pinned} sur ${pinNow.behind === 'k' ? (by === me ? 'son roi' : 'ton roi') : (by === me ? 'sa dame' : 'ta dame')}`;
    if (freed) { const f = c.get(freed as Square)!; return ` ; ${P(f.type, by)} ${freed} n’est plus cloué${FEM_T[f.type] ? 'e' : ''}`; }
    return '';
  };
  const done = (t: string, kind: 'and' | 'also' | null = 'and', skip?: Square) => {
    const x = kind ? t + (keep(t) || tail(kind, skip)) : t;
    return (x.length <= 158 ? x : t) + '.';
  };
  const chk = c.inCheck() ? ' avec échec' : '';

  // En échec : il faut d'abord parer.
  if (before.inCheck()) {
    const checker = before.attackers(before.board().flat().find((p) => p && p.type === 'k' && p.color === by)!.square, opp)[0];
    const ck = checker ? P(before.get(checker)!.type, opp) : '';
    if (m.piece === 'k') return done(`${subj} sort de l’échec en ${m.to}`, null);
    if (m.captured && m.to === checker) return done(`${subj} prend ${ck} ${m.to}, qui donnait échec`);
    return done(`${subj} pare l’échec de ${ck} en ${m.to}${m.from[1] === homeRank && m.piece !== 'p' ? ' et se développe' : ''}`, null);
  }

  const dangers = dangersOf(fenBefore, by, ctx);
  if (!dangers.length) return null;
  for (const d of dangers) {
    const X = d.type ? `${P(d.type, by)} ${d.sq}` : `la case ${d.sq}`;
    const A = P(d.attType, opp);
    const e = d.type && FEM_T[d.type] ? 'e' : '';
    const att = d.via ? `menacé${e} par ${A} (${d.via})` : `attaqué${e} par ${piecesWords(d.atts ?? [d.attType], opp, me)}`;
    const what = d.mate ? `plus de menace de mat en ${d.sq}` : `${X} n’est plus ${d.via ? `menacé${e}` : `attaqué${e}`}`;
    // Prend l'attaquant.
    if (m.captured && m.to === d.att) return done(`${subj} prend ${A} ${m.to}${chk}, qui ${d.mate ? `menaçait de mater en ${d.sq}` : `attaquait ${X}`}`);
    // La pièce visée part : elle prend, avance (pion) ou s'écarte.
    if (!d.mate && d.type && m.from === d.sq) {
      const who = `${cap(P(d.type, by))}${d.type === 'p' ? ` ${d.sq}` : ''}, ${att},`;
      if (m.captured) return done(`${who} prend ${P(m.captured as PieceSymbol, opp)} ${m.to}${chk}`, null);
      return done(`${who} ${d.type === 'p' ? 'avance' : 's’écarte'} en ${m.to}${bonus()}`, 'also');
    }
    // Bouche la ligne (de l'attaquant, ou d'une pièce à longue portée qui soutient la menace de mat).
    const sliders = [d.att, ...(d.mate ? before.attackers(d.sq, opp) : [])].filter((sq, i, a) => a.indexOf(sq) === i && 'bqr'.includes(before.get(sq as Square)?.type ?? ''));
    const cut = sliders.find((sq) => between(sq, d.sq).includes(m.to) && !c.attackers(d.sq, opp).includes(sq as Square));
    if (cut) {
      const ct = before.get(cut as Square)!.type;
      // Une autre de ses pièces derrière, sur la même ligne (batterie) ?
      const f0 = Math.sign(cut.charCodeAt(0) - d.sq.charCodeAt(0)), r0 = Math.sign(Number(cut[1]) - Number(d.sq[1]));
      const diag = f0 !== 0 && r0 !== 0;
      let behind: PieceSymbol | null = null;
      for (let f = cut.charCodeAt(0) + f0, r = Number(cut[1]) + r0; f >= 97 && f <= 104 && r >= 1 && r <= 8; f += f0, r += r0) {
        const q = before.get((String.fromCharCode(f) + r) as Square);
        if (!q) continue;
        if (q.color === opp && (q.type === 'q' || q.type === (diag ? 'b' : 'r'))) behind = q.type;
        break;
      }
      const still = !d.mate && c.attackers(d.sq, opp).length > 0;
      // « elle » seulement si le sujet n'est pas lui aussi féminin (sinon on nomme sa pièce).
      const who = FEM_T[ct] !== FEM_T[m.piece] ? (FEM_T[ct] ? 'elle' : 'il') : P(ct, opp);
      const res = still ? `${who} ne vise plus ${X}` : what;
      return done(`${subj} bouche ${lineWord(cut, d.sq)} ${P(ct, opp)}${behind ? `, avec ${P(behind, opp)} derrière ${FEM_T[ct] ? 'elle' : 'lui'}` : ''} : ${res}`, 'also', d.sq);
    }
    // Garde la case de sa fourchette (vue par le moteur).
    if (d.fork && c.attackers(d.fork.sq, by).includes(m.to as Square)) {
      return done(`${subj} ${m.piece === 'p' ? '' : `va en ${m.to} et `}garde ${d.fork.sq} : plus de fourchette ${d.via} sur ${list(d.fork.targets.map((t) => pieceWords(t, by, me)))}`, null);
    }
    // Protège (et la pièce n'est plus mal défendue).
    if (c.attackers(d.sq, by).includes(m.to as Square) && (d.mate || d.via || (d.type && !underDefended(c, d.sq, d.type, by)))) {
      const how = d.mate ? `protège ${d.sq} contre la menace de mat` : `protège ${X}, ${att}`;
      return done(m.piece === 'p' ? `${subj} ${how}` : `${subj} va en ${m.to} et ${how}`, m.piece === 'p' ? 'and' : 'also', d.sq);
    }
  }
  // Rien ne pare : contre-attaque au lieu de défendre.
  const d = dangers.find((x) => x.type) ?? dangers[0];
  const X = d.type ? `${P(d.type, by)} ${d.sq}` : `la case ${d.sq}`;
  const instead = d.mate ? `au lieu de parer la menace de mat en ${d.sq}` : `au lieu de défendre ${X}`;
  if (d.via) return null;                         // menace seulement vue par le moteur : pas de « au lieu de »
  if (m.captured) return done(`${subj} prend ${P(m.captured as PieceSymbol, opp)} ${m.to}${chk} ${instead}`, null);
  if (c.inCheck()) return done(`${subj} donne échec en ${m.to} ${instead}`, null);
  const target = attackedBy(c, m.to as Square, by).map((s) => ({ s, p: c.get(s) })).filter((x) => x.p && x.p.color === opp && x.p.type !== 'k')
    .filter((x) => !before.attackers(x.s, by).includes(m.from as Square))
    .filter((x) => VALUE[x.p!.type] > VALUE[m.piece] || c.attackers(x.s, opp).length === 0)
    .sort((a, b) => VALUE[b.p!.type] - VALUE[a.p!.type])[0];
  if (target && (d.mate || VALUE[target.p!.type] >= VALUE[d.type ?? 'p'])) return done(`${subj} ${m.piece === 'p' ? '' : `va en ${m.to} et `}contre-attaque ${P(target.p!.type, opp)} ${target.s} ${instead}`, null);
  return null;
}
