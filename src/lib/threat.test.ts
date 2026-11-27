// « Qu'est-ce qu'il menace ? » : coup nul, verdict (≥ 20 pts ou mat), phrase en mots, réponse acceptée.
import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { isThreatAnswerOk, pvToSan, threatGain, threatPositions, threatSentence } from './threat';
import { nullMove } from './words';

const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };

describe('menace par coup nul', () => {
  it('le trait passe à l’adversaire (prise en passant effacée) ; impossible si je suis en échec', () => {
    const f = fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']);
    expect(threatPositions(f, 'w')).toEqual({ fenMe: f, fenHim: nullMove(f) });
    expect(nullMove(fenOf(['e4'])).split(' ').slice(1, 4)).toEqual(['w', 'KQkq', '-']);
    expect(threatPositions(fenOf(['e4', 'f5', 'Qh5+']), 'b')).toBeNull();
    // Au trait de l'adversaire : on compare avec la position où j'aurais le trait.
    const his = fenOf(['e4']);
    expect(threatPositions(his, 'w')).toEqual({ fenMe: nullMove(his), fenHim: his });
  });
  it('vraie menace : au moins 20 points de win% gagnés, ou un mat', () => {
    expect(threatGain({ cp: 0 }, { cp: 30 }).serious).toBe(false);            // 50 % → ~53 %
    const g = threatGain({ cp: 0 }, { cp: 600 });                              // une pièce de gagnée
    expect(g.serious).toBe(true);
    expect(Math.round(g.gain)).toBeGreaterThanOrEqual(20);
    expect(threatGain({ cp: -900 }, { mate: 1 }).mate).toBe(true);
    expect(threatGain({ cp: -900 }, { mate: 1 }).serious).toBe(true);
    expect(threatGain({ mate: -2 }, { mate: 1 }).mate).toBe(false);           // déjà mat forcé : rien de nouveau
  });
  it('phrase en mots et suite en SAN', () => {
    const f = fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']);
    expect(threatSentence(nullMove(f), 'c6d4', 'w', false)).toBe('Il menace ceci : son cavalier prend ta dame d4.');
    const m = fenOf(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5']);
    expect(threatSentence(nullMove(m), 'h5f7', 'b', true)).toBe('Il menace ceci : sa dame prend ton pion f7 : échec et mat.');
    expect(pvToSan(nullMove(f), ['c6d4', 'f1d3', 'zzzz'])).toEqual(['Nxd4', 'Bd3']);
  });
  it('« Lis la menace » : sa menace, un mat, ou un coup qui rapporte presque autant (10 points)', () => {
    const o = { mates: false, wpOppAfterMine: 60, threatWp: 80 };
    expect(isThreatAnswerOk('c6d4', 'c6d4', o)).toBe(true);
    expect(isThreatAnswerOk('a7a6', 'c6d4', o)).toBe(false);
    expect(isThreatAnswerOk('a7a6', 'c6d4', { ...o, wpOppAfterMine: 71 })).toBe(true);
    expect(isThreatAnswerOk('d8h4', 'c6d4', { ...o, mates: true })).toBe(true);
  });
});
