import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import type { ErrorDetail } from './report/motifs';
import { motifHint, moveNo, whyBest, whyPlayed } from './reviseText';

const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };
const base: ErrorDetail = { v: 2, depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, motifs: ['autre'], motif: 'autre' };

describe('textes de la révision « Trouve le bon coup »', () => {
  // 1.e4 e5 2.Nf3 Bc5 3.Nc3 Bxf2+ : le fou f2 n'est pas défendu, 4.Kxf2 le gagne ; 4.Ke2 le laisse filer.
  const fen = fenOf(['e4', 'e5', 'Nf3', 'Bc5', 'Nc3', 'Bxf2+']);
  const gain: ErrorDetail = { ...base, motif: 'gain-rate', motifs: ['gain-rate'], bestLine: '4. Kxf2 Nf6 5. d4', bestMaterial: 3, refutation: '4… Bb6 5. d4', refutationMaterial: 0 };

  it('numéro de coup lisible', () => {
    expect(moveNo(0)).toBe('1.');
    expect(moveNo(1)).toBe('1…');
    expect(moveNo(6)).toBe('4.');
    expect(moveNo(13)).toBe('7…');
  });

  it('indice « Gain raté » : la pièce adverse non défendue, sans donner le coup', () => {
    const h = motifHint(gain, fen, 'e1e2');
    expect(h).toBe('Une pièce adverse n’est pas défendue : cherche une prise.');
    expect(h).not.toMatch(/Kxf2|♔xf2/);
  });

  it('indice d’une prise défendue / d’un gain sans prise / d’un mat', () => {
    // 1.e4 d5 : exd5 prend un pion défendu par la dame.
    const f2 = fenOf(['e4', 'd5']);
    expect(motifHint({ ...gain, bestLine: '2. exd5 Qxd5' }, f2, 'a2a3')).toBe('Tu peux gagner du matériel par une prise.');
    expect(motifHint({ ...gain, bestLine: '2. Nc3 Nf6' }, f2, 'a2a3')).toMatch(/double attaque/);
    expect(motifHint({ ...gain, bestLine: '4. Qxf7#' }, fen, 'e1e2')).toMatch(/mat/);
    expect(motifHint({ ...base, motif: 'mat-rate', motifs: ['mat-rate'], bestLine: '4. Qxf7#' }, fen, 'e1e2')).toMatch(/mat en quelques coups/);
  });

  it('explication : pourquoi le bon coup est bon et pourquoi le mien l’était moins', () => {
    expect(whyBest(gain, fen, 'e1e2', 'Kxf2')).toBe('♔xf2 prend le ♗f2, qui n’était pas assez défendu (suite : 4. ♔xf2 ♘f6 5. d4, bilan matériel pour toi : +3).');
    expect(whyPlayed(gain, fen, 'e1e2', 'Ke2', 'mistake')).toBe('♔e2 était une erreur (gain raté) : il laisse filer le ♗f2. Après ♔e2 : 4… ♗b6 5. d4, bilan matériel pour toi : 0.');
    const pp: ErrorDetail = { ...base, motif: 'piece-en-prise', motifs: ['piece-en-prise'], refutation: '2… Bxg4 3. h3', refutationMaterial: -9 };
    expect(whyPlayed(pp, fenOf(['e4', 'd5']), 'd1g4', 'Qg4', 'blunder')).toBe('♕g4 était une gaffe (pièce laissée en prise) : le ♗c8 peut prendre ta ♕g4. Après ♕g4 : 2… ♗xg4 3. h3, bilan matériel pour toi : −9.');
  });

  it('indice « pièce en prise » et « menace ignorée » reprennent la raison de la revue', () => {
    const pp: ErrorDetail = { ...base, motif: 'piece-en-prise', motifs: ['piece-en-prise'], refutation: '2… Bxg4 3. h3' };
    expect(motifHint(pp, fenOf(['e4', 'd5']), 'd1g4')).toBe('Ton coup laissait une pièce sans défense (le ♗c8 peut prendre ta ♕g4). Cherche un coup qui garde tes pièces protégées.');
    const mi: ErrorDetail = { ...base, motif: 'menace-ignoree', motifs: ['menace-ignoree'], threatLine: '4… Nxd4 5. Nf3' };
    expect(motifHint(mi, fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']), 'a2a3')).toBe('L’adversaire avait une menace : le ♘c6 menaçait de prendre ta ♕d4. Cherche un coup qui la pare.');
    expect(motifHint(base, new Chess().fen(), 'a2a3')).toMatch(/améliore le plus ta position/);
  });
});
