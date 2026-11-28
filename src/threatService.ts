// Cartes « Lis la menace » : Stockfish confirme les positions candidates (critère « Qu'est-ce qu'il menace ? ») et
// crée au plus 5 nouvelles cartes par jour, à revoir aussitôt puis en répétition espacée habituelle.
import { db, type Card } from './db';
import { stockfish } from './engines/stockfish';
import { findThreat, pvToSan, type ThreatSearch } from './lib/threat';
import { threatCandidates, threatKey, threatQuotaLeft } from './lib/threatCards';
import { dayKey } from './lib/srs';

/** Recherche Stockfish du navigateur (~`ms` par position). */
export const browserThreatSearch = (ms: number): ThreatSearch => (fen) => stockfish.analyse(fen, ms).then((r) => ({ score: r.eval, pv: r.pv }));

const SCANNED = 'threatScanned';
let running: Promise<Card[]> | null = null;

/**
 * Cherche de nouvelles positions « Lis la menace » dans mes parties analysées et crée les cartes (quota du jour).
 * `maxChecks` : positions vérifiées au plus par Stockfish (2 recherches chacune) ; `maxNew` : cartes créées au plus
 * (place restante sous le plafond de la révision). Renvoie les cartes créées.
 */
export function fillThreatCards(opts: { maxChecks?: number; ms?: number; maxNew?: number } = {}): Promise<Card[]> {
  running ??= run(opts.maxChecks ?? 16, opts.ms ?? 500, opts.maxNew ?? Infinity).finally(() => { running = null; });
  return running;
}

async function run(maxChecks: number, ms: number, maxNew: number): Promise<Card[]> {
  const cards = await db.cards.toArray();
  let left = Math.min(threatQuotaLeft(cards), maxNew);
  if (!left) return [];
  const scanned = new Set<string>(((await db.meta.get(SCANNED))?.value as string[] | undefined) ?? []);
  const taken = new Set<string>([...scanned, ...cards.filter((c) => c.kind === 'threat' && c.key).map((c) => c.key!)]);
  const games = await db.games.toArray();
  const cands = threatCandidates(games, taken);
  const search = browserThreatSearch(ms);
  const made: Card[] = [];
  const today = dayKey();
  let checks = 0;
  for (const cand of cands) {
    if (!left || checks >= maxChecks) break;
    checks++;
    const key = threatKey(cand.gameId, cand.ply);
    let r;
    try { r = await findThreat(cand.fen, cand.me, search); } catch { break; }
    scanned.add(key);
    if (r.status !== 'threat') continue;
    // La même menace qu'à mon coup précédent dans la partie : déjà une carte, son coup ne l'a pas créée.
    const prev = cards.find((c) => c.key === threatKey(cand.gameId, cand.ply - 2)) ?? made.find((c) => c.key === threatKey(cand.gameId, cand.ply - 2));
    if (prev?.threatUci === r.uci) continue;
    const bestUci = r.bestUci ?? cand.a.bestUci ?? '';
    const card: Card = {
      kind: 'threat', gameId: cand.gameId, source: cand.source, fen: cand.fen, myColor: cand.me,
      playedUci: cand.a.uci, playedSan: cand.a.san, bestUci, bestSan: (bestUci && pvToSan(cand.fen, [bestUci])[0]) || '',
      wpBefore: cand.a.wpBefore, drop: cand.a.drop, severity: cand.a.severity,
      step: 0, due: today, createdAt: Date.now(), attempts: [], key,
      prevFen: cand.prevFen, lastMoveUci: cand.lastMoveUci, threatUci: r.uci, threatSan: r.san, threatLine: r.line,
      threatWp: r.wpOppAfter, threatMate: r.mate, parryLine: r.bestLine, ignored: cand.ignored,
    };
    card.id = await db.cards.add(card);
    made.push(card);
    left--;
  }
  await db.meta.put({ key: SCANNED, value: [...scanned] });
  return made;
}
