// Garde-fou en CI : chaque « pourquoi » calculé (src/data/lessonLines.ts) et chaque phrase-panneau des carrefours est
// vérifié sur l'échiquier (lib/whyGuard.ts). Les « pourquoi » écrits à la main ne bloquent pas : avertissements listés.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { GENERATED_EXTRAS } from '../data/lessonLines';
import { OPENING_LESSONS } from '../data/openingLessons';
import { BUILTIN_OPENINGS } from '../data/openings';
import { SIGNPOST_THREATS } from '../data/signpostThreats';
import { parsePgn } from './repertoire';
import { signpostCards } from './crossroads';
import { signpostSentence } from './signposts';
import { checkSignpost, checkWhy, fenKeyOf, type ThreatCache } from './whyGuard';

const THREATS: ThreatCache = JSON.parse(readFileSync('scripts/why-threats.json', 'utf8'));

/** Textes écrits à la main, par position + coup (comme scripts/lesson-lines.ts). */
function handWritten(openingId: string): Map<string, string> {
  const l = OPENING_LESSONS.find((x) => x.openingId === openingId);
  const out = new Map<string, string>();
  if (!l) return out;
  const note = (seq: string[], whys: (string | null)[]) => {
    const c = new Chess();
    seq.forEach((m, i) => { if (whys[i]) out.set(fenKeyOf(c.fen()) + ' ' + m, whys[i]!); c.move(m); });
  };
  note(l.moves.map((m) => m.san), l.moves.map((m) => m.why));
  for (const x of (l.extras ?? []).filter((e) => !e.id.startsWith('cx-'))) {
    for (const ln of x.lines) note([...ln.start, ...ln.moves.map((m) => m.san)], [...ln.start.map(() => null), ...ln.moves.map((m) => m.why)]);
  }
  return out;
}

export function auditWhys() {
  const computed: string[] = [];
  const hand: string[] = [];
  let n = 0;
  for (const [openingId, extras] of Object.entries(GENERATED_EXTRAS)) {
    const hw = handWritten(openingId);
    for (const x of extras) for (const ln of x.lines) {
      const c = new Chess();
      for (const s of ln.start) c.move(s);
      let prev: { fen: string; san: string } | undefined;
      const h = c.history({ verbose: true });
      if (h.length) prev = { fen: h[h.length - 1].before, san: h[h.length - 1].san };
      for (const mv of ln.moves) {
        const fen = c.fen();
        const issues = checkWhy(mv.why, fen, mv.san, THREATS, prev);
        n++;
        if (issues.length) {
          const isHand = hw.get(fenKeyOf(fen) + ' ' + mv.san) === mv.why;
          (isHand ? hand : computed).push(`${openingId} · ${c.history().concat(mv.san).join(' ')} · « ${mv.why} » → ${issues.join(' ; ')}`);
        }
        prev = { fen, san: mv.san };
        c.move(mv.san);
      }
    }
  }
  return { n, computed: [...new Set(computed)], hand: [...new Set(hand)] };
}

describe('garde-fou des explications', () => {
  it('tous les « pourquoi » calculés sont conformes à la position (menace, parade, mat, attaquants, colonne, matériel)', () => {
    const r = auditWhys();
    expect(r.n).toBeGreaterThan(900);
    if (r.hand.length) console.warn(`« Pourquoi » écrits à la main à relire (${r.hand.length}) :\n` + r.hand.join('\n'));
    expect(r.computed).toEqual([]);
  }, 30_000);
  it('toutes les phrases-panneaux du répertoire actif sont conformes (menace précalculée, attaque, mat)', () => {
    const bad: string[] = [];
    for (const op of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
      const l = OPENING_LESSONS.find((x) => x.openingId === op.id);
      for (const card of signpostCards(parsePgn(op.pgn).root, op.color)) {
        const pos = new Chess(card.crossroad.fen);
        pos.move(card.his);
        const threat = SIGNPOST_THREATS[fenKeyOf(pos.fen())] ?? null;
        const text = signpostSentence(card, op.color, { lesson: l });
        const issues = checkSignpost(text, card.crossroad.fen, card.his, card.mine ?? null, threat);
        if (issues.length) bad.push(`${op.id} · ${card.id} · « ${text} » → ${issues.join(' ; ')}`);
      }
    }
    expect(bad).toEqual([]);
  }, 30_000);
});
