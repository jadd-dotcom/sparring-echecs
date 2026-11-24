import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import type { Card, Game, MoveAnalysis } from '../../db';
import { annotatedPgn, buildReport, costliestMoves, gamesToShow, opponentExits, repText, selectGames, worstErrors } from './buildReport';
import { parsePgn } from '../repertoire';

const DAY = 86400000;
const NOW = new Date(2026, 10, 15, 20, 0).getTime();

function game(id: number, date: number, sans: string[], me: 'w' | 'b', score: 0 | 0.5 | 1, errs: Record<number, [number, 'ok' | 'inaccuracy' | 'mistake' | 'blunder']>): Game {
  const c = new Chess();
  const uci = sans.map((s) => { const m = c.move(s); return m.from + m.to + (m.promotion ?? ''); });
  const analysis: MoveAnalysis[] = sans.map((s, ply) => ({ ply, s })).filter((x) => (x.ply % 2 === 0) === (me === 'w')).map(({ ply, s }) => {
    const [drop, severity] = errs[ply] ?? [0, 'ok'];
    return {
      ply, san: s, uci: uci[ply], bestUci: 'a2a3', bestSan: 'BEST', wpBefore: 60, wpAfter: 60 - drop, drop, severity,
      ...(severity === 'mistake' || severity === 'blunder' ? { detail: { depth: 12, bestLine: '1. BEST', bestMaterial: 0, refutation: '1… REF', refutationMaterial: -3, motifs: ['piece-en-prise' as const], motif: 'piece-en-prise' as const } } : {}),
    };
  });
  return {
    id, source: 'app', date, myColor: me, startFen: c.history().length ? new Chess().fen() : '', uci, san: sans,
    result: score === 1 ? (me === 'w' ? '1-0' : '0-1') : score === 0 ? (me === 'w' ? '0-1' : '1-0') : '1/2-1/2',
    score, termination: 'Abandon', ratingBefore: 900 + id, ratingAfter: 900 + id + 10, botElo: 950, analysis,
  };
}

const G1 = game(1, NOW - 10 * DAY, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], 'w', 0, { 2: [25, 'mistake'], 4: [12, 'inaccuracy'] });
const G2 = game(2, NOW - 3 * DAY, ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'], 'b', 1, { 1: [45, 'blunder'], 5: [22, 'mistake'] });
const G3 = game(3, NOW - DAY, ['e4', 'c5', 'Nf3', 'd6'], 'w', 0, { 0: [31, 'blunder'] });
G1.thoughts = { 2: 'Je voulais développer vite.' };
G2.thoughtTags = { 1: 'menace' };
G3.thoughtTags = { 0: 'trop-vite' };
G3.thoughts = { 0: 'Pressé par la pendule.' };

describe('période', () => {
  it('depuis le dernier rapport / 7 jours / 20 parties', () => {
    expect(selectGames([G3, G1, G2], 'since-last', NOW - 5 * DAY, NOW).games.map((g) => g.id)).toEqual([2, 3]);
    expect(selectGames([G3, G1, G2], 'since-last', null, NOW).games.map((g) => g.id)).toEqual([1, 2, 3]);
    expect(selectGames([G1, G2, G3], '7-days', null, NOW).games.map((g) => g.id)).toEqual([2, 3]);
    expect(selectGames([G1, G2, G3], '20-games', null, NOW).games.length).toBe(3);
  });
});

describe('tri des erreurs', () => {
  it('par chute de win%, inexactitudes exclues', () => {
    const w = worstErrors([G1, G2, G3], (g) => g.id!, 10);
    expect(w.map((x) => [x.gameNo, x.a.ply, x.a.drop])).toEqual([[2, 1, 45], [3, 0, 31], [1, 2, 25], [2, 5, 22]]);
    expect(w[0].oppLast).toBe('1. d4');
    expect(w[1].oppLast).toBeNull();
    expect(worstErrors([G1, G2, G3], (g) => g.id!, 2).length).toBe(2);
  });
});

describe('PGN annoté', () => {
  it('?! ? ?? et win% sur mes coups, relisible', () => {
    const pgn = annotatedPgn(G1, 1);
    expect(pgn).toContain('2. Nf3? {win% 60→35, meilleur : BEST. Je pensais : « Je voulais développer vite. »}');
    expect(annotatedPgn(G3, 3)).toContain('1. e4?? {win% 60→29, meilleur : BEST. Je pensais : J’ai joué trop vite — « Pressé par la pendule. »}');
    expect(pgn).toContain('3. Bc4?! {win% 60→48');
    expect(pgn).toContain('1. e4 {win% 60}');
    expect(pgn).toContain('2... Nc6');
    expect(pgn).toMatch(/\[White "Moi \(901\)"\]/);
    expect(parsePgn(pgn).games).toBe(1); // PGN valide
  });
});

describe('rapport complet', () => {
  const cards: Card[] = [{
    kind: 'mistake', gameId: 1, source: 'app', fen: new Chess().fen(), myColor: 'w', playedUci: 'a2a4', playedSan: 'a4', bestUci: 'e2e4', bestSan: 'e4',
    wpBefore: 50, drop: 30, severity: 'blunder', step: 0, due: '2026-11-16', createdAt: NOW,
    attempts: [{ date: NOW - DAY, uci: 'a2a4', ok: false }, { date: NOW - DAY / 2, uci: 'a2a4', ok: false }, { date: NOW - 1000, uci: 'e2e4', ok: true }],
  }];
  const { games, period } = selectGames([G1, G2, G3], 'since-last', null, NOW);
  const md = buildReport({ now: NOW, period, games, allGames: [G1, G2, G3], cards });
  it('contient les 4 sections et les faits clés', () => {
    expect(md).toContain('## 1. Résumé de la période');
    expect(md).toContain('bornes 550–2600');
    expect(md).toContain('| Partie | Mes coups | Précision | Imprécisions | Erreurs | Gaffes |');
    expect(md).toContain('- **Précision** : précision de mes coups');
    expect(md).toContain('Début : **901** → fin : **913** (+12)');
    expect(md).toContain('Victoires / nulles / défaites : **1 / 0 / 2**');
    expect(md).toContain('| Pièce laissée en prise | 4 |');
    expect(md).toContain('| Gain raté | 0 |');
    expect(md.indexOf('| Gain raté |')).toBeLessThan(md.indexOf('| Autre |'));
    expect(md).toContain('*Gain raté* : je pouvais gagner au moins 2 points');
    expect(md).toContain('## 2. Mes coups les plus coûteux (5, tri par chute de win%)');
    expect(md).toContain('complété par mes 1 imprécision les plus coûteuses');
    expect(md).toContain('### 5. Partie n°1, coup 3. Bc4?! — imprécision (−12 pts)');
    expect(md).toContain('### 1. Partie n°2, coup 1… d5?? — gaffe (−45 pts)');
    expect(md).toContain('- Ce que je pensais : « Je voulais développer vite. »');
    expect(md).toContain('- Ce que je pensais : Je n’ai pas vu la menace');
    expect(md).toContain('## 3. Mes parties (les 3 : défaites, puis nulles, puis victoires)');
    expect(md.indexOf('### Partie n°3 — défaite')).toBeLessThan(md.indexOf('### Partie n°1 — défaite'));
    expect(md.indexOf('### Partie n°1 — défaite')).toBeLessThan(md.indexOf('### Partie n°2 — victoire'));
    expect(md).toContain('Cartes vues : **1** (3 tentatives) ; réussite : **33 %**');
    expect(md).toMatch(/\| `rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1` \| Blancs \| e4 \| 2 \/ 3 \|/);
  });
  it('« ce que je pensais » en un toucher, compté par motif', () => {
    expect(md).toContain('### Ce que je pensais (réponse en un toucher), par motif');
    expect(md).toContain('Réponses données sur 2 de mes 4 erreurs et gaffes');
    expect(md).toContain('| Motif | Menace pas vue | Mal calculé | Autre cible | Trop vite | Ne sait pas | Sans réponse |');
    expect(md).toContain('| Pièce laissée en prise | 1 | 0 | 0 | 1 | 0 | 2 |');
    expect(md).toContain('| Gain raté | 0 | 0 | 0 | 0 | 0 | 0 |');
    expect(md).toContain('| **Total** | **1** | **0** | **0** | **1** | **0** | **2** |');
    expect(md).not.toContain('Motif non calculé');
    expect(md.indexOf('### Ce que je pensais')).toBeGreaterThan(md.indexOf('### Motifs des erreurs et gaffes'));
  });

  it('phases : coups 1-10 = ouverture', () => {
    expect(md).toMatch(/\| Ouverture \| 8 \| 1 \| 2 \| 2 \|/);
    expect(md).toMatch(/\| Milieu \| 0 \|/);
  });
  it('plateau ASCII avec ma couleur en bas (Noirs pour la partie 2)', () => {
    const block = md.split('### 1. Partie n°2')[1].split('```')[1];
    expect(block.trim().split('\n')[1]).toMatch(/^1 \| R N B K Q B N R \|$/);
  });
});

describe('coups les plus coûteux et « Mes parties »', () => {
  it('au moins 5 erreurs + gaffes : pas d’imprécision ; sinon complétées jusqu’à 5', () => {
    const many = game(9, NOW, ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd3', 'Be7'], 'w', 0, { 0: [40, 'blunder'], 2: [25, 'mistake'], 4: [21, 'mistake'], 6: [15, 'inaccuracy'] });
    expect(costliestMoves([many, G2], (g) => g.id!, 10, 5).map((r) => r.a.severity)).toEqual(['blunder', 'blunder', 'mistake', 'mistake', 'mistake']);
    expect(costliestMoves([G3], (g) => g.id!, 10, 5).map((r) => r.a.severity)).toEqual(['blunder']);  // pas d'imprécision à ajouter
    expect(costliestMoves([G1], (g) => g.id!, 10, 5).map((r) => [r.a.ply, r.a.severity])).toEqual([[2, 'mistake'], [4, 'inaccuracy']]);
  });
  it('au plus 5 parties : défaites, puis nulles, puis victoires (les plus récentes d’abord)', () => {
    const mk = (id: number, d: number, score: 0 | 0.5 | 1) => ({ ...G1, id, date: NOW - d * DAY, score });
    const gs = [mk(1, 9, 1), mk(2, 8, 0), mk(3, 7, 0.5), mk(4, 6, 1), mk(5, 5, 0), mk(6, 4, 0.5), mk(7, 3, 1)];
    expect(gamesToShow(gs, 5).map((g) => g.id)).toEqual([5, 2, 6, 3, 7]);
  });
});

describe('parties Chess.com et répertoire', () => {
  const CC: Game = {
    ...game(4, NOW - DAY / 2, ['c4', 'e5', 'Nc3', 'Nf6', 'a3', 'd5'], 'w', 0.5, { 4: [11, 'inaccuracy'] }),
    source: 'chesscom', externalId: 'https://www.chess.com/game/live/1', ratingBefore: undefined, ratingAfter: undefined, botElo: undefined,
    termination: 'Nulle par accord',
    ext: { site: 'chess.com', url: 'https://www.chess.com/game/live/1', timeClass: 'rapid', timeControl: '600', me: { name: 'lightning_light', rating: 330 }, opp: { name: 'Adversaire42', rating: 310 } },
  };
  const exitMe = { ply: 4, by: 'me' as const, playedSan: 'a3', expectedSan: ['g3'], fenBefore: '', fenAfter: '' };
  const { games, period } = selectGames([G1, G2, G3, CC], 'since-last', null, NOW);
  const md = buildReport({
    now: NOW, period, games, allGames: [G1, G2, G3, CC], cards: [],
    rep: { 1: { exit: undefined }, 2: { exit: null, name: 'Système …c5 / …g6' }, 3: { exit: { ...exitMe, ply: 1, by: 'opponent', playedSan: 'c5', expectedSan: ['e5'] }, name: 'Anglaise' }, 4: { exit: exitMe, name: 'Anglaise' } },
    repertoire: [{ name: 'Anglaise', color: 'w' }, { name: 'Système …c5 / …g6', color: 'b' }],
  });
  it('source, adversaire, niveau Maia seulement', () => {
    expect(md).toContain('*Chess.com* = partie importée');
    expect(md).toContain('Début : **901** → fin : **913** (+12)');          // la partie Chess.com ne change pas le niveau
    expect(md).toContain('Classement Chess.com (pour information) : 330 → 330.');
    expect(md).toMatch(/\| n°4 \| [^|]+ \| Chess.com \| Blancs \| Adversaire42 \(310\) \| Nulle \(1\/2-1\/2\) \| Nulle par accord \| \*\*sorti au coup 3\.\*\* \(a3 au lieu de g3\) \| – \|/);
    expect(md).toContain('| Maia | 3 | 1 / 0 / 2 |');
    expect(md).toContain('| Chess.com | 1 | 0 / 1 / 0 |');
  });
  it('par ouverture et % resté dans le répertoire jusqu’au coup 8', () => {
    expect(md).toContain('| Anglaise | 2 | 0 / 1 / 1 | 0 | 1 | 1 |');
    expect(md).toContain('| Système …c5 / …g6 | 1 | 1 / 0 / 0 | 1 | 0 | 0 |');
    expect(md).toContain('**Resté dans mon répertoire jusqu’au coup 8 : 1 / 3 parties (33 %)** — sorti moi-même avant : 1 (33 %) ; l’adversaire en est sorti avant : 1 (33 %).');
    expect(md).toContain('- Contre Maia : 1 / 2 (50 %) · sur Chess.com : 0 / 1 (0 %).');
  });
  it('coups par lesquels l’adversaire sort de mon répertoire, vus au moins 2 fois', () => {
    expect(md).toContain('#### Coups par lesquels l’adversaire sort de mon répertoire (vus au moins 2 fois)');
    expect(md).toContain('Aucun coup vu 2 fois sur la période.');
    const ex = (ply: number, played: string, fen: string) => ({ exit: { ply, by: 'opponent' as const, playedSan: played, expectedSan: ['Nf3'], fenBefore: fen, fenAfter: '' } });
    const a = game(10, NOW, ['e4', 'c5', 'Qh5', 'd6'], 'b', 1, {});
    const b = game(11, NOW, ['e4', 'c5', 'Qh5', 'Nf6'], 'b', 0, {});
    const c = game(12, NOW, ['e4', 'c5', 'Qf3', 'Nc6'], 'b', 0, {});
    const fen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
    const out = opponentExits([a, b, c], { 10: ex(2, 'Qh5', fen), 11: ex(2, 'Qh5', fen), 12: ex(2, 'Qf3', fen) }).join('\n');
    expect(out).toContain('- 1.e4 c5 **2.Qh5** : 2 fois (j’avais les Noirs)');
    expect(out).not.toContain('Qf3');
  });
  it('PGN annoté Chess.com : joueurs, lien, cadence', () => {
    const pgn = annotatedPgn(CC, 4);
    expect(pgn).toContain('[Event "Chess.com — partie n°4"]');
    expect(pgn).toContain('[Site "https://www.chess.com/game/live/1"]');
    expect(pgn).toContain('[White "Moi (lightning_light, 330)"]');
    expect(pgn).toContain('[Black "Adversaire42 (310)"]');
    expect(parsePgn(pgn).games).toBe(1);
    expect(md).toContain('### Partie n°4 — nulle, Chess.com contre Adversaire42 (310) · répertoire : sorti au coup 3. (a3 au lieu de g3)');
  });
  it('libellés du suivi de répertoire', () => {
    expect(repText(undefined)).toBe('–');
    expect(repText(null)).toBe('suivi jusqu’au bout');
    expect(repText({ ...exitMe, ply: 0 })).toBe('hors répertoire dès le 1er coup (a3 au lieu de g3)');
  });
});

describe('section « Échiquier »', () => {
  it('chapitres validés, meilleurs scores, 10 cases les plus faibles', async () => {
    const { boardSection } = await import('./buildReport');
    const { emptyProgress, recordTest } = await import('../board/levels');
    const { recordAnswer } = await import('../board/stats');
    let p = emptyProgress();
    for (const id of ['1a', '1b', '1c', '1d', '1e']) for (let i = 0; i < 3; i++) p = recordTest(p, id, true, `2${i + 6} bonnes réponses, 0 erreur en 30 s`, 26 + i, '2026-11-20');
    p = recordTest(p, '2c', false, '20 bonnes réponses, 3 erreurs en 30 s', 5, '2026-11-20');
    let s = {};
    for (let i = 0; i < 3; i++) s = recordAnswer(s, 'c6', false, 3000);
    s = recordAnswer(s, 'e4', true, 800); s = recordAnswer(s, 'e4', true, 800);
    const md = boardSection({ progress: p, stats: s, today: '2026-11-20' }).join('\n');
    expect(md).toContain('## 5. Échiquier');
    expect(md).toContain('Chapitres validés : **1 / 7** (1)');
    expect(md).toContain('prochaine le 21/11/2026');
    expect(md).toContain('| 1a | Colonnes | 28 bonnes réponses, 0 erreur en 30 s | 3 / 3 (il en faut 3) | oui |');
    expect(md).toContain('| 2c | Trouver une case (coordonnées affichées) | 20 bonnes réponses, 3 erreurs en 30 s | 0 / 1 (il en faut 3) | non |');
    expect(md).toMatch(/\| c6 \| claire \| 3 \/ 3 \| 3 s \| \d+ % \|/);
    expect(md.indexOf('| c6 |')).toBeLessThan(md.indexOf('| e4 |'));
    expect(boardSection({ progress: emptyProgress(), stats: {}, today: '2026-11-20' }).join('\n')).toContain('Mode pas encore commencé.');
  });
});
