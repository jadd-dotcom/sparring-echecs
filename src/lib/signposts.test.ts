// Phrases-panneaux : ce que son coup change → ma réponse.
import { describe, expect, it } from 'vitest';
import { parsePgn } from './repertoire';
import { signpostCards } from './crossroads';
import { signpostSentence } from './signposts';
import { BUILTIN_OPENINGS } from '../data/openings';
import { OPENING_LESSONS } from '../data/openingLessons';

const PGN = `[Orientation "black"]

1. d4 d5 2. c4 (2. Nf3 Nf6) (2. Bf4 Bf5) (2. e4 dxe4) 2... c6 3. Nf3 (3. cxd5 cxd5) 3... Nf6 *`;

describe('phrases-panneaux : règles simples (sans leçon ni menace)', () => {
  const cards = signpostCards(parsePgn(PGN).root, 'b');
  const s = (id: string) => signpostSentence(cards.find((c) => c.id === id)!, 'b');
  it('attaque d’un pion central → je le soutiens', () => expect(s('d4 d5 c4')).toBe('Il attaque ton pion d5 → tu le soutiens (…c6)'));
  it('développement → développement ; gambit → je prends ; prise → je reprends', () => {
    expect(s('d4 d5 Nf3')).toBe('Il sort son cavalier en f3 → tu sors ton cavalier (…Nf6)');
    expect(s('d4 d5 Bf4')).toBe('Il sort son fou en f4 → tu sors ton fou (…Bf5)');
    expect(s('d4 d5 e4')).toBe('Il attaque ton pion d5 → tu prends (…dxe4)');
    expect(s('d4 d5 c4 c6 cxd5')).toBe('Il prend ton pion d5 → tu prends (…cxd5)');
  });
  it('une phrase par coup-panneau, toujours avec mon coup', () => {
    for (const c of cards) expect(signpostSentence(c, 'b')).toMatch(/^Il .+ → .+ \(…\S+\)$/);
  });
});

describe('phrases-panneaux : la menace d’abord (mat en f7), puis le « pourquoi » de la leçon', () => {
  const o = BUILTIN_OPENINGS.find((x) => x.id === 'g6-system')!;
  const lesson = OPENING_LESSONS.find((l) => l.openingId === 'g6-system')!;
  const cards = signpostCards(parsePgn(o.pgn).root, 'b');
  const card = (id: string) => { const c = cards.find((x) => x.id === id); expect(c, id).toBeDefined(); return c!; };
  const s = (id: string) => signpostSentence(card(id), 'b', { lesson });
  it('1.e4 c5 2.Bc4 Nc6 3.Qf3 : mat en f7 → …Nf6 bouche la colonne f', () => {
    expect(s('e4 c5 Bc4 Nc6 Qf3')).toMatch(/^Il menace Qxf7 mat → ton cavalier bloque la colonne f.* \(…Nf6\)$/);
  });
  it('1.e4 c5 2.Nc3 Nc6 3.Bc4 g6 4.Qf3 : mat en f7 → …Nf6 (et non « il attaque e4 »)', () => {
    const t = s('e4 c5 Nc3 Nc6 Bc4 g6 Qf3');
    expect(t).toMatch(/^Il menace Qxf7 mat → ton cavalier bloque la colonne f.* \(…Nf6\)$/);
    expect(t).not.toMatch(/attaque.*e4/);
  });
  it('1.e4 c5 2.Qh5 d6 3.Bc4 g6 4.Qf3 : Qxf7+ (pas mat : le roi va en d7) → …Nf6 bouche la colonne f', () => {
    const t = s('e4 c5 Qh5 d6 Bc4 g6 Qf3');
    expect(t).toMatch(/Qxf7\+.* → ton cavalier bloque la colonne f.* \(…Nf6\)$/);
    expect(t).not.toMatch(/attaque.*e4/);
  });
  it('1.e4 c5 2.Bc4 Nc6 3.Qh5 : mat en f7 → …e6 coupe la diagonale c4-f7 et ouvre f8-c5', () => {
    expect(s('e4 c5 Bc4 Nc6 Qh5')).toMatch(/^Il menace Qxf7 mat → le pion e6 ferme la route du fou vers f7 et ouvre celle de ton fou f8.* \(…e6\)$/);
  });
  it('sans « pourquoi » de leçon : ce que mon coup fait contre la menace', () => {
    expect(signpostSentence(card('e4 c5 Bc4 Nc6 Qf3'), 'b')).toBe('Il menace Qxf7 mat → tu bouches la ligne (…Nf6)');
    expect(signpostSentence(card('e4 c5 Bc4 Nc6 Qh5'), 'b')).toBe('Il menace Qxf7 mat → tu bouches la ligne (…e6)');
    const t = { san: 'Bxf5', line: ['Bxf5'], mate: null, gain: 3, captured: { type: 'b' as const, sq: 'f5' } };
    const ld = signpostCards(parsePgn(BUILTIN_OPENINGS.find((x) => x.id === 'london-def')!.pgn).root, 'b').find((x) => x.id === 'd4 d5 e3 Bf5 Bd3')!;
    expect(signpostSentence(ld, 'b', { threat: t })).toBe('Il menace de prendre ton fou f5 → tu défends f5 (…e6)');
  });
  it('chaque carte du répertoire actif : une phrase, mon coup entre parenthèses, la menace d’abord quand il y en a une', () => {
    for (const op of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
      const l = OPENING_LESSONS.find((x) => x.openingId === op.id);
      for (const c of signpostCards(parsePgn(op.pgn).root, op.color)) {
        expect(signpostSentence(c, op.color, { lesson: l })).toMatch(/^\S.+ → .+ \((…)?\S+\)$/);
      }
    }
  });
});
