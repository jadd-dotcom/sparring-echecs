// Rapport Markdown « pour Claude » : texte structuré, sans image, faits calculés.
import { Chess } from 'chess.js';
import type { Card, Game, MoveAnalysis } from '../../db';
import { asciiBoard, moveLabel, phaseOf, type Phase } from './facts';
import { MOTIF_LABEL, MOTIF_ORDER, DETAIL_DEPTH, LINE_PLIES, type Motif } from './motifs';
import { SEVERITY_LABEL, THRESHOLDS } from '../winpct';
import { RATING_MAX, RATING_MIN, RATING_START } from '../rating';

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

/** Erreurs et gaffes de la période, de la pire à la moins grave (chute de win%). */
export function worstErrors(games: Game[], numberOf: (g: Game) => number, n = 10): ErrorRow[] {
  const rows: ErrorRow[] = [];
  for (const g of games) {
    if (!g.analysis) continue;
    const c = new Chess(g.startFen);
    const fens = [c.fen()];
    for (const u of g.uci) { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); fens.push(c.fen()); }
    for (const a of g.analysis) {
      if (!isError(a)) continue;
      rows.push({ game: g, gameNo: numberOf(g), a, phase: phaseOf(a.ply, fens[a.ply]), fenBefore: fens[a.ply], oppLast: a.ply > 0 ? moveLabel(a.ply - 1, g.san[a.ply - 1]) : null });
    }
  }
  rows.sort((x, y) => y.a.drop - x.a.drop || x.gameNo - y.gameNo || x.a.ply - y.a.ply);
  return rows.slice(0, n);
}

/** PGN annoté : ?! ? ?? et win% sur mes coups, « ce que je pensais » en commentaire. */
export function annotatedPgn(g: Game, gameNo: number): string {
  const byPly = new Map((g.analysis ?? []).map((a) => [a.ply, a]));
  const me = 'Moi' + (g.ratingBefore ? ` (${r0(g.ratingBefore)})` : '');
  const bot = 'Maia-3' + (g.botElo ? ` (${r0(g.botElo)})` : '');
  const d = new Date(g.date);
  const head = [
    ['Event', `Sparring Échecs — partie n°${gameNo}`],
    ['Date', `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`],
    ['White', g.myColor === 'w' ? me : bot],
    ['Black', g.myColor === 'b' ? me : bot],
    ['Result', g.result],
    ['Termination', g.termination],
  ].map(([k, v]) => `[${k} "${v}"]`).join('\n');
  const parts: string[] = [];
  g.san.forEach((s, i) => {
    const a = byPly.get(i);
    // Un coup noir qui suit un commentaire reprend son numéro (« 5... »).
    const num = i % 2 === 0 ? `${i / 2 + 1}. ` : byPly.has(i - 1) ? `${Math.floor(i / 2) + 1}... ` : '';
    let tok = num + s + (a && a.severity !== 'ok' ? NAG[a.severity] : '');
    if (a) {
      const thought = g.thoughts?.[i];
      const wp = a.severity === 'ok' ? `win% ${r0(a.wpAfter)}` : `win% ${r0(a.wpBefore)}→${r0(a.wpAfter)}${a.bestSan ? `, meilleur : ${a.bestSan}` : ''}`;
      tok += ` {${wp}${thought ? `. Je pensais : ${thought.replace(/[{}]/g, '')}` : ''}}`;
    }
    parts.push(tok);
  });
  return `${head}\n\n${parts.join(' ')} ${g.result}`;
}

export interface ReportInput {
  now: number;
  period: Period;
  games: Game[];          // parties de la période, analysées, triées par date
  allGames: Game[];       // toutes les parties (numérotation stable)
  cards: Card[];
}

export function buildReport({ now, period, games, allGames, cards }: ReportInput): string {
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
    '## Définitions',
    '',
    `- **Niveau** : estimation de type Elo, échelle de l’appli proche de Lichess (bornes ${RATING_MIN}–${RATING_MAX}), mise à jour après chaque partie. Mon adversaire est Maia-3, une IA qui imite le jeu humain, réglée 50 points au-dessus de mon niveau.`,
    '- **win%** : mes chances de gain estimées depuis l’évaluation de Stockfish (formule Lichess), de mon point de vue.',
    `- **Imprécision / erreur / gaffe** : un de mes coups qui fait chuter mon win% d’au moins ${THRESHOLDS.inaccuracy} / ${THRESHOLDS.mistake} / ${THRESHOLDS.blunder} points par rapport au meilleur coup.`,
    '- **Phases** : ouverture = coups 1 à 10 ; finale = chaque camp a au plus 13 points de pièces hors pions (cavalier/fou 3, tour 5, dame 9) ; milieu de partie = le reste.',
    `- **Suites Stockfish** : ${LINE_PLIES} demi-coups, profondeur ${DETAIL_DEPTH}. **Bilan matériel** = mes points − ceux de l’adversaire (pion 1, cavalier 3, fou 3, tour 5, dame 9) au bout de la suite.`,
    '- **Motifs** (règles automatiques, un motif principal par erreur, dans cet ordre de priorité) :',
    '  - *Mat raté* : j’avais un mat en 3 coups ou moins et je ne l’ai pas joué.',
    '  - *Mat ouvert* : après mon coup, l’adversaire a un mat en 3 coups ou moins.',
    '  - *Menace ignorée* : si l’adversaire avait pu rejouer avant mon coup, il gagnait au moins 2 points de matériel ou matait, et mon coup ne l’en empêche pas.',
    '  - *Pièce laissée en prise* : dans la réfutation de mon coup, l’adversaire gagne au moins 2 points en 2 demi-coups.',
    '  - *Autre* : aucun des cas précédents (souvent positionnel ou stratégique).',
    '',
  );

  // ------------------------------------------------------------ 1. Résumé
  push('## 1. Résumé de la période', '');
  if (!games.length) push('Aucune partie sur cette période.', '');
  const startR = games[0]?.ratingBefore ?? RATING_START;
  const endR = games[games.length - 1]?.ratingAfter ?? startR;
  push('### Niveau', '', `Début : **${r0(startR)}** → fin : **${r0(endR)}** (${signed(r0(endR - startR))}).`, '');
  if (games.length) {
    push('| Partie | Date | Couleur | Résultat | Fin | Niveau après |', '|---|---|---|---|---|---|');
    for (const g of games) {
      const res = g.score === 1 ? 'Victoire' : g.score === 0 ? 'Défaite' : 'Nulle';
      push(`| n°${numberOf(g)} | ${fmtDate(g.date)} | ${colorName(g.myColor)} | ${res} (${g.result}) | ${g.termination} | ${r0(g.ratingAfter ?? 0)} |`);
    }
    push('');
  }
  const W = games.filter((g) => g.score === 1).length;
  const D = games.filter((g) => g.score === 0.5).length;
  const Lo = games.filter((g) => g.score === 0).length;
  push('### Résultats', '', `Victoires / nulles / défaites : **${W} / ${D} / ${Lo}**.`, '');

  push('### Imprécisions, erreurs, gaffes par partie', '', '| Partie | Mes coups | Imprécisions | Erreurs | Gaffes |', '|---|---|---|---|---|');
  const tot = { moves: 0, inaccuracy: 0, mistake: 0, blunder: 0 };
  for (const g of games) {
    const an = g.analysis ?? [];
    const c = { inaccuracy: 0, mistake: 0, blunder: 0 };
    for (const a of an) if (a.severity !== 'ok') c[a.severity]++;
    tot.moves += an.length; tot.inaccuracy += c.inaccuracy; tot.mistake += c.mistake; tot.blunder += c.blunder;
    push(`| n°${numberOf(g)} | ${an.length} | ${c.inaccuracy} | ${c.mistake} | ${c.blunder} |`);
  }
  push(`| **Moyenne par partie** | ${avg(tot.moves, games.length)} | ${avg(tot.inaccuracy, games.length)} | ${avg(tot.mistake, games.length)} | ${avg(tot.blunder, games.length)} |`, '');

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

  // Révision
  const from = period.from ?? 0;
  const attempts = cards.flatMap((c) => c.attempts.filter((t) => t.date >= from).map((t) => ({ ...t, kind: c.kind ?? 'mistake', id: c.id })));
  const okN = attempts.filter((t) => t.ok).length;
  const drill = attempts.filter((t) => t.kind === 'drill');
  push('### Révision (paquet de positions)', '',
    `Cartes vues : **${new Set(attempts.map((t) => t.id)).size}** (${attempts.length} tentative${attempts.length > 1 ? 's' : ''}) ; réussite : **${pct(okN, attempts.length)}**.`,
    `- Positions issues de mes erreurs : ${attempts.length - drill.length} tentatives, réussite ${pct(attempts.filter((t) => t.kind !== 'drill' && t.ok).length, attempts.length - drill.length)}.`,
    `- Drill d’ouvertures : ${drill.length} tentatives, réussite ${pct(drill.filter((t) => t.ok).length, drill.length)}.`,
    '');

  // ------------------------------------------------------------ 2. Pires erreurs
  const worst = worstErrors(games, numberOf, 10);
  push(`## 2. Mes ${worst.length} pires erreurs (tri par chute de win%)`, '');
  if (!worst.length) push('Aucune erreur ni gaffe sur la période.', '');
  worst.forEach((w, i) => {
    const { a, game: g } = w;
    const d = a.detail;
    push(
      `### ${i + 1}. Partie n°${w.gameNo}, coup ${moveLabel(a.ply, a.san)}${NAG[a.severity]} — ${SEVERITY_LABEL[a.severity].toLowerCase()} (−${r0(a.drop)} pts)`,
      '',
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
    const th = g.thoughts?.[a.ply];
    push(`- Ce que je pensais : ${th ? `« ${th} »` : '(non renseigné)'}`, '');
  });

  // ------------------------------------------------------------ 3. Parties perdues
  const lost = games.filter((g) => g.score === 0).slice(-3);
  push(`## 3. Parties perdues (${lost.length}${games.filter((g) => g.score === 0).length > 3 ? ', les 3 plus récentes' : ''})`, '');
  if (!lost.length) push('Aucune partie perdue sur la période.', '');
  for (const g of lost) push(`### Partie n°${numberOf(g)}`, '', '```pgn', annotatedPgn(g, numberOf(g)), '```', '');

  // ------------------------------------------------------------ 4. Cartes ratées
  const failed = cards
    .map((c) => ({ c, fails: c.attempts.filter((t) => !t.ok).length }))
    .filter((x) => x.fails >= 2)
    .sort((x, y) => y.fails - x.fails);
  push('## 4. Positions du paquet ratées au moins 2 fois', '');
  if (!failed.length) push('Aucune.', '');
  else {
    push('| FEN | Trait | Bon coup | Échecs / tentatives | Origine |', '|---|---|---|---|---|');
    for (const { c, fails } of failed) {
      const good = c.kind === 'drill' ? (c.acceptSan ?? [c.bestSan]).join(' ou ') : c.kind === 'mate' ? `mater (mat en ${c.minMoves})` : c.bestSan;
      push(`| \`${c.fen}\` | ${colorName(c.myColor)} | ${good} | ${fails} / ${c.attempts.length} | ${c.kind === 'drill' ? 'drill d’ouverture' : c.kind === 'mate' ? 'mat élémentaire raté' : `erreur (j’avais joué ${c.playedSan})`} |`);
    }
    push('');
  }
  return L.join('\n');
}
