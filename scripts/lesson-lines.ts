// Leçons complètes : pour chaque ouverture active, les lignes du répertoire qui n'ont pas encore d'explication.
// Chaque ligne reprend la partie déjà expliquée (`start`, sans commentaire) puis un « pourquoi » par coup (les deux
// camps, src/lib/moveWhy.ts, qui répond d'abord au coup d'avant ; une explication déjà écrite ailleurs pour la même
// position est reprise) et une phrase
// de plan (src/data/linePlans.ts, écrite à la main). Lignes rangées par carrefour (là où son coup change ma réponse).
// Sortie : src/data/lessonLines.ts. Usage : npm run lesson-lines
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Chess } from 'chess.js';
import { BUILTIN_OPENINGS } from '../src/data/openings';
import { OPENING_LESSONS, type LessonExtra, type LessonLine } from '../src/data/openingLessons';
import { LINE_PLANS } from '../src/data/linePlans';
import { parsePgn, type Color } from '../src/lib/repertoire';
import { crossroads, moveLabel, type Crossroad } from '../src/lib/crossroads';
import { orderedLines } from '../src/lib/lineTrainer';
import { branchName } from '../src/lib/crossroadTrainer';
import { moveWhy } from '../src/lib/moveWhy';
import type { SignpostThreat } from '../src/lib/signposts';

// Menaces « s'il rejouait » après chaque coup du répertoire (npm run why-threats) : la réponse dit d'abord ce qu'elle
// fait contre la menace du coup d'avant.
const THREATS: Record<string, SignpostThreat | null> = existsSync('scripts/why-threats.json') ? JSON.parse(readFileSync('scripts/why-threats.json', 'utf8')) : {};

const fk = (fen: string) => fen.split(' ').slice(0, 4).join(' ');
const isPrefix = (a: string[], b: string[]) => a.length <= b.length && a.every((m, i) => m === b[i]);
const fmt = (sans: string[]) => sans.map((m, i) => (i % 2 ? '' : `${i / 2 + 1}.`) + m).join(' ');

const out: Record<string, LessonExtra[]> = {};
const missingPlans: string[] = [];
let nLines = 0, nMoves = 0;
for (const o of BUILTIN_OPENINGS.filter((x) => !x.archived)) {
  const lessonAll = OPENING_LESSONS.find((l) => l.openingId === o.id)!;
  // Leçon écrite à la main (sans les blocs générés par ce script).
  const lesson = { ...lessonAll, extras: (lessonAll.extras ?? []).filter((x) => !x.id.startsWith('cx-')) };
  const me = o.color as Color;
  const root = parsePgn(o.pgn).root;
  const cs = crossroads(root, me);
  // Explications existantes : position + coup → phrase.
  const whys = new Map<string, string>();
  const note = (seq: string[], texts: (string | null)[]) => {
    const c = new Chess();
    seq.forEach((m, i) => { const t = texts[i]; if (t && !whys.has(fk(c.fen()) + ' ' + m)) whys.set(fk(c.fen()) + ' ' + m, t); c.move(m); });
  };
  note(lesson.moves.map((m) => m.san), lesson.moves.map((m) => m.why));
  for (const x of lesson.extras) for (const ln of x.lines) note([...ln.start, ...ln.moves.map((m) => m.san)], [...ln.start.map(() => null), ...ln.moves.map((m) => m.why)]);

  const blocks = new Map<string, { cr: Crossroad | null; lines: LessonLine[] }>();
  for (const l of orderedLines(root, lesson)) {
    // Déjà couverte : chaque coup a déjà un « pourquoi » (même position, même coup), dans une leçon ou une ligne générée.
    // Sinon la ligne commence au premier coup sans explication (`start` = les coups déjà expliqués).
    const c = new Chess();
    let k = 0;
    const explained: boolean[] = [];
    for (const m of l) { explained.push(whys.has(fk(c.fen()) + ' ' + m)); c.move(m); }
    if (explained.every(Boolean)) continue;
    while (k < l.length && explained[k]) k++;
    // Carrefour où la ligne quitte ce qui est expliqué : le dernier dont le chemin est un début de la ligne (≤ k).
    const cr = [...cs].reverse().find((x) => x.path.length <= k && isPrefix(x.path, l) && x.branches.some((b) => b.his === l[x.path.length])) ?? null;
    const moves: { san: string; why: string }[] = [];
    const pos = new Chess();
    for (let i = 0; i < l.length; i++) {
      const before = pos.fen();
      const prev = pos.history({ verbose: true }).slice(-1)[0];
      if (i >= k) {
        const ctx = prev ? { prev: { fen: prev.before, san: prev.san }, threat: THREATS[fk(before)] ?? null } : {};
        const why = whys.get(fk(before) + ' ' + l[i]) ?? moveWhy(before, l[i], me, ctx);
        moves.push({ san: l[i], why });
        whys.set(fk(before) + ' ' + l[i], why);
      }
      pos.move(l[i]);
    }
    const key = l.join(' ');
    const plan = LINE_PLANS[o.id]?.[key];
    if (!plan) missingPlans.push(`${o.id} :: ${key}`);
    const gid = cr ? cr.path.join(' ') : '';
    if (!blocks.has(gid)) blocks.set(gid, { cr, lines: [] });
    const name = cr ? branchName(cr.path, l[cr.path.length], lesson) : moveLabel(0, l[0]);
    blocks.get(gid)!.lines.push({ name, start: l.slice(0, k), moves, ...(plan ? { plan } : {}) });
    nLines++; nMoves += moves.length;
  }
  // Noms distincts dans un bloc : on ajoute le premier coup qui les sépare.
  const extras: LessonExtra[] = [];
  let n = 0;
  for (const { cr, lines } of blocks.values()) {
    const full = lines.map((ln) => [...ln.start, ...ln.moves.map((m) => m.san)]);
    lines.forEach((ln, i) => {
      if (lines.filter((x) => x.name === ln.name).length > 1) {
        const others = full.filter((_, j) => j !== i && lines[j].name === ln.name);
        let d = (cr?.path.length ?? 0) + 1;
        while (d < full[i].length && others.some((x) => x[d] === full[i][d])) d++;
        if (d < full[i].length) ln.name = `${ln.name} · ${moveLabel(d, full[i][d])}`;
      }
    });
    const where = cr ? (cr.path.length ? `après ${fmt(cr.path)}` : 'au premier coup') : 'autres lignes';
    const his = cr ? cr.branches.map((b) => moveLabel(cr.path.length, b.his)).join(', ') : '';
    extras.push({
      id: `cx-${o.id}-${++n}`,
      title: `Carrefour ${where}`,
      intro: cr ? `À ce carrefour, il a plusieurs coups dans ton répertoire (${his}) : chacun change ta réponse. Voici les lignes qui n’étaient pas encore expliquées.` : 'Les lignes qui n’étaient pas encore expliquées.',
      lines,
    });
  }
  out[o.id] = extras;
}

const header = `// Généré par scripts/lesson-lines.ts (npm run lesson-lines) : ne pas modifier à la main.
// Lignes du répertoire actif qui n'avaient pas d'explication, rangées par carrefour ; un « pourquoi » par coup
// (src/lib/moveWhy.ts, ou l'explication déjà écrite pour la même position) et une phrase de plan (src/data/linePlans.ts).
import type { LessonExtra } from './openingLessons';

export const GENERATED_EXTRAS: Record<string, LessonExtra[]> = ${JSON.stringify(out, null, 1)};
`;
writeFileSync('src/data/lessonLines.ts', header);
console.log(`src/data/lessonLines.ts : ${nLines} lignes, ${nMoves} coups expliqués`);
if (missingPlans.length) { console.log(`Plans manquants (${missingPlans.length}) :\n` + missingPlans.join('\n')); process.exitCode = 1; }
