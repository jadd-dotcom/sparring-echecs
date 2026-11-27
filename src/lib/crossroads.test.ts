// Carrefours : détection, cartes par coup-panneau, arbre des lignes groupé, noms de lignes.
import { describe, expect, it } from 'vitest';
import { parsePgn } from './repertoire';
import { crossroads, lastCrossroadPly, lineName, lineTree, linesUnder, moveLabel, signpostCards } from './crossroads';
import { lines } from './repertoire';

// Mini-répertoire Noirs : 1.d4 d5 2.c4 (c6 3.Nf3 Nf6 | 3.Nc3 Nf6) | 2.Nf3 Nf6 | 2.Bf4 Bf5 ; 1.c4 c6
const PGN = `[Orientation "black"]

1. d4 (1. c4 c6) 1... d5 2. c4 (2. Nf3 Nf6) (2. Bf4 Bf5) 2... c6 3. Nf3 (3. Nc3 Nf6) 3... Nf6 *`;

describe('carrefours', () => {
  const root = parsePgn(PGN).root;
  const cs = crossroads(root, 'b');
  it('positions où il a au moins 2 coups dans mon arbre, avec ma réponse à chacun', () => {
    expect(cs.map((c) => c.path.join(' '))).toEqual(['', 'd4 d5', 'd4 d5 c4 c6']);
    expect(cs[1].branches).toEqual([{ his: 'c4', mine: 'c6', ply: 2 }, { his: 'Nf3', mine: 'Nf6', ply: 2 }, { his: 'Bf4', mine: 'Bf5', ply: 2 }]);
    expect(signpostCards(root, 'b').length).toBe(2 + 3 + 2);
    expect(moveLabel(2, 'Nc3')).toBe('2.Nc3');
    expect(moveLabel(3, 'c6')).toBe('2…c6');
  });
  it('arbre des lignes groupé : chaque ligne sous son dernier coup-panneau ; nom = coup-panneau', () => {
    const all = lines(root);
    const t = lineTree(all, cs);
    expect(t.root).toEqual([]);
    expect(t.nodes.map((n) => n.his)).toEqual(['d4', 'c4']);
    const d4 = t.nodes[0];
    expect(d4.children.map((n) => `${n.his} → ${n.mine}`)).toEqual(['c4 → c6', 'Nf3 → Nf6', 'Bf4 → Bf5']);
    expect(d4.children[0].children.map((n) => `${n.his} → ${n.mine}`)).toEqual(['Nf3 → Nf6', 'Nc3 → Nf6']);
    expect(linesUnder(d4).length).toBe(4);
    const l = ['d4', 'd5', 'c4', 'c6', 'Nc3', 'Nf6'];
    expect(lastCrossroadPly(l, cs)).toBe(4);
    expect(lineName(l, undefined, cs)).toBe('3.Nc3');
    expect(lineName(['d4', 'd5', 'Bf4', 'Bf5'], undefined, cs)).toBe('2.Bf4');
    expect(lineName(l, undefined, cs, l)).toBe('Ligne principale');
  });
});
