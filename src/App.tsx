import { useEffect, useState } from 'react';
import Home from './screens/Home';
import Play from './screens/Play';
import Review from './screens/Review';
import Revise from './screens/Revise';
import Stats from './screens/Stats';
import Settings from './screens/Settings';
import './selftest';
import { go, parse, type Route } from './router';

export default function App() {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
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
      <main>
        {route.name === 'home' && <Home />}
        {route.name === 'play' && <Play />}
        {route.name === 'review' && <Review key={route.id} id={route.id} />}
        {route.name === 'revise' && <Revise />}
        {route.name === 'stats' && <Stats />}
        {route.name === 'settings' && <Settings />}
      </main>
    </div>
  );
}
