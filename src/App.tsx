import { useEffect, useState } from 'react';
import Home from './screens/Home';
import Play from './screens/Play';
import Review from './screens/Review';
import Revise from './screens/Revise';
import Cards from './screens/Cards';
import Comment from './screens/Comment';
import PlayLines from './screens/PlayLines';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import Openings from './screens/Openings';
import Report from './screens/Report';
import Mates from './screens/Mates';
import OpeningLessonScreen from './screens/OpeningLesson';
import RepertoireEditor from './screens/RepertoireEditor';
import BoardMastery, { BoardLessonScreen } from './screens/BoardMastery';
import BoardExercise from './screens/BoardExercise';
import BoardWarmup from './screens/BoardWarmup';
import { BoardBlindGame, BoardReplay } from './screens/BoardBlind';
import { ensureOpenings } from './openings';
import './selftest';
import { go, parse, type Route } from './router';
import { ChevronLeft } from './icons';
import { loadPrefs } from './prefs';
import { autoImportMessage, autoImportOnStart } from './autoImport';
import { resumeAnalysis, setAnalysisPause } from './chesscomImport';

// L'analyse des parties importées se met en pause pendant une partie contre Maia et son analyse (reprise ensuite).
setAnalysisPause(() => location.hash.startsWith('#/play') || location.hash.startsWith('#/comment/'));

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { Promise.all([ensureOpenings(), loadPrefs()]).catch(console.error).finally(() => setReady(true)); }, []);
  // Import Chess.com automatique (une fois par ouverture, avec Internet et un pseudo enregistré).
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    autoImportOnStart().then((r) => {
      const m = autoImportMessage(r);
      if (m) { setToast(m); timer = setTimeout(() => setToast(null), 8000); }
    }).catch(console.error);
    return () => { if (timer) clearTimeout(timer); };
  }, [ready]);
  useEffect(() => { if (route.name !== 'play' && !(route.name === 'comment' && route.id !== undefined)) resumeAnalysis(); }, [route]);
  useEffect(() => {
    const f = () => setRoute(parse(location.hash));
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  // Écrans avec un échiquier : tout tient dans la hauteur de l'écran (échiquier ajusté, texte qui défile seul).
  const fit = ['play', 'review', 'revise', 'lesson', 'comment', 'repertoire', 'lines'].includes(route.name)
    || (route.name === 'mates' && !!route.level)
    || (route.name === 'board' && !!route.view && route.view !== 'lesson');
  return (
    <div className={`app${fit ? ' fit' : ''}`}>
      {route.name !== 'home' && (
        <header className="topbar">
          <button className="ghost back" onClick={() => go({ name: 'home' })}><ChevronLeft aria-hidden className="ico" />Accueil</button>
        </header>
      )}
      {toast && <div className="toast" role="status" data-testid="auto-import" onClick={() => setToast(null)}>{toast}</div>}
      <main>{ready && <>
        {route.name === 'home' && <Home />}
        {route.name === 'play' && <Play key={`${route.opening ?? ''}-${route.unrated ? 'nc' : ''}`} opening={route.opening} unrated={route.unrated} />}
        {route.name === 'review' && <Review key={route.id} id={route.id} />}
        {route.name === 'revise' && <Revise key={route.opening ?? ''} opening={route.opening} />}
        {route.name === 'cards' && <Cards />}
        {route.name === 'lines' && <PlayLines key={route.id} id={route.id} />}
        {route.name === 'comment' && <Comment key={route.id ?? 'all'} id={route.id} />}
        {route.name === 'openings' && <Openings />}
        {route.name === 'repertoire' && <RepertoireEditor key={route.id} id={route.id} />}
        {route.name === 'stats' && <Stats />}
        {route.name === 'settings' && <Settings />}
        {route.name === 'report' && <Report />}
        {route.name === 'lesson' && <OpeningLessonScreen key={`${route.id}-${route.part ?? ''}`} id={route.id} part={route.part} />}
        {route.name === 'mates' && <Mates key={`${route.level}-${route.mode}`} level={route.level} mode={route.mode} />}
        {route.name === 'board' && !route.view && <BoardMastery />}
        {route.name === 'board' && route.view === 'lesson' && <BoardLessonScreen key={route.chapter} chapter={route.chapter!} />}
        {route.name === 'board' && route.view === 'ex' && <BoardExercise key={`${route.id}-${route.mode}`} id={route.id!} mode={route.mode ?? 'test'} />}
        {route.name === 'board' && route.view === 'warmup' && <BoardWarmup />}
        {route.name === 'board' && route.view === 'replay' && <BoardReplay />}
        {route.name === 'board' && route.view === 'blind' && <BoardBlindGame />}
      </>}</main>
    </div>
  );
}
