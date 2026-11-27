// Choix des cartes « Lis la menace » : positions juste après son coup, menaces ignorées d'abord, quota de 5 par jour.
import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import type { Game, MoveAnalysis } from '../db';
import { looksLikeNewThreat, threatCandidates, threatKey, threatQuotaLeft } from './threatCards';
import { dayKey } from './srs';

const START = new Chess().fen();
const fenOf = (sans: string[]) => { const c = new Chess(); sans.forEach((s) => c.move(s)); return c.fen(); };
function game(id: number, sans: string[], myColor: 'w' | 'b', date: number, ignoredPly?: number): Game {
  const c = new Chess();
  const uci = sans.map((s) => { const m = c.move(s); return m.from + m.to + (m.promotion ?? ''); });
  const analysis: MoveAnalysis[] = sans.map((s, ply) => ({ ply, san: s, uci: uci[ply], bestUci: null, bestSan: null, wpBefore: 50, wpAfter: 50, drop: 0, severity: 'ok' as const }))
    .filter((a) => (a.ply % 2 === 0) === (myColor === 'w'));
  if (ignoredPly !== undefined) {
    const a = analysis.find((x) => x.ply === ignoredPly)!;
    a.severity = 'blunder';
    a.detail = { depth: 12, bestLine: '', bestMaterial: 0, refutation: '', refutationMaterial: 0, threatLine: '4… Nxd4', motifs: ['menace-ignoree'], motif: 'menace-ignoree' };
  }
  return { id, source: 'app', date, myColor, startFen: START, uci, san: sans, result: '1-0', score: 0, termination: '', ratingBefore: 900, ratingAfter: 900, botElo: 900, analysis } as Game;
}

describe('cartes « Lis la menace » : choix des positions', () => {
  it('tri rapide : son coup crée une prise gagnante ou un mat en 1', () => {
    expect(looksLikeNewThreat(fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4']), fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']), 'w')).toBe(true);
    expect(looksLikeNewThreat(fenOf(['e4', 'e5', 'Bc4', 'Nc6']), fenOf(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5']), 'b')).toBe(true);
    expect(looksLikeNewThreat(fenOf(['e4']), fenOf(['e4', 'e5']), 'w')).toBe(false);
  });
  it('menaces ignorées d’abord, puis les autres, parties récentes d’abord ; jamais en échec ni au 1er coup', () => {
    const old = game(1, ['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6', 'a3'], 'w', 1000, 6);   // menace ignorée (4.a3??)
    const recent = game(2, ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'g6'], 'b', 2000);            // menace de mat, parée
    const check = game(3, ['e4', 'f5', 'Qh5+', 'g6'], 'b', 3000);                           // en échec : pas de coup nul
    const cands = threatCandidates([old, recent, check], new Set());
    expect(cands.map((c) => [c.gameId, c.ply, c.ignored])).toEqual([[1, 6, true], [2, 5, false]]);
    const first = cands[0];
    expect(first.lastMoveUci).toBe('b8c6');
    expect(first.prevFen).toBe(fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4']));
    expect(first.fen).toBe(fenOf(['e4', 'e5', 'd4', 'exd4', 'Qxd4', 'Nc6']));
    // Positions déjà prises (ou déjà vérifiées) : ignorées.
    expect(threatCandidates([old, recent], new Set([threatKey(1, 6)])).map((c) => [c.gameId, c.ply])).toEqual([[2, 5]]);
  });
  it('au plus 5 nouvelles cartes par jour', () => {
    const now = Date.now();
    const today = dayKey();
    const t = (createdAt: number) => ({ kind: 'threat' as const, createdAt });
    expect(threatQuotaLeft([], today)).toBe(5);
    expect(threatQuotaLeft([t(now), t(now), { kind: 'mistake', createdAt: now }], today)).toBe(3);
    expect(threatQuotaLeft([t(now - 3 * 86400000), ...Array.from({ length: 6 }, () => t(now))], today)).toBe(0);
  });
});
