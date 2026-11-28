import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { db } from './db';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

// Crochets de test (__db, __selftest…) : seulement sous automatisation (Playwright : navigator.webdriver) ou en
// développement, jamais pour l'utilisateur. __db est posé tout de suite (dès l'exécution du module, avant l'événement
// load) ; le reste (__selftest…) est chargé avant le premier rendu.
const testMode = navigator.webdriver || import.meta.env.DEV;
if (testMode) Object.assign(globalThis, { __db: db });
const testHooks = testMode ? import('./selftest') : Promise.resolve();

testHooks.finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
