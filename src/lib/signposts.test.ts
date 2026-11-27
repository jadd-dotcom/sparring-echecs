// Phrases-panneaux : ce que son coup change → ma réponse.
import { describe, expect, it } from 'vitest';
import { parsePgn } from './repertoire';
import { signpostCards } from './crossroads';
import { signpostSentence } from './signposts';

const PGN = `[Orientation "black"]

1. d4 d5 2. c4 (2. Nf3 Nf6) (2. Bf4 Bf5) (2. e4 dxe4) 2... c6 3. Nf3 (3. cxd5 cxd5) 3... Nf6 *`;

describe('phrases-panneaux', () => {
  const cards = signpostCards(parsePgn(PGN).root, 'b');
  const s = (id: string) => signpostSentence(cards.find((c) => c.id === id)!, 'b');
  it('attaque d’un pion central → je le soutiens', () => expect(s('d4 d5 c4')).toBe('Il attaque ton pion d5 → tu le soutiens : …c6'));
  it('développement → développement ; gambit → je prends ; prise → je reprends', () => {
    expect(s('d4 d5 Nf3')).toBe('Il sort son cavalier en f3 → tu sors ton cavalier : …Nf6');
    expect(s('d4 d5 Bf4')).toBe('Il sort son fou en f4 → tu sors ton fou : …Bf5');
    expect(s('d4 d5 e4')).toBe('Il attaque ton pion d5 → tu prends : …dxe4');
    expect(s('d4 d5 c4 c6 cxd5')).toBe('Il prend ton pion d5 → tu prends : …cxd5');
  });
  it('une phrase par coup-panneau, toujours avec mon coup', () => {
    for (const c of cards) expect(signpostSentence(c, 'b')).toMatch(/^Il .+ → .+ : …\S+$/);
  });
});
