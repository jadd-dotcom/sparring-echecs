// Import Chess.com : conversion des réponses de l'API publique (archives mensuelles) en parties de l'appli.
// Fonctions pures, sans réseau ni base (testées sur des réponses enregistrées).
import { Chess } from 'chess.js';
import type { Score } from './rating';

export const API = 'https://api.chess.com/pub';
export const STANDARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export interface CcPlayer { username: string; rating?: number; result: string }
export interface CcGame {
  url: string;
  pgn?: string;
  time_control?: string;
  time_class?: string;
  end_time: number;          // secondes (UTC)
  rated?: boolean;
  rules?: string;
  initial_setup?: string;
  uuid?: string;
  eco?: string;              // URL de la page d'ouverture Chess.com
  white: CcPlayer;
  black: CcPlayer;
}

/** Données propres à une partie importée (Chess.com ou PGN collé). */
export interface ExternalMeta {
  site: 'chess.com' | 'pgn';
  url?: string;
  timeClass?: string;        // rapid, blitz, bullet, daily
  timeControl?: string;
  rated?: boolean;
  me: { name: string; rating?: number };
  opp: { name: string; rating?: number };
  eco?: string;              // code ECO (A25…)
  openingName?: string;      // nom d'ouverture donné par Chess.com
}

/** Partie importée, prête à enregistrer (même forme que les parties contre Maia, sans effet sur le niveau). */
export interface ImportedGame {
  source: 'chesscom';
  externalId: string;
  date: number;
  myColor: 'w' | 'b';
  startFen: string;
  uci: string[];
  san: string[];
  result: '1-0' | '0-1' | '1/2-1/2';
  score: Score;
  termination: string;
  ext: ExternalMeta;
}

export type Converted = { ok: true; game: ImportedGame } | { ok: false; reason: string };

const DRAW_CODES = new Set(['agreed', 'repetition', 'stalemate', 'insufficient', '50move', 'timevsinsufficient']);

const TERMINATION_FR: Record<string, string> = {
  checkmated: 'Échec et mat',
  resigned: 'Abandon',
  timeout: 'Temps écoulé',
  abandoned: 'Partie abandonnée',
  agreed: 'Nulle par accord',
  repetition: 'Triple répétition',
  stalemate: 'Pat',
  insufficient: 'Matériel insuffisant',
  '50move': 'Règle des 50 coups',
  timevsinsufficient: 'Temps écoulé, matériel insuffisant',
};

/** « archives/2026/10 » → « 2026/10 ». */
export function monthOf(archiveUrl: string): string {
  const m = archiveUrl.match(/(\d{4})\/(\d{2})\/?$/);
  return m ? `${m[1]}/${m[2]}` : archiveUrl;
}

/** Mois (UTC) d'une date : « 2026/11 ». */
export function monthKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Un mois passé est figé : une fois importé, on ne le redemande plus. */
export const isPastMonth = (archiveUrl: string, now: number) => monthOf(archiveUrl) < monthKey(now);

export const archivesUrl = (user: string) => `${API}/player/${encodeURIComponent(user.trim().toLowerCase())}/games/archives`;

/** Résultat et terminaison à partir des codes Chess.com des deux joueurs. */
export function resultOf(white: CcPlayer, black: CcPlayer): { result: ImportedGame['result']; termination: string } {
  if (white.result === 'win') return { result: '1-0', termination: TERMINATION_FR[black.result] ?? black.result };
  if (black.result === 'win') return { result: '0-1', termination: TERMINATION_FR[white.result] ?? white.result };
  const code = DRAW_CODES.has(white.result) ? white.result : black.result;
  return { result: '1/2-1/2', termination: TERMINATION_FR[code] ?? code };
}

function scoreOf(result: ImportedGame['result'], me: 'w' | 'b'): Score {
  if (result === '1/2-1/2') return 0.5;
  return (result === '1-0') === (me === 'w') ? 1 : 0;
}

/** En-têtes d'un PGN. */
export function pgnHeaders(pgn: string): Record<string, string> {
  const h: Record<string, string> = {};
  for (const m of pgn.matchAll(/^\[(\w+)\s+"((?:[^"\\]|\\.)*)"\]\s*$/gm)) h[m[1]] = m[2];
  return h;
}

/** « https://www.chess.com/openings/English-Opening-Reversed-Sicilian-Closed-3.g3-Nf6-4.Bg2 » → nom lisible sans les coups. */
export function openingNameFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const slug = decodeURIComponent(url.split('/openings/')[1] ?? '').replace(/[?#].*$/, '');
  if (!slug) return undefined;
  const words = slug.split('-');
  const cut = words.findIndex((w) => /^\d+\.{1,3}/.test(w));   // les coups (3.g3, 4...Nf6) terminent le nom
  return (cut > 0 ? words.slice(0, cut) : words).join(' ').trim() || undefined;
}

/** Coups (SAN et UCI) d'un PGN, depuis sa position de départ. Lève une erreur si un coup est illégal. */
export function movesOfPgn(pgn: string, startFen: string): { san: string[]; uci: string[] } {
  const c = new Chess();
  c.loadPgn(pgn);
  const hist = c.history({ verbose: true });
  if (hist.length && hist[0].before !== startFen) throw new Error('position de départ différente');
  return { san: hist.map((m) => m.san), uci: hist.map((m) => m.lan) };
}

/** Convertit une partie Chess.com ; `user` = mon pseudo (casse indifférente). */
export function convertGame(g: CcGame, user: string): Converted {
  const me = user.trim().toLowerCase();
  if ((g.rules ?? 'chess') !== 'chess') return { ok: false, reason: 'variante' };
  const myColor = g.white.username.toLowerCase() === me ? 'w' : g.black.username.toLowerCase() === me ? 'b' : null;
  if (!myColor) return { ok: false, reason: 'joueur absent' };
  if (!g.pgn) return { ok: false, reason: 'sans PGN' };
  const startFen = g.initial_setup || pgnHeaders(g.pgn).FEN || STANDARD_FEN;
  if (startFen !== STANDARD_FEN) return { ok: false, reason: 'position de départ non standard' };
  let moves: { san: string[]; uci: string[] };
  try { moves = movesOfPgn(g.pgn, startFen); } catch { return { ok: false, reason: 'PGN illisible' }; }
  if (moves.uci.length < 2) return { ok: false, reason: 'moins de 2 coups' };
  const { result, termination } = resultOf(g.white, g.black);
  const h = pgnHeaders(g.pgn);
  const mine = myColor === 'w' ? g.white : g.black;
  const opp = myColor === 'w' ? g.black : g.white;
  return {
    ok: true,
    game: {
      source: 'chesscom', externalId: g.url, date: g.end_time * 1000, myColor, startFen,
      uci: moves.uci, san: moves.san, result, score: scoreOf(result, myColor), termination,
      ext: {
        site: 'chess.com', url: g.url, timeClass: g.time_class, timeControl: g.time_control, rated: g.rated,
        me: { name: mine.username, rating: mine.rating }, opp: { name: opp.username, rating: opp.rating },
        eco: h.ECO, openingName: openingNameFromUrl(g.eco ?? h.ECOUrl),
      },
    },
  };
}

/** Découpe un texte contenant un ou plusieurs PGN. */
export function splitPgns(text: string): string[] {
  const t = text.replace(/\r\n?/g, '\n').trim();
  if (!t) return [];
  const parts = t.split(/\n\s*\n(?=\[Event\s)/);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** Identifiant stable d'un PGN collé sans lien : date + joueurs + coups. */
export function pgnId(h: Record<string, string>, uci: string[]): string {
  const key = [h.UTCDate ?? h.Date ?? '', h.UTCTime ?? h.StartTime ?? '', h.White ?? '', h.Black ?? '', uci.join(' ')].join('|');
  let x = 5381;
  for (let i = 0; i < key.length; i++) x = ((x * 33) ^ key.charCodeAt(i)) >>> 0;
  return `pgn:${x.toString(36)}:${uci.length}`;
}

function dateOfHeaders(h: Record<string, string>, fallback: number): number {
  // Fin de partie si connue (Chess.com : EndDate/EndTime en UTC), sinon début.
  const end = !!(h.EndDate && h.EndTime);
  const d = ((end ? h.EndDate : h.UTCDate ?? h.Date) ?? '').match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (!d) return fallback;
  const t = ((end ? h.EndTime : h.UTCTime ?? h.StartTime) ?? '00:00:00').match(/(\d{2}):(\d{2}):(\d{2})/);
  return Date.UTC(+d[1], +d[2] - 1, +d[3], t ? +t[1] : 0, t ? +t[2] : 0, t ? +t[3] : 0);
}

/**
 * Convertit un PGN collé. Ma couleur : celle de mon pseudo s'il apparaît dans White/Black,
 * sinon `color` (choisie à l'écran).
 */
export function convertPgn(pgn: string, user: string, color?: 'w' | 'b', now = Date.now()): Converted {
  const h = pgnHeaders(pgn);
  const me = user.trim().toLowerCase();
  const myColor = me && (h.White ?? '').toLowerCase() === me ? 'w' : me && (h.Black ?? '').toLowerCase() === me ? 'b' : color ?? null;
  if (!myColor) return { ok: false, reason: 'couleur inconnue (indique ton pseudo ou ta couleur)' };
  if (h.Variant && !/standard/i.test(h.Variant)) return { ok: false, reason: 'variante' };
  const startFen = h.FEN || STANDARD_FEN;
  if (startFen !== STANDARD_FEN) return { ok: false, reason: 'position de départ non standard' };
  let moves: { san: string[]; uci: string[] };
  try { moves = movesOfPgn(pgn, startFen); } catch { return { ok: false, reason: 'PGN illisible' }; }
  if (moves.uci.length < 2) return { ok: false, reason: 'moins de 2 coups' };
  let result = (['1-0', '0-1', '1/2-1/2'] as const).find((r) => r === h.Result);
  let termination = h.Termination ?? '';
  const end = new Chess(startFen);
  for (const u of moves.uci) end.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  if (end.isCheckmate()) { result = end.turn() === 'w' ? '0-1' : '1-0'; termination = 'Échec et mat'; }
  if (!result) return { ok: false, reason: 'résultat inconnu' };
  if (!end.isCheckmate()) termination = terminationFromText(termination, result);
  const mineName = myColor === 'w' ? h.White : h.Black;
  const oppName = myColor === 'w' ? h.Black : h.White;
  const elo = (s?: string) => (s && /^\d+$/.test(s) ? Number(s) : undefined);
  return {
    ok: true,
    game: {
      source: 'chesscom', externalId: h.Link || pgnId(h, moves.uci), date: dateOfHeaders(h, now), myColor, startFen,
      uci: moves.uci, san: moves.san, result, score: scoreOf(result, myColor), termination,
      ext: {
        site: (h.Link || /chess\.com/i.test(h.Site ?? '')) ? 'chess.com' : 'pgn', url: h.Link, timeControl: h.TimeControl,
        me: { name: mineName ?? 'moi', rating: elo(myColor === 'w' ? h.WhiteElo : h.BlackElo) },
        opp: { name: oppName ?? 'adversaire', rating: elo(myColor === 'w' ? h.BlackElo : h.WhiteElo) },
        eco: h.ECO, openingName: openingNameFromUrl(h.ECOUrl),
      },
    },
  };
}

/** « LupinMomo won by checkmate » → « Échec et mat », etc. */
export function terminationFromText(t: string, result: ImportedGame['result']): string {
  const s = t.toLowerCase();
  if (/checkmate/.test(s)) return 'Échec et mat';
  if (/resign/.test(s)) return 'Abandon';
  if (/insufficient/.test(s) && /time/.test(s)) return 'Temps écoulé, matériel insuffisant';
  if (/time/.test(s)) return 'Temps écoulé';
  if (/abandon/.test(s)) return 'Partie abandonnée';
  if (/stalemate/.test(s)) return 'Pat';
  if (/repetition/.test(s)) return 'Triple répétition';
  if (/agree/.test(s)) return 'Nulle par accord';
  if (/insufficient/.test(s)) return 'Matériel insuffisant';
  if (/50/.test(s)) return 'Règle des 50 coups';
  return result === '1/2-1/2' ? 'Nulle' : 'Abandon';
}
