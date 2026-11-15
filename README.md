# Sparring Échecs

Appli web (PWA) d'entraînement aux échecs pour tablette, 100 % dans le navigateur :

- **Adversaire humain** : Maia-3 (variante 5M, paquet `maia3-js`) jouant ~50 points au-dessus de ton niveau estimé.
- **Niveau adaptatif** (échelle Lichess, 600–2600, départ 900, K = 80 pendant 10 parties puis 32).
- **Analyse d'après-partie** par Stockfish 19 lite (single-thread) : imprécisions / erreurs / gaffes selon la chute de % de gain.
- **Paquet de révision** (J+1, J+3, J+7, J+14, J+30 ; raté → J+1).
- **Stats** : courbe de niveau, V/N/D, gaffes par partie. Export/import JSON.
- **Rapport pour Claude (V1.5)** : rapport Markdown (résumé, phases, motifs d'erreur, 10 pires erreurs avec FEN/ASCII/suites
  Stockfish, PGN annotés, cartes ratées) à copier ou partager. Exemple : `docs/exemple-rapport.md`.
- **Ouvertures (V2)** : répertoire en PGN à variantes (Londres, GDR, Française pré-chargés, vérifiés par Stockfish),
  parties à thème, sorties signalées en revue, trous du répertoire, drill en répétition espacée, stats par ouverture.

## Développement

```bash
npm ci
npm run dev        # copie les binaires (modèle, Stockfish) puis lance Vite
npm test           # tests unitaires (niveau, intervalles, classement, tirage Maia)
npm run build      # build de production dans dist/
npx vite preview --port 4173
node tests/selftest20.cjs   # 20 parties Maia vs aléatoire dans Chromium (Playwright)
node tests/e2e.cjs <dossier-captures>   # parcours tactile complet sur iPad émulé
node tests/offline.cjs <url>            # mesures + test hors ligne
node tests/v2.cjs <dossier-captures>    # parcours Ouvertures (V2)
node tests/report.cjs <dossier-captures> # 3 parties de test → docs/exemple-rapport.md (V1.5)
npm run validate-repertoire             # vérif Stockfish du répertoire pré-chargé → docs/REPERTOIRE.md
```

Déploiement : GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`).

## Licences

Code de l'appli : GPL-3.0 (imposée par Stockfish). Maia3-js : MIT. Stockfish.js : GPL-3.0.
chess.js : BSD-2-Clause. react-chessboard : MIT. onnxruntime-web : MIT. Dexie : Apache-2.0.
