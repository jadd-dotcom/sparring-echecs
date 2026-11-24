// Chaque motif sur une position de test connue, avec le vrai Stockfish 19 lite (Node).
import { afterAll, describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { computeErrorDetail } from './motifs';
import { errorReason } from '../reason';
import { createNodeEngine } from '../../../tests/nodeEngine';

const engine = createNodeEngine();
afterAll(() => engine.quit());

/** Position après des coups SAN, puis le coup fautif (SAN) en UCI. */
function setup(sans: string[], bad: string) {
  const c = new Chess();
  sans.forEach((s) => c.move(s));
  const fen = c.fen();
  const m = c.move(bad);
  return { fen, uci: m.from + m.to + (m.promotion ?? ''), me: m.color };
}

describe('motifs sur positions connues (Stockfish)', { timeout: 60000 }, () => {
  it('pièce laissée en prise : 1.e4 d5 2.Qg4?? (Bxg4)', async () => {
    const { fen, uci, me } = setup(['e4', 'd5'], 'Qg4');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('piece-en-prise');
    expect(d.refutation).toMatch(/^2… Bxg4/);
    expect(d.refutationMaterial).toBeLessThanOrEqual(-8);
  });
  it('menace ignorée : 1.e4 e5 2.d4 exd4 3.Qxd4 Nc6 4.a3?? (Nxd4)', async () => {
    const { fen, uci, me } = setup(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6'], 'a3');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('menace-ignoree');
    expect(d.motifs).toContain('piece-en-prise');
    expect(d.threatLine).toMatch(/Nxd4/);
  });
  it('mat raté : 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.d3 (au lieu de Qxf7#)', async () => {
    const { fen, uci, me } = setup(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6'], 'd3');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('mat-rate');
    expect(d.bestLine).toBe('4. Qxf7#');
  });
  it('gain raté : 1.e4 e5 2.Nf3 Bc5 3.Nc3 Bxf2+ 4.Ke2?! (au lieu de Kxf2)', async () => {
    const { fen, uci, me } = setup(['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+'], 'Ke2');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('gain-rate');
    expect(d.bestLine).toMatch(/^4\. Kxf2/);
    expect(errorReason(d, fen, uci)).toBe(`tu pouvais prendre le ♗f2 avec ♔xf2 (${d.bestLine.replace(/K/g, '♔').replace(/N/g, '♘').replace(/B/g, '♗').replace(/Q/g, '♕').replace(/R/g, '♖')})`);
  });
  it('mat ouvert : 1.f3 e5 2.g4?? (Qh4#)', async () => {
    const { fen, uci, me } = setup(['f3', 'e5'], 'g4');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('mat-ouvert');
    expect(d.refutation).toBe('2… Qh4#');
  });
  it('la suite du meilleur coup part du coup donné par l’analyse', async () => {
    const { fen, uci, me } = setup(['e4', 'd5'], 'Qg4');
    const d = await computeErrorDetail(engine, fen, uci, me, 12, 'b1c3');
    expect(d.bestLine).toMatch(/^2\. Nc3/);
  });
  it('autre : 1.e4 e5 2.Ke2 (rien de tactique)', async () => {
    const { fen, uci, me } = setup(['e4', 'e5'], 'Ke2');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motifs).toEqual(['autre']);
  });
  it('les Noirs aussi : 1.e4 e5 2.Nf3 Qh4?? (dame en prise, Nxh4)', async () => {
    const { fen, uci, me } = setup(['e4', 'e5', 'Nf3'], 'Qh4');
    expect(me).toBe('b');
    const d = await computeErrorDetail(engine, fen, uci, me);
    expect(d.motif).toBe('piece-en-prise');
    expect(d.refutation).toMatch(/^3\. Nxh4/);
  });
});
