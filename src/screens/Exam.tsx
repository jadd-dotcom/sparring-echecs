// Mode « Examen » d'une ouverture : 10 positions de mon répertoire tirées au hasard, sans indice et sans la ligne qui y
// mène. Score sur 10 ; les positions ratées sont « à refaire » (leurs cartes de drill reviennent aujourd'hui).
import { useEffect, useMemo, useState } from 'react';
import Board, { type BoardArrow } from '../Board';
import { db, type Opening } from '../db';
import { treeOf } from '../openings';
import { drillPositions, type DrillPosition } from '../lib/repertoire';
import { examOk, examResult, pickExam, type ExamAnswer } from '../lib/exam';
import { dayKey } from '../lib/srs';
import { uciToSan } from '../analysis';
import { fig } from '../lib/notation';
import { go } from '../router';
import { getMeta, putMeta } from '../metaKeys';
import { CircleCheck, CircleX, RotateCcw } from '../icons';
import { answerFeedback } from '../sound';

/** Enregistre le résultat et remet les positions ratées dans le drill du jour. */
async function saveExam(openingId: string, answers: ExamAnswer[]) {
  const r = examResult(answers);
  const all = (await getMeta('examResults')) ?? {};
  await putMeta('examResults', { ...all, [openingId]: [...(all[openingId] ?? []), r] });
  const today = dayKey();
  const missed = new Set(r.missed);
  await db.cards.where('openingId').equals(openingId).filter((c) => c.kind === 'drill' && !!c.key && missed.has(c.key)).modify({ step: 0, due: today });
  return r;
}

export default function Exam({ id }: { id: string }) {
  const [o, setO] = useState<Opening | null>(null);
  const [exam, setExam] = useState<DrillPosition[]>([]);
  const positions = useMemo<DrillPosition[]>(() => (o ? drillPositions(treeOf(o), o.color) : []), [o]);
  useEffect(() => { db.openings.get(id).then((x) => setO(x ?? null)); }, [id]);
  useEffect(() => { setExam(pickExam(positions)); }, [positions]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [last, setLast] = useState<ExamAnswer | null>(null);
  const [done, setDone] = useState<{ score: number; total: number } | null>(null);
  if (!o) return null;
  if (!positions.length) return <div className="card">Pas de position dans ce répertoire.</div>;
  if (!exam.length) return null;

  async function onMove(uci: string) {
    if (last || done) return;
    const p = exam[i];
    const a = { key: p.key, uci, ok: examOk(p, uci) };
    answerFeedback(a.ok);
    setLast(a);
    const next = [...answers, a];
    setAnswers(next);
    if (next.length === exam.length) setDone(await saveExam(o!.id, next));
  }
  function nextQ() { setLast(null); setI(i + 1); }
  function restart() { setExam(pickExam(positions)); setI(0); setAnswers([]); setLast(null); setDone(null); }

  if (done && !last) {
    const missed = exam.filter((p) => answers.find((a) => a.key === p.key && !a.ok));
    return (
      <div className="card center" data-testid="exam-done" data-score={done.score}>
        <h2>Examen : {done.score}/{done.total}</h2>
        <p>{missed.length ? `${missed.length} position${missed.length > 1 ? 's' : ''} à refaire : elles reviennent dans ton drill aujourd’hui.` : 'Sans faute.'}</p>
        {missed.length > 0 && <ul className="exam-missed">{missed.map((p) => <li key={p.key}>{fig(p.acceptSan.join(' ou '))}</li>)}</ul>}
        <div className="row center-row">
          <button onClick={restart} data-testid="exam-restart"><RotateCcw aria-hidden className="ico" />Nouvel examen</button>
          <button className="primary" onClick={() => go({ name: 'opening', id: o!.id })}>Retour à l’ouverture</button>
        </div>
      </div>
    );
  }
  const p = exam[i];
  const arrows: BoardArrow[] = [];
  if (last && !last.ok && p.accept[0]) arrows.push({ from: p.accept[0].slice(0, 2), to: p.accept[0].slice(2, 4), color: 'rgba(30,160,60,.85)' });
  return (
    <div className="play exam" data-testid="exam" data-q={i + 1} data-fen={p.fen} data-accept={p.accept.join(' ')}>
      <div className="board-col">
        <Board key={p.key} fen={p.fen} orientation={o.color} movable={last ? null : o.color} onMove={onMove} arrows={arrows} highlight={{}} lastMove={null} />
      </div>
      <aside className="side-col">
        <div className="card">
          <p className="muted small">Examen · {o.name} · position {i + 1}/{exam.length} · sans indice</p>
          <h2>Joue le coup de ton répertoire ({o.color === 'w' ? 'Blancs' : 'Noirs'})</h2>
        </div>
        {last && (
          <div className={`card ${last.ok ? 'good' : 'bad'}`} data-testid="exam-feedback">
            <p>{last.ok ? <><CircleCheck aria-hidden className="ico good-text" /> Juste.</> : <><CircleX aria-hidden className="ico bad-text" /> Pas ton coup ({fig(uciToSan(p.fen, last.uci) ?? last.uci)}) : ton répertoire joue {fig(p.acceptSan.join(' ou '))} (flèche verte).</>}</p>
            <button className="primary" onClick={() => (i + 1 < exam.length ? nextQ() : setLast(null))} data-testid="exam-next">{i + 1 < exam.length ? 'Suivante' : 'Voir le résultat'}</button>
          </div>
        )}
      </aside>
    </div>
  );
}
