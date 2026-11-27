// Rapport Markdown « pour Claude » : texte structuré, sans image, faits calculés.
import { Chess } from 'chess.js';
import type { Card, Game, MoveAnalysis } from '../../db';
import { asciiBoard, moveLabel, phaseOf, type Phase } from './facts';
import { MOTIF_LABEL, MOTIF_ORDER, DETAIL_DEPTH, LINE_PLIES, type Motif } from './motifs';
import { SEVERITY_LABEL, THRESHOLDS } from '../winpct';
import { RATING_MAX, RATING_MIN, RATING_START } from '../rating';
import { accuracyOfGame } from '../accuracy';
import { stayedUntil } from '../bookLabel';
import type { BookExit } from '../repertoire';
import { CHAPTERS, chapterValidated, LEVELS, passesNeeded, type BoardProgress } from '../board/levels';
import { weakestSquares, type SquareStats } from '../board/stats';
import { colorName as squareColor } from '../board/geometry';
import { THOUGHT_LABEL, THOUGHT_ORDER, THOUGHT_SHORT, type ThoughtTag } from '../thoughts';
import { THREAT_MIN_GAIN, THREAT_TOLERANCE } from '../threat';

export type PeriodKind = 'since-last' | '7-days' | '20-games';

export interface Period { kind: PeriodKind; from: number | null; label: string }

const DAY = 86400000;
const fmtDate = (t: number) => new Date(t).toLocaleDateString('fr-FR');
const fmtDateTime = (t: number) => new Date(t).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
const r0 = (x: number) => Math.round(x);
const signed = (x: number) => (x > 0 ? `+${x}` : `${x}`);
const pct = (a: number, b: number) => (b ? `${r0((100 * a) / b)} %` : '–');
const avg = (a: number, b: number) => (b ? (a / b).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) : '–');
const colorName = (c: 'w' | 'b') => (c === 'w' ? 'Blancs' : 'Noirs');
const isError = (a: MoveAnalysis) => a.severity === 'mistake' || a.severity === 'blunder';
const NAG: Record<string, string> = { inaccuracy: '?!', mistake: '?', blunder: '??' };
const isImported = (g: Game) => g.source === 'chesscom';
const sourceName = (g: Game) => (isImported(g) ? (g.ext?.site === 'pgn' ? 'PGN importé' : 'Chess.com') : 'Maia');
const oppName = (g: Game) => (isImported(g)
  ? `${g.ext?.opp.name ?? 'adversaire'}${g.ext?.opp.rating ? ` (${g.ext.opp.rating})` : ''}`
  : `Maia-3${g.botElo ? ` (${r0(g.botElo)})` : ''}`);
const resultWord = (g: Game) => (g.score === 1 ? 'Victoire' : g.score === 0 ? 'Défaite' : 'Nulle');
const moveNo = (ply: number) => `${Math.floor(ply / 2) + 1}${ply % 2 ? '…' : '.'}`;
/** Nombre de coups de chaque camp où je dois être resté dans mon répertoire. */
export const REP_MOVES = 8;

/** Suivi de mon répertoire dans une partie : première sortie et nom de l'ouverture suivie. */
export interface RepInfo { exit?: BookExit | null; name?: string }

/** Le suivi du répertoire, en clair, pour le rapport. */
export function repText(exit: BookExit | null | undefined): string {
  if (exit === undefined) return '–';
  if (exit === null) return 'suivi jusqu’au bout';
  if (exit.ply === 0) return exit.by === 'me' ? `hors répertoire dès le 1er coup (${exit.playedSan} au lieu de ${exit.expectedSan.join(' ou ')})` : `adversaire hors répertoire dès le 1er coup (${exit.playedSan})`;
  if (exit.by === 'end') return `suivi jusqu’à la fin de la ligne (coup ${moveNo(exit.ply)})`;
  if (exit.by === 'opponent') return `suivi ; adversaire sorti au coup ${moveNo(exit.ply)} (${exit.playedSan})`;
  return `**sorti au coup ${moveNo(exit.ply)}** (${exit.playedSan} au lieu de ${exit.expectedSan.join(' ou ')})`;
}

/** Parties de la période (triées par date). */
export function selectGames(all: Game[], kind: PeriodKind, lastReportAt: number | null, now: number): { games: Game[]; period: Period } {
  const sorted = [...all].sort((a, b) => a.date - b.date);
  if (kind === '7-days') {
    const from = now - 7 * DAY;
    return { games: sorted.filter((g) => g.date >= from), period: { kind, from, label: `7 derniers jours (depuis le ${fmtDate(from)})` } };
  }
  if (kind === '20-games') {
    const games = sorted.slice(-20);
    return { games, period: { kind, from: games[0]?.date ?? null, label: '20 dernières parties' } };
  }
  const games = lastReportAt ? sorted.filter((g) => g.date > lastReportAt) : sorted;
  return {
    games,
    period: { kind, from: lastReportAt, label: lastReportAt ? `depuis le dernier rapport (${fmtDateTime(lastReportAt)})` : 'toutes les parties (premier rapport)' },
  };
}

export interface ErrorRow { game: Game; gameNo: number; a: MoveAnalysis; phase: Phase; fenBefore: string; oppLast: string | null }

function rowsOf(games: Game[], numberOf: (g: Game) => number, keep: (a: MoveAnalysis) => boolean): ErrorRow[] {
  const rows: ErrorRow[] = [];
  for (const g of games) {
    if (!g.analysis) continue;
    const c = new Chess(g.startFen);
    const fens = [c.fen()];
    for (const u of g.uci) { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); fens.push(c.fen()); }
    for (const a of g.analysis) {
      if (!keep(a)) continue;
      rows.push({ game: g, gameNo: numberOf(g), a, phase: phaseOf(a.ply, fens[a.ply]), fenBefore: fens[a.ply], oppLast: a.ply > 0 ? moveLabel(a.ply - 1, g.san[a.ply - 1]) : null });
    }
  }
  return rows.sort((x, y) => y.a.drop - x.a.drop || x.gameNo - y.gameNo || x.a.ply - y.a.ply);
}

/** Erreurs et gaffes de la période, de la pire à la moins grave (chute de win%). */
export function worstErrors(games: Game[], numberOf: (g: Game) => number, n = 10): ErrorRow[] {
  return rowsOf(games, numberOf, isError).slice(0, n);
}

/**
 * Mes coups les plus coûteux : erreurs et gaffes (au plus `n`), complétées par mes imprécisions
 * jusqu'à `min` s'il y a moins de `min` erreurs et gaffes ; tri par chute de win%.
 */
export function costliestMoves(games: Game[], numberOf: (g: Game) => number, n = 10, min = 5): ErrorRow[] {
  const errs = worstErrors(games, numberOf, n);
  if (errs.length >= min) return errs;
  const inacc = rowsOf(games, numberOf, (a) => a.severity === 'inaccuracy').slice(0, min - errs.length);
  return [...errs, ...inacc].sort((x, y) => y.a.drop - x.a.drop || x.gameNo - y.gameNo || x.a.ply - y.a.ply);
}

/** Imprécisions nécessaires pour compléter « Mes coups les plus coûteux » (leur détail Stockfish est à calculer). */
export function inaccuraciesToDetail(games: Game[], min = 5): { gameId: number; ply: number }[] {
  const numberOf = (g: Game) => g.id ?? 0;
  return costliestMoves(games, numberOf, 10, min).filter((r) => r.a.severity === 'inaccuracy' && !r.a.detail).map((r) => ({ gameId: r.game.id!, ply: r.a.ply }));
}

/** « Mes parties » : au plus `n`, d'abord les défaites, puis les nulles, puis les victoires (les plus récentes d'abord). */
export function gamesToShow(games: Game[], n = 5): Game[] {
  const recent = [...games].sort((a, b) => b.date - a.date);
  return [0, 0.5, 1].flatMap((sc) => recent.filter((g) => g.score === sc)).slice(0, n);
}

/** « Ce que je pensais » d'un coup : réponse en un toucher et/ou texte libre (null si rien). */
export function thoughtText(g: Game, ply: number): string | null {
  const tag = g.thoughtTags?.[ply];
  const txt = g.thoughts?.[ply];
  if (!tag && !txt) return null;
  return [tag ? THOUGHT_LABEL[tag] : null, txt ? `« ${txt} »` : null].filter(Boolean).join(' — ');
}

/** PGN annoté : ?! ? ?? et win% sur mes coups, « ce que je pensais » en commentaire. */
export function annotatedPgn(g: Game, gameNo: number): string {
  const byPly = new Map((g.analysis ?? []).map((a) => [a.ply, a]));
  const me = isImported(g)
    ? `Moi (${g.ext?.me.name ?? 'moi'}${g.ext?.me.rating ? `, ${g.ext.me.rating}` : ''})`
    : 'Moi' + (g.ratingBefore ? ` (${r0(g.ratingBefore)})` : '');
  const bot = oppName(g);
  const d = new Date(g.date);
  const head = [
    ['Event', isImported(g) ? `${sourceName(g)} — partie n°${gameNo}` : `Sparring Échecs — partie n°${gameNo}`],
    ...(g.ext?.url ? [['Site', g.ext.url]] : []),
    ['Date', `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`],
    ['White', g.myColor === 'w' ? me : bot],
    ['Black', g.myColor === 'b' ? me : bot],
    ['Result', g.result],
    ['Termination', g.termination],
    ...(g.ext?.timeControl ? [['TimeControl', g.ext.timeControl]] : []),
  ].map(([k, v]) => `[${k} "${v.replace(/"/g, "'")}"]`).join('\n');
  const parts: string[] = [];
  g.san.forEach((s, i) => {
    const a = byPly.get(i);
    // Un coup noir qui suit un commentaire reprend son numéro (« 5... »).
    const num = i % 2 === 0 ? `${i / 2 + 1}. ` : byPly.has(i - 1) ? `${Math.floor(i / 2) + 1}... ` : '';
    let tok = num + s + (a && a.severity !== 'ok' ? NAG[a.severity] : '');
    if (a) {
      const thought = thoughtText(g, i);
      const wp = a.severity === 'ok' ? `win% ${r0(a.wpAfter)}` : `win% ${r0(a.wpBefore)}→${r0(a.wpAfter)}${a.bestSan ? `, meilleur : ${a.bestSan}` : ''}`;
      tok += ` {${wp}${thought ? `. Je pensais : ${thought.replace(/[{}]/g, '')}` : ''}}`;
    }
    parts.push(tok);
  });
  return `${head}\n\n${parts.join(' ')} ${g.result}`;
}

/** Coups par lesquels l'adversaire sort de mon répertoire, vus au moins 2 fois (même position, même coup). */
export function opponentExits(games: Game[], rep: Record<number, RepInfo>, min = 2): string[] {
  const seen = new Map<string, { line: string; n: number; color: 'w' | 'b' }>();
  for (const g of games) {
    const e = rep[g.id!]?.exit;
    if (!e || e.by !== 'opponent') continue;
    const k = `${g.myColor} ${e.fenBefore.split(' ').slice(0, 4).join(' ')} ${e.playedSan}`;
    const line = g.san.slice(0, e.ply + 1).map((m, i) => (i === e.ply ? `**${i % 2 ? `${moveNo(i)} ` : `${moveNo(i)}`}${m}**` : `${i % 2 ? '' : moveNo(i)}${m}`)).join(' ');
    const x = seen.get(k) ?? { line, n: 0, color: g.myColor };
    x.n++;
    seen.set(k, x);
  }
  const often = [...seen.values()].filter((x) => x.n >= min).sort((a, b) => b.n - a.n);
  return ['#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)', '',
    ...(often.length ? often.map((x) => `- ${x.line} : ${x.n} fois (j’avais les ${colorName(x.color)})`) : ['Aucun coup vu 2 fois sur la période.']), ''];
}

/**
 * « Ce que je pensais » (réponses en un toucher dans la revue) sur mes erreurs et gaffes, compté par motif.
 * Colonnes : les 5 réponses + « sans réponse » ; lignes : les motifs (+ « motif non calculé » s'il y en a).
 */
export function thoughtTable(games: Game[]): string[] {
  type Row = Record<ThoughtTag | 'none', number>;
  const empty = (): Row => ({ menace: 0, calcul: 0, 'autre-cible': 0, 'trop-vite': 0, 'sais-pas': 0, none: 0 });
  const rows = new Map<Motif | 'none', Row>([...MOTIF_ORDER.map((m) => [m, empty()] as const), ['none', empty()]]);
  let answered = 0, total = 0;
  for (const g of games) {
    for (const a of g.analysis ?? []) {
      if (!isError(a)) continue;
      total++;
      const tag = g.thoughtTags?.[a.ply];
      if (tag) answered++;
      rows.get(a.detail?.motif ?? 'none')![tag ?? 'none']++;
    }
  }
  const out = ['### Ce que je pensais (réponse en un toucher), par motif', '',
    `Réponses données sur ${answered} de mes ${total} erreur${total > 1 ? 's' : ''} et gaffe${total > 1 ? 's' : ''} (dans la revue, avant de voir le meilleur coup).`, '',
    `| Motif | ${THOUGHT_ORDER.map((t) => THOUGHT_SHORT[t]).join(' | ')} | Sans réponse |`,
    `|---|${THOUGHT_ORDER.map(() => '---|').join('')}---|`];
  const sum = empty();
  for (const [m, r] of rows) {
    const n = THOUGHT_ORDER.reduce((x, t) => x + r[t], r.none);
    if (m === 'none' && n === 0) continue;
    for (const k of Object.keys(sum) as (keyof Row)[]) sum[k] += r[k];
    out.push(`| ${m === 'none' ? 'Motif non calculé' : MOTIF_LABEL[m]} | ${THOUGHT_ORDER.map((t) => r[t]).join(' | ')} | ${r.none} |`);
  }
  out.push(`| **Total** | ${THOUGHT_ORDER.map((t) => `**${sum[t]}**`).join(' | ')} | **${sum.none}** |`, '');
  out.push(`Réponses : ${THOUGHT_ORDER.map((t) => `${THOUGHT_SHORT[t]} = « ${THOUGHT_LABEL[t]} »`).join(' ; ')}.`, '');
  return out;
}

export interface ReportInput {
  now: number;
  period: Period;
  games: Game[];          // parties de la période, analysées, triées par date
  allGames: Game[];       // toutes les parties (numérotation stable)
  cards: Card[];
  /** Suivi de mon répertoire, par identifiant de partie. */
  rep?: Record<number, RepInfo>;
  /** Mes ouvertures actives (pour les définitions). */
  repertoire?: { name: string; color: 'w' | 'b' }[];
  /** Mode « Maîtrise de l'échiquier » : progression et statistiques par case. */
  board?: { progress: BoardProgress; stats: SquareStats; today: string };
  /** « Jouer les lignes » : par ouverture, lignes validées dans le tour et erreurs. */
  lines?: LinesReport[];
  /** « Mon objectif » : objectif actif et sa progression. */
  goal?: GoalReport;
  /** Pièges d'ouverture : état par piège et pièges où je suis tombé dans mes parties. */
  traps?: TrapsReport;
}

export interface TrapsReport {
  rows: { name: string; chapter: string; status: string; defend: { clean: number; n: number }; punish: { clean: number; n: number } }[];
  falls: { name: string; gameNo: number; date: number; move: string; source: string }[];
}

/** Section « Pièges d'ouverture » : maîtrisés / en cours, puis les pièges où je suis tombé dans mes vraies parties. */
export function trapsSection(t: TrapsReport): string[] {
  const n = (s: string) => t.rows.filter((r) => r.status === s).length;
  const L: string[] = ['## 8. Pièges d’ouverture', '',
    `Maîtrisés : **${n('maîtrisé')}/${t.rows.length}** · en cours : ${n('en cours')} · pas commencés : ${n('nouveau')}. Maîtrisé = « Défends-toi » et « Punis-le » réussis sans indice, deux jours différents.`, '',
    '| Piège | Chapitre | État | Défends-toi (sans indice / essais) | Punis-le (sans indice / essais) |', '|---|---|---|---|---|'];
  for (const r of t.rows) L.push(`| ${r.name} | ${r.chapter} | ${r.status} | ${r.defend.clean} / ${r.defend.n} | ${r.punish.clean} / ${r.punish.n} |`);
  L.push('', `### Pièges où je suis tombé dans mes vraies parties (${t.falls.length})`, '');
  if (!t.falls.length) L.push('Aucun.', '');
  else {
    L.push('| Piège | Partie | Date | Source | Mon coup fautif |', '|---|---|---|---|---|');
    for (const f of t.falls) L.push(`| ${f.name} | n°${f.gameNo} | ${fmtDate(f.date)} | ${f.source} | ${f.move} |`);
    L.push('');
  }
  return L;
}

export interface GoalReport {
  /** null : tous les objectifs sont maîtrisés. */
  active: { name: string; rule: string; since: number; last: { date: number; clean: boolean }[]; clean: number; total: number; baseline: { clean: number; n: number } } | null;
  mastered: { name: string; at: number }[];
  watch: { label: string; count: number }[];
}

/** Section « Objectif » (en tête du rapport) : objectif actif, début, X/10, ✓/✗, point de départ, À surveiller. */
export function goalSection(g: GoalReport): string[] {
  const L: string[] = ['## Objectif en cours (« Mon objectif » : une règle à la fois)', ''];
  const a = g.active;
  if (!a) L.push('Tous les objectifs sont maîtrisés.', '');
  else {
    L.push(
      `**${a.name}** — règle : « ${a.rule} »`, '',
      `- Début : ${fmtDate(a.since)} ; ${a.total} partie${a.total > 1 ? 's' : ''} mesurée${a.total > 1 ? 's' : ''} depuis (analysées, 10 coups au moins).`,
      `- **${a.clean}/10** parties propres sur les ${a.last.length} dernières${a.last.length ? ` : ${a.last.map((x) => (x.clean ? '✓' : '✗')).join(' ')}` : ''} (maîtrisé à 7/10, 10 parties au moins).`,
      `- Point de départ : ${a.baseline.clean}/${a.baseline.n} parties propres sur les ${a.baseline.n} d’avant le début.`,
    );
  }
  if (g.mastered.length) L.push(`- Objectifs maîtrisés : ${g.mastered.map((m) => `${m.name} (${fmtDate(m.at)})`).join(' ; ')}.`);
  L.push(`- À surveiller (gaffes des autres motifs sur les 10 dernières parties) : ${g.watch.length ? g.watch.map((w) => `${w.label} ×${w.count}`).join(', ') : 'rien'}.`, '');
  return L;
}

export interface LinesReport {
  name: string;
  color: 'w' | 'b';
  done: number;
  total: number;
  round: number;
  errors: { line: string[]; ply: number; expected: string; played: string; date: number }[];
}

/** Section « Lignes du répertoire » : X/Y validées par ouverture, puis chaque erreur (ligne, coup attendu, joué, date). */
export function linesSection(ls: LinesReport[], from: number | null): string[] {
  const L: string[] = ['## 6. Lignes du répertoire (« Jouer les lignes »)', ''];
  if (!ls.length) return [...L, 'Aucune ouverture active.', ''];
  L.push('Une partie = une ligne du répertoire ; l’adversaire joue exactement la ligne, je dois trouver mes coups. ✓ = ligne jouée sans erreur dans le tour en cours.', '');
  L.push('| Ouverture | Couleur | Lignes validées (✓) | Tour |', '|---|---|---|---|');
  for (const o of ls) L.push(`| ${o.name} | ${colorName(o.color)} | ${o.done} / ${o.total} | ${o.round} |`);
  L.push('');
  const errs = ls.flatMap((o) => o.errors.filter((e) => e.date >= (from ?? 0)).map((e) => ({ ...e, name: o.name })));
  L.push(`### Erreurs${from ? ' de la période' : ''} (${errs.length})`, '');
  if (!errs.length) L.push('Aucune.', '');
  else {
    L.push('| Ouverture | Ligne | Coup attendu | Coup joué | Date |', '|---|---|---|---|---|');
    for (const e of errs.sort((a, b) => a.date - b.date)) {
      const line = e.line.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}. `) + m).join(' ');
      L.push(`| ${e.name} | ${line} | ${moveLabel(e.ply, e.expected)} | ${moveLabel(e.ply, e.played)} | ${fmtDateTime(e.date)} |`);
    }
    L.push('');
  }
  return L;
}

/** Section « Échiquier » : chapitres validés, meilleurs scores, mes 10 cases les plus faibles. */
export function boardSection(b: NonNullable<ReportInput['board']>): string[] {
  const L: string[] = ['## 5. Échiquier (mode « Maîtrise de l’échiquier »)', ''];
  const { progress: p, stats, today } = b;
  const tried = LEVELS.filter((l) => p.levels[l.id]?.attempts);
  if (!tried.length && !Object.keys(stats).length) return [...L, 'Mode pas encore commencé.', ''];
  const validated = CHAPTERS.filter((c) => chapterValidated(p, c.n));
  L.push(`Chapitres validés : **${validated.length} / ${CHAPTERS.length}**${validated.length ? ` (${validated.map((c) => c.n).join(', ')})` : ''}.`, '');
  if (validated.length) {
    L.push('| Chapitre | Validé le | Révision |', '|---|---|---|');
    for (const c of validated) {
      const r = p.chapters[c.n];
      const rev = !r ? '–' : r.toReview ? '**à revoir**' : r.due <= today ? 'due aujourd’hui' : `prochaine le ${r.due.split('-').reverse().join('/')}`;
      L.push(`| ${c.n}. ${c.title} | ${r ? fmtDate(r.validatedAt) : '–'} | ${rev} |`);
    }
    L.push('');
  }
  if (tried.length) {
    L.push('### Meilleurs scores', '', '| Niveau | Exercice | Meilleur score | Réussites / épreuves | Validé |', '|---|---|---|---|---|');
    for (const l of tried) {
      const lp = p.levels[l.id];
      const need = passesNeeded(l.test);
      L.push(`| ${l.id} | ${l.title} | ${lp.best ?? '–'} | ${lp.passes} / ${lp.attempts}${need > 1 ? ` (il en faut ${need})` : ''} | ${lp.validated && need ? 'oui' : 'non'} |`);
    }
    L.push('');
  }
  const weak = weakestSquares(stats, 10, 2);
  L.push('### Mes 10 cases les plus faibles', '', 'Faiblesse = 70 % taux d’erreur + 30 % lenteur (au-delà de 1,5 s en moyenne) ; cases vues au moins 2 fois.', '');
  if (!weak.length) L.push('Pas encore assez de réponses.', '');
  else {
    L.push('| Case | Couleur | Erreurs / réponses | Temps moyen | Faiblesse |', '|---|---|---|---|---|');
    for (const w of weak) L.push(`| ${w.square} | ${squareColor(w.square)} | ${w.stat.err} / ${w.stat.n} | ${(w.stat.ms / w.stat.n / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} s | ${Math.round(100 * w.weakness)} % |`);
    L.push('');
  }
  return L;
}

/**
 * Section « Lecture des menaces » (cartes « Lis la menace ») : réussies / ratées pour Q1 (lire sa menace en jouant
 * son coup à sa place) et Q2 (la parer), puis les 5 dernières Q1 ratées (FEN, menace, coup joué).
 */
export function threatsSection(cards: Card[], from: number | null): string[] {
  const L: string[] = ['## 7. Lecture des menaces (« Lis la menace »)', ''];
  const tc = cards.filter((c) => c.kind === 'threat');
  if (!tc.length) return [...L, 'Aucune carte « Lis la menace » pour l’instant.', ''];
  const tries = tc.flatMap((c) => c.attempts.filter((t) => t.date >= (from ?? 0)).map((t) => ({ ...t, c })));
  const q1 = tries.filter((t) => t.q === 1);
  const q2 = tries.filter((t) => t.q === 2);
  L.push(
    `Positions de mes parties juste après un coup adverse qui a créé une vraie menace (s’il pouvait rejouer — coup nul —, il gagnait au moins ${THREAT_MIN_GAIN} points de win% ou matait). Q1 : je joue son prochain coup à sa place (sa menace, ou un coup qui rapporte au plus ${THREAT_TOLERANCE} points de moins, est accepté). Q2 : je la pare.`,
    '',
    `Cartes : **${tc.length}** (dont ${tc.filter((c) => c.ignored).length} menaces que j’avais ignorées dans la partie).`,
    '',
    '| Question | Réussies | Ratées |', '|---|---|---|',
    `| Q1 — lire sa menace | ${q1.filter((t) => t.ok).length} | ${q1.filter((t) => !t.ok).length} |`,
    `| Q2 — la parer | ${q2.filter((t) => t.ok).length} | ${q2.filter((t) => !t.ok).length} |`,
    '',
  );
  const failed = q1.filter((t) => !t.ok).sort((a, b) => b.date - a.date).slice(0, 5);
  L.push(`### Les ${failed.length} dernières menaces mal lues (Q1 ratée)`, '');
  if (!failed.length) return [...L, 'Aucune.', ''];
  L.push('| Date | FEN (après son coup, à moi de jouer) | Sa menace | Coup joué à sa place |', '|---|---|---|---|');
  for (const t of failed) {
    let played = '(solution demandée)';
    if (t.uci) {
      const f = t.c.fen.split(' ');
      f[1] = f[1] === 'w' ? 'b' : 'w';
      f[3] = '-';
      try { played = new Chess(f.join(' ')).move({ from: t.uci.slice(0, 2), to: t.uci.slice(2, 4), promotion: t.uci[4] }).san; } catch { played = t.uci; }
    }
    L.push(`| ${fmtDateTime(t.date)} | \`${t.c.fen}\` | ${t.c.threatSan ?? '?'}${t.c.threatMate ? ' (mat)' : ''} | ${played} |`);
  }
  L.push('');
  return L;
}

export function buildReport({ now, period, games, allGames, cards, rep = {}, repertoire = [], board, lines, goal, traps }: ReportInput): string {
  const order = [...allGames].sort((a, b) => a.date - b.date);
  const numberOf = (g: Game) => order.findIndex((x) => x.id === g.id) + 1;
  const L: string[] = [];
  const push = (...s: string[]) => L.push(...s);

  push(
    '# Rapport d’entraînement aux échecs — pour Claude',
    '',
    `Généré par l’appli Sparring Échecs le ${fmtDateTime(now)}. Période : ${period.label} — ${games.length} partie${games.length > 1 ? 's' : ''}.`,
    '',
    '**Demande :** je suis débutant. À partir de ces données (calculées automatiquement, pas devinées), diagnostique mes lacunes principales, explique-les simplement et propose-moi 3 axes de travail concrets.',
    '',
    ...(goal ? goalSection(goal) : []),
    '## Définitions',
    '',
    '- **Sources** : *Maia* = partie dans l’appli contre Maia-3, une IA qui imite le jeu humain (compte pour mon niveau) ; *Chess.com* = partie importée de mon compte Chess.com, contre un humain, analysée de la même façon (ne compte pas pour mon niveau).',
    `- **Niveau** : estimation de type Elo, échelle de l’appli proche de Lichess (bornes ${RATING_MIN}–${RATING_MAX}), mise à jour après chaque partie contre Maia. Maia-3 est réglée 50 points au-dessus de mon niveau.`,
    ...(repertoire.length ? [`- **Mon répertoire** : ${repertoire.map((o) => `${o.name} (${colorName(o.color)})`).join(' ; ')}. « Resté dans mon répertoire jusqu’au coup ${REP_MOVES} » = je n’ai joué aucun coup hors répertoire avant mon ${REP_MOVES + 1}e coup (fin de ligne comprise) ; les parties où l’adversaire en sort avant sont comptées à part.`] : []),
    '- **win%** : mes chances de gain estimées depuis l’évaluation de Stockfish (formule Lichess), de mon point de vue.',
    '- **Précision** : précision de mes coups sur une partie, en %, avec la formule publique de Lichess (100 = aucun coup ne baisse mes chances de gain).',
    `- **Imprécision / erreur / gaffe** : un de mes coups qui fait chuter mon win% d’au moins ${THRESHOLDS.inaccuracy} / ${THRESHOLDS.mistake} / ${THRESHOLDS.blunder} points par rapport au meilleur coup.`,
    '- **Phases** : ouverture = coups 1 à 10 ; finale = chaque camp a au plus 13 points de pièces hors pions (cavalier/fou 3, tour 5, dame 9) ; milieu de partie = le reste.',
    `- **Suites Stockfish** : ${LINE_PLIES} demi-coups, profondeur ${DETAIL_DEPTH}. **Bilan matériel** = mes points − ceux de l’adversaire (pion 1, cavalier 3, fou 3, tour 5, dame 9) au bout de la suite.`,
    '- **Motifs** (règles automatiques, un motif principal par erreur, dans cet ordre de priorité) :',
    '  - *Mat raté* : j’avais un mat en 3 coups ou moins et je ne l’ai pas joué.',
    '  - *Mat ouvert* : après mon coup, l’adversaire a un mat en 3 coups ou moins.',
    '  - *Menace ignorée* : si l’adversaire avait pu rejouer avant mon coup, il gagnait au moins 2 points de matériel ou matait, et mon coup ne l’en empêche pas.',
    '  - *Pièce laissée en prise* : dans la réfutation de mon coup, l’adversaire gagne au moins 2 points en 2 demi-coups.',
    '  - *Gain raté* : je pouvais gagner au moins 2 points de matériel (sur les 3 premiers demi-coups de la meilleure suite) ou mater, et mon coup ne le fait pas.',
    '  - *Autre* : aucun des cas précédents (souvent positionnel ou stratégique).',
    '',
  );

  // ------------------------------------------------------------ 1. Résumé
  push('## 1. Résumé de la période', '');
  if (!games.length) push('Aucune partie sur cette période.', '');
  const maiaGames = games.filter((g) => !isImported(g));
  const ccGames = games.filter(isImported);
  if (maiaGames.length) {
    const startR = maiaGames[0]?.ratingBefore ?? RATING_START;
    const endR = maiaGames[maiaGames.length - 1]?.ratingAfter ?? startR;
    push('### Niveau (parties contre Maia)', '', `Début : **${r0(startR)}** → fin : **${r0(endR)}** (${signed(r0(endR - startR))}).`, '');
  } else {
    push('### Niveau (parties contre Maia)', '', 'Aucune partie contre Maia sur la période.', '');
  }
  if (ccGames.length) {
    const rs = ccGames.map((g) => g.ext?.me.rating).filter((x): x is number => typeof x === 'number');
    if (rs.length) push(`Classement Chess.com (pour information) : ${rs[0]} → ${rs[rs.length - 1]}.`, '');
  }
  if (games.length) {
    push('| Partie | Date | Source | Couleur | Adversaire | Résultat | Fin | Répertoire | Niveau après |', '|---|---|---|---|---|---|---|---|---|');
    for (const g of games) {
      push(`| n°${numberOf(g)} | ${fmtDate(g.date)} | ${sourceName(g)} | ${colorName(g.myColor)} | ${oppName(g)} | ${resultWord(g)} (${g.result}) | ${g.termination} | ${repText(rep[g.id!]?.exit)} | ${isImported(g) ? '–' : r0(g.ratingAfter ?? 0)} |`);
    }
    push('');
  }
  const W = games.filter((g) => g.score === 1).length;
  const D = games.filter((g) => g.score === 0.5).length;
  const Lo = games.filter((g) => g.score === 0).length;
  push('### Résultats', '', `Victoires / nulles / défaites : **${W} / ${D} / ${Lo}**.`, '');
  // Par source
  const accAvg = (gs: Game[]) => {
    const xs = gs.map((g) => accuracyOfGame(g)?.me).filter((x): x is number => typeof x === 'number');
    return xs.length ? `${(xs.reduce((a, b) => a + b, 0) / xs.length).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %` : '–';
  };
  const perGame = (gs: Game[], k: 'mistake' | 'blunder') => {
    const an = gs.filter((g) => g.analysis);
    return avg(an.reduce((t, g) => t + g.analysis!.filter((a) => a.severity === k).length, 0), an.length);
  };
  const wdl = (gs: Game[]) => `${gs.filter((g) => g.score === 1).length} / ${gs.filter((g) => g.score === 0.5).length} / ${gs.filter((g) => g.score === 0).length}`;
  push('### Par source', '', '| Source | Parties | V / N / D | Précision moyenne | Erreurs par partie | Gaffes par partie |', '|---|---|---|---|---|---|');
  for (const [label, gs] of [['Maia', maiaGames], ['Chess.com', ccGames]] as const) {
    push(`| ${label} | ${gs.length} | ${gs.length ? wdl(gs) : '–'} | ${accAvg(gs)} | ${perGame(gs, 'mistake')} | ${perGame(gs, 'blunder')} |`);
  }
  push('');
  // Par ouverture + suivi du répertoire jusqu'au coup 8
  const withRep = games.filter((g) => rep[g.id!]?.exit !== undefined);
  const cat = (g: Game) => stayedUntil(rep[g.id!]?.exit, REP_MOVES);
  const groups = new Map<string, Game[]>();
  for (const g of games) {
    const name = rep[g.id!]?.name ?? `Hors répertoire (${colorName(g.myColor)})`;
    groups.set(name, [...(groups.get(name) ?? []), g]);
  }
  push('### Par ouverture', '', `| Ouverture | Parties | V / N / D | Resté dans mon répertoire jusqu’au coup ${REP_MOVES} | Sorti moi-même avant | Adversaire sorti avant |`, '|---|---|---|---|---|---|');
  for (const [name, gs] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
    push(`| ${name} | ${gs.length} | ${wdl(gs)} | ${gs.filter((g) => cat(g) === 'yes').length} | ${gs.filter((g) => cat(g) === 'me').length} | ${gs.filter((g) => cat(g) === 'opponent').length} |`);
  }
  push('');
  if (withRep.length) {
    const yes = withRep.filter((g) => cat(g) === 'yes').length;
    const meOut = withRep.filter((g) => cat(g) === 'me').length;
    const oppOut = withRep.filter((g) => cat(g) === 'opponent').length;
    push(`**Resté dans mon répertoire jusqu’au coup ${REP_MOVES} : ${yes} / ${withRep.length} parties (${pct(yes, withRep.length)})** — sorti moi-même avant : ${meOut} (${pct(meOut, withRep.length)}) ; l’adversaire en est sorti avant : ${oppOut} (${pct(oppOut, withRep.length)}).`, '');
    const bySrc = (gs: Game[]) => { const r = gs.filter((g) => rep[g.id!]?.exit !== undefined); return `${r.filter((g) => cat(g) === 'yes').length} / ${r.length} (${pct(r.filter((g) => cat(g) === 'yes').length, r.length)})`; };
    push(`- Contre Maia : ${bySrc(maiaGames)} · sur Chess.com : ${bySrc(ccGames)}.`, '');
    push(...opponentExits(withRep, rep));
  }

  push('### Imprécisions, erreurs, gaffes par partie', '', '| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |', '|---|---|---|---|---|---|');
  const tot = { moves: 0, inaccuracy: 0, mistake: 0, blunder: 0, acc: 0, accN: 0 };
  for (const g of games) {
    const an = g.analysis ?? [];
    const c = { inaccuracy: 0, mistake: 0, blunder: 0 };
    for (const a of an) if (a.severity !== 'ok') c[a.severity]++;
    tot.moves += an.length; tot.inaccuracy += c.inaccuracy; tot.mistake += c.mistake; tot.blunder += c.blunder;
    const acc = accuracyOfGame(g)?.me;
    if (acc != null) { tot.acc += acc; tot.accN++; }
    push(`| n°${numberOf(g)} | ${an.length} | ${acc != null ? `${acc.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %` : '–'} | ${c.inaccuracy} | ${c.mistake} | ${c.blunder} |`);
  }
  push(`| **Moyenne par partie** | ${avg(tot.moves, games.length)} | ${tot.accN ? `${(tot.acc / tot.accN).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %` : '–'} | ${avg(tot.inaccuracy, games.length)} | ${avg(tot.mistake, games.length)} | ${avg(tot.blunder, games.length)} |`, '');

  // Par phase
  const phases: Phase[] = ['ouverture', 'milieu', 'finale'];
  const byPhase = Object.fromEntries(phases.map((p) => [p, { moves: 0, inaccuracy: 0, mistake: 0, blunder: 0 }]));
  const motifCount = Object.fromEntries(MOTIF_ORDER.map((m) => [m, 0])) as Record<Motif, number>;
  let errorsTotal = 0;
  for (const g of games) {
    const c = new Chess(g.startFen);
    const fens = [c.fen()];
    for (const u of g.uci) { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); fens.push(c.fen()); }
    for (const a of g.analysis ?? []) {
      const ph = byPhase[phaseOf(a.ply, fens[a.ply])];
      ph.moves++;
      if (a.severity !== 'ok') ph[a.severity]++;
      if (isError(a)) { errorsTotal++; if (a.detail) motifCount[a.detail.motif]++; }
    }
  }
  push('### Par phase', '', '| Phase | Mes coups | Imprécisions | Erreurs | Gaffes | Erreurs + gaffes pour 10 coups |', '|---|---|---|---|---|---|');
  for (const p of phases) {
    const x = byPhase[p];
    push(`| ${p[0].toUpperCase() + p.slice(1)} | ${x.moves} | ${x.inaccuracy} | ${x.mistake} | ${x.blunder} | ${avg(10 * (x.mistake + x.blunder), x.moves)} |`);
  }
  push('');
  push('### Motifs des erreurs et gaffes', '', `Sur ${errorsTotal} erreur${errorsTotal > 1 ? 's' : ''} et gaffe${errorsTotal > 1 ? 's' : ''} :`, '', '| Motif | Nombre |', '|---|---|');
  for (const m of MOTIF_ORDER) push(`| ${MOTIF_LABEL[m]} | ${motifCount[m]} |`);
  push('');
  push(...thoughtTable(games));

  // Révision
  const from = period.from ?? 0;
  const attempts = cards.flatMap((c) => c.attempts.filter((t) => t.date >= from).map((t) => ({ ...t, kind: c.kind ?? 'mistake', id: c.id })));
  const okN = attempts.filter((t) => t.ok).length;
  const drill = attempts.filter((t) => t.kind === 'drill');
  const threatTries = attempts.filter((t) => t.kind === 'threat');
  const mistakeTries = attempts.filter((t) => t.kind !== 'drill' && t.kind !== 'threat' && t.kind !== 'trap');
  push('### Révision (paquet de positions)', '',
    `Cartes vues : **${new Set(attempts.map((t) => t.id)).size}** (${attempts.length} tentative${attempts.length > 1 ? 's' : ''}) ; réussite : **${pct(okN, attempts.length)}**.`,
    `- Positions issues de mes erreurs : ${mistakeTries.length} tentatives, réussite ${pct(mistakeTries.filter((t) => t.ok).length, mistakeTries.length)}.`,
    `- Lis la menace : ${threatTries.length} tentatives, réussite ${pct(threatTries.filter((t) => t.ok).length, threatTries.length)} (détail en section 7).`,
    `- Drill d’ouvertures : ${drill.length} tentatives, réussite ${pct(drill.filter((t) => t.ok).length, drill.length)}.`,
    '');

  // ------------------------------------------------------------ 2. Mes coups les plus coûteux
  const worst = costliestMoves(games, numberOf, 10, 5);
  const nInacc = worst.filter((w) => w.a.severity === 'inaccuracy').length;
  push(`## 2. Mes coups les plus coûteux (${worst.length}, tri par chute de win%)`, '');
  if (nInacc) push(`Moins de 5 erreurs et gaffes sur la période : complété par mes ${nInacc} imprécision${nInacc > 1 ? 's' : ''} les plus coûteuses.`, '');
  if (!worst.length) push('Aucune erreur, gaffe ni imprécision sur la période.', '');
  worst.forEach((w, i) => {
    const { a, game: g } = w;
    const d = a.detail;
    push(
      `### ${i + 1}. Partie n°${w.gameNo}, coup ${moveLabel(a.ply, a.san)}${NAG[a.severity]} — ${SEVERITY_LABEL[a.severity].toLowerCase()} (−${r0(a.drop)} pts)`,
      '',
      `- Source : ${sourceName(g)} · adversaire : ${oppName(g)}`,
      `- Ma couleur : ${colorName(g.myColor)} · phase : ${w.phase} · motif : **${d ? MOTIF_LABEL[d.motif] : 'non calculé'}**${d && d.motifs.length > 1 ? ` (aussi : ${d.motifs.filter((m) => m !== d.motif).map((m) => MOTIF_LABEL[m]).join(', ')})` : ''}`,
      `- Dernier coup adverse : ${w.oppLast ?? '— (premier coup)'}`,
      `- FEN avant mon coup : \`${w.fenBefore}\``,
      '',
      '```',
      asciiBoard(w.fenBefore, g.myColor),
      '```',
      '',
      `- Mon coup : **${moveLabel(a.ply, a.san)}** → win% ${r0(a.wpBefore)} → ${r0(a.wpAfter)}`,
      `- Meilleur coup : **${a.bestSan ?? '?'}**${d ? ` — suite : ${d.bestLine} — bilan matériel au bout : ${signed(d.bestMaterial)}` : ''}`,
      `- Réfutation de mon coup : ${d ? `${d.refutation || '(fin de partie)'} — bilan matériel au bout : ${signed(d.refutationMaterial)}` : 'non calculée'}`,
    );
    if (d?.threatLine) push(`- Menace avant mon coup (si l’adversaire rejouait) : ${d.threatLine}`);
    const th = thoughtText(g, a.ply);
    push(`- Ce que je pensais : ${th ?? '(non renseigné)'}`, '');
  });

  // ------------------------------------------------------------ 3. Mes parties
  const shown = gamesToShow(games, 5);
  const counts3 = [games.filter((g) => g.score === 0).length, games.filter((g) => g.score === 0.5).length, games.filter((g) => g.score === 1).length];
  push(`## 3. Mes parties (${shown.length === games.length ? `les ${games.length}` : `${shown.length} sur ${games.length}`} : défaites, puis nulles, puis victoires)`, '');
  if (!shown.length) push('Aucune partie sur la période.', '');
  else push(`Sur la période : ${counts3[0]} défaite${counts3[0] > 1 ? 's' : ''}, ${counts3[1]} nulle${counts3[1] > 1 ? 's' : ''}, ${counts3[2]} victoire${counts3[2] > 1 ? 's' : ''}${shown.length < games.length ? ' ; les plus récentes de chaque catégorie' : ''}.`, '');
  for (const g of shown) {
    push(`### Partie n°${numberOf(g)} — ${resultWord(g).toLowerCase()}, ${sourceName(g)} contre ${oppName(g)}${rep[g.id!]?.exit !== undefined ? ` · répertoire : ${repText(rep[g.id!]?.exit).replace(/\*\*/g, '')}` : ''}`, '', '```pgn', annotatedPgn(g, numberOf(g)), '```', '');
  }

  // ------------------------------------------------------------ 4. Cartes ratées
  const failed = cards
    .filter((c) => c.kind !== 'trap')
    .map((c) => ({ c, fails: c.attempts.filter((t) => !t.ok).length }))
    .filter((x) => x.fails >= 2)
    .sort((x, y) => y.fails - x.fails);
  push('## 4. Positions du paquet ratées au moins 2 fois', '');
  if (!failed.length) push('Aucune.', '');
  else {
    push('| FEN | Trait | Bon coup | Échecs / tentatives | Origine |', '|---|---|---|---|---|');
    for (const { c, fails } of failed) {
      const good = c.kind === 'drill' ? (c.acceptSan ?? [c.bestSan]).join(' ou ') : c.kind === 'mate' ? `mater (mat en ${c.minMoves})` : c.bestSan;
      const origin = c.kind === 'drill' ? 'drill d’ouverture' : c.kind === 'mate' ? 'mat élémentaire raté' : c.kind === 'threat' ? `Lis la menace (sa menace : ${c.threatSan})` : `erreur (j’avais joué ${c.playedSan})`;
      push(`| \`${c.fen}\` | ${colorName(c.myColor)} | ${good} | ${fails} / ${c.attempts.length} | ${origin} |`);
    }
    push('');
  }
  if (board) push(...boardSection(board));
  if (lines) push(...linesSection(lines, period.from));
  push(...threatsSection(cards, period.from));
  if (traps) push(...trapsSection(traps));
  return L.join('\n');
}
