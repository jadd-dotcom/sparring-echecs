// « Qu'est-ce qu'il menace ? » avec le vrai Stockfish (Node) : coup nul, menace de pièce, menace de mat, rien.
import { afterAll, describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { findThreat, type ThreatSearch } from './threat';
import { createNodeEngine } from '../../tests/nodeEngine';

const engine = createNodeEngine();
afterAll(() => engine.quit());
const search: ThreatSearch = (fen) => engine.search(fen, 10);
const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };

describe('menace par coup nul (Stockfish)', { timeout: 60000 }, () => {
  it('1.e4 e5 2.d4 exd4 3.Qxd4 Nc6 : il menace de prendre ma dame (Nxd4)', async () => {
    const r = await findThreat(fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']), 'w', search);
    expect(r.status).toBe('threat');
    if (r.status !== 'threat') return;
    expect(r.uci).toBe('c6d4');
    expect(r.san).toBe('Nxd4');
    expect(r.gain).toBeGreaterThanOrEqual(20);
    expect(r.bestUci).toBeTruthy();
  });
  it('1.e4 e5 2.Bc4 Nc6 3.Qh5 (j’ai les Noirs) : il menace de mater (Qxf7#)', async () => {
    const r = await findThreat(fenOf(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5']), 'b', search);
    expect(r.status).toBe('threat');
    if (r.status !== 'threat') return;
    expect(r.mate).toBe(true);
    expect(r.san).toBe('Qxf7#');
  });
  it('après 1.e4 e5 (j’ai les Blancs) : pas de menace sérieuse', async () => {
    const r = await findThreat(fenOf(['e4', 'e5']), 'w', search);
    expect(r.status).toBe('none');
  });
  it('je suis en échec : pas de coup nul', async () => {
    expect((await findThreat(fenOf(['e4', 'f5', 'Qh5+']), 'b', search)).status).toBe('check');
  });
});
