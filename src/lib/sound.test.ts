import { describe, expect, it, vi } from 'vitest';
vi.mock('../db', () => ({ db: { meta: { get: async () => undefined, put: async () => undefined } } }));
import { soundForMove, soundLog } from '../sound';

describe('sons', () => {
  it('le bon son selon le coup (sans navigateur : seul le journal est rempli)', () => {
    soundLog.length = 0;
    ['e4', 'Nxe5', 'Bb5+', 'O-O', 'O-O-O', 'Qxf7#'].forEach((s) => soundForMove(s));
    soundForMove('Kd2', true);
    expect(soundLog).toEqual(['move', 'capture', 'check', 'castle', 'castle', 'end', 'end']);
  });
});
