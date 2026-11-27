// Recalcul des détails : quels coups sont à refaire.
import { describe, expect, it } from 'vitest';
import { stalePlies } from './detailRefresh';
import { DETAIL_VERSION } from './lib/report/motifs';

const a = (ply: number, severity: string, v?: number) => ({ ply, severity, detail: v === undefined ? undefined : { v } });
describe('recalcul des détails anciens', () => {
  it('erreurs et gaffes sans détail à jour, et imprécisions qui avaient un détail ancien', () => {
    const g = { analysis: [a(0, 'ok'), a(2, 'blunder', 2), a(4, 'mistake', DETAIL_VERSION), a(6, 'inaccuracy', 2), a(8, 'inaccuracy'), a(10, 'mistake')] };
    expect(stalePlies(g as never)).toEqual([2, 6, 10]);
  });
});
