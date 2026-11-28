import { lazy, Suspense, useEffect, useState } from 'react';
import Home from './screens/Home';
// Écrans en chargement différé : chacun dans son propre fichier, téléchargé à la première visite (précaché pour le hors ligne).
const Play = lazy(() => import('./screens/Play'));
const Review = lazy(() => import('./screens/Review'));
const Revise = lazy(() => import('./screens/Revise'));
const Cards = lazy(() => import('./screens/Cards'));
const Comment = lazy(() => import('./screens/Comment'));
const PlayLines = lazy(() => import('./screens/PlayLines'));
const Stats = lazy(() => import('./screens/Stats'));
const Settings = lazy(() => import('./screens/Settings'));
const Openings = lazy(() => import('./screens/Openings'));
const Report = lazy(() => import('./screens/Report'));
const Mates = lazy(() => import('./screens/Mates'));
const Traps = lazy(() => import('./screens/Traps'));
const PlayMenu = lazy(() => import('./screens/PlayMenu'));
const Training = lazy(() => import('./screens/Training'));
const Progress = lazy(() => import('./screens/Progress'));
const GoalDetail = lazy(() => import('./screens/GoalDetail'));
const CrossroadTrainer = lazy(() => import('./screens/CrossroadTrainer'));
const OpeningPage = lazy(() => import('./screens/OpeningPage'));
import TabBar from './TabBar';
import { parentOf } from './nav';
const OpeningLessonScreen = lazy(() => import('./screens/OpeningLesson'));
const RepertoireEditor = lazy(() => import('./screens/RepertoireEditor'));
const BoardMastery = lazy(() => import('./screens/BoardMastery'));
const BoardLessonScreen = lazy(() => import('./screens/BoardMastery').then((m) => ({ default: m.BoardLessonScreen })));
const BoardExercise = lazy(() => import('./screens/BoardExercise'));
const BoardWarmup = lazy(() => import('./screens/BoardWarmup'));
const BoardBlindGame = lazy(() => import('./screens/BoardBlind').then((m) => ({ default: m.BoardBlindGame })));
const BoardReplay = lazy(() => import('./screens/BoardBlind').then((m) => ({ default: m.BoardReplay })));
import { ensureOpenings } from './openings';
import { go, parse, type Route } from './router';
import { ChevronLeft } from './icons';
import { loadPrefs } from './prefs';
import { requestPersistentStorage } from './storage';
import { autoImportMessage, autoImportOnStart } from './autoImport';
import { resumeAnalysis, setAnalysisPause } from './chesscomImport';
import { resumeDetailRefresh, setDetailRefreshPause, startDetailRefresh } from './detailRefresh';

// L'analyse des parties importées se met en pause pendant une partie contre Maia et son analyse (reprise ensuite).
const playing = () => location.hash.startsWith('#/play') || location.hash.startsWith('#/comment/');
setAnalysisPause(playing);
// Recalcul des motifs (nouvelle version du détail) : même pause.
setDetailRefreshPause(playing);

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { requestPersistentStorage().catch(() => {}); Promise.all([ensureOpenings(), loadPrefs()]).catch(console.error).finally(() => setReady(true)); }, []);
  // Import Chess.com automatique (une fois par ouverture, avec Internet et un pseudo enregistré).
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    autoImportOnStart().then((r) => {
      const m = autoImportMessage(r);
      if (m) { setToast(m); timer = setTimeout(() => setToast(null), 8000); }
    }).catch(console.error).finally(() => { if (!playing()) startDetailRefresh().catch(console.error); });
    return () => { if (timer) clearTimeout(timer); };
  }, [ready]);
  useEffect(() => {
    if (route.name !== 'play' && !(route.name === 'comment' && route.id !== undefined)) { resumeAnalysis(); if (ready) resumeDetailRefresh(); }
  }, [route, ready]);
  useEffect(() => {
    const f = () => setRoute(parse(location.hash));
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  // Écrans avec un échiquier : tout tient dans la hauteur de l'écran (échiquier ajusté, texte qui défile seul).
  const fit = ['play', 'review', 'revise', 'lesson', 'comment', 'repertoire', 'lines', 'crossroads'].includes(route.name)
    || (route.name === 'mates' && !!route.level)
    || (route.name === 'traps' && !!route.id)
    || (route.name === 'board' && !!route.view && route.view !== 'lesson');
  const parent = parentOf(route);
  return (
    <div className={`app${fit ? ' fit' : ' with-tabbar'}`}>
      {parent && (
        <header className="topbar">
          <button className="ghost back" onClick={() => go(parent.route)} data-testid="back"><ChevronLeft aria-hidden className="ico" />{parent.label}</button>
        </header>
      )}
      {toast && <div className="toast" role="status" data-testid="auto-import" onClick={() => setToast(null)}>{toast}</div>}
      <main>{ready && <Suspense key={route.name} fallback={<p className="muted center-text" data-testid="screen-loading">Chargement…</p>}>
        {route.name === 'home' && <Home />}
        {route.name === 'jouer' && <PlayMenu />}
        {route.name === 'training' && <Training />}
        {route.name === 'progress' && <Progress />}
        {route.name === 'goal' && <GoalDetail />}
        {route.name === 'play' && <Play key={`${route.opening ?? ''}-${route.unrated ? 'nc' : ''}`} opening={route.opening} unrated={route.unrated} />}
        {route.name === 'review' && <Review key={route.id} id={route.id} />}
        {route.name === 'revise' && <Revise key={`${route.opening ?? ''}-${route.only ?? ''}`} opening={route.opening} only={route.only} />}
        {route.name === 'cards' && <Cards />}
        {route.name === 'lines' && <PlayLines key={`${route.id}-${route.sel ? 's' : ''}`} id={route.id} sel={route.sel} />}
        {route.name === 'opening' && <OpeningPage key={route.id} id={route.id} tab={route.tab} />}
        {route.name === 'crossroads' && <CrossroadTrainer key={route.id} id={route.id} />}
        {route.name === 'comment' && <Comment key={route.id ?? 'all'} id={route.id} />}
        {route.name === 'openings' && <Openings />}
        {route.name === 'repertoire' && <RepertoireEditor key={route.id} id={route.id} />}
        {route.name === 'stats' && <Stats />}
        {route.name === 'settings' && <Settings />}
        {route.name === 'report' && <Report />}
        {route.name === 'lesson' && <OpeningLessonScreen key={`${route.id}-${route.part ?? ''}-${route.stage ?? ''}`} id={route.id} part={route.part} stage={route.stage} />}
        {route.name === 'mates' && <Mates key={`${route.level}-${route.mode}`} level={route.level} mode={route.mode} />}
        {route.name === 'traps' && <Traps key={`${route.id ?? ''}-${route.mode ?? ''}`} id={route.id} mode={route.mode} />}
        {route.name === 'board' && !route.view && <BoardMastery />}
        {route.name === 'board' && route.view === 'lesson' && <BoardLessonScreen key={route.chapter} chapter={route.chapter!} />}
        {route.name === 'board' && route.view === 'ex' && <BoardExercise key={`${route.id}-${route.mode}`} id={route.id!} mode={route.mode ?? 'test'} />}
        {route.name === 'board' && route.view === 'warmup' && <BoardWarmup />}
        {route.name === 'board' && route.view === 'replay' && <BoardReplay />}
        {route.name === 'board' && route.view === 'blind' && <BoardBlindGame />}
      </Suspense>}</main>
      {!fit && ready && <TabBar route={route} />}
    </div>
  );
}
