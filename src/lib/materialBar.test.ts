import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { advantageLabel, advantageOf, capturedLabel, groups, lossPulse, materialState } from './materialBar';

const START = new Chess().fen();
const uciOf = (sans: string, from = START) => { const c = new Chess(from); return sans.split(' ').map((s) => { const m = c.move(s); return m.from + m.to + (m.promotion ?? ''); }); };

describe('matériel pendant la partie', () => {
  it('position de départ : rien de pris, égalité (pas de +N)', () => {
    const s = materialState(START, []);
    expect(s).toEqual({ captured: { w: [], b: [] }, diff: 0 });
    expect(advantageOf(s, 'w')).toBeNull();
    expect(advantageOf(s, 'b')).toBeNull();
  });
  it('pièces prises lues dans l’historique, groupées par type ; +N du camp qui a plus', () => {
    // 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.Bc4 Nf6 5.Bxf7+ Kxf7 : les Blancs ont pris 2 pions, les Noirs 1 pion et 1 fou.
    const s = materialState(START, uciOf('e4 d5 exd5 Qxd5 Nc3 Qa5 Bc4 Nf6 Bxf7+ Kxf7'));
    expect(s.captured.w).toEqual(['p', 'p']);
    expect(s.captured.b).toEqual(['p', 'b']);
    expect(s.diff).toBe(-2);                           // 37 − 35 sur l'échiquier
    expect(advantageOf(s, 'b')).toBe(2);
    expect(advantageOf(s, 'w')).toBeNull();
    expect(advantageLabel('b', 3)).toBe('Les Noirs ont 3 points de plus');
    expect(advantageLabel('w', 1)).toBe('Les Blancs ont 1 point de plus');
    expect(capturedLabel('b', s.captured.b)).toBe('Pièces prises par les noirs : 1 pion, 1 fou');
    expect(groups(['p', 'p', 'n', 'q'])).toEqual([{ type: 'p', n: 2 }, { type: 'n', n: 1 }, { type: 'q', n: 1 }]);
  });
  it('une promotion compte dans les points (calculés sur l’échiquier)', () => {
    const fen = '8/P6k/8/8/8/8/8/K7 w - - 0 1';
    const s = materialState(fen, ['a7a8q']);
    expect(s.diff).toBe(9);
    // Position de départ autre que l'initiale : les pièces qui manquent comptent comme prises.
    expect(s.captured.b.filter((t) => t === 'q')).toHaveLength(1);
    expect(s.captured.w).toContain('p');
  });
  it('pulsation : son coup me fait perdre au moins 2 points nets et il passe devant', () => {
    // 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 : sa dame prend g2 (1 point) → pas de pulsation.
    expect(lossPulse(START, uciOf('e4 e5 Nf3 Nc6 Bc4 Nd4 Nxe5 Qg5 Nxf7 Qxg2'), 'w')).toBe(false);
    // 1.e4 e5 2.Bc4 Nf6 3.Bxf7+? Kxf7 : je perds mon fou (−3 net, après avoir pris un pion → il a +2) → pulsation.
    expect(lossPulse(START, uciOf('e4 e5 Bc4 Nf6 Bxf7+ Kxf7'), 'w')).toBe(true);
    // Échange égal (je prends un fou, il reprend) : pas de pulsation.
    expect(lossPulse(START, uciOf('e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6'), 'w')).toBe(false);
    // Le dernier coup est le mien : jamais.
    expect(lossPulse(START, uciOf('e4 e5 Bc4 Nf6 Bxf7+'), 'w')).toBe(false);
  });
});
