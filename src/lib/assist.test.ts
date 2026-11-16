import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { gameAccuracy, moveAccuracy } from './accuracy';
import { threatsAgainst } from './threats';
import { errorReason, firstSan } from './reason';
import type { ErrorDetail } from './report/motifs';

const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };

describe('précision (formule Lichess)', () => {
  it('précision d’un coup', () => {
    expect(moveAccuracy(50, 50)).toBe(100);
    expect(moveAccuracy(50, 60)).toBe(100);                 // le % de gain monte : 100
    expect(moveAccuracy(50, 45)).toBeCloseTo(80.82, 1);     // chute de 5 pts
    expect(moveAccuracy(60, 50)).toBeCloseTo(64.58, 1);     // chute de 10 pts
    expect(moveAccuracy(80, 50)).toBeCloseTo(25.78, 1);     // chute de 30 pts
    expect(moveAccuracy(100, 0)).toBe(0);
  });
  it('partie parfaite : 100 % des deux côtés', () => {
    const w = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * 15)) - 1); // % de départ (15 cp)
    const r = gameAccuracy(Array(20).fill(w));
    expect(r.w).toBeCloseTo(100, 5);
    expect(r.b).toBeCloseTo(100, 5);
  });
  it('une gaffe des Noirs fait baisser leur précision, pas celle des Blancs', () => {
    const w0 = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * 15)) - 1);
    const series = [w0, w0, w0, w0, w0, 90, 90, 90, 90, 90];    // 6e demi-coup (Noirs) : le % des Blancs bondit à 90
    const r = gameAccuracy(series);
    expect(r.w).toBeCloseTo(100, 5);
    expect(r.b!).toBeLessThan(60);
    expect(r.b!).toBeGreaterThan(5);
  });
  it('les Noirs commencent (position de départ trait aux Noirs)', () => {
    const r = gameAccuracy([40, 40], false);
    expect(r.b).not.toBeNull();
    expect(r.w).toBe(100);
  });
});

describe('menaces', () => {
  it('dame attaquée par un cavalier : menace', () => {
    const t = threatsAgainst(fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']), 'w');
    expect(t).toContainEqual({ from: 'c6', to: 'd4', attacker: 'n', target: 'q' });
  });
  it('pion non défendu attaqué : menace ; une fois défendu : plus de menace', () => {
    expect(threatsAgainst(fenOf(['e4', 'd5']), 'w')).toContainEqual({ from: 'd5', to: 'e4', attacker: 'p', target: 'p' });
    expect(threatsAgainst(fenOf(['e4', 'd5', 'Nc3']), 'w')).toEqual([]);   // e4 défendu par le cavalier : échange égal
  });
  it('fou non défendu attaqué par un cavalier : menace', () => {
    expect(threatsAgainst('4k3/8/8/8/3n4/8/2B5/4K3 w - - 0 1', 'w')).toContainEqual({ from: 'd4', to: 'c2', attacker: 'n', target: 'b' });
  });
});

describe('raison de l’erreur', () => {
  const base: ErrorDetail = { depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: ['autre'], motif: 'autre' };
  it('premier coup d’une suite', () => {
    expect(firstSan('12… Nf6 13. Bxf7+')).toBe('Nf6');
    expect(firstSan('4. Qxf7#')).toBe('Qxf7#');
  });
  it('menace ignorée : « le ♘c6 menaçait de prendre ta ♕d4 »', () => {
    const fen = fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']);
    const r = errorReason({ ...base, motif: 'menace-ignoree', motifs: ['menace-ignoree'], threatLine: '4… Nxd4 5. Nf3' }, fen, 'a2a3');
    expect(r).toBe('le ♘c6 menaçait de prendre ta ♕d4');
  });
  it('pièce en prise : « le ♗c8 peut prendre ta ♕g4 »', () => {
    const fen = fenOf(['e4', 'd5']);
    const r = errorReason({ ...base, motif: 'piece-en-prise', motifs: ['piece-en-prise'], refutation: '2… Bxg4 3. h3' }, fen, 'd1g4');
    expect(r).toBe('le ♗c8 peut prendre ta ♕g4');
  });
  it('mat raté / mat ouvert / autre', () => {
    expect(errorReason({ ...base, motif: 'mat-rate', bestLine: '4. Qxf7#' }, fenOf(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6']), 'd2d3')).toBe('tu pouvais mater : 4. ♕xf7#');
    expect(errorReason({ ...base, motif: 'mat-ouvert', refutation: '2… Qh4#' }, fenOf(['f3', 'e5']), 'g2g4')).toBe('il permet un mat : 2… ♕h4#');
    expect(errorReason(base, new Chess().fen(), 'e2e4')).toBeNull();
  });
});
