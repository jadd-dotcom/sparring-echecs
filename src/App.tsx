import { useEffect, useState } from 'react';
import Home from './screens/Home';
import Play from './screens/Play';
import Review from './screens/Review';
import Revise from './screens/Revise';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import Openings from './screens/Openings';
import RepertoireEditor from './screens/RepertoireEditor';
import { ensureOpenings } from './openings';
import './selftest';
import { go, parse, type Route } from './router';

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  const [ready, setReady] = useState(false);
  useEffect(() => { ensureOpenings().catch(console.error).finally(() => setReady(true)); }, []);
  useEffect(() => {
    const f = () => setRoute(parse(location.hash));
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return (
    <div className="app">
      {route.name !== 'home' && (
        <header className="topbar">
          <button className="ghost back" onClick={() => go({ name: 'home' })}>‹ Accueil</button>
        </header>
      )}
      <main>{ready && <>
        {route.name === 'home' && <Home />}
        {route.name === 'play' && <Play key={route.opening ?? ''} opening={route.opening} />}
        {route.name === 'review' && <Review key={route.id} id={route.id} />}
        {route.name === 'revise' && <Revise key={route.opening ?? ''} opening={route.opening} />}
        {route.name === 'openings' && <Openings />}
        {route.name === 'repertoire' && <RepertoireEditor key={route.id} id={route.id} />}
        {route.name === 'stats' && <Stats />}
        {route.name === 'settings' && <Settings />}
      </>}</main>
    </div>
  );
}
