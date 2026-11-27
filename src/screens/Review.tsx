import { useEffect, useState } from 'react';
import { fig } from '../lib/notation';
import Board, { type BoardArrow } from '../Board';
import { db, type Game } from '../db';
import { analyseGame, analysePlies, evaluate, replay } from '../analysis';
import { reasonWords } from '../lib/whyWords';
import { ErrorSuites, Notation, useSuite } from '../Suite';
import { accuracyOfGame } from '../lib/accuracy';
import { winPercent } from '../lib/winpct';
import EvalCurve from '../EvalCurve';
import { BookOpen, CircleCheck, CircleX, Compass, Target, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ClassBadge, RotateCcw } from '../icons';
import { recordBookExit, treeOf } from '../openings';
import { MOTIF_LABEL } from '../lib/report/motifs';
import { buildIndex } from '../lib/repertoire';
import {
  bookLength, CLASS_LABEL, CLASS_ORDER, classifyMove, classSummary, mergeIndexes, moveSentence, type MoveClass,
} from '../lib/moveClass';
import { Chess } from 'chess.js';
import { ThoughtBox, ThoughtButtons } from '../ThoughtUi';
import Explorer from '../Explorer';
import { ThreatCheck } from '../ThreatUi';
import { activeGoal, exitsOf } from '../goalService';
import { goalBlunderPlies, type GoalDef } from '../lib/goals';

const TIME_CLASS: Record<string, string> = { bullet: 'bullet', blitz: 'blitz', rapid: 'rapide', daily: 'par jour' };

export default function Review({ id }: { id: number }) {
  const [game, setGame] = useState<Game | null>(null);
  const [progress, setProgress] = useState<{ d: number; t: number; label: string } | null>(null);
  const [ply, setPlyRaw] = useState(-1); // -1 = position de départ
  const [bookLen, setBookLen] = useState(0);
  // « Réessayer » : je cherche un meilleur coup dans la position d'une de mes erreurs.
  const [retry, setRetry] = useState<{ ply: number; tries: number; checking: boolean; result: null | { ok: boolean; text: string }; solution: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [exploring, setExploring] = useState(false);
  const suite = useSuite();
  const [threatArrows, setThreatArrows] = useState<{ fen: string; a: BoardArrow[] }>({ fen: '', a: [] });
  // « Mon objectif » : les gaffes de la partie qui relèvent de la règle de l'objectif actif.
  const [goalMark, setGoalMark] = useState<{ goal: GoalDef; plies: number[] } | null>(null);
  const analysed = !!game?.analysis;
  useEffect(() => {
    if (!game?.analysis) return;
    let alive = true;
    (async () => {
      const goal = await activeGoal();
      if (!goal) return;
      const exit = goal.repertoire ? exitsOf([game], await db.openings.toArray())[game.id!] : undefined;
      if (alive) setGoalMark({ goal, plies: goalBlunderPlies(goal, game, exit) });
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, analysed, game?.bookExit]);
  // Changer de coup referme la suite affichée.
  const setPly = (p: number) => { suite.close(); setPlyRaw(p); };
  const [openingNames, setOpeningNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const g = await db.games.get(id);
      if (!g) { setErr('Partie introuvable'); return; }
      setGame(g);
      // Phase « livre » : coups de mon répertoire depuis le début (l'ouverture de la partie à thème,
      // sinon toutes mes ouvertures actives de cette couleur).
      const allOpenings = await db.openings.toArray();
      if (!cancelled) setOpeningNames(Object.fromEntries(allOpenings.map((o) => [o.id, o.name])));
      const openings = allOpenings.filter((o) => (g.openingId ? o.id === g.openingId : o.color === g.myColor && !o.archived));
      if (!cancelled) setBookLen(bookLength(mergeIndexes(openings.map((o) => buildIndex(treeOf(o)))), g.startFen, g.uci));
      if (g.openingId && g.bookExit === undefined) {
        const withExit = await recordBookExit(id);
        if (!cancelled && withExit) setGame((cur) => ({ ...(cur ?? withExit), bookExit: withExit.bookExit }));
      }
      try {
        if (!g.analysis) {
          const a = await analyseGame(id, (d, t) => !cancelled && setProgress({ d, t, label: 'Analyse de la partie par Stockfish…' }));
          if (!cancelled) { setGame((cur) => ({ ...a, bookExit: a.bookExit ?? cur?.bookExit })); setProgress(null); }
        } else if (!g.plies) {
          // Partie analysée avant le classement de tous les coups : on le complète (cartes et erreurs inchangées).
          const a = await analysePlies(id, (d, t) => !cancelled && setProgress({ d, t, label: 'Classement de tous les coups…' }));
          if (!cancelled) { setGame((cur) => ({ ...a, bookExit: a.bookExit ?? cur?.bookExit })); setProgress(null); }
        }
      } catch (e) { setErr('Analyse impossible : ' + (e as Error).message); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (err) return <div className="card error">{err}</div>;
  if (!game) return null;
  if (progress || !game.analysis || !game.plies || !game.bars) {
    const { d, t, label } = progress ?? { d: 0, t: 1, label: 'Analyse…' };
    return (
      <div className="card center">
        <h2>{label}</h2>
        <div className="progress big"><div style={{ width: (100 * d) / t + '%' }} /></div>
        <p className="muted">{Math.round((100 * d) / t)} %</p>
      </div>
    );
  }

  const { fens, san } = replay(game.startFen, game.uci);
  const plies = game.plies;
  const bars = game.bars;
  const clsOf = (i: number): MoveClass => (i < bookLen ? 'book' : plies[i].cls);
  const byPly = new Map(game.analysis.map((a) => [a.ply, a]));
  const a = ply >= 0 ? byPly.get(ply) : undefined;          // analyse détaillée (mes coups)
  const pe = ply >= 0 ? plies[ply] : undefined;
  const cls = ply >= 0 ? clsOf(ply) : null;
  const exit = game.bookExit ?? null;
  const isMyExit = exit?.by === 'me' && ply === exit.ply;
  // Erreur ou gaffe sans réponse « ce que je pensais » : on cache le meilleur coup, la raison et le motif.
  const askThought = !!a && (a.severity === 'mistake' || a.severity === 'blunder') && !game.thoughtTags?.[ply] && !(retry && retry.ply === ply);

  // Position APRÈS le coup ; pastille sur la case d'arrivée ; flèche verte = meilleur coup (s'il y en avait un meilleur).
  const fen = fens[ply + 1];
  const arrows: BoardArrow[] = [];
  const highlight: Record<string, string> = {};
  const badges: Record<string, MoveClass> = {};
  if (pe && cls) {
    const u = game.uci[ply];
    highlight[u.slice(0, 2)] = 'rgba(255,255,0,.35)';
    highlight[u.slice(2, 4)] = 'rgba(255,255,0,.45)';
    badges[u.slice(2, 4)] = cls;
    if (cls !== 'best' && cls !== 'book' && pe.bestUci && pe.bestUci !== u && !askThought)
      arrows.push({ from: pe.bestUci.slice(0, 2), to: pe.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
    if (isMyExit) for (const sanExp of exit!.expectedSan) {
      const m = new Chess(fens[ply]).move(sanExp);
      arrows.push({ from: m.from, to: m.to, color: 'rgba(40,110,230,.85)' });
    }
  }
  // Réessayer : position AVANT mon coup, à moi de jouer.
  const retryOn = retry !== null && retry.ply === ply;
  if (retryOn) {
    arrows.length = 0;
    for (const k of Object.keys(highlight)) delete highlight[k];
    for (const k of Object.keys(badges)) delete badges[k];
    if (retry!.solution && pe?.bestUci) arrows.push({ from: pe.bestUci.slice(0, 2), to: pe.bestUci.slice(2, 4), color: 'rgba(30,160,60,.9)' });
  }
  if (!retryOn && threatArrows.fen === fen) arrows.push(...threatArrows.a);
  const bar = bars[ply + 1] ?? bars[0];
  const acc = accuracyOfGame(game);
  const fmtAcc = (v: number | null | undefined) => (v == null ? '–' : `${v.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`);
  const reason = a?.detail && pe ? reasonWords(a.detail, fens[ply], pe.uci, game.myColor) : null;

  async function onRetryMove(uci: string) {
    if (!retry || retry.checking || !pe) return;
    setRetry({ ...retry, checking: true, result: null });
    const fenBefore = fens[ply];
    const c = new Chess(fenBefore);
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    const before = await evaluate(fenBefore, 700);
    const after = await evaluate(c.fen(), 700);
    const isBest = uci === pe.bestUci || uci === before.bestMove;
    const drop = isBest ? 0 : Math.max(0, winPercent(before.eval) - (100 - winPercent(after.eval)));
    const k = classifyMove({ isBest, drop });
    const ok = k === 'best' || k === 'excellent' || k === 'good';
    const tries = retry.tries + 1;
    setRetry({
      ply: retry.ply, tries, checking: false, solution: !ok && tries >= 2,
      result: ok
        ? { ok, text: `Bien vu : ${fig(m.san)} est ${k === 'best' ? 'le meilleur coup' : k === 'excellent' ? 'excellent' : 'un bon coup'}.` }
        : { ok, text: `${fig(m.san)} est ${{ inaccuracy: 'une imprécision', mistake: 'une erreur', blunder: 'une gaffe' }[k as 'inaccuracy' | 'mistake' | 'blunder']}. ${tries >= 2 ? `Solution : ${fig(pe.bestSan ?? '')} (flèche verte).` : 'Essaie encore.'}` },
    });
  }
  const whiteBottom = game.myColor === 'w';
  const summary = classSummary(plies, game.myColor, bookLen, game.startFen.split(' ')[1] === 'w');
  const errorsPlies = game.analysis.filter((x) => x.severity !== 'ok').map((x) => x.ply);
  const mine = (i: number) => byPly.has(i);
  const imported = game.source === 'chesscom';
  const opp = imported ? game.ext?.opp.name ?? 'l’adversaire' : 'Maia';
  const repName = game.repOpeningId ? openingNames[game.repOpeningId] : undefined;

  // Carte d'explication du coup ; en tête de colonne quand une réponse « ce que je pensais » est attendue.
  const explain = (a || pe) && (
          <div className="card explain">
            {pe && <span className="muted small">Chances de gain {mine(ply) ? 'pour toi' : `pour ${opp}`} : {Math.round(pe.wpBefore)} % → {Math.round(pe.wpAfter)} %{pe.drop >= 1 ? ` (−${Math.round(pe.drop)} pts)` : ''}</span>}
            {isMyExit && <><br /><span><BookOpen aria-hidden className="ico sm book-ico" /> Répertoire : <b>{fig(exit!.expectedSan.join(' ou '))}</b> (flèche bleue) au lieu de {fig(exit!.playedSan)}.</span></>}
            {askThought && <ThoughtButtons game={game} ply={ply} onSaved={(thoughtTags) => setGame((g) => (g ? { ...g, thoughtTags } : g))} />}
            {goalMark?.plies.includes(ply) && !askThought && (
              <p className="goal-mark" data-testid="goal-mark"><Target aria-hidden className="ico sm" /> Règle de l’objectif « {goalMark.goal.name} » : {goalMark.goal.rule}</p>
            )}
            {a?.detail && !askThought && <>
              <br />Motif : <b>{MOTIF_LABEL[a.detail.motif]}</b>
              {pe && <ErrorSuites d={a.detail} fenBefore={fens[ply]} myUci={pe.uci} me={game.myColor} open={suite.open} />}
              <Notation><p>Meilleure suite : {fig(a.detail.bestLine) || '—'}</p><p>Réfutation : {fig(a.detail.refutation) || '—'}</p></Notation>
            </>}
            {a && a.severity !== 'ok' && !retryOn && !askThought && (
              <div><button className="primary" onClick={() => { suite.close(); setRetry({ ply, tries: 0, checking: false, result: null, solution: false }); }}><RotateCcw aria-hidden className="ico" />Réessayer</button></div>
            )}
            {retryOn && (
              <div className={`retry-card ${retry!.result ? (retry!.result.ok ? 'good' : 'bad') : ''}`}>
                <p><b>Réessayer :</b> trouve un meilleur coup que {fig(pe!.san)}.</p>
                {retry!.checking && <p className="pulse muted">Vérification par Stockfish…</p>}
                {retry!.result && <p>{retry!.result.ok ? <CircleCheck aria-hidden className="ico good-text" /> : <CircleX aria-hidden className="ico bad-text" />} {retry!.result.text}</p>}
                <button onClick={() => setRetry(null)}>Fermer</button>
              </div>
            )}
            {a && (a.severity === 'mistake' || a.severity === 'blunder') && !askThought && <>
              <ThoughtButtons game={game} ply={ply} onSaved={(thoughtTags) => setGame((g) => (g ? { ...g, thoughtTags } : g))} />
              <ThoughtBox key={ply} game={game} ply={ply} onSaved={(thoughts) => setGame((g) => (g ? { ...g, thoughts } : g))} />
            </>}
          </div>
        );
  if (exploring) return <Explorer fen={fen} me={game.myColor} onQuit={() => setExploring(false)} />;

  return (
    <div className="play">
      <div className="board-col">
        <div className="review-board">
          <div className="evalbar" style={{ flexDirection: whiteBottom ? 'column' : 'column-reverse' }} aria-label={`Évaluation ${bar.label}`}>
            <div className="white" style={{ height: `${bar.wpWhite}%`, marginTop: whiteBottom ? 'auto' : 0, marginBottom: whiteBottom ? 0 : 'auto' }} />
            <span className="lbl" style={{ [bar.wpWhite >= 50 === whiteBottom ? 'bottom' : 'top']: 2, color: bar.wpWhite >= 50 ? '#333' : '#eee' }}>{bar.label}</span>
          </div>
          {suite.view
            ? <Board fen={suite.view.fen} orientation={game.myColor} movable={null} arrows={suite.view.arrows} lastMove={suite.view.lastMove} />
            : <Board fen={retryOn ? fens[ply] : fen} orientation={game.myColor} movable={retryOn && !retry!.checking && !retry!.result?.ok ? game.myColor : null}
              onMove={onRetryMove} arrows={arrows} highlight={highlight} badges={badges} lastMove={retryOn ? null : pe ? { from: pe.uci.slice(0, 2), to: pe.uci.slice(2, 4) } : null} />}
        </div>
        <p className="move-sentence">
          {pe && cls ? <><ClassBadge cls={cls} size={22} className="class-badge inline" />{' '}
            {askThought ? moveSentence(fig(pe.san), cls, null, null, null)
              : moveSentence(fig(pe.san), cls, pe.bestSan ? fig(pe.bestSan) : null, mine(ply) ? reason : null, mine(ply) && reason && a?.detail ? MOTIF_LABEL[a.detail.motif] : null)}{' '}
            <span className="muted small">({mine(ply) ? 'ton coup' : opp})</span></>
            : <span className="muted">Touche un coup ou utilise les flèches.</span>}
        </p>
        <div className="nav row">
          <button aria-label="Début" onClick={() => { setRetry(null); setPly(-1); }}><ChevronsLeft aria-hidden /></button>
          <button aria-label="Coup précédent" onClick={() => { setRetry(null); setPly(Math.max(-1, ply - 1)); }}><ChevronLeft aria-hidden /></button>
          <button aria-label="Coup suivant" onClick={() => { setRetry(null); setPly(Math.min(game.uci.length - 1, ply + 1)); }}><ChevronRight aria-hidden /></button>
          <button aria-label="Fin" onClick={() => { setRetry(null); setPly(game.uci.length - 1); }}><ChevronsRight aria-hidden /></button>
          <button onClick={() => { const n = errorsPlies.find((p) => p > ply); if (n !== undefined) { setRetry(null); setPly(n); } }}>Erreur suivante</button>
          <button onClick={() => { setRetry(null); suite.close(); setExploring(true); }} data-testid="explore-btn"><Compass aria-hidden className="ico" />Explorer</button>
        </div>
      </div>
      <aside className="side-col">
        {suite.panel}
        {askThought && explain}
        {!askThought && !retryOn && (
          <div className="card threat-card">
            <ThreatCheck fen={fen} me={game.myColor} onArrows={(f, a) => setThreatArrows({ fen: f, a })}
              onSuite={(f, line, title) => suite.open(f, line, game.myColor, title)} />
          </div>
        )}
        <div className="card">
          {imported && (
            <p className="source-line"><span className="tag chesscom-tag">{game.ext?.site === 'pgn' ? 'PGN importé' : 'Chess.com'}</span>{' '}
              contre <b>{opp}</b>{game.ext?.opp.rating ? ` (${game.ext.opp.rating})` : ''}{game.ext?.timeClass ? ` · ${TIME_CLASS[game.ext.timeClass] ?? game.ext.timeClass}` : ''}
              {' '}· <span className="muted small">sans effet sur ton niveau Maia</span></p>
          )}
          <b>{game.result}</b> · {game.termination} · tu avais les {game.myColor === 'w' ? 'Blancs' : 'Noirs'}{game.unrated ? ' · non comptée' : ''}
          <div className="accuracy" aria-label="Précision (formule Lichess)">
            <span>Précision : <b>toi {fmtAcc(acc?.me)}</b></span><span>{imported ? 'Adversaire' : 'Maia'} {fmtAcc(acc?.maia)}</span>
          </div>
          <table className="classes">
            <thead><tr><th></th><th>Moi</th><th>{imported ? 'Adversaire' : 'Maia'}</th></tr></thead>
            <tbody>
              {CLASS_ORDER.map((c) => (
                <tr key={c}>
                  <td><ClassBadge cls={c} size={20} className="class-badge inline" /> {CLASS_LABEL[c]}</td>
                  <td>{summary.me[c]}</td><td>{summary.maia[c]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <EvalCurve wpWhite={bars.map((b) => b.wpWhite)} current={ply + 1} onPick={(i) => { setRetry(null); setPly(i - 1); }} />
        </div>
        {imported && game.bookExit !== undefined && (
          <div className="card book" data-testid="book-info">
            {game.bookExit === null && <span><BookOpen aria-hidden className="ico sm book-ico" /> Partie entièrement dans ton répertoire{repName ? ` (${repName})` : ''}.</span>}
            {exit && exit.ply === 0 && exit.by === 'me' && <span>Hors répertoire dès ton 1er coup : tu as joué <b>{fig(exit.playedSan)}</b>, ton répertoire prévoit <b>{fig(exit.expectedSan.join(' ou '))}</b>.</span>}
            {exit && exit.ply === 0 && exit.by !== 'me' && <span>Hors répertoire dès le 1er coup : l’adversaire a joué <b>{fig(exit.playedSan)}</b>, que ton répertoire ne couvre pas.</span>}
            {exit && exit.ply > 0 && exit.by === 'end' && <span><BookOpen aria-hidden className="ico sm book-ico" /> Resté dans ton répertoire{repName ? ` (${repName})` : ''} jusqu’au bout de la ligne (coup {Math.floor(exit.ply / 2) + 1}).</span>}
            {exit && exit.ply > 0 && exit.by === 'me' && (
              <span><BookOpen aria-hidden className="ico sm book-ico" /> {repName ? `${repName} : ` : ''}<b>sorti du répertoire</b> au coup {Math.floor(exit.ply / 2) + 1}{exit.ply % 2 ? '…' : '.'} : tu as joué <b>{fig(exit.playedSan)}</b>,
                {' '}ton répertoire prévoit <b>{fig(exit.expectedSan.join(' ou '))}</b> (flèche bleue).{' '}
                <button className="small" onClick={() => setPly(exit.ply)}>Voir</button></span>
            )}
            {exit && exit.ply > 0 && exit.by === 'opponent' && (
              <span><BookOpen aria-hidden className="ico sm book-ico" /> {repName ? `${repName} : ` : ''}tu es resté dans ton répertoire ; l’adversaire l’a quitté avec <b>{fig(exit.playedSan)}</b> (coup {Math.floor(exit.ply / 2) + 1}{exit.ply % 2 ? '…' : '.'}).</span>
            )}
          </div>
        )}
        {game.openingId && (
          <div className="card book">
            {exit === null && <span><BookOpen aria-hidden className="ico sm book-ico" /> Partie entièrement dans ton répertoire.</span>}
            {exit?.by === 'end' && <span><BookOpen aria-hidden className="ico sm book-ico" /> Tu as suivi ton répertoire jusqu’au bout de la ligne (coup {Math.floor(exit.ply / 2) + 1}).</span>}
            {exit?.by === 'me' && (
              <span><BookOpen aria-hidden className="ico sm book-ico" /> <b>Sortie du répertoire</b> au coup {Math.floor(exit.ply / 2) + 1}{exit.ply % 2 ? '…' : '.'} : tu as joué <b>{fig(exit.playedSan)}</b>,
                {' '}ton répertoire prévoit <b>{fig(exit.expectedSan.join(' ou '))}</b> (flèche bleue).{' '}
                <button className="small" onClick={() => setPly(exit.ply)}>Voir</button></span>
            )}
            {exit?.by === 'opponent' && (
              <span><BookOpen aria-hidden className="ico sm book-ico" /> L’adversaire a quitté ton répertoire avec <b>{fig(exit.playedSan)}</b> (coup {Math.floor(exit.ply / 2) + 1}).
                {' '}Position ajoutée aux <b>trous du répertoire</b> avec le meilleur coup Stockfish.</span>
            )}
          </div>
        )}
        {!askThought && explain}
        <div className="moves card grid">
          {san.map((s, i) => {
            const c = clsOf(i);
            return (
              <button key={i} className={`mv ${i === ply ? 'active' : ''} ${mine(i) ? '' : 'theirs'} ${exit && exit.by !== 'end' && exit.ply === i ? 'book-exit' : ''}`}
                onClick={() => { setRetry(null); setPly(i); }} aria-label={`${s} : ${CLASS_LABEL[c]}`}>
                {i % 2 === 0 ? `${i / 2 + 1}.` : ''}{fig(s)}<ClassBadge cls={c} size={18} className="class-badge ic" />
                {goalMark?.plies.includes(i) && <Target aria-label="Règle de l’objectif" className="ico sm goal-move" data-testid="goal-move" />}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
