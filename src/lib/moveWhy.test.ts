import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { moveWhy } from './moveWhy';
import type { SignpostThreat } from './signposts';

/** Pourquoi du dernier coup de `sans` (vu par `me`). */
function why(sans: string, me: 'w' | 'b' = 'w', threat: SignpostThreat | null = null) {
  const seq = sans.split(' ');
  const c = new Chess();
  seq.slice(0, -1).forEach((m) => c.move(m));
  const prev = c.history({ verbose: true }).slice(-1)[0];
  return moveWhy(c.fen(), seq[seq.length - 1], me, prev ? { prev: { fen: prev.before, san: prev.san }, threat } : {});
}

describe('moveWhy : une phrase par coup, les deux camps', () => {
  it('roques (moi / lui)', () => {
    expect(why('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O')).toBe('Petit roque : ton roi se met à l’abri et ta tour se rapproche du centre.');
    expect(why('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 O-O')).toBe('Petit roque : son roi se met à l’abri.');
  });
  it('prise, reprise (matériel égal), colonne ouverte', () => {
    expect(why('c4 d5 cxd5')).toBe('Ton pion prend son pion d5, qui attaquait ton pion c4, et la colonne c s’ouvre pour tes tours.');
    expect(why('d4 d5 c4 c6 cxd5', 'b')).toBe('Son pion prend ton pion d5 : la colonne c s’ouvre pour ses tours.');
    expect(why('c4 d5 cxd5 Qxd5')).toBe('Sa dame reprend en d5 : le matériel reste égal.');
  });
  it('clouage sur la dame (pas pour un pion, pas par la dame) et sur le roi ; déclouage', () => {
    expect(why('c4 e6 Nc3 d5 cxd5 exd5 d4 Nf6 Bg5')).toBe('Ton fou cloue son cavalier f6 sur sa dame.');
    expect(why('c4 d5 cxd5 Qxd5 Nc3 Qd8')).toBe('Sa dame, attaquée par ton cavalier, s’écarte en d8 ; elle surveille aussi d4 et d5.');
    expect(why('d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 cxd5 exd5 Qc2 Bd6 e3 O-O Bd3 h6 Bh4 Be7', 'b')).toBe('Ton fou va en e7 : ton cavalier f6 n’est plus cloué.');
  });
  it('pions : fianchetto, case g4 contrôlée (+ case de fuite si le roi est roqué), c3 prépare d4, attaque d’un pion', () => {
    expect(why('c4 e5 Nc3 Nf6 g3')).toBe('Le pion g3 prépare le fianchetto de ton fou en g2.');
    expect(why('d4 g6 Nf3 Nf6 Bf4 Bg7 e3 O-O Be2 d6 h3')).toBe('Le pion h3 contrôle g4 : ni son fou ni son cavalier ne pourront s’y installer.');
    expect(why('c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 e4 f5 Nge2 Nf6 O-O O-O exf5 Bxf5 h3')).toMatch(/et ton roi a une case de fuite\.$/);
    expect(why('e4 c5 c3', 'b')).toBe('Le pion c3 prépare d4 : il pourra occuper tout le centre.');
    expect(why('c4 c5 Nc3 Nf6 g3 d5', 'w')).toBe('Le pion d5 attaque ton pion c4.');
  });
  it('pièces : avant-poste, dame d2 + fou e3 contre un fianchetto, tour derrière son pion', () => {
    expect(why('c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 e4 e5 Nge2 Nge7 O-O O-O Be3 Nd4')).toBe('Son cavalier s’installe en d4, un [[avant-poste]] protégé par son pion.');
    expect(why('c4 d5 cxd5 Nf6 Nf3 Nxd5 d4 g6 e4 Nb6 h3 Bg7 Nc3 O-O Be3 Nc6 Qd2')).toBe('Ta dame sort en d2 : avec ton fou e3, Bh6 échangera son fou g7, le meilleur défenseur de son roi.');
    expect(why('c4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bc5 e3 O-O Nge2 d6 O-O a6 d4 Ba7 h3 Re8')).toBe('Sa tour vient en e8 et soutient son pion e5.');
  });
  it('interposition (vraie menace seulement) ; pion qui protège une pièce attaquée', () => {
    expect(why('e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6 bxc6 Qd4 Nf6', 'b')).toBe('Ton cavalier bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée ; il surveille aussi d5 et e4.');
    expect(why('e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6 bxc6 Qd4 Nf6 e5 Nd5 e6 f6', 'b')).toBe('Le pion f6 bouche la diagonale de sa dame : ta tour h8 n’est plus attaquée.');
    expect(why('d4 d5 e3 Bf5 Bd3 e6', 'b')).toBe('Le pion e6 protège ton fou f5, attaqué par son fou, et ouvre la diagonale de ton fou f8.');
    // Fou contre cavalier défendu (même valeur) : pas une menace, pas d'interposition annoncée.
    expect(why('d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Bf4 e6 e3 Bd6', 'b')).not.toMatch(/bouche/);
  });
  it('le coup d’avant attaque une pièce mal défendue : la réponse le dit d’abord (les 3 exemples)', () => {
    // 1.c4 c6 … 7.Qb3 Qc7 : la dame protège b7, attaqué par sa dame.
    expect(why('c4 c6 Nf3 d5 e3 Nf6 d4 Bf5 Nc3 e6 Nh4 Bg6 Qb3 Qc7', 'b')).toMatch(/^Ta dame va en c7 et protège ton pion b7, attaqué par sa dame/);
    // 1.d4 d5 2.e3 Bf5 3.Bd3 … 8.Qd3 g6 : le pion g6 protège f5, attaqué par sa dame (et prépare le fianchetto).
    expect(why('d4 d5 e3 Bf5 Bd3 e6 Nf3 c6 c4 Nf6 O-O Nbd7 Bxf5 exf5 Qd3 g6', 'b')).toBe('Le pion g6 protège ton pion f5, attaqué par sa dame, et prépare le fianchetto de ton fou en g7.');
    // Londres … 8…Qb6 9.Qc2 : la dame protège b2, attaqué par sa dame.
    expect(why('d4 e6 Bf4 c5 e3 d5 Nf3 Nf6 c3 Nc6 Nbd2 Nh5 Bg3 Nxg3 hxg3 Qb6 Qc2', 'w')).toMatch(/^Ta dame va en c2 et protège ton pion b2, attaqué par sa dame/);
  });
  it('les autres réponses : s’écarte, prend l’attaquant, pare l’échec, bouche la ligne (menace de mat), contre-attaque', () => {
    expect(why('d4 d5 Bf4 c6 e3 Bf5 f3 e6 g4 Bg6', 'b')).toBe('Ton fou, attaqué par son pion, s’écarte en g6 ; il surveille aussi e4.');
    expect(why('d4 e5 dxe5 Nc6 Nf3 Qe7 Bg5 Qb4+ Nc3', 'w')).toMatch(/^Ton cavalier pare l’échec de sa dame en c3 et se développe\.$/);
    // Menace de mat (Stockfish) : …Nf6 bouche la colonne f de sa dame.
    const mate = { san: 'Qxf7#', line: ['Qxf7#'], mate: 1, gain: 0 };
    expect(why('e4 c5 Bc4 Nc6 Qf3 Nf6', 'b', mate)).toBe('Ton cavalier bouche la colonne de sa dame : plus de menace de mat en f7 ; il surveille aussi d5 et e4.');
    expect(why('e4 c5 Bc4 Nc6 Qh5 e6', 'b', { san: 'Qxf7#', line: ['Qxf7#'], mate: 1, gain: 0 })).toMatch(/^Le pion e6 bouche la diagonale de son fou : plus de menace de mat en f7/);
    // Rien d'attaqué par le coup d'avant : description habituelle.
    expect(why('c4 e5 Nc3 Nf6 g3')).toBe('Le pion g3 prépare le fianchetto de ton fou en g2.');
  });
  it('toujours une seule phrase qui finit par un point', () => {
    const c = new Chess();
    for (const m of 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3 Nc6 Nbd2 Bd6 Bg3 O-O Bd3 b6 Ne5 Bb7 f4'.split(' ')) {
      const t = moveWhy(c.fen(), m, 'w');
      expect(t.endsWith('.'), t).toBe(true);
      expect((t.slice(0, -1).match(/[.!?](\s|$)/g) ?? []).length, t).toBe(0);
      c.move(m);
    }
  });
});
