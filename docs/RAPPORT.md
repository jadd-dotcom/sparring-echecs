# Rapport V1 — Sparring Échecs (15/11/2026)

## Choix techniques
- **Adversaire : Maia-3 via `maia3-js` 0.2.0** (plan A ; le plan B Maia-2 n'a pas servi). Modèle 5M embarqué (22,5 Mo),
  exécuté par onnxruntime-web 1.31 (build « wasm » seul, 14,8 Mo) dans un Web Worker. `selfElo` = Rbot, `oppoElo` = R,
  historique des coups transmis. Tirage selon la politique, coups < 3 % ignorés, puis renormalisation.
- **Correcteur : Stockfish 19 « lite single-threaded »** (nmrugg, 1,8 Mo) : pas besoin de COOP/COEP, que GitHub Pages ne permet pas.
  500 ms par position ; chaque coup du joueur demande 2 positions (avant/après), positions communes réutilisées.
- **Win %** : formule Lichess, cp bornés à ±1000, mats → ±10000. Chute = win% (meilleur coup) − win% (après mon coup).
- **Révision** : une carte par erreur/gaffe, 1re révision à J+1. Vérif : meilleur coup, sinon Stockfish 700 ms avant/après le coup, juste si chute ≤ 5.
- **Nulle proposée** : Maia accepte à partir du 10e coup si sa probabilité de gain (tête de valeur de Maia) est ≤ 55 %.
- **Stockage** : Dexie (IndexedDB), partie en cours sauvegardée à chaque coup. Champ `source: 'app' | 'chesscom'` + `externalId` prévus pour la V2.
- **PWA** : vite-plugin-pwa (Workbox), précache complet (≈ 40 Mo). Au 1er lancement, Maia attend la fin du précache → un seul téléchargement.

## Tests
- Unitaires (Vitest) : 17 tests (niveau, intervalles, classement, tirage Maia) ✅
- 20 parties Maia vs aléatoire dans Chromium : 20/20 terminées (mat), 0 plantage, 0 coup illégal ✅
- Parcours tactile iPad émulé (tap, glisser-déposer, coup illégal, nulle refusée, abandon, analyse, cartes, révision, stats, export, portrait) ✅
- Hors ligne (Playwright `setOffline`) : accueil, partie contre Maia, analyse Stockfish ✅ (en local ; à refaire sur l'URL publique)

## Mesures (conteneur Linux, Chromium headless, serveur local)
- Poids : 39,9 Mo non compressés ; 34,4 Mo transférés (gzip) au 1er lancement.
- Accueil affiché : ~150 ms (local). Appli prête hors ligne + Maia chargée : ~2,5 s (réseau local).
- Maia : moyenne 43 ms, médiane 42 ms, p95 57 ms, max 153 ms par coup (437 coups). +450 ms de « réflexion » minimale volontaire.
- Stockfish : profondeur ~16-17 en 500 ms ; analyse d'une partie de 30 coups ≈ 30 s.
