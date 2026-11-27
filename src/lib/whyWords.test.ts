import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import type { ErrorDetail } from './report/motifs';
import { reasonWords, whyWords } from './whyWords';

const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };
const base: ErrorDetail = { v: 2, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: ['autre'], motif: 'autre' };
const NOTATION = /\b\d+\.\s|\d+…|♔|♕|♖|♗|♘|\b[KQRBN][a-h]?x?[a-h][1-8]/;

describe('« Pourquoi » en mots, sans notation', () => {
  it('pièce en prise : 2.Qg4?? → « son fou prend ta dame g4 »', () => {
    const fen = fenOf(['e4', 'd5']);
    const d: ErrorDetail = { ...base, motif: 'piece-en-prise', motifs: ['piece-en-prise'], bestLine: '2. exd5 Qxd5', refutation: '2… Bxg4 3. h3' };
    expect(reasonWords(d, fen, 'd1g4', 'w')).toBe('après ton coup, son fou prend ta dame g4');
    const w = whyWords(d, fen, 'd1g4', 'e4d5', 'w');
    expect(w).toEqual(['Le bon coup : ton pion prend son pion d5.', 'Après ton coup, son fou prend ta dame g4.']);
    for (const s of w) expect(s).not.toMatch(NOTATION);
  });
  it('menace ignorée : « il menaçait ceci : son cavalier prend ta dame d4 »', () => {
    const fen = fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']);
    const d: ErrorDetail = { ...base, motif: 'menace-ignoree', motifs: ['menace-ignoree'], threatLine: '4… Nxd4 5. Nf3', bestLine: '4. Qe3 Nf6', refutation: '4… Nxd4' };
    expect(reasonWords(d, fen, 'a2a3', 'w')).toBe('il menaçait ceci : son cavalier prend ta dame d4');
    const [a, b] = whyWords(d, fen, 'a2a3', 'd4e3', 'w');
    expect(a).toBe('Le bon coup pare sa menace : ta dame va en e3.');
    expect(b).toBe('Ton coup laissait faire sa menace : son cavalier prend ta dame d4.');
  });
  it('mat raté / gain raté', () => {
    const fen = fenOf(['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6']);
    const d: ErrorDetail = { ...base, motif: 'mat-rate', motifs: ['mat-rate'], bestLine: '4. Qxf7#' };
    expect(whyWords(d, fen, 'd2d3', 'h5f7', 'w')[0]).toBe('Le bon coup mène au mat : ta dame prend son pion f7 : échec et mat.');
    const g = fenOf(['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+']);
    const dg: ErrorDetail = { ...base, motif: 'gain-rate', motifs: ['gain-rate'], bestLine: '4. Kxf2 Nf6' };
    expect(reasonWords(dg, g, 'e1e2', 'w')).toBe('tu pouvais gagner du matériel : ton roi prend son fou f2');
    expect(whyWords(dg, g, 'e1e2', 'e1f2', 'w')).toEqual(['Le bon coup gagne du matériel : ton roi prend son fou f2.', 'Ton coup laisse passer ce gain.']);
  });
});
