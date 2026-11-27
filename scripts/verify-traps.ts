// Vérification des pièges d'ouverture, coup par coup, avec Stockfish → docs/PIEGES.md :
// - la suite jusqu'au moment critique (éval après chaque coup) ;
// - chaque bonne défense tient (au plus 10 points de win% de moins que la meilleure) ;
// - le coup fautif perd vraiment (au moins 20 points) ;
// - la punition : coup clé (mat, ou au plus 10 points de moins que le meilleur coup, et au moins 75 % de gain),
//   puis chaque coup du punisseur dans la suite (au plus 10 points de moins que le meilleur) ; éval finale.
import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { Chess } from 'chess.js';
import { TRAPS, TRAP_CHAPTERS } from '../src/data/traps';
import { TRAP_FALL, TRAP_TOLERANCE, trapPositions } from '../src/lib/traps';
import { winPercent, type Eval } from '../src/lib/winpct';

const require = createRequire(import.meta.url);
const ENGINE = process.env.ENGINE ?? (existsSync('/usr/games/stockfish') ? '/usr/games/stockfish' : 'lite');
const MS = Number(process.env.MS ?? 1000);
const OUT = process.env.OUT ?? 'docs/PIEGES.md';
const WIN = 75;

let onLine: (l: string) => void = () => {};
const sf: { processCommand(c: string): void; terminate?: () => void } = (() => {
  if (ENGINE === 'lite') return require('stockfish')('lite-single', (l: string) => onLine(l));
  const p = spawn(ENGINE, [], { stdio: ['pipe', 'pipe', 'inherit'] });
  let buf = '';
  p.stdout.on('data', (d) => { buf += d.toString(); let i; while ((i = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, i).trim(); buf = buf.slice(i + 1); onLine(l); } });
  return { processCommand: (c: string) => p.stdin.write(c + '\n'), terminate: () => p.kill() };
})();
sf.processCommand('uci'); sf.processCommand('setoption name Hash value 64');
const engineName = ENGINE === 'lite' ? 'Stockfish 19 lite (wasm)' : `Stockfish natif (${ENGINE})`;

/** Éval du point de vue du camp au trait, et meilleur coup. Position terminée : mat = 0 %, nulle = 50 %. */
function analyse(fen: string): Promise<{ ev: Eval; best: string | null }> {
  const c = new Chess(fen);
  if (c.isCheckmate()) return Promise.resolve({ ev: { mate: 0 }, best: null });
  if (c.isGameOver()) return Promise.resolve({ ev: { cp: 0 }, best: null });
  return new Promise((resolve) => {
    let ev: Eval = { cp: 0 };
    onLine = (l) => {
      const m = l.match(/ score (cp|mate) (-?\d+)/);
      if (m && !/bound/.test(l)) ev = m[1] === 'cp' ? { cp: Number(m[2]) } : { mate: Number(m[2]) };
      if (l.startsWith('bestmove')) { const b = l.split(' ')[1]; resolve({ ev, best: b && b !== '(none)' ? b : null }); }
    };
    sf.processCommand('position fen ' + fen);
    sf.processCommand('go movetime ' + MS);
  });
}
const fmtEv = (e: Eval, sign = 1) => ('mate' in e ? (e.mate === 0 ? 'mat' : `#${sign * e.mate}`) : (sign * e.cp / 100).toFixed(2));
const sanOf = (fen: string, uci: string | null) => { if (!uci) return '—'; try { return new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san; } catch { return uci; } };
/** Chances (win%) du camp qui vient de jouer, après le coup `san` depuis `fen`. */
async function wpAfter(fen: string, san: string): Promise<{ wp: number; mate: boolean; fen: string }> {
  const c = new Chess(fen);
  c.move(san);
  if (c.isCheckmate()) return { wp: 100, mate: true, fen: c.fen() };
  const r = await analyse(c.fen());
  return { wp: 100 - winPercent(r.ev), mate: false, fen: c.fen() };
}

(async () => {
  const t0 = Date.now();
  const L: string[] = ['# Pièges d’ouverture — vérification Stockfish', '',
    `Moteur : ${engineName}, ${MS} ms par position. Chances de gain (win%) avec la formule de Lichess, du point de vue du camp indiqué.`,
    `Critères : une bonne défense perd au plus ${TRAP_TOLERANCE} points de win% par rapport au meilleur coup ; le coup fautif en perd au moins ${TRAP_FALL} ;`,
    `le coup clé de la punition est un mat, ou au plus ${TRAP_TOLERANCE} points sous le meilleur coup et au moins ${WIN} % de gain ; chaque coup suivant du punisseur, au plus ${TRAP_TOLERANCE} points sous le meilleur.`,
    'Dans l’appli, un autre coup est aussi accepté si Stockfish le juge dans les mêmes tolérances.', ''];
  let allOk = true;
  for (const ch of TRAP_CHAPTERS) {
    L.push(`## ${ch.name}`, '');
    for (const t of TRAPS.filter((x) => x.chapter === ch.id)) {
      const p = trapPositions(t);
      const checks: string[] = [];
      let ok = true;
      const flag = (cond: boolean, text: string) => { if (!cond) ok = false; checks.push(`- ${cond ? '✅' : '❌'} ${text}`); };
      // 1. La suite, coup par coup (éval du point de vue des Blancs).
      const c = new Chess();
      const row: string[] = [];
      for (let i = 0; i < t.line.length; i++) {
        c.move(t.line[i]);
        const r = await analyse(c.fen());
        row.push(`${i % 2 === 0 ? `${i / 2 + 1}. ` : ''}${t.line[i]} (${fmtEv(r.ev, c.turn() === 'w' ? 1 : -1)})`);
      }
      // 2. Moment critique : meilleur coup, bonnes défenses, coup fautif.
      const crit = await analyse(p.critical);
      const wpBest = winPercent(crit.ev);
      checks.push(`- Moment critique (${p.victim === 'w' ? 'Blancs' : 'Noirs'} au trait) : meilleur coup ${sanOf(p.critical, crit.best)}, ${Math.round(wpBest)} % pour la victime.`);
      for (const g of t.good) {
        const r = await wpAfter(p.critical, g);
        flag(wpBest - r.wp <= TRAP_TOLERANCE, `Défense ${g} : ${Math.round(r.wp)} % (−${Math.max(0, Math.round(wpBest - r.wp))} pts) — elle tient.`);
      }
      const bl = await wpAfter(p.critical, t.blunder);
      flag(wpBest - bl.wp >= TRAP_FALL, `Faute ${t.blunder} : ${Math.round(bl.wp)} % (−${Math.round(wpBest - bl.wp)} pts) — c’est bien un piège.`);
      // 3. La punition.
      const pc = new Chess(p.afterBlunder);
      for (let i = 0; i < t.punish.length; i++) {
        const fen = pc.fen();
        const mine = i % 2 === 0;
        const best = await analyse(fen);
        const wpBestHere = winPercent(best.ev);
        const r = await wpAfter(fen, t.punish[i]);
        if (mine) {
          const near = r.mate || wpBestHere - r.wp <= TRAP_TOLERANCE;
          if (i === 0) flag(near && (r.mate || r.wp >= WIN), `Punition ${t.punish[0]} : ${r.mate ? 'mat' : `${Math.round(r.wp)} % pour le punisseur`} (meilleur coup : ${sanOf(fen, best.best)}, ${Math.round(wpBestHere)} %).`);
          else flag(near, `Puis ${t.punish[i]} : ${r.mate ? 'mat' : `${Math.round(r.wp)} %`} (meilleur : ${sanOf(fen, best.best)}, ${Math.round(wpBestHere)} %).`);
        } else {
          const isBest = best.best && sanOf(fen, best.best) === t.punish[i];
          checks.push(`- Réponse ${t.punish[i]} : ${isBest ? 'meilleure défense' : `défense naturelle (meilleure : ${sanOf(fen, best.best)}, ${Math.round(wpBestHere)} % pour la victime contre ${Math.round(r.wp)} %)`}.`);
        }
        pc.move(t.punish[i]);
      }
      const fin = pc.isCheckmate() ? 'échec et mat' : `${fmtEv((await analyse(pc.fen())).ev, pc.turn() === 'w' ? 1 : -1)} (Blancs)`;
      checks.push(`- Position finale : ${fin}.`);
      if (!ok) allOk = false;
      L.push(`### ${ok ? '✅' : '❌'} ${t.name}${t.opening ? ` — ${t.opening}` : ''}`, '',
        `Suite (éval Blancs après chaque coup) : ${row.join(' ')}`, '',
        `Faute : **${t.blunder}** · Punition : **${t.punish.join(' ')}** (gagne ${t.gain}) · Bonnes défenses : ${t.good.join(', ')}`, '',
        ...checks, '');
    }
  }
  L.splice(6, 0, `**${allOk ? 'Tous les pièges sont vérifiés.' : 'ATTENTION : au moins un piège échoue.'}** (${TRAPS.length} pièges, ${Math.round((Date.now() - t0) / 1000)} s)`, '');
  writeFileSync(OUT, L.join('\n'));
  console.log(L.join('\n'));
  sf.terminate?.();
  process.exit(allOk ? 0 : 1);
})();
