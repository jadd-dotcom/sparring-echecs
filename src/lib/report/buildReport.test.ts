import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import type { Card, Game, MoveAnalysis } from '../../db';
import { annotatedPgn, buildReport, selectGames, worstErrors } from './buildReport';
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
    expect(pgn).toContain('2. Nf3? {win% 60→35, meilleur : BEST. Je pensais : Je voulais développer vite.}');
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
    expect(md).toContain('Début : **901** → fin : **913** (+12)');
    expect(md).toContain('Victoires / nulles / défaites : **1 / 0 / 2**');
    expect(md).toContain('| Pièce laissée en prise | 4 |');
    expect(md).toContain('## 2. Mes 4 pires erreurs');
    expect(md).toContain('### 1. Partie n°2, coup 1… d5?? — gaffe (−45 pts)');
    expect(md).toContain('- Ce que je pensais : « Je voulais développer vite. »');
    expect(md).toContain('## 3. Parties perdues (2)');
    expect(md).toContain('Cartes vues : **1** (3 tentatives) ; réussite : **33 %**');
    expect(md).toMatch(/\| `rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w KQkq - 0 1` \| Blancs \| e4 \| 2 \/ 3 \|/);
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
