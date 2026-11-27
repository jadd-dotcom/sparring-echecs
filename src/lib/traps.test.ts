// Pièges d'ouverture : positions, verdicts, maîtrise (deux jours), pièges où je suis tombé dans mes parties.
import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { TRAPS } from '../data/traps';
import type { Game } from '../db';
import { cleanDays, defendVerdict, fallsInGames, isMastered, punishOk, trapPositions, trapStatus, type TrapAttempt } from './traps';

const DAY = 86400000;
const T = new Date(2026, 10, 20, 10).getTime();

describe('pièges d’ouverture : données', () => {
  it('chaque piège : suite légale, faute, punition et bonnes défenses légales ; 3 chapitres', () => {
    for (const t of TRAPS) {
      const p = trapPositions(t);
      const c = new Chess(p.afterBlunder);
      for (const s of t.punish) expect(() => c.move(s), `${t.id} : ${s}`).not.toThrow();
      expect(t.good.length, t.id).toBeGreaterThan(0);
      expect(p.goodUci).not.toContain(p.blunderUci);
      expect(t.lesson.length).toBe(2);
      expect(/\b\d+\.\s|♔|♕|♖|♗|♘/.test(t.lesson.join(' ') + t.rule + t.hintDefend + t.hintPunish), `${t.id} : pas de notation`).toBe(false);
    }
    expect(new Set(TRAPS.map((t) => t.chapter))).toEqual(new Set(['mats', 'dame', 'mes']));
    expect(new Set(TRAPS.map((t) => t.id)).size).toBe(TRAPS.length);
  });
  it('mat du berger : la victime a les Noirs, la faute …Nf6, la punition Qxf7#', () => {
    const p = trapPositions(TRAPS.find((t) => t.id === 'berger-h5')!);
    expect(p.victim).toBe('b');
    expect(p.lastUci).toBe('d1h5');
    expect(p.blunderUci).toBe('g8f6');
    expect(p.keyUci).toBe('h5f7');
    expect(new Chess(p.afterBlunder).move('Qxf7#').san).toBe('Qxf7#');
  });
});

describe('pièges d’ouverture : verdicts', () => {
  const p = { goodUci: ['g7g6'], blunderUci: 'g8f6' };
  it('« Défends-toi » : bonne défense, presque aussi bonne (10 pts), piège (faute ou ≥ 20 pts), sinon à refaire', () => {
    expect(defendVerdict('g7g6', p, null)).toBe('ok');
    expect(defendVerdict('g8f6', p, null)).toBe('fell');
    expect(defendVerdict('d7d6', p, 8)).toBe('ok');
    expect(defendVerdict('a7a6', p, 15)).toBe('retry');
    expect(defendVerdict('h7h6', p, 45)).toBe('fell');
  });
  it('« Punis-le » : coup clé, mat, ou presque autant (10 pts)', () => {
    expect(punishOk('h5f7', 'h5f7', { mates: false })).toBe(true);
    expect(punishOk('c4f7', 'h5f7', { mates: true })).toBe(true);
    expect(punishOk('d2d3', 'h5f7', { mates: false, wpMine: 55, wpKey: 99 })).toBe(false);
    expect(punishOk('b1c3', 'c3d5', { mates: false, wpMine: 86, wpKey: 92 })).toBe(true);
  });
});

describe('pièges d’ouverture : maîtrise', () => {
  const a = (d: number, mode: 'defend' | 'punish', clean = true): TrapAttempt => ({ date: T + d * DAY, mode, ok: true, clean });
  it('les deux exercices réussis sans indice, deux jours différents', () => {
    expect(isMastered([a(0, 'defend'), a(0, 'punish')])).toBe(false);                         // un seul jour
    expect(isMastered([a(0, 'defend'), a(0, 'punish'), a(1, 'defend'), a(1, 'punish', false)])).toBe(false); // indice le 2e jour
    expect(isMastered([a(0, 'defend'), a(1, 'punish'), a(2, 'defend')])).toBe(false);          // jamais les deux le même jour
    const ok = [a(0, 'defend'), a(0, 'punish'), a(3, 'punish'), a(3, 'defend', false), a(3, 'defend')];
    expect(cleanDays(ok).length).toBe(2);
    expect(isMastered(ok)).toBe(true);
    expect(trapStatus(undefined)).toBe('nouveau');
    expect(trapStatus({ attempts: [a(0, 'defend', false)] })).toBe('en cours');
    expect(trapStatus({ attempts: ok })).toBe('maîtrisé');
  });
});

describe('pièges d’ouverture : dans mes vraies parties', () => {
  const game = (id: number, sans: string[], myColor: 'w' | 'b'): Game => {
    const c = new Chess();
    return { id, date: T, myColor, startFen: c.fen(), uci: sans.map((s) => { const m = c.move(s); return m.from + m.to; }), san: sans } as unknown as Game;
  };
  it('je suis tombé dans le mat du berger avec les Noirs ; pas quand c’est l’adversaire, ni avec une bonne défense', () => {
    const fell = game(1, ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'], 'b');
    const opp = game(2, ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'], 'w');
    const ok = game(3, ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'g6'], 'b');
    // Par transposition (ordre de coups différent), la même position compte.
    const trans = game(4, ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#'], 'b');
    expect(fallsInGames([fell, opp, ok, trans]).map((f) => [f.trapId, f.gameId, f.ply])).toEqual([['berger-h5', 1, 5], ['berger-h5', 4, 5]]);
  });
});
