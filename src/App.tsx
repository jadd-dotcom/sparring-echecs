import { useEffect, useState } from 'react';
import Home from './screens/Home';
import Play from './screens/Play';
import Review from './screens/Review';
import Revise from './screens/Revise';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import Openings from './screens/Openings';
import Report from './screens/Report';
import Mates from './screens/Mates';
import OpeningLessonScreen from './screens/OpeningLesson';
import RepertoireEditor from './screens/RepertoireEditor';
import { ensureOpenings } from './openings';
import './selftest';
import { go, parse, type Route } from './router';
import { ChevronLeft } from './icons';
import { loadPrefs } from './prefs';

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  const [ready, setReady] = useState(false);
  useEffect(() => { Promise.all([ensureOpenings(), loadPrefs()]).catch(console.error).finally(() => setReady(true)); }, []);
  useEffect(() => {
    const f = () => setRoute(parse(location.hash));
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return (
    <div className="app">
      {route.name !== 'home' && (
        <header className="topbar">
          <button className="ghost back" onClick={() => go({ name: 'home' })}><ChevronLeft aria-hidden className="ico" />Accueil</button>
        </header>
      )}
      <main>{ready && <>
        {route.name === 'home' && <Home />}
        {route.name === 'play' && <Play key={`${route.opening ?? ''}-${route.unrated ? 'nc' : ''}`} opening={route.opening} unrated={route.unrated} />}
        {route.name === 'review' && <Review key={route.id} id={route.id} />}
        {route.name === 'revise' && <Revise key={route.opening ?? ''} opening={route.opening} />}
        {route.name === 'openings' && <Openings />}
        {route.name === 'repertoire' && <RepertoireEditor key={route.id} id={route.id} />}
        {route.name === 'stats' && <Stats />}
        {route.name === 'settings' && <Settings />}
        {route.name === 'report' && <Report />}
        {route.name === 'lesson' && <OpeningLessonScreen key={route.id} id={route.id} />}
        {route.name === 'mates' && <Mates key={`${route.level}-${route.mode}`} level={route.level} mode={route.mode} />}
      </>}</main>
    </div>
  );
}
