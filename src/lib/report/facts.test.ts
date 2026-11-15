import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { asciiBoard, balance, flipTurn, formatPv, material, opponentGain, phaseOf } from './facts';
import { detectMotifs, type MotifFacts } from './motifs';

const START = new Chess().fen();
const fenOf = (sans: string[], start?: string) => { const c = new Chess(start); sans.forEach((s) => c.move(s)); return c.fen(); };

describe('matériel et phases', () => {
  it('matériel de départ : 39 par camp, 31 hors pions', () => {
    expect(material(START)).toEqual({ w: 39, b: 39, wNonPawn: 31, bNonPawn: 31 });
    expect(balance('4k3/8/8/8/8/8/8/3QK3 w - - 0 1', 'w')).toBe(9);
    expect(balance('4k3/8/8/8/8/8/8/3QK3 w - - 0 1', 'b')).toBe(-9);
  });
  it('ouverture = coups 1 à 10', () => {
    expect(phaseOf(0, START)).toBe('ouverture');
    expect(phaseOf(19, START)).toBe('ouverture'); // 10… (Noirs)
    expect(phaseOf(20, START)).toBe('milieu');    // 11. avec toutes les pièces
  });
  it('finale = chaque camp ≤ 13 pts hors pions', () => {
    // Tour + fou (8) contre dame + cavalier (12) : finale
    expect(phaseOf(40, '4k3/pp3ppp/8/2n5/8/8/PPq2PPP/R1B1K3 w - - 0 21')).toBe('finale');
    // Dame + tour (14) d'un côté : encore le milieu
    expect(phaseOf(40, '4k3/pp3ppp/8/8/8/8/PPq2PPP/RQ2K3 w - - 0 21')).toBe('milieu');
    // Seuil exact : deux tours + fou = 13 → finale
    expect(phaseOf(40, '4k3/8/8/8/8/8/8/RR1BK3 w - - 0 21')).toBe('finale');
  });
});

describe('plateau ASCII et suites', () => {
  it('Blancs en bas', () => {
    const a = asciiBoard(START, 'w').split('\n');
    expect(a[1]).toBe('8 | r n b q k b n r |');
    expect(a[8]).toBe('1 | R N B Q K B N R |');
    expect(a[10]).toBe('    a b c d e f g h');
  });
  it('Noirs en bas : plateau retourné', () => {
    const a = asciiBoard(fenOf(['e4']), 'b').split('\n');
    expect(a[1]).toBe('1 | R N B K Q B N R |');
    expect(a[5]).toBe('5 | . . . . . . . . |');
    expect(a[4]).toBe('4 | . . . P . . . . |');
    expect(a[10]).toBe('    h g f e d c b a');
  });
  it('suite numérotée à partir d’un coup noir', () => {
    expect(formatPv(fenOf(['e4']), ['e5', 'Nf3', 'Nc6'])).toBe('1… e5 2. Nf3 Nc6');
  });
  it('gain de l’adversaire en 2 demi-coups', () => {
    const f = fenOf(['e4', 'd5', 'Qg4']); // la dame blanche est en prise
    expect(opponentGain(f, ['c8g4', 'h2h3'], 'w')).toBe(9);
    expect(opponentGain(fenOf(['e4', 'd5']), ['e4d5', 'd8d5'], 'b')).toBe(0); // échange
  });
  it('trait inversé', () => {
    expect(flipTurn(fenOf(['e4'])).split(' ').slice(1, 4).join(' ')).toBe('w KQkq -');
  });
});

describe('règles des motifs (faits donnés)', () => {
  const base: MotifFacts = { mateForMeBefore: null, playedKeepsMate: false, mateAgainstMeAfter: null, refutationGain2: 0, threat: { mate: null, gain2: 0 }, threatStillWorks: false };
  it('autre', () => expect(detectMotifs(base)).toEqual({ motifs: ['autre'], motif: 'autre' }));
  it('pièce en prise', () => expect(detectMotifs({ ...base, refutationGain2: 3 }).motif).toBe('piece-en-prise'));
  it('gain de 1 pt : pas en prise', () => expect(detectMotifs({ ...base, refutationGain2: 1 }).motif).toBe('autre'));
  it('menace ignorée prioritaire sur pièce en prise', () => {
    const r = detectMotifs({ ...base, threat: { mate: null, gain2: 9 }, threatStillWorks: true, refutationGain2: 9 });
    expect(r).toEqual({ motifs: ['menace-ignoree', 'piece-en-prise'], motif: 'menace-ignoree' });
  });
  it('menace parée : pas de « menace ignorée »', () => {
    expect(detectMotifs({ ...base, threat: { mate: null, gain2: 9 }, threatStillWorks: false }).motif).toBe('autre');
  });
  it('en échec : pas de menace évaluée', () => expect(detectMotifs({ ...base, threat: null }).motif).toBe('autre'));
  it('mat raté (sauf si mon coup garde le mat)', () => {
    expect(detectMotifs({ ...base, mateForMeBefore: 2 }).motif).toBe('mat-rate');
    expect(detectMotifs({ ...base, mateForMeBefore: 2, playedKeepsMate: true }).motif).toBe('autre');
  });
  it('mat ouvert', () => expect(detectMotifs({ ...base, mateAgainstMeAfter: 1 }).motif).toBe('mat-ouvert'));
});
