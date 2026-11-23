// Import Chess.com : tests sur des réponses de l'API enregistrées (tests/fixtures/chesscom), sans réseau.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  convertGame, convertPgn, isPastMonth, monthOf, openingNameFromUrl, resultOf, splitPgns, terminationFromText, type CcGame,
} from './chesscom';

const fx = (f: string) => JSON.parse(readFileSync(new URL(`../../tests/fixtures/chesscom/${f}`, import.meta.url), 'utf8'));
const OCT: CcGame[] = fx('games-2026-10.json').games;
const NOV: CcGame[] = fx('games-2026-11.json').games;
const USER = 'Lightning_Light';

describe('import Chess.com', () => {
  it('mois des archives ; un mois passé est figé', () => {
    const arch: string[] = fx('archives.json').archives;
    expect(arch.map(monthOf)).toEqual(['2026/10', '2026/11']);
    const now = Date.UTC(2026, 10, 23);
    expect(isPastMonth(arch[0], now)).toBe(true);
    expect(isPastMonth(arch[1], now)).toBe(false);
  });

  it('toutes les parties enregistrées se convertissent (couleur, résultat, coups légaux)', () => {
    let ok = 0;
    for (const g of [...OCT, ...NOV]) {
      const r = convertGame(g, USER);
      if (r.ok) ok++;
      if (!r.ok) { expect(r.reason, g.url).toBe('moins de 2 coups'); continue; }
      const me = r.game.myColor === 'w' ? g.white : g.black;
      expect(me.username.toLowerCase()).toBe('lightning_light');
      expect(r.game.score).toBe(me.result === 'win' ? 1 : r.game.result === '1/2-1/2' ? 0.5 : 0);
      expect(r.game.uci.length).toBe(r.game.san.length);
      expect(r.game.externalId).toBe(g.url);
      expect(r.game.date).toBe(g.end_time * 1000);
    }
    expect(ok).toBeGreaterThan(150);
  }, 20000);

  it('première partie de novembre : mat subi avec les Blancs, ouverture anglaise', () => {
    const r = convertGame(NOV[0], USER);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.game).toMatchObject({ myColor: 'w', result: '0-1', score: 0, termination: 'Échec et mat' });
    expect(r.game.san.slice(0, 4)).toEqual(['c4', 'Nc6', 'Nc3', 'e5']);
    expect(r.game.san[r.game.san.length - 1]).toBe('Qh2#');
    expect(r.game.ext).toMatchObject({
      site: 'chess.com', timeClass: 'rapid', eco: 'A25', me: { name: 'lightning_light', rating: 328 }, opp: { name: 'LupinMomo', rating: 285 },
      openingName: 'English Opening Reversed Sicilian Closed',
    });
  });

  it('résultats et terminaisons en français', () => {
    expect(resultOf({ username: 'a', result: 'win' }, { username: 'b', result: 'resigned' })).toEqual({ result: '1-0', termination: 'Abandon' });
    expect(resultOf({ username: 'a', result: 'timeout' }, { username: 'b', result: 'win' })).toEqual({ result: '0-1', termination: 'Temps écoulé' });
    expect(resultOf({ username: 'a', result: 'stalemate' }, { username: 'b', result: 'stalemate' })).toEqual({ result: '1/2-1/2', termination: 'Pat' });
    expect(resultOf({ username: 'a', result: 'timevsinsufficient' }, { username: 'b', result: 'timeout' }).result).toBe('1/2-1/2');
    expect(terminationFromText('LupinMomo won by checkmate', '0-1')).toBe('Échec et mat');
    expect(terminationFromText('Game drawn by agreement', '1/2-1/2')).toBe('Nulle par accord');
  });

  it('ignore les variantes et les parties d’un autre joueur', () => {
    expect(convertGame({ ...NOV[0], rules: 'chess960' }, USER)).toEqual({ ok: false, reason: 'variante' });
    expect(convertGame(NOV[0], 'quelquun')).toEqual({ ok: false, reason: 'joueur absent' });
  });

  it('nom d’ouverture lisible depuis l’URL Chess.com', () => {
    expect(openingNameFromUrl('https://www.chess.com/openings/Sicilian-Defense-Accelerated-Dragon-5.Nc3-Bg7')).toBe('Sicilian Defense Accelerated Dragon');
    expect(openingNameFromUrl('https://www.chess.com/openings/English-Opening')).toBe('English Opening');
    expect(openingNameFromUrl(undefined)).toBeUndefined();
  });

  it('plan B : PGN collé (plusieurs parties), couleur par pseudo, sinon choisie', () => {
    const text = `${NOV[0].pgn}\n\n${NOV[1].pgn}`;
    const parts = splitPgns(text);
    expect(parts).toHaveLength(2);
    const a = convertPgn(parts[0], USER);
    const b = convertGame(NOV[0], USER);
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.game.externalId).toBe(NOV[0].url);           // en-tête [Link] → pas de doublon avec l'API
    expect(a.game.uci).toEqual(b.game.uci);
    expect(a.game).toMatchObject({ myColor: 'w', result: '0-1', termination: 'Échec et mat', date: b.game.date });
    const bare = '[White "X"]\n[Black "Y"]\n[Result "1-0"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0';
    expect(convertPgn(bare, USER)).toEqual({ ok: false, reason: 'couleur inconnue (indique ton pseudo ou ta couleur)' });
    const c = convertPgn(bare, USER, 'b');
    expect(c.ok && c.game).toMatchObject({ myColor: 'b', score: 0, termination: 'Échec et mat', ext: { site: 'pgn', opp: { name: 'X' } } });
    const c2 = convertPgn(bare, USER, 'b');
    expect(c.ok && c2.ok && c.game.externalId === c2.game.externalId).toBe(true);   // identifiant stable
  });
});
